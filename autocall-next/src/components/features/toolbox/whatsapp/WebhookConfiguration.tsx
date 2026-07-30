"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUserSettingsQuery } from "@/redux/api/userSettingApi";
import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const WebhookConfiguration = () => {
  const { t } = useTranslation();
  const { data: userSettingsRes } = useGetUserSettingsQuery(null);
  const userSettings = userSettingsRes?.data;

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("copied_success", { title }));
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autocall.com";
  const webhookUrl = `${API_URL}/api/whatsapp/webhook`;
  const verifyToken = userSettings?.webhook_verification_token || "autocall";

  return (
    <Card className="rounded-radius border border-input-border-color bg-bg-card overflow-hidden h-full">
      <CardContent className="p-4 sm:p-6  space-y-6 srelative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-title">
            {t("webhook_configuration_title", "Webhook Configuration")}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-md font-semibold text-title">
              {t("webhook_url", "Webhook URL")}
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={webhookUrl}
                className="h-9 bg-input-color  border-input-border-color dark:bg-white/5 dark:border-white/10 focus:ring-primary/20 transition-all rounded-radius font-medium"
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-9 w-9 bg-primary/10  rounded-lg border-none text-primary hover:bg-primary hover:text-white"
                onClick={() => copyToClipboard(webhookUrl, t("webhook_url", "Webhook URL"))}
              >
                <Copy size={18} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-md font-semibold text-title">
              {t("verification_token", "Verification Token")}
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={verifyToken}
                className="h-9 bg-input-color  border-input-border-color dark:bg-white/5 dark:border-white/10 focus:ring-primary/20 transition-all rounded-radius font-medium"
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-9 w-9 bg-primary/10  rounded-lg border-none text-primary hover:bg-primary hover:text-white "
                onClick={() => copyToClipboard(verifyToken, t("verification_token", "Verification Token"))}
              >
                <Copy size={18} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfiguration;
