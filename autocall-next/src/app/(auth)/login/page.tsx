"use client";

import AuthSplitPage from "@/components/auth/AuthSplitPage";
import { VoiceWidget } from "@/components/features/voice-widget";
import { useLoginVoiceWidgetKey } from "@/hooks/useLoginVoiceWidgetKey";

const LoginPage = () => {
  const { widgetKey } = useLoginVoiceWidgetKey();

  return (
    <>
      <AuthSplitPage initialMode="login" />
      {widgetKey && <VoiceWidget widgetKey={widgetKey} />}
    </>
  );
};

export default LoginPage;
