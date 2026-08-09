"use client";

import AuthInput from "@/components/reusable/AuthInput";
import { Loader2 } from '@/components/reusable/Loader2';
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { adminSettingApi } from "@/redux/api/adminSettingApi";
import { useTeamMemberLoginMutation } from '@/redux/api/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth } from "@/redux/slices/authSlice";
import { ApiError } from "@/types/api";
import { LoginFormValues } from "@/types/auth";
import { authUtils } from "@/utils/auth";
import { authSchemas } from "@/utils/validation-schemas";
import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import { Lock, Mail } from 'lucide-react';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const TeamMemberLoginForm = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const dispatch = useAppDispatch();
  const [login] = useTeamMemberLoginMutation();

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
          {t('team_member_login')}
        </h2>
        <p className="text-base font-medium text-subtitle-color leading-relaxed mx-auto">
          {t('team_member_login_desc')}
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
        {({ isSubmitting }) => (
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
                rightElement={
                  <Link
                    href={ROUTES.AUTH.FORGOT_PASSWORD}
                    className="text-xs font-semibold text-primary hover:underline transition-all"
                  >
                    {t("forgot_password")}
                  </Link>
                }
              />
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
                  t('sign_in')
                )}
              </Button>
            </motion.div>

            <div className="flex items-center justify-center gap-2 text-sm text-subtitle-color mt-4">
              <Link href={ROUTES.PRIVACY_POLICY} target="_blank" className="hover:underline transition-all">{t("privacy_policy")}</Link>
              <span>•</span>
              <Link href={ROUTES.TERMS_AND_CONDITIONS} target="_blank" className="hover:underline transition-all">{t("terms_and_conditions")}</Link>
              <span>•</span>
              <Link href={ROUTES.REFUND_POLICY} target="_blank" className="hover:underline transition-all">{t("refund_policy")}</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TeamMemberLoginForm;
