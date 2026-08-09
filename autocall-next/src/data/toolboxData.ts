import { ROUTES } from "@/constants/routes";
import { ToolboxItem } from "@/types/toolbox";
import { Calendar, FileText, Home, MessageCircle, MessageSquareCode, Webhook } from "lucide-react";

export const toolboxItems: ToolboxItem[] = [
  {
    id: "forms",
    titleKey: "toolbox_forms_title",
    descriptionKey: "toolbox_forms_description",
    icon: FileText,
    redirectPath: ROUTES.LEAD_CAPTURE_FORMS,
  },
  {
    id: "appointment",
    titleKey: "toolbox_appointment_title",
    descriptionKey: "toolbox_appointment_description",
    icon: Calendar,
    redirectPath: `${ROUTES.TOOLBOX}/appointment-scheduling`,
  },
  {
    id: "google_account",
    titleKey: "toolbox_google_account_title",
    descriptionKey: "toolbox_google_account_description",
    icon: Home,
    redirectPath: `${ROUTES.TOOLBOX}/google-workspace`,
  },
  {
    id: "embeddable_widget",
    titleKey: "toolbox_embeddable_widget_title",
    descriptionKey: "toolbox_embeddable_widget_description",
    icon: MessageSquareCode,
    redirectPath: `${ROUTES.TOOLBOX}/embeddable-widget`,
  },
  {
    id: "whatsapp",
    titleKey: "toolbox_whatsapp_title",
    descriptionKey: "toolbox_whatsapp_description",
    icon: MessageCircle,
    redirectPath: `${ROUTES.WHATSAPP_CONNECT}`,
  },
  {
    id: "event_webhooks",
    titleKey: "toolbox_event_webhooks_title",
    descriptionKey: "toolbox_event_webhooks_description",
    icon: Webhook,
    redirectPath: `${ROUTES.TOOLBOX}/event-webhooks`,
  },
];
