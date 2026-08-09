"use client";

import { Loader2 } from '@/components/reusable/Loader2';
import { ROUTES } from '@/constants/routes';
import { useLazyGetProfileQuery } from '@/redux/api/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth } from '@/redux/slices/authSlice';
import { authUtils } from '@/utils/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [fetchProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      toast.error(t('auth_failed_no_token', 'Authentication failed: No token received.'));
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    const completeLogin = async () => {
      try {
        authUtils.setToken(token);
        const response = await fetchProfile(undefined, true).unwrap();
        const user = response?.user;

        if (!user) throw new Error(t('failed_to_retrieve_profile', 'Failed to retrieve user profile'));

        authUtils.setUser(user);
        dispatch(setAuth({ token, user }));
        toast.success(t('login_successful', 'Successfully logged in!'));
        window.location.href = ROUTES.DASHBOARD;
      } catch (error) {
        console.error('Error fetching profile during OAuth callback:', error);
        authUtils.removeToken();
        toast.error(t('failed_to_complete_auth', 'Failed to complete authentication.'));
        router.push(ROUTES.AUTH.LOGIN);
      }
    };

    completeLogin();
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-xl font-bold text-title">{t('completing_authentication', 'Completing Authentication...')}</h2>
        <p className="text-subtitle-color">{t('please_wait_logging_in', 'Please wait while we log you in.')}</p>
      </div>
    </div>
  );
}
