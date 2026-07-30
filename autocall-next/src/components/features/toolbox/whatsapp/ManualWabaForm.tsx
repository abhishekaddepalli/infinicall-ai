"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetManualConnectDetailsQuery, useManualConnectMutation } from "@/redux/api/whatsappApi";
import { isBrowser } from "@/utils/environment";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ManualWabaForm = () => {
  const { t } = useTranslation();
  const [manualConnect, { isLoading }] = useManualConnectMutation();
  const { data: detailsData, isLoading: isDetailsLoading } = useGetManualConnectDetailsQuery();
  const [formData, setFormData] = useState(() => {
    if (isBrowser) {
      const saved = sessionStorage.getItem('manualWabaFormData');
      if (saved) return JSON.parse(saved);
    }
    return {
      phone_number_id: "",
      waba_id: "",
      business_id: "",
      registered_phone_number: "",
      access_token: "",
    };
  });

  useEffect(() => {
    const hasDraft = isBrowser && sessionStorage.getItem('manualWabaFormData');
    if (detailsData?.data && !hasDraft) {
      setFormData({
        phone_number_id: detailsData.data.phone_number_id || "",
        waba_id: detailsData.data.waba_id || "",
        business_id: detailsData.data.business_id || "",
        registered_phone_number: detailsData.data.registered_phone_number || "",
        access_token: detailsData.data.access_token || "",
      });
    }
  }, [detailsData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const next = { ...prev, [name]: value };
      if (isBrowser) {
        sessionStorage.setItem('manualWabaFormData', JSON.stringify(next));
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone_number_id || !formData.waba_id || !formData.business_id || !formData.registered_phone_number || !formData.access_token) {
      toast.error(t("all_fields_required", "All fields are required."));
      return;
    }

    try {
      const response = await manualConnect(formData).unwrap();
      if (response.success) {
        toast.success(t("waba_connected_successfully", "WhatsApp Business Account connected successfully!"));
        if (isBrowser) {
          sessionStorage.removeItem('manualWabaFormData');
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.error || t("failed_to_connect_whatsapp_account"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3 items-start">
        <Info size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-md text-primary">
          {t("manual_connect_info", "Connect your business account using Meta developer credentials. Make sure you have generated a permanent access token and added your phone number in the Meta developer console.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone_number_id">
            {t("phone_number_id", "Phone Number ID")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone_number_id"
            name="phone_number_id"
            placeholder="e.g. 109283746509182"
            value={formData.phone_number_id}
            onChange={handleChange}
            disabled={isLoading || isDetailsLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="waba_id">
            {t("whatsapp_business_id", "WhatsApp Business ID")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="waba_id"
            name="waba_id"
            placeholder="e.g. 982734615243"
            value={formData.waba_id}
            onChange={handleChange}
            disabled={isLoading || isDetailsLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_id">
            {t("business_id", "Business ID")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="business_id"
            name="business_id"
            placeholder="e.g. 123456789"
            value={formData.business_id}
            onChange={handleChange}
            disabled={isLoading || isDetailsLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registered_phone_number">
            {t("registered_phone_number", "Registered Phone Number")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="registered_phone_number"
            name="registered_phone_number"
            placeholder="+1 (555) 000-0000"
            value={formData.registered_phone_number}
            onChange={handleChange}
            disabled={isLoading || isDetailsLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="access_token">
            {t("access_token", "Access Token")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="access_token"
            name="access_token"
            type="password"
            placeholder={t("paste_access_token", "Paste your permanent access token here...")}
            value={formData.access_token}
            onChange={handleChange}
            disabled={isLoading || isDetailsLoading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="bg-subcard border-input-border-color border p-padding!"
          onClick={() => {
            if (isBrowser) {
              sessionStorage.removeItem('manualWabaFormData');
            }
            if (detailsData?.data) {
              setFormData({
                phone_number_id: detailsData.data.phone_number_id || "",
                waba_id: detailsData.data.waba_id || "",
                business_id: detailsData.data.business_id || "",
                registered_phone_number: detailsData.data.registered_phone_number || "",
                access_token: detailsData.data.access_token || "",
              });
            } else {
              setFormData({ phone_number_id: "", waba_id: "", business_id: "", registered_phone_number: "", access_token: "" });
            }
          }}
          disabled={isLoading || isDetailsLoading}
        >
          {t("cancel", "Cancel")}
        </Button>
        <Button type="submit" disabled={isLoading || isDetailsLoading} className="p-padding! bg-primary text-white">
          {isLoading ? t("connecting", "Connecting...") : t("save_changes", "Save Changes")}
        </Button>
      </div>
    </form>
  );
};

export default ManualWabaForm;
