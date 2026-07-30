"use client";

import AuthInput from "@/components/reusable/AuthInput";
import { Loader2 } from '@/components/reusable/Loader2';
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { ApiError } from "@/types/api";
import { ResetPasswordFormValues } from "@/types/auth";
import { authSchemas } from "@/utils/validation-schemas";
import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
 
  const [resetPassword] = useResetPasswordMutation()

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const response = await resetPassword({
        email,
        otp,
        newPassword: values.password,
      }).unwrap()

      toast.success(response.message || t('password_reset_successfully'))
      router.push(ROUTES.AUTH.LOGIN)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_reset_password'))
    }
  }

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
        <h2 className="text-xl font-bold text-title">{t('reset_password_title')}</h2>
        <p className="text-subtitle-color font-medium text-base">{t('reset_password_desc')}</p>
      </motion.div>

      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={authSchemas.resetPassword(t)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <AuthInput
                label={t("password")}
                name="password"
                type="password"
                placeholder={t("password_placeholder")}
              />
              <AuthInput
                label={t("confirm_password")}
                name="confirmPassword"
                type="password"
                placeholder={t("confirm_password_placeholder")}
              />
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
                  "Reset Password"
                )}
              </Button>
            </motion.div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
