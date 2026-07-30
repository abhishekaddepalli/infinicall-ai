"use client";

import InboxLayout from "@/components/features/inbox/InboxLayout";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";
import { useTranslation } from "react-i18next";

const InboxPage = () => {
  const { hasPermission } = usePermission();
  const { t } = useTranslation();
  
  const canView = hasPermission(PERMISSIONS.VIEW_SMS_CHAT);

  if (!canView) {
    return (
      <div className="p-8 text-center text-subtitle-color font-medium">
        {t('no_permission_to_view', 'You do not have permission to view SMS inbox.')}
      </div>
    );
  }

  return <InboxLayout />;
};

export default InboxPage;
