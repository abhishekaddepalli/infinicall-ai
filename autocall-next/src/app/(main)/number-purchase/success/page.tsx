'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useMarkPaymentSuccessMutation } from '@/redux/api/numberPurchaseApi'
import { CheckCircle2, XCircle } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PaymentSuccessPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const paymentGateway = searchParams.get('payment_gateway')
  const razorpayPaymentId = searchParams.get('razorpay_payment_id')
  const razorpayOrderId = searchParams.get('razorpay_order_id')
  const razorpaySignature = searchParams.get('razorpay_signature')
  const paypalToken = searchParams.get('token')

  const [markSuccess] = useMarkPaymentSuccessMutation()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const confirmPayment = async () => {
      const requestId = localStorage.getItem('pending_purchase_request_id') || 'fallback'

      try {
        const res = await markSuccess({
          id: requestId,
          session_id: sessionId || undefined,
          payment_gateway: paymentGateway || (paypalToken ? 'paypal' : undefined) || undefined,
          razorpay_payment_id: razorpayPaymentId || undefined,
          razorpay_order_id: razorpayOrderId || undefined,
          razorpay_signature: razorpaySignature || undefined,
          paypal_order_id: paypalToken || undefined
        }).unwrap()
        setStatus('success')
        localStorage.removeItem('pending_purchase_request_id')

        // The backend returns the updated purchaseRequest, we can extract its real _id
        const extractedId = res?.data?._id || res?.data?.id || res?._id || res?.id;
        const realId = extractedId || (requestId !== 'fallback' ? requestId : null);

        // Redirect to KYC upload after short delay
        setTimeout(() => {
          if (realId && realId !== 'fallback' && realId !== 'undefined') {
            router.push(`${ROUTES.KYC_UPLOAD}/${realId}`);
          } else {
            // If we couldn't extract the ID, redirect to phone numbers table so they can click "Upload KYC"
            router.push(ROUTES.PHONE_NUMBERS);
          }
        }, 2000)
      } catch (error) {
        setStatus('error')
      }
    }

    confirmPayment()
  }, [markSuccess, sessionId, paymentGateway, razorpayPaymentId, razorpayOrderId, razorpaySignature, paypalToken, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {status === 'loading' && (
        <>
          <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
          <h2 className="text-2xl font-bold text-title dark:text-white mb-2">{t('confirming_payment', 'Confirming Payment...')}</h2>
          <p className="text-subtitle-color">{t('please_wait_payment', 'Please wait while we verify your transaction.')}</p>
        </>
      )}

      {status === 'success' && (
        <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
          <div className="w-20 h-20 bg-edit/10 rounded-lg   flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-edit" />        
          </div>
          <h2 className="text-2xl font-bold text-title dark:text-white mb-2">{t('payment_successful', 'Payment Successful!')}</h2>
          <p className="text-subtitle-color mb-8">{t('redirecting_kyc', 'Redirecting you to the KYC upload page...')}</p>
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {status === 'error' && (
        <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-title dark:text-white mb-2">{t('payment_verification_failed', 'Payment Verification Failed')}</h2>
          <p className="text-subtitle-color mb-8">{t('payment_failed_desc', 'We could not verify your payment or the session has expired.')}</p>
          <Button onClick={() => router.push(ROUTES.PHONE_NUMBERS)} className="rounded-full px-8">
            {t('return_to_phone_numbers', 'Return to Phone Numbers')}
          </Button>
        </div>
      )}
    </div>
  )
}
