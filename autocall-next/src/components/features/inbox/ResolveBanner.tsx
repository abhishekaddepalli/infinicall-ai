"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

const ResolveBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-subcard text-subtitle-color text-md font-medium py-3 px-4 flex items-center justify-center gap-2 border-b border-input-border-color">
      <AlertCircle className="h-4 w-4 opacity-80" />
      <span>{t("conversation_resolved", "Conversation Resolved")}</span>
    </div>
  );
};

export default ResolveBanner;
