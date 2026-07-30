import { ROUTES } from "@/constants/routes";
import { Layers, LayoutGrid } from "lucide-react";

export const attributeItems = [
    {
        id: "template-category",
        title: "Template Category",
        description: "Manage classifications for your prompt templates. Organise prompts into reusable categories.",
        icon: LayoutGrid,
        redirectPath: ROUTES.ATTRIBUTE_TEMPLATE_CATEGORY
    },
    {
        id: "campaign-type",
        title: "Campaign Type",
        description: "Manage types for calling campaigns. Customise how different calling workflows are categorized.",
        icon: Layers,
        redirectPath: ROUTES.ATTRIBUTE_CAMPAIGN_TYPE
    },
];