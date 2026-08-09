import { PhoneNumber } from './phone-number';

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type KYCStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface NumberPurchaseRequest {
  _id: string;
  id: string;
  user_id: any;
  phone_number_id: PhoneNumber | string;
  amount: number;
  payment_status: PaymentStatus;
  kyc_status: KYCStatus;
  payment_intent_id?: string;
  payment_gateway?: string;
  kyc_documents?: Record<string, string>;
  kyc_form_data?: Record<string, any>;
  kyc_files?: Array<{
    fieldname: string;
    filename: string;
    originalname: string;
    mimetype: string;
    url: string;
  }>;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InitiatePurchaseResponse {
  success: boolean;
  message: string;
  data: {
    purchaseRequest?: NumberPurchaseRequest;
    payment_link?: string;
    payment_intent_id?: string;
  };
}

export interface NumberPurchaseRequestsResponse {
  success: boolean;
  data: NumberPurchaseRequest[];
  total?: number;
  page?: number;
  limit?: number;
}
