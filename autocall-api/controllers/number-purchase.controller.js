'use strict';

const { db } = require('../models');
const NumberPurchaseRequest = db.NumberPurchaseRequest;
const PhoneNumber = db.PhoneNumber;
const User = db.User;
const { stripeService, razorpayService, paypalService } = require('../utils/payment-gateway.service');

exports.getAvailableNumbers = async (req, res) => {
  try {
    const { search, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const activeCampaigns = await db.Campaign.find({
      campaignStatus: { $in: ['Draft', 'Active', 'Paused'] }
    }).select('phoneNumberId').lean();

    const usedNumberIds = activeCampaigns.map(c => c.phoneNumberId);

    let query = {
      is_system_pool: true,
      user_id: null,
      purchase_price: { $gt: 0 },
      agent_id: null,
      sip_trunk_id: null,
      _id: { $nin: usedNumberIds }
    };

    if (search && search.trim()) {
      query.phone_number = new RegExp(search.trim(), 'i');
    }

    const numbers = await PhoneNumber.find(query)
      .sort(sortOptions)
      .lean();

    const userId = req.user.id;
    const numberIds = numbers.map(n => n._id);
    
    const purchaseRequests = await NumberPurchaseRequest.find({
      user_id: userId,
      phone_number_id: { $in: numberIds },
      payment_status: { $in: ['pending', 'paid'] },
      kyc_status: { $in: ['pending', 'under_review'] }
    }).lean();

    const requestMap = {};
    purchaseRequests.forEach(r => {
      requestMap[r.phone_number_id] = r;
    });

    const populatedNumbers = numbers.map(num => ({
      ...num,
      purchase_request: requestMap[num._id] || null
    }));

    res.json({ success: true, data: populatedNumbers });
  } catch (error) {
    console.error('Get Available Numbers Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.initiatePurchase = async (req, res) => {
  try {
    const { phone_number_id, payment_gateway } = req.body;
    const userId = req.user.id;

    if (!phone_number_id) {
      return res.status(400).json({ success: false, message: 'Phone number ID is required' });
    }

    if (!payment_gateway) {
      return res.status(400).json({ success: false, message: 'Payment gateway is required' });
    }

    const phoneNumber = await PhoneNumber.findOne({ _id: phone_number_id, is_system_pool: true, user_id: null });
    if (!phoneNumber) {
      return res.status(404).json({ success: false, message: 'Phone number is not available for purchase' });
    }

    const purchasePrice = phoneNumber.purchase_price || 0;

    const existingRequest = await NumberPurchaseRequest.findOne({
      user_id: userId,
      phone_number_id,
      payment_status: { $in: ['pending', 'paid'] },
      kyc_status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending purchase request for this number', data: existingRequest });
    }

    let paymentLink = null;
    let paymentIntentId = null;

    if (payment_gateway === 'stripe') {
      const stripe = await stripeService._getStripe();
      if (!stripe) return res.status(400).json({ success: false, message: 'Stripe not configured' });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: `Phone Number - ${phoneNumber.phone_number}` },
            unit_amount: Math.round(purchasePrice * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || req.protocol + '://' + req.get('host')}/number-purchase/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || req.protocol + '://' + req.get('host')}/number-purchase/cancel`,
        client_reference_id: userId.toString(),
      });
      paymentLink = session.url;
      paymentIntentId = session.id;
    } else if (payment_gateway === 'razorpay') {
      const razorpay = await razorpayService._getRazorpay();
      if (!razorpay) return res.status(400).json({ success: false, message: 'Razorpay not configured' });

      const order = await razorpay.orders.create({
        amount: Math.round(purchasePrice * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      paymentIntentId = order.id;
    } else if (payment_gateway === 'paypal') {
      const cfg = await paypalService._getConfig();
      if (!cfg) return res.status(400).json({ success: false, message: 'PayPal not configured' });

      const { token, apiUrl } = await paypalService.getAccessToken();
      const response = await fetch(`${apiUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: { currency_code: 'USD', value: purchasePrice.toFixed(2) },
            description: `Phone Number Purchase - ${phoneNumber.phone_number}`
          }],
          application_context: {
            return_url: `${process.env.FRONTEND_URL || req.protocol + '://' + req.get('host')}/number-purchase/success`,
            cancel_url: `${process.env.FRONTEND_URL || req.protocol + '://' + req.get('host')}/number-purchase/cancel`
          }
        })
      });
      if (!response.ok) throw new Error('Failed to create PayPal order');

      const order = await response.json();
      paymentIntentId = order.id;

      const approveLink = order.links?.find(l => l.rel === 'approve');
      if (approveLink) paymentLink = approveLink.href;
    }

    const purchaseRequest = await NumberPurchaseRequest.create({
      user_id: userId,
      phone_number_id,
      amount: purchasePrice,
      payment_gateway: payment_gateway,
      payment_intent_id: paymentIntentId,
      payment_status: 'pending',
      kyc_status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Purchase request initiated',
      data: {
        purchaseRequest,
        payment_link: paymentLink,
        payment_intent_id: paymentIntentId
      }
    });
  } catch (error) {
    console.error('Initiate Purchase Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.markPaymentSuccess = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { payment_gateway, session_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, paypal_order_id } = req.body;

    let query = { user_id: userId };
    if (id && id !== 'fallback' && id !== 'undefined' && id !== 'null') {
      query._id = id;
    } else if (session_id) {
      query.payment_intent_id = session_id;
    } else if (razorpay_order_id) {
      query.payment_intent_id = razorpay_order_id;
    } else if (paypal_order_id) {
      query.payment_intent_id = paypal_order_id;
    } else {
      return res.status(400).json({ success: false, message: 'Could not identify the purchase request' });
    }

    const purchaseRequest = await NumberPurchaseRequest.findOne(query);
    if (!purchaseRequest) {
      return res.status(404).json({ success: false, message: 'Purchase request not found' });
    }

    if (purchaseRequest.payment_status === 'paid') {
      return res.status(200).json({ success: true, message: 'Payment already marked as successful', data: purchaseRequest });
    }

    const gateway = payment_gateway || purchaseRequest.payment_gateway;

    if (gateway === 'stripe') {
      if (!session_id) return res.status(400).json({ success: false, message: 'Missing Stripe session ID' });
      const stripe = await stripeService._getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ success: false, message: 'Stripe payment not successful yet' });
      }
    } else if (gateway === 'razorpay') {
      if (!razorpay_payment_id || !razorpay_signature || !razorpay_order_id) {
        return res.status(400).json({ success: false, message: 'Missing Razorpay confirmation parameters' });
      }
      const isValid = razorpayService.verifyPaymentSignature(razorpay_payment_id, razorpay_order_id, razorpay_signature);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid Razorpay signature' });
      }
    } else if (gateway === 'paypal') {
      if (!paypal_order_id) return res.status(400).json({ success: false, message: 'Missing PayPal order ID' });

      const { token, apiUrl } = await paypalService.getAccessToken();
      const response = await fetch(`${apiUrl}/v2/checkout/orders/${paypal_order_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return res.status(400).json({ success: false, message: 'Failed to verify PayPal order' });
      const order = await response.json();
      if (order.status !== 'COMPLETED' && order.status !== 'APPROVED') {
        return res.status(400).json({ success: false, message: 'PayPal payment not successful yet' });
      }

      if (order.status === 'APPROVED') {
        const captureRes = await fetch(`${apiUrl}/v2/checkout/orders/${paypal_order_id}/capture`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const captureData = await captureRes.json();
        if (captureData.status !== 'COMPLETED') {
          return res.status(400).json({ success: false, message: 'PayPal payment not completed' });
        }
      }
    }

    purchaseRequest.payment_status = 'paid';
    await purchaseRequest.save();

    res.json({ success: true, message: 'Payment marked as successful', data: purchaseRequest });
  } catch (error) {
    console.error('Mark Payment Success Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.uploadKycDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const purchaseRequest = await NumberPurchaseRequest.findOne({ _id: id, user_id: userId });
    if (!purchaseRequest) {
      return res.status(404).json({ success: false, message: 'Purchase request not found' });
    }

    if (purchaseRequest.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment must be completed before uploading KYC documents' });
    }

    const requiredFields = [
      'government_id_proof',
      'business_registration_document',
      'tax_identification_document',
      'company_consent_letter'
    ];

    if (!purchaseRequest.kyc_documents) {
      purchaseRequest.kyc_documents = {};
    }

    const missingFields = requiredFields.filter(field => {
      const hasNewFile = req.files && req.files[field] && req.files[field].length > 0;
      const hasExistingFile = purchaseRequest.kyc_documents[field];
      return !hasNewFile && !hasExistingFile;
    });

    if (missingFields.length > 0) {
      return res.status(400).json({ success: false, message: `Missing required documents: ${missingFields.join(', ')}` });
    }

    const path = require('path');
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    const allFiles = req.files ? Object.values(req.files).flat() : [];
    const invalidFiles = allFiles.filter(file => {
      const ext = path.extname(file.originalname).toLowerCase();
      return !allowedExtensions.includes(ext) || !allowedMimeTypes.includes(file.mimetype);
    });

    if (invalidFiles.length > 0) {
      return res.status(400).json({ success: false, message: 'Only JPEG, PNG, and PDF documents are allowed for KYC' });
    }

    requiredFields.forEach(field => {
      if (req.files && req.files[field] && req.files[field].length > 0) {
        purchaseRequest.kyc_documents[field] = `/uploads/kyc_documents/${req.files[field][0].filename}`;
      }
    });

    purchaseRequest.markModified('kyc_documents');
    await purchaseRequest.save();

    res.json({ success: true, message: 'KYC documents uploaded successfully', data: purchaseRequest });
  } catch (error) {
    console.error('Upload KYC Documents Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    let query = {};
    if (status) {
      query.kyc_status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');

      const users = await User.find({
        $or: [
          { first_name: searchRegex },
          { last_name: searchRegex },
          { email: searchRegex }
        ]
      }).select('_id');
      const userIds = users.map(u => u._id);

      const phones = await PhoneNumber.find({
        phone_number: searchRegex
      }).select('_id');
      const phoneIds = phones.map(p => p._id);

      query.$or = [
        { user_id: { $in: userIds } },
        { phone_number_id: { $in: phoneIds } },
        { kyc_status: searchRegex },
        { payment_status: searchRegex }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    const total = await NumberPurchaseRequest.countDocuments(query);

    const requests = await NumberPurchaseRequest.find(query)
      .populate('user_id', 'first_name last_name email')
      .populate('phone_number_id', 'phone_number label')
      .sort(sortOptions)
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    res.json({ 
      success: true, 
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parsedLimit) || 1,
        limit: parsedLimit
      }
    });
  } catch (error) {
    console.error('Get All Requests Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.verifyRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { kyc_status, admin_notes } = req.body;

    if (!['approved', 'rejected'].includes(kyc_status)) {
      return res.status(400).json({ success: false, message: 'Invalid KYC status' });
    }

    const purchaseRequest = await NumberPurchaseRequest.findById(id).populate('phone_number_id');
    if (!purchaseRequest) {
      return res.status(404).json({ success: false, message: 'Purchase request not found' });
    }

    purchaseRequest.kyc_status = kyc_status;
    if (admin_notes) {
      purchaseRequest.admin_notes = admin_notes;
    }
    await purchaseRequest.save();

    if (kyc_status === 'approved') {
      const phoneNumber = purchaseRequest.phone_number_id;
      if (phoneNumber) {
        phoneNumber.user_id = purchaseRequest.user_id;
        phoneNumber.is_system_pool = false;
        
        if (phoneNumber.validity_days > 0) {
          phoneNumber.expires_at = new Date(Date.now() + (phoneNumber.validity_days * 24 * 60 * 60 * 1000));
        } else {
          phoneNumber.expires_at = null;
        }
        
        await phoneNumber.save();
      }
    }

    res.json({ success: true, message: `Purchase request ${kyc_status} successfully`, data: purchaseRequest });
  } catch (error) {
    console.error('Verify Request Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
