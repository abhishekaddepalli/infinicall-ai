"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants/routes";
import { useEmbeddedSignup } from "@/hooks/useEmbeddedSignup";
import { useGetUserSettingsQuery } from "@/redux/api/userSettingApi";
import { useConnectionMutation, useDisconnectWabaMutation, useGetWhatsappPhoneNumbersQuery } from "@/redux/api/whatsappApi";
import { ConnectionResponse, PhoneNumber } from "@/types/waba";
import { AlertCircle, ArrowLeft, Check, HelpCircle, MessageCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ConnectWabaSkeleton from "./ConnectWabaSkeleton";
import ManualWabaForm from "./ManualWabaForm";
import PhoneNumbersTable from "./PhoneNumbersTable";
import WabaSetupGuide from "./WabaSetupGuide";
import WebhookConfiguration from "./WebhookConfiguration";

const ConnectWABA = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [showGuideDialog, setShowGuideDialog] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState<"embedded" | "manual">("embedded");
  const [connection] = useConnectionMutation();
  const [disconnect] = useDisconnectWabaMutation();
  const { data: phoneNumbersData, isLoading: isLoadingPhoneNumbers } = useGetWhatsappPhoneNumbersQuery();
  const { data: userSettings, isLoading: isLoadingUserSettings } = useGetUserSettingsQuery(undefined);

  const phoneNumbers: PhoneNumber[] = phoneNumbersData?.data || [];
  const isConnected = phoneNumbers.length > 0;

  const handleFinish = useCallback(
    async (code: string, signupData: unknown) => {
      try {
        setIsLoading(true);

        const dataToSend = {
          code,
          data: signupData,
        };

        const response = await connection(dataToSend).unwrap() as ConnectionResponse;
        if (response.success) {
          toast.success("WhatsApp Business Account connected successfully!");
        }
      } catch (err: unknown) {
        const error = err as { data?: { error?: string } };
        console.error('Connection error:', err);
        toast.error(error?.data?.error || t('failed_to_connect_whatsapp_account'));
      } finally {
        setIsLoading(false);
      }
    },
    [connection]
  );

  const { startSignup, fbReady, isConfigured } = useEmbeddedSignup(handleFinish);

  if ((isLoadingPhoneNumbers && !phoneNumbersData) || (isLoadingUserSettings && !userSettings)) {
    return <ConnectWabaSkeleton />;
  }

  const handleDisconnect = async () => {
    try {
      await disconnect().unwrap();
      toast.success("WhatsApp Business Account disconnected successfully");
      setShowDisconnectDialog(false);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || t('failed_to_disconnect_waba'));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.TOOLBOX)} className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-title ">
              {t("waba_connection", "WhatsApp Configuration")}
            </h1>
          </div>
        </div>

        <Button
          variant="outline"
          className="rounded-lg bg-subcard border-input-border-color text-title gap-2 h-11 p-padding! font-bold self-start sm:self-center"
          onClick={() => setShowGuideDialog(true)}
          type="button"
        >
          <HelpCircle size={16} />
          {t("guide", "Guide")}
        </Button>
      </div>

      {/* Warning if credentials not configured */}
      {!isConfigured && (
        <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 flex gap-3 items-start mb-4">
          <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-500">{t('meta_credentials_not_configured')}</p>
            <p className="text-xs text-yellow-500 mt-1">
              Please go to{" "}
              <Link href={ROUTES.TOOLBOX_SETTINGS} className="underline font-medium">{t('user_settings')}</Link>{" "}
              and configure your <strong>{t('whatsapp_app_id')}</strong>, <strong>{t('app_secret')}</strong>, and{" "}
              <strong>{t('configuration_id')}</strong> before connecting.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Method and Status */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Connection Method Card */}
          <Card className="rounded-lg border-input-border-color bg-bg-card transition-all duration-300 overflow-hidden">
            <CardContent className="sm:p-6 p-4">
              <h3 className="text-lg font-bold text-title mb-4">
                {t("connection_method", "Connection Method")}
              </h3>
              <div className="space-y-3">
                {/* Embedded Signup Option */}
                <div
                  className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between transition-colors ${connectionMethod === "embedded"
                    ? "bg-primary/10 border-primary/30"
                    : "border-input-border-color hover:border-primary/30 bg-transparent"
                    }`}
                  onClick={() => setConnectionMethod("embedded")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg flex items-center justify-center shrink-0 ${connectionMethod === 'embedded' ? 'bg-primary/10 text-primary' : 'bg-subcard text-subtitle-color'}`}>
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-md ${connectionMethod === 'embedded' ? 'text-primary' : 'text-title'}`}>
                        {t("embedded_signup", "Embedded Signup")}
                      </h4>
                      <p className="text-sm text-subtitle-color font-medium mt-0.5">
                        {t("quickly_connect_waba", "Quickly connect your WABA")}
                      </p>
                    </div>
                  </div>
                  {connectionMethod === "embedded" && (
                    <Check size={18} className="text-primary shrink-0 ms-auto rtl:mr-auto rtl:ml-0" />
                  )}
                </div>

                {/* Manual (Cloud API) Option */}
                <div
                  className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between transition-colors ${connectionMethod === "manual"
                    ? "bg-primary/5 border-primary/30"
                    : "border-input-border-color hover:border-primary/30 bg-transparent"
                    }`}
                  onClick={() => setConnectionMethod("manual")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg flex items-center justify-center shrink-0 ${connectionMethod === 'manual' ? 'bg-primary/10 text-primary' : 'bg-subcard text-subtitle-color'}`}>
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-md ${connectionMethod === 'manual' ? 'text-primary' : 'text-title'}`}>
                        {t("manual_cloud_api", "Manual (Cloud API)")}
                      </h4>
                      <p className="text-sm text-subtitle-color font-medium mt-0.5">
                        {t("connect_using_api_credentials", "Connect using API credentials")}
                      </p>
                    </div>
                  </div>
                  {connectionMethod === "manual" && (
                    <Check size={18} className="text-primary shrink-0 ms-auto rtl:mr-auto rtl:ml-0" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Business (Cloud API) Status Card */}
          <Card className="rounded-radius border-input-border-color bg-bg-card transition-all duration-300 overflow-hidden">
            <CardContent className="sm:p-6 p-4">
              <h3 className="text-lg font-bold text-title mb-4">
                {t("whatsapp_business", "WhatsApp Business (Cloud API)")}
              </h3>
              <div className="flex items-center justify-between">
                {isConnected ? (
                  <Badge className="px-3 py-1.5 gap-2 flex items-center bg-edit/10 text-edit border-none shadow-none font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-edit animate-pulse shrink-0" />
                    {t("connected", "Connected")}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="px-3 py-1.5 gap-2 bg-subcard text-subtitle-color border-none shadow-none flex items-center font-bold text-xs">
                    {t("not_connected", "Not Connected")}
                  </Badge>
                )}

                {isConnected ? (
                  <Button
                    variant="destructive"
                    className="bg-destructive/10 text-destructive hover:bg-destructive! hover:text-white! h-9 p-padding! rounded-lg font-bold text-sm shadow-none transition-colors"
                    onClick={() => setShowDisconnectDialog(true)}
                  >
                    {t("disconnect", "Disconnect")}
                  </Button>
                ) : (
                  <Button
                    className="h-9 px-4 rounded-lg text-white font-bold text-sm shadow-none transition-colors"
                    onClick={startSignup}
                    disabled={!fbReady || !isConfigured || isLoading}
                    title={!isConfigured ? "Configure App ID, App Secret and Configuration ID in User Settings first" : undefined}
                  >
                    {isLoading ? t("connecting", "Connecting...") : t("connect", "Connect")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Webhook or Manual Form */}
        <div className="lg:col-span-2">
          {connectionMethod === "embedded" ? (
            <WebhookConfiguration />
          ) : (
            <Card className="rounded-radius border-input-border-color bg-bg-card transition-all duration-300 overflow-hidden h-full">
              <CardContent className="sm:p-6 p-4 h-full">
                <ManualWabaForm />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Phone Numbers Table */}
      {isConnected && (
        <PhoneNumbersTable phoneNumbers={phoneNumbers} isLoading={isLoadingPhoneNumbers} />
      )}

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("are_you_sure", "Are you sure?")}</DialogTitle>
            <DialogDescription>
              {t(
                "disconnect_waba_warning",
                "This action will disconnect your WhatsApp Business Account. You will no longer be able to send or receive messages until reconnected."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>
              {t("cancel", "Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDisconnect}>
              {t("disconnect", "Disconnect")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Guide Steps Dialog */}
      <Dialog open={showGuideDialog} onOpenChange={setShowGuideDialog}>
        <DialogContent className="sm:max-w-3xl! max-w-[calc(100%-2rem)] max-h-[90vh] no-scrollbar overflow-auto h-fit p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">
            {t("guide_main_title", "Getting Started With WhatsApp API")}
          </DialogTitle>
          <WabaSetupGuide isConnected={isConnected} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectWABA;

