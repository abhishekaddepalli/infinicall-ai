export interface PaymentGatewayConfig {
  _id: string
  gateway_name: 'stripe' | 'razorpay' | 'paypal' | 'manual'
  is_enabled: boolean
  is_test_mode: boolean
  currency: string
  // Stripe fields
  stripe_publishable_key?: string
  stripe_secret_key?: string
  stripe_webhook_secret?: string
  // Razorpay fields
  razorpay_key_id?: string
  razorpay_key_secret?: string
  razorpay_webhook_secret?: string
  // PayPal fields
  paypal_client_id?: string
  paypal_client_secret?: string
  paypal_mode?: 'sandbox' | 'live'
  // General config
  config?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface WebhookUrlsResponse {
  success: boolean
  data: {
    stripe: string
    razorpay: string
    paypal: string
  }
}

export interface GetGatewaysResponse {
  success: boolean
  data: PaymentGatewayConfig[]
}

export interface GetGatewayByNameResponse {
  success: boolean
  data: PaymentGatewayConfig
}

export interface UpdateGatewayRequest {
  is_enabled?: boolean
  is_test_mode?: boolean
  currency?: string
  stripe_publishable_key?: string
  stripe_secret_key?: string
  stripe_webhook_secret?: string
  razorpay_key_id?: string
  razorpay_key_secret?: string
  razorpay_webhook_secret?: string
  paypal_client_id?: string
  paypal_client_secret?: string
  paypal_mode?: 'sandbox' | 'live'
}

export interface GatewayCardProps {
  title: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  children: React.ReactNode
}

export interface PaymentGatewayHeaderProps {
  isLoading: boolean
  onRefresh: () => void
}