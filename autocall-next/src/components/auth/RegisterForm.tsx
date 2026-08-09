"use client";

import AuthInput from "@/components/reusable/AuthInput";
import { Loader2 } from '@/components/reusable/Loader2';
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import useSettings from "@/hooks/useSettings";
import { useFacebookSignupMutation, useGoogleSignupMutation, useRegisterMutation } from "@/redux/api/authApi";
import { ApiError } from "@/types/api";
import { RegisterFormProps, RegisterFormValues } from "@/types/auth";
import { authSchemas } from "@/utils/validation-schemas";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { motion } from "framer-motion";
import { Lock, Mail, User } from 'lucide-react';
import Image from "next/image";
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
  const [googleSignup] = useGoogleSignupMutation();
  const [facebookSignup] = useFacebookSignupMutation();
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
      toast.success(t('registration_successful_check_email', "Registration successful! Please check your email for the verification code."));
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || t('registration_failed', "Registration failed. Please try again."));
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

  const handleGoogleSignup = async () => {
    try {
      const response = await googleSignup().unwrap();
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(t('login_failed') || t('google_signup_failed', "Google signup failed"));
    }
  };

  const handleFacebookSignup = async () => {
    try {
      const response = await facebookSignup().unwrap();
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(t('login_failed') || t('facebook_signup_failed', "Facebook signup failed"));
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto space-y-4 py-0">

      {/* Welcome Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-extrabold text-title">
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
          <Form className="space-y-4">

            {/* Input fields */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-3"
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
              className="space-y-2.5"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-[0_4px_12px_rgba(1,84,130,0.15)] hover:shadow-[0_6px_16px_rgba(1,84,130,0.25)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t('sign_up', "Sign Up")
                )}
              </Button>
              <div className="flex items-center justify-center my-4">
                <div className="h-px flex-1 bg-[#CBD5E1] dark:bg-gray-800"></div>
                <span className="px-5 text-[#475569] dark:text-gray-400 font-bold text-md">{t('or', 'OR')}</span>
                <div className="h-px flex-1 bg-[#CBD5E1] dark:bg-gray-800"></div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="relative w-full h-[52px] rounded-xl border-[#E2E8F0] dark:border-gray-800 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                onClick={handleGoogleSignup}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <Image src="/google.svg" alt="Google" width={24} height={24} className="w-6 h-6" unoptimized />
                  <div className="h-6 w-px bg-[#E2E8F0] dark:bg-gray-800"></div>
                </div>
                <span className="text-[#0F172A] dark:text-white font-bold text-sm">
                  {t('continue_with_google', 'Continue with Google')}
                </span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="relative w-full h-[52px] rounded-xl border-[#E2E8F0] dark:border-gray-800 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                onClick={handleFacebookSignup}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <Image src="/facebook.svg" alt="Facebook" width={24} height={24} className="w-6 h-6" unoptimized />
                  <div className="h-6 w-px bg-[#E2E8F0] dark:bg-gray-800"></div>
                </div>
                <span className="text-[#0F172A] dark:text-white font-bold text-sm">
                  {t('continue_with_facebook', 'Continue with Facebook')}
                </span>
              </Button>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-2 gap-y-1.5 text-xs text-subtitle-color mt-3">
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
