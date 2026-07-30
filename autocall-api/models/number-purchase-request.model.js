const mongoose = require('mongoose');
const { Schema } = mongoose;
const { addVirtualId } = require('../utils/modelHelper');

const NumberPurchaseRequestSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    phone_number_id: {
      type: Schema.Types.ObjectId,
      ref: 'PhoneNumber',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    kyc_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    payment_intent_id: {
      type: String,
      default: null
    },
    payment_gateway: {
      type: String,
      default: null
    },
    kyc_documents: {
      government_id_proof: { type: String, default: null },
      business_registration_document: { type: String, default: null },
      tax_identification_document: { type: String, default: null },
      company_consent_letter: { type: String, default: null },
    },
    admin_notes: {
      type: String,
      default: null
    }
  },
  {
    collection: 'number_purchase_requests',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

addVirtualId(NumberPurchaseRequestSchema);

module.exports = mongoose.model('NumberPurchaseRequest', NumberPurchaseRequestSchema);
