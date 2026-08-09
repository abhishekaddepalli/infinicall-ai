import { NumberPurchaseRequest } from './number-purchase'
import { PhoneNumber } from './phone-number'

export interface KycUploadPageProps {
  purchaseRequestId: string
}

export type DocumentType = 'government_id_proof' | 'business_registration_document' | 'tax_identification_document' | 'company_consent_letter'

export interface PurchaseNumbersModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface InitiatePurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: PhoneNumber | null
  onSubmit: (data: { phone_number_id: string; payment_gateway: string }) => Promise<void>
  isLoading?: boolean
}

export interface VerifyRequestModalProps {
  isOpen: boolean
  onClose: () => void
  request: NumberPurchaseRequest | null
  onSubmit: (data: { id: string; status: 'approved' | 'rejected'; reason?: string }) => Promise<void>
  isLoading?: boolean
}

export interface AssignPriceModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: PhoneNumber | null
  onSubmit: (data: { purchase_price: number; validity_days: number }) => Promise<void>
  isLoading?: boolean
}
