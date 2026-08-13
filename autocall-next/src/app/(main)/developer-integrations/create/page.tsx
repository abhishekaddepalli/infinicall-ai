"use client";

import { ApiKeyRawDisplayModal } from "@/components/features/api-integration/ApiKeyRawDisplayModal";
import PermissionPicker from "@/components/features/permissions/PermissionPicker";
import { Loader2 } from '@/components/reusable/Loader2';
import Spinner from '@/components/reusable/Spinner';
import TextInput from "@/components/shared/TextInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PERMISSIONS } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";
import { usePermission } from "@/hooks/usePermission";
import { useProfile } from "@/hooks/useProfile";
import { useCreateApiKeyMutation } from "@/redux/api/apiKeyApi";
import { ApiError } from "@/types/api";
import { Form, Formik } from "formik";
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as Yup from "yup";

export default function CreateApiKeyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { hasPermission } = usePermission();

  const canCreate = hasPermission(PERMISSIONS.CREATE_API_KEY);

  const { data: profileData, isLoading: isLoadingPermissions } = useProfile();

  const [createApiKey, { isLoading: isCreating }] = useCreateApiKeyMutation();

  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t("name_required")),
    permissions: Yup.array()
      .min(1, t("at_least_one_permission"))
      .required(),
  });

  const handleSubmit = async (values: { name: string; permissions: string[] }) => {
    try {
      const res = await createApiKey({
        name: values.name,
        permissions: values.permissions,
      }).unwrap();

      if (res.data?.raw_key) {
        setNewRawKey(res.data.raw_key);
        setIsModalOpen(true);
      } else {
        toast.success(res.message || t("api_key_created_successfully"));
        router.push(ROUTES.API_INTEGRATION);
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || t("something_went_wrong"));
    }
  };

  if (!canCreate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">{t("access_denied")}</h1>
        <p className="text-muted-foreground">{t("no_permission_settings")}</p>
        <Button onClick={() => router.push(ROUTES.API_INTEGRATION)}>{t("go_back")}</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push(ROUTES.API_INTEGRATION)} className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-title flex items-center gap-2.5">
            <span>{t("create_api_key")}</span>
          </h1>
        </div>
      </div>

      <Formik initialValues={{ name: "", permissions: [] as string[] }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="bg-bg-card rounded-radius border border-input-border-color p-4 sm:p-6 space-y-8">
            <div>
              <TextInput name="name" label={t("name")} placeholder={t("enter_api_key_name")} />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <Label className="text-md font-medium text-title">{t("permissions")}</Label>
                <span className="text-md text-subtitle-color">{t("api_key_permissions_hint")}</span>
                {errors.permissions && touched.permissions && <span className="text-xs font-bold text-destructive mt-1">{errors.permissions as string}</span>}
              </div>

              {isLoadingPermissions ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner />
                </div>
              ) : (
                <PermissionPicker permissions={profileData?.user?.permissions || []} selectedIds={values.permissions} onChange={(ids) => setFieldValue("permissions", ids)} />
              )}
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-input-border-color">
              <Button type="button" variant="outline" onClick={() => router.push(ROUTES.API_INTEGRATION)} disabled={isCreating} className="h-10 px-6 rounded-radius border-input-border-color dark:border-white/10 text-subtitle-color font-medium hover:bg-subcard">
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isCreating} className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-medium rounded-radius shadow-sm shadow-primary/20">
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("create")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <ApiKeyRawDisplayModal
        isOpen={isModalOpen}
        onClose={(open) => {
          if (open === false) {
            setIsModalOpen(false);
            setTimeout(() => {
              setNewRawKey(null);
              router.push(ROUTES.API_INTEGRATION);
            }, 300);
          }
        }}
        newRawKey={newRawKey}
      />
    </div>
  );
}
