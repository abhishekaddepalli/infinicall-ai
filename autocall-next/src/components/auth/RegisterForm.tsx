"use client";

import AuthInput from "@/components/reusable/AuthInput";
import { Loader2 } from '@/components/reusable/Loader2';
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import useSettings from "@/hooks/useSettings";
import { useRegisterMutation } from "@/redux/api/authApi";
import { ApiError } from "@/types/api";
import { RegisterFormProps, RegisterFormValues } from "@/types/auth";
import { authSchemas } from "@/utils/validation-schemas";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { motion } from "framer-motion";
import { Lock, Mail, User } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { RegistrationOtpForm } from "./RegistrationOtpForm";

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [register] = useRegisterMutation();
  const { settings } = useSettings();
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const targetPageSlug = typeof settings?.signup_agreement_target_page === 'object' 
    ? settings.signup_agreement_target_page?.slug 
    : settings?.signup_agreement_target_page;

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting, resetForm }: FormikHelpers<RegisterFormValues>) => {
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();
      
      setRegisteredEmail(values.email);
      setIsOtpOpen(true);
      resetForm();
      toast.success("Registration successful! Please check your email for the verification code.");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isOtpOpen) {
    return (
      <RegistrationOtpForm 
        email={registeredEmail}
        onSuccess={() => {
          setIsOtpOpen(false);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push(ROUTES.AUTH.LOGIN);
          }
        }} 
      />
    );
  }

  return (
    <div className="w-full max-w-[420px] mx-auto space-y-7 py-4">

      {/* Welcome Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-2.5"
      >
        <h2 className="text-3xl font-extrabold text-title">
          {t('welcome_to_autocall_signup')}
        </h2>
        <p className="text-base font-medium text-subtitle-color leading-relaxed mx-auto">
          {t('welcome_to_autocall_signup_desc')}
        </p>
      </motion.div>

      {/* Formik Block */}
      <Formik<RegisterFormValues>
        initialValues={{ name: "", email: "", password: "", confirmPassword: "", signup_agreement: false }}
        validationSchema={authSchemas.register(t, settings?.signup_agreement_enabled)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">

            {/* Input fields */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-4"
            >
              <AuthInput
                label={
                  <span>
                    {t('full_name')} <span className="text-primary font-bold">*</span>
                  </span>
                }
                name="name"
                type="text"
                placeholder={t("enter_full_name")}
                leftIcon={<User className="w-4 h-4 text-primary" />}
              />

              <AuthInput
                label={
                  <span>
                    {t('email_address')} <span className="text-primary font-bold">*</span>
                  </span>
                }
                name="email"
                type="email"
                placeholder={t("enter_email_address")}
                leftIcon={<Mail className="w-4 h-4 text-primary" />}
              />

              <AuthInput
                label={
                  <span>
                    {t('password')} <span className="text-primary font-bold">*</span>
                  </span>
                }
                name="password"
                type="password"
                placeholder={t("enter_password")}
                leftIcon={<Lock className="w-4 h-4 text-primary" />}
              />

              <AuthInput
                label={
                  <span>
                    {t('confirm_password')} <span className="text-primary font-bold">*</span>
                  </span>
                }
                name="confirmPassword"
                type="password"
                placeholder={t("enter_confirm_password")}
                leftIcon={<Lock className="w-4 h-4 text-primary" />}
              />

              {settings?.signup_agreement_enabled && (
                <div className="flex flex-col gap-1 pt-2">
                  <div className="flex items-start gap-2">
                    <div className="flex items-center h-5">
                      <Field
                        name="signup_agreement"
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </div>
                    <div className="text-sm">
                      <Label htmlFor="signup_agreement" className="text-subtitle-color font-medium cursor-pointer select-none">
                        {settings.signup_agreement_prefix_text}{' '}
                        <Link 
                          href={`/page/${targetPageSlug}`} 
                          target="_blank" 
                          className="text-primary hover:underline font-bold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {settings.signup_agreement_link_text}
                        </Link>
                      </Label>
                    </div>
                  </div>
                  <ErrorMessage name="signup_agreement" component="div" className="text-destructive text-xs ml-6" />
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-[0_4px_12px_rgba(1,84,130,0.15)] hover:shadow-[0_6px_16px_rgba(1,84,130,0.25)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-2 gap-y-2 text-sm text-subtitle-color mt-4">
              <Link href={ROUTES.PRIVACY_POLICY} target="_blank" className="hover:underline transition-all whitespace-nowrap">{t('privacy_policy')}</Link>
              <span className="hidden sm:inline">•</span>
              <Link href={ROUTES.TERMS_AND_CONDITIONS} target="_blank" className="hover:underline transition-all whitespace-nowrap">{t('terms_and_conditions')}</Link>
              <span className="hidden sm:inline">•</span>
              <Link href={ROUTES.REFUND_POLICY} target="_blank" className="hover:underline transition-all whitespace-nowrap">{t('refund_policy')}</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;
