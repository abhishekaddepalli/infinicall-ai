import { LucideIcon } from "lucide-react";

export interface ToolboxItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  redirectPath: string;
}
