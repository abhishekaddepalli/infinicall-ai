export type GatewayId = "stripe" | "razorpay" | "paypal"

export const gateways: { id: GatewayId; name: string; subtitle: string; icon: React.ReactNode }[] = [
  {
    id: "stripe",
    name: "Stripe",
    subtitle: "Recommended for SaaS",
    icon: (
      <svg viewBox="0 0 32 22" className="w-8 h-8 text-primary" fill="none">
        <rect width="32" height="22" rx="4" fill="#635BFF" />
        <path d="M8.3 9.1c0-.6.5-.8 1.3-.8 1.2 0 2.6.3 3.8 1V6.2c-1.3-.5-2.5-.7-3.8-.7-3.1 0-5.2 1.6-5.2 4.3 0 4.2 5.8 3.5 5.8 5.3 0 .7-.6.9-1.5.9-1.3 0-3-.5-4.3-1.3v3c1.4.7 2.9.9 4.3.9 3.1 0 5.2-1.5 5.2-3.7.1-4.5-5.6-3.6-5.6-5.8z" fill="#fff" transform="translate(4, 3) scale(0.75)" />
      </svg>
    ),
  },
  {
    id: "razorpay",
    name: "Razorpay",
    subtitle: "Best for Indian Markets",
    icon: (
      <svg viewBox="0 0 52 22" className="w-10 h-8" fill="none">
        <rect width="52" height="22" rx="4" fill="#072654" />
        <text x="8" y="15" fontSize="9" fontWeight="bold" fill="#3395FF" fontFamily="sans-serif">Rzp</text>
        <path d="M30 5l4 12-3-3-4 3 3-12z" fill="#3395FF" transform="translate(8, 0) scale(0.9)" />
      </svg>
    ),
  },
  {
    id: "paypal",
    name: "PayPal",
    subtitle: "Global Standard",
    icon: (
      <svg viewBox="0 0 32 22" className="w-8 h-8" fill="none">
        <rect width="32" height="22" rx="4" fill="#003087" />
        <path d="M11 7h4c2 0 3.5.5 3.5 2.5S17 12 15 12h-2l-.5 2.5H10L11 7z" fill="#009cde" />
        <path d="M13 9h4c2 0 3.5.5 3.5 2.5S19 14 17 14h-2l-.5 2.5H12L13 9z" fill="#fff" transform="translate(2, 1)" />
      </svg>
    ),
  },
]