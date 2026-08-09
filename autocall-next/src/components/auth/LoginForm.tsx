"use client";

import AuthInput from "@/components/reusable/AuthInput";
import { Loader2 } from '@/components/reusable/Loader2';
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { adminSettingApi } from "@/redux/api/adminSettingApi";
import { useFacebookSignupMutation, useGetDemoCredentialsQuery, useGoogleSignupMutation, useLoginMutation } from '@/redux/api/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth } from "@/redux/slices/authSlice";
import { ApiError } from "@/types/api";
import { LoginFormValues } from "@/types/auth";
import { authUtils } from "@/utils/auth";
import { authSchemas } from "@/utils/validation-schemas";
import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import { Lock, Mail, Shield, User } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const LoginForm = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [googleSignup] = useGoogleSignupMutation();
  const [facebookSignup] = useFacebookSignupMutation();
  const router = useRouter();

  const { data: demoData } = useGetDemoCredentialsQuery();
  const isDemoMode = demoData?.demo === true;

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap();
      authUtils.setToken(response.token);
      authUtils.setUser(response.user);

      dispatch(
        setAuth({
          token: response.token,
          user: response.user,
        }),
      );

      toast.success(response.message || t('login_successful'));

      // Force-refetch public/admin settings to get the absolute latest maintenance status
      let isMaintenanceActive = false;
      try {
        const freshSettings = await dispatch(
          adminSettingApi.endpoints.getPublicSettings.initiate(undefined, { forceRefetch: true })
        ).unwrap();

        const settingsData = freshSettings?.settings || freshSettings?.setting || freshSettings?.data || freshSettings;
        const isMaintenanceAffected = response.user?.role !== "admin" && response.user?.role !== "super_admin";
        const isMaintenanceMode = settingsData?.maintenance_mode === true;
        const userIp = settingsData?.userIp;
        const allowedIps = settingsData?.maintenance_allowed_ips || [];
        const isAllowedIp = userIp && allowedIps.includes(userIp);

        if (isMaintenanceAffected && isMaintenanceMode && !isAllowedIp) {
          isMaintenanceActive = true;
        }
      } catch (err) {
        console.error("Failed to fetch fresh settings on login", err);
      }

      if (isMaintenanceActive) {
        window.location.href = "/maintenance";
      } else {
        const redirectTo = searchParams.get('redirect_to');
        if (redirectTo) {
          window.location.href = redirectTo;
        } else {
          window.location.href = ROUTES.DASHBOARD;
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.data?.message || t('login_failed');
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await googleSignup().unwrap();
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(t('login_failed') || t('google_login_failed', "Google login failed"));
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const response = await facebookSignup().unwrap();
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error(t('login_failed') || t('facebook_login_failed', "Facebook login failed"));
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto space-y-7">

      {/* Welcome Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-2.5"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-title">
          {t('welcome_to_autocall')}
        </h2>
        <p className="text-base font-medium text-subtitle-color leading-relaxed mx-auto">
          {t('welcome_to_autocall_desc')}
        </p>
      </motion.div>

      {/* Formik Block */}
      <Formik
        initialValues={{
          email: initialEmail,
          password: '',
        }}
        enableReinitialize={true}
        validationSchema={authSchemas.login(t)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-5">

            {/* Input fields with custom icons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-4"
            >
              <AuthInput
                label={
                  <span>
                    {t('email_address')} <span className="text-primary font-bold">*</span>
                  </span>
                }
                name="email"
                type="email"
                placeholder={t('enter_your_email_address')}
                leftIcon={<Mail className="w-4 h-4 text-primary" />}
              />
              <div className="flex flex-col items-end gap-1.5 w-full">
                <div className="w-full">
                  <AuthInput
                    label={
                      <span>
                        {t('password')} <span className="text-primary font-bold">*</span>
                      </span>
                    }
                    name="password"
                    type="password"
                    placeholder={t('enter_your_password')}
                    leftIcon={<Lock className="w-4 h-4 text-primary" />}
                  />
                </div>
                <Link
                  href={ROUTES.AUTH.FORGOT_PASSWORD}
                  className="text-sm font-semibold text-primary hover:underline transition-all"
                >
                  {t("forgot_password")}
                </Link>
              </div>
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
                  t('sign_in', "Sign In")
                )}
              </Button>

            <div className="flex items-center justify-center my-4">
                <div className="h-px flex-1 bg-[#CBD5E1] dark:bg-gray-800"></div>
                <span className="px-5 text-[#475569] dark:text-gray-400 font-bold text-md">{t('or', 'OR')}</span>
                <div className="h-px flex-1 bg-[#CBD5E1] dark:bg-gray-800"></div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="relative w-full h-[52px] rounded-xl border-[#E2E8F0] dark:border-gray-800 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                  onClick={handleGoogleLogin}
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
                  onClick={handleFacebookLogin}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                    <Image src="/facebook.svg" alt="Facebook" width={24} height={24} className="w-6 h-6" unoptimized />
                    <div className="h-6 w-px bg-[#E2E8F0] dark:bg-gray-800"></div>
                  </div>
                  <span className="text-[#0F172A] dark:text-white font-bold text-sm">
                    {t('continue_with_facebook', 'Continue with Facebook')}
                  </span>
                </Button>
              </div>
            </motion.div>

            {/* Demo Mode panel, styled elegantly */}
            {isDemoMode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="pt-4 border-t border-dashed border-input-border-color space-y-2.5"
              >
                <span className="text-[10px] uppercase font-bold text-subtitle-color tracking-wider text-center block">
                  {t('quick_demo_access')}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 bg-subcard hover:bg-primary border-input-border-color hover:border-transparent text-subtitle-color hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-none"
                    onClick={() => {
                      setFieldValue('email', demoData?.admin?.email || '');
                      setFieldValue('password', demoData?.admin?.password || '');
                    }}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{t("demo_admin")}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 bg-subcard hover:bg-primary border-input-border-color hover:border-transparent text-subtitle-color hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-none"
                    onClick={() => {
                      setFieldValue('email', demoData?.user?.email || '');
                      setFieldValue('password', demoData?.user?.password || '');
                    }}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{t("demo_user")}</span>
                  </Button>
                </div>
              </motion.div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-2 gap-y-2 text-sm text-subtitle-color mt-4">
              <Link href={ROUTES.PRIVACY_POLICY} target="_blank" className="hover:underline transition-all whitespace-nowrap">{t("privacy_policy")}</Link>
              <span className="hidden sm:inline">•</span>
              <Link href={ROUTES.TERMS_AND_CONDITIONS} target="_blank" className="hover:underline transition-all whitespace-nowrap">{t("terms_and_conditions")}</Link>
              <span className="hidden sm:inline">•</span>
              <Link href={ROUTES.REFUND_POLICY} target="_blank" className="hover:underline transition-all whitespace-nowrap">{t("refund_policy")}</Link>
            </div>
          </Form>
        )}
      </Formik>

    </div>
  );
};

export default LoginForm;
