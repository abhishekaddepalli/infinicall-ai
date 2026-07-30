import { useFacebookReady } from "@/app/FacebookSDKProvider";
import { useGetUserSettingsQuery } from "@/redux/api/userSettingApi";
import { FBLoginOptions, FBLoginResponse, UserSettingsResponse } from "@/types/shared";
import { useCallback, useEffect, useState } from "react";

export const useEmbeddedSignup = (onFinish: (code: string, data: unknown) => void) => {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [signupData, setSignupData] = useState<unknown>(null);
  const fbReady = useFacebookReady();

  const { data: userSettingsRes } = useGetUserSettingsQuery(undefined) as { data?: UserSettingsResponse };
  const userSettings = userSettingsRes?.data;
  const appId = userSettings?.whatsapp_app_id;
  const configId = userSettings?.configuration_id;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.origin.includes("facebook")) return;

      try {
        const payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (payload.type === "WA_EMBEDDED_SIGNUP" && payload.event === "FINISH") {
          setSignupData(payload.data);
        }
      } catch { }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authCode && signupData) {
      onFinish(authCode, signupData);
      timer = setTimeout(() => {
        setAuthCode(null);
        setSignupData(null);
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [authCode, signupData, onFinish]);

  const startSignup = useCallback(() => {
    if (!fbReady || !window.FB) {
      console.error('Facebook SDK not ready');
      return;
    }
    if (!appId || !configId) {
      console.error('WhatsApp App ID or Configuration ID not configured in User Settings');
      return;
    }

    // Re-init FB with the user-specific app ID before each login
    (window.FB as {
      init: (config: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (callback: (res: FBLoginResponse) => void, options: FBLoginOptions) => void;
    }).init({
      appId,
      cookie: true,
      xfbml: false,
      version: 'v22.0',
    });

    // Use FB.login for WhatsApp embedded signup
    (window.FB as {
      init: (config: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (callback: (res: FBLoginResponse) => void, options: FBLoginOptions) => void;
    }).login(
      (res: FBLoginResponse) => {
        if (res.authResponse?.code) {
          setAuthCode(res.authResponse.code);
        } else if (res.authResponse === undefined) {
          console.error('User cancelled the signup or error occurred');
        } else {
          console.error('No auth code in response:', res);
        }
      },
      {
        config_id: configId,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          sessionInfoVersion: 2,
          featureType: 'whatsapp_business_app_onboarding',
        },
      }
    );
  }, [fbReady, appId, configId]);

  const isConfigured = !!(appId && configId);

  return { startSignup, fbReady, isConfigured };
};
