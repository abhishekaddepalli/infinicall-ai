import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useVerifyRegistrationOtpMutation } from '@/redux/api/authApi'
import { ApiError } from '@/types/api'
import { RegistrationOtpFormProps } from '@/types/auth'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Label } from '../ui/label'

export function RegistrationOtpForm({ email, onSuccess }: RegistrationOtpFormProps) {
  const { t } = useTranslation()
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [verifyOtp, { isLoading }] = useVerifyRegistrationOtpMutation()

  const otpValue = otp.join('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (otpValue.length < 6) return

    try {
      const res = await verifyOtp({ email, otp: otpValue }).unwrap()
      toast.success(res.message || t('email_verified_success', 'Email verified successfully!'))
      onSuccess()
    } catch (error: any) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || error?.message || t('invalid_or_expired_otp', 'Invalid or expired OTP. Please try again.'))

      // Clear the inputs so the user can easily try again
      setOtp(new Array(6).fill(''))
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 50)
    }
  }

  const handleChange = (index: number, value: string) => {
    if (value && isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6)
    if (pastedData) {
      const newOtp = [...otp]
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || ''
      }
      setOtp(newOtp)
      const nextIndex = pastedData.length < 6 ? pastedData.length : 5
      inputRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[420px] mx-auto py-4"
    >
      <div className="flex items-center gap-3 justify-center mb-6">
        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-2.5 mb-8">
        <h2 className="text-3xl font-extrabold text-title">
          {t('verify_your_email', 'Verify Your Email')}
        </h2>
        <p className="text-base font-medium text-subtitle-color leading-relaxed mx-auto">
          {t('sent_verification_code_to', "We've sent a verification code to")} <br />
          <span className="font-bold text-title mt-1 inline-block">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <Label className="text-md font-bold text-title block text-center">
            {t('enter_verification_code', 'Enter Verification Code')}
          </Label>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                ref={(el) => { inputRefs.current[index] = el }}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 sm:w-14 sm:h-14 p-0 text-center text-xl sm:text-2xl font-bold rounded-lg bg-transparent outline-none border border-input-border-color text-title focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary/50 transition-all duration-200"
                maxLength={2}
                autoComplete={index === 0 ? "one-time-code" : "off"}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || otpValue.length < 6}
          className="w-full h-12 rounded-lg bg-primary text-white font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2 rtl:mr-0 rtl:ml-2" />
          ) : null}
          {isLoading ? t('verifying', 'Verifying...') : t('verify_email_btn', 'Verify Email')}
        </Button>

        <p className="text-center text-md font-medium text-subtitle-color mt-4">
          {t('didnt_receive_email_spam', "Didn't receive the email? Check your spam folder.")}
        </p>
      </form>
    </motion.div>
  )
}
