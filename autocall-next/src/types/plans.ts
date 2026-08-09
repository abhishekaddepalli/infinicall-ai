import { loadStripe } from '@stripe/stripe-js'
import { User } from './auth';

export interface Plan {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price?: number;
  currency: 'USD' | 'INR' | 'EUR' | 'GBP';
  billing_cycle: 'free_trial' | 'monthly' | 'yearly' | 'lifetime' | 'both';
  trial_days: number;
  trial_period_days?: number;
  total_credits: number;
  is_popular: boolean;
  is_active: boolean;

  sort_order: number;
  display_order?: number;
  agent_limit?: number;
  campaign_limit_per_day?: number;
  flow_limit?: number;
  knowledgebase_limit?: number;
  storage_limit?: number;
  contact_limit?: number;
  sms_agent_limit?: number;
  sms_campaign_limit_per_day?: number;
  campaign_sms_limit?: number;
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
  stripe_payment_link_id?: string | null;
  stripe_payment_link_url?: string | null;
  razorpay_plan_id?: string | null;
  paypal_plan_id_monthly?: string | null;
  paypal_plan_id_yearly?: string | null;
  paypal_plan_id?: string | null;
  allowed_payment_gateways?: string[];
  amount?: number;
  plan_type?: 'subscription' | 'prepaid' | 'lifetime' | 'top_up';
  module_access?: string[];
  features?: Record<string, unknown>;
  validity_days?: number | null;
  status?: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PlanResponse {
  success: boolean;
  data: Plan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Subscription {
  _id: string;
  id: string;
  user_id: string | User;
  user?: User;
  plan_id: Plan;
  plan?: Plan;
  status: 'trial' | 'trialing' | 'active' | 'expired' | 'cancelled' | 'suspended' | 'pending' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'cancelled';
  started_at: string;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  expires_at: string | null;
  cancelled_at: string | null;
  cancels_at: string | null;
  stripe_subscription_id?: string | null;
  razorpay_subscription_id?: string | null;
  paypal_subscription_id?: string | null;
  payment_gateway: 'stripe' | 'razorpay' | 'paypal' | 'manual' | 'free' | 'admin generated' | null;
  payment_method: 'card' | 'upi' | 'netbanking' | 'wallet' | 'manual' | 'free' | 'cash' | 'bank_transfer' | 'paypal' | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount_paid: number;
  currency: string;
  payment_reference?: string | null;
  transaction_receipt?: string | null;
  manual_payment_type?: 'bank_transfer' | 'cash' | 'check' | 'other' | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  duration: number;
  auto_renew: boolean;
  days_remaining?: number;
  total_amount?: number;
  amount?: number;
  member_count?: number;
  billing_cycle?: string;
  cancel_at_period_end?: boolean;
  features?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  _id: string;
  id: string;
  user_id: string | User;
  user?: User;
  subscription_id: string | Subscription;
  plan_id: string | Plan;
  plan?: Plan;
  amount: number;
  currency: string;
  payment_method: string | null;
  payment_status: 'pending' | 'success' | 'failed' | 'refunded';
  transaction_id: string | null;
  payment_gateway: 'stripe' | 'razorpay' | 'paypal' | 'manual' | null;
  invoice_number?: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface BillingHeroProps {
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  onToggle: () => void
}

export interface CurrentSubscriptionCardProps {
  subscription: Subscription | null
  isCanceling: boolean
  onCancel: () => void
}

export interface PlanCardProps {
  plan: Plan
  index: number
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  isCurrent: boolean
  onSubscribe: (plan: Plan) => void
}

export type PaymentStep =
  | 'select-gateway'
  | 'stripe-checkout'
  | 'paypal-redirect'
  | 'razorpay-checkout'
  | 'manual-checkout'
  | 'confirming'
  | 'success'

export type Gateway = 'stripe' | 'paypal' | 'razorpay' | 'manual'

export interface GatewaySelectorProps {
  plan: Plan | null
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  selectedGateway: Gateway
  onSelectGateway: (g: Gateway) => void
  onProceed: () => void
  onClose: () => void
  isInitializing: boolean
}

export interface RazorpayCheckoutStepProps {
  onBack: () => void
}

export interface SuccessStepProps {
  plan: Plan | null
  onClose: () => void
}

export interface PayPalRedirectStepProps {
  paypalUrl: string
  onBack: () => void
}

export interface StripeCheckoutStepProps {
  clientSecret: string
  stripePromise: ReturnType<typeof loadStripe> | null
  onComplete: () => void
  onBack: () => void
}

export interface PlanBasicFieldsProps {
  formData: Partial<Plan>
  isEdit: boolean
  onChange: (field: string | Record<string, unknown>, value?: unknown) => void
}

export interface FeatureEntry {
  key: string
  value: string
}

export interface PlanFeaturesEditorProps {
  features: FeatureEntry[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, field: 'key' | 'value', value: string) => void
}

export interface PlanGatewayFieldsProps {
  formData: Partial<Plan>
  onChange: (field: string | Record<string, unknown>, value?: unknown) => void
}

export interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  onSuccess?: () => void
  activeSubscription?: any
  sessionIdToConfirm?: string | null
  showSuccessModal?: boolean
}

export interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Plan>) => void
  plan?: Plan | null
  isLoading?: boolean
}

export interface SubscribePlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
  initialBillingCycle: 'monthly' | 'yearly' | 'one-time'
  onProceedToPayment: (billingCycle: 'monthly' | 'yearly' | 'one-time') => void
}

export interface GatewayConfig {
  id: Gateway
  label: string
  logo: string
  activeClass: string
  hoverClass: string
  checkClass: string
  infoText: string
  infoClass: string
}

export interface PlanFormProps {
  plan?: Plan | null
  onSave: (data: Partial<Plan>) => Promise<void>
  isLoading?: boolean
}

export interface PlanModulesAndLimitsProps {
  formData: Partial<Plan>
  onChange: (field: string | Record<string, unknown>, value?: unknown) => void
}

export interface HistoryRow {
  plan: string
  members: number
  billing_cycle: string
  amount: number
  status: string
  subscription_date: string | null;
  expiry_date: string | null;
  cancel_at_period_end?: boolean
}

export interface SubscriptionHistoryProps {
  filteredHistory: HistoryRow[]
  historyFilter: string
  setHistoryFilter: (filter: 'all' | 'active' | 'expired' | 'cancelled') => void
  sub: Subscription | null
  t: (key: string, options?: Record<string, unknown>) => string
  pagination?: any
  currentPage?: number
  setCurrentPage?: (page: number) => void
  rowsPerPage?: number
  setRowsPerPage?: (rows: number) => void
  isLoading?: boolean
}

export interface UserSubscriptionOverviewProps {
  sub: Subscription | null
  amountPaid: number
  daysRemaining: number
  isCancelDialogOpen: boolean
  setIsCancelDialogOpen: (open: boolean) => void
  handleCancel: () => void
  isCancelling: boolean
  t: (key: string, options?: Record<string, unknown>) => string
}

export interface AssignPlanModalProps {
  isOpen: boolean
  onClose: () => void
  editingSubscription?: Subscription | null
}

export interface UserAIFeatureUsageProps {
  sub: Subscription
}

export interface PlanAIFeaturesProps {
  formData: Partial<Plan>
  onChange: (field: string | Record<string, unknown>, value?: unknown) => void
}

export interface TrialConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface AdminPlanCardProps {
  plan: Plan
  onEdit: (plan: Plan) => void
  onDelete: (plan: Plan) => void
}

export interface Pagination {
  total: number
  totalPages: number
  currentPage: number
  limit: number
}

export interface ManualCheckoutStepProps {
  plan: Plan | null
  onComplete: () => void
  onBack: () => void
}