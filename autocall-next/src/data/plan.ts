import { GatewayConfig } from '@/types/plans'

export const gatewayFields = [
  {
    id: 'paypal_monthly',
    field: 'paypal_plan_id_monthly',
    label: 'PayPal Plan ID (Monthly)',
    placeholder: 'e.g. P-XXXXXXXXXXXX',
    note: 'Overrides global PayPal settings for this specific plan.',
  },
  {
    id: 'paypal_yearly',
    field: 'paypal_plan_id_yearly',
    label: 'PayPal Plan ID (Yearly)',
    placeholder: 'e.g. P-XXXXXXXXXXXX',
    note: 'Overrides global PayPal settings for this specific plan.',
  },
  {
    id: 'stripe_price_id',
    field: 'stripe_price_id',
    label: 'Stripe Price ID',
    placeholder: 'e.g. price_XXXXXXXXXXXX',
    note: null,
  },
  {
    id: 'razorpay_plan_id',
    field: 'razorpay_plan_id',
    label: 'Razorpay Plan ID',
    placeholder: 'e.g. plan_XXXXXXXXXXXX',
    note: null,
  },
]

export const currencySymbols: Record<string, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
}

export const gateways: GatewayConfig[] = [
  {
    id: 'stripe',
    label: 'Stripe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    activeClass: 'border-primary bg-primary/5',
    hoverClass: 'hover:border-primary/50',
    checkClass: 'bg-primary',
    infoText: "Your card details are entered securely on Stripe's hosted checkout.",
    infoClass: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    activeClass: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
    hoverClass: 'hover:border-blue-400',
    checkClass: 'bg-blue-500',
    infoText: "You'll be redirected to PayPal to complete your subscription securely.",
    infoClass:
      'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
  },
  {
    id: 'razorpay',
    label: 'Razorpay',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg',
    activeClass: 'border-primary bg-primary/5',
    hoverClass: 'hover:border-primary/50',
    checkClass: 'bg-primary',
    infoText: 'Complete your payment via UPI, Cards, or Netbanking using Razorpay.',
    infoClass:
      'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium',
  },
  {
    id: 'manual',
    label: 'Bank Transfer',
    logo: '/bank-transfer.svg',
    activeClass: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
    hoverClass: 'hover:border-emerald-400',
    checkClass: 'bg-emerald-500',
    infoText: 'Pay directly to our bank account. Subscription will be active after admin approval.',
    infoClass:
      'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium',
  },
]

