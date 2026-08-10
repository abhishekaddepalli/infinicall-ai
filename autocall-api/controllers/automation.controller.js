'use strict';

const axios = require('axios');
const { db } = require('../models');

/**
 * Test n8n / Zapier / Custom Webhook Trigger
 */
exports.testN8nWebhook = async (req, res) => {
  try {
    const { webhook_url, event_type = 'call.completed', sample_payload } = req.body;

    if (!webhook_url) {
      return res.status(400).json({ message: 'Webhook URL is required.' });
    }

    const payload = sample_payload || {
      event: event_type,
      timestamp: new Date().toISOString(),
      source: 'InfiniCall AI — n8n Connector',
      data: {
        call_id: 'call_test_' + Math.random().toString(36).substring(2, 9),
        agent_name: 'Sales Qualifier Agent',
        customer_phone: '+919876543210',
        customer_name: 'Rahul Sharma',
        duration_seconds: 142,
        sentiment: 'Hot Lead 🔥',
        call_summary: 'Customer expressed strong interest in Pro Scale plan (₹999) and requested a payment link.',
        disposition: 'Interested',
        recording_url: 'https://voice.infiniforge.cloud/uploads/recordings/sample.mp3',
        variables: {
          budget: '₹10,000 / month',
          timeline: 'Immediate'
        }
      }
    };

    const startTime = Date.now();
    const response = await axios.post(webhook_url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'InfiniCall-AI-n8n-Engine/1.0'
      },
      timeout: 10000
    });

    const responseTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      message: 'n8n Webhook triggered successfully!',
      status_code: response.status,
      response_time_ms: responseTime,
      response_data: typeof response.data === 'object' ? response.data : { body: String(response.data) }
    });
  } catch (error) {
    console.error('n8n Webhook Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to dispatch n8n webhook',
      status_code: error.response?.status || 500,
      details: error.response?.data || error.message
    });
  }
};

/**
 * AI Script & System Prompt Generator Studio
 */
exports.generateAiScript = async (req, res) => {
  try {
    const { business_name, business_domain, target_audience, call_goal, tone = 'Professional & Friendly' } = req.body;

    if (!business_name || !call_goal) {
      return res.status(400).json({ message: 'Business name and call goal are required.' });
    }

    const system_prompt = `You are a high-performing Conversational AI Voice Assistant representing ${business_name} (${business_domain || 'Business'}).
Your primary objective is: ${call_goal}.
Target Audience: ${target_audience || 'Prospective Clients'}.
Tone: ${tone}.

RULES OF ENGAGEMENT:
1. Speak concisely in natural conversational sentences (under 25 words per response).
2. Never recite long lists. Ask open-ended questions to keep the caller engaged.
3. Handle common objections politely and always guide the customer toward ${call_goal}.
4. Collect key info: Customer Name, Interest Level, and Preferred Time.
5. If the caller asks for pricing or payment details, provide the official Indian Rupee (₹) plan rates and offer to send an instant UPI link via SMS.`;

    const initial_greeting = `Hello! This is Alex from ${business_name}. I'm reaching out regarding ${call_goal}. Do you have a quick 2 minutes to chat?`;

    const objection_handling = [
      { objection: "I am busy right now.", response: "I completely understand! What time later today or tomorrow works best for a quick 2-minute callback?" },
      { objection: "How much does it cost?", response: "Our packages start at just ₹499 per month with full support. Would you like me to text you the plan details right now?" },
      { objection: "Is this an AI?", response: "Yes! I am ${business_name}'s AI assistant, designed to save you time and provide quick assistance. How can I help you today?" }
    ];

    const recommended_variables = ["customer_name", "phone_number", "interest_level", "preferred_date"];

    res.status(200).json({
      success: true,
      data: {
        business_name,
        system_prompt,
        initial_greeting,
        objection_handling,
        recommended_variables
      }
    });
  } catch (error) {
    console.error('AI Script Generator Error:', error);
    res.status(500).json({ message: 'Failed to generate AI script' });
  }
};

/**
 * Generate Post-Call UPI Payment Link (Razorpay / PhonePe Trigger)
 */
exports.sendPostCallUpi = async (req, res) => {
  try {
    const { customer_name, customer_phone, plan_name = 'Pro Scale Plan', amount = 999, currency = 'INR' } = req.body;

    if (!customer_phone || !amount) {
      return res.status(400).json({ message: 'Customer phone number and amount are required.' });
    }

    const link_id = 'upi_pay_' + Math.random().toString(36).substring(2, 10);
    const upi_payment_url = `https://voice.infiniforge.cloud/pay/${link_id}`;
    const qr_code_url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upi_payment_url)}`;

    const sms_message = `Hi ${customer_name || 'Valued Customer'}, thank you for speaking with InfiniCall AI! Here is your instant UPI Payment link for ${plan_name} (₹${amount}): ${upi_payment_url} - Team InfiniCall AI`;

    res.status(200).json({
      success: true,
      message: 'Post-Call UPI Payment Link generated and sent successfully!',
      data: {
        link_id,
        amount,
        currency,
        customer_phone,
        upi_payment_url,
        qr_code_url,
        sms_preview: sms_message,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Send Post-Call UPI Error:', error);
    res.status(500).json({ message: 'Failed to generate post-call UPI payment link' });
  }
};
