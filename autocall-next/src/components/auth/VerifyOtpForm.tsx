"use client";

import { Loader2 } from '@/components/reusable/Loader2';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/redux/api/authApi";
import { ApiError } from "@/types/api";
import { VerifyOtpFormValues } from "@/types/auth";
import { authSchemas } from "@/utils/validation-schemas";
import { Form, Formik, FormikHelpers } from "formik";
import { motion } from "framer-motion";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const VerifyOtpForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const handleSubmit = async (values: VerifyOtpFormValues, { setSubmitting }: FormikHelpers<VerifyOtpFormValues>) => {
    try {
      await verifyOtp({ email, otp: values.otp }).unwrap();
      toast.success(t('otp_verified_successfully'));
      router.push(`${ROUTES.AUTH.RESET_PASSWORD}?email=${encodeURIComponent(email)}&otp=${values.otp}`);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || t('failed_to_verify_otp'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email is missing. Please try again from forgot password page.");
      return;
    }
    try {
      await resendOtp({ email }).unwrap();
      toast.success(t('otp_has_been_sent', { email }));
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="w-full max-w-md space-y-10 relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute -top-12 left-0"
      >
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="inline-flex items-center gap-2 text-sm font-bold text-title hover:text-primary transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {t("back_to_login")}
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-xl font-bold text-title">{t('verify_otp_title')}</h2>
        <p className="text-subtitle-color font-medium text-base">{t('verify_otp_desc', { email })}</p>
      </motion.div>

      <Formik
        initialValues={{ otp: "" }}
        validationSchema={authSchemas.verifyOtp(t)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, errors, touched }) => {
          const handleChange = (index: number, value: string) => {
            if (value && isNaN(Number(value))) return

            const newOtp = [...otp]
            newOtp[index] = value.substring(value.length - 1)
            setOtp(newOtp)
            setFieldValue("otp", newOtp.join(""))

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
              setFieldValue("otp", newOtp.join(""))
              const nextIndex = pastedData.length < 6 ? pastedData.length : 5
              inputRefs.current[nextIndex]?.focus()
            }
          }

          return (
            <Form className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex flex-col items-end gap-2 w-full">
                  <div className="w-full space-y-1.5">
                    <Label className="block text-md font-semibold text-title">
                      {t('otp_code')}
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
                          className="w-12 h-12 sm:w-14 sm:h-14 p-0 text-center text-xl sm:text-2xl font-bold rounded-lg bg-input-color outline-none border border-input-border-color text-title focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary/50 transition-all duration-200"
                          maxLength={2}
                          autoComplete={index === 0 ? "one-time-code" : "off"}
                        />
                      ))}
                    </div>
                    {touched.otp && errors.otp ? (
                      <p className="mt-1 text-xs text-red-500">{errors.otp}</p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isResending}
                    onClick={handleResendOtp}
                    className="text-sm p-0! font-semibold text-primary hover:text-primary/80 transition-all disabled:opacity-50 p-0 h-auto hover:bg-transparent"
                  >
                    {isResending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    {t('resend_otp')}
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-[0_4px_12px_rgba(1,84,130,0.15)] hover:shadow-[0_6px_16px_rgba(1,84,130,0.25)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    t('verify_otp')
                  )}
                </Button>
              </motion.div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default VerifyOtpForm;
