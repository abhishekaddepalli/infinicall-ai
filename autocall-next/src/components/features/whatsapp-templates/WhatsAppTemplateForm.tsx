"use client";

import { Loader2 } from '@/components/reusable/Loader2';
import Spinner from '@/components/reusable/Spinner';
import CKEditorField from "@/components/shared/CKEditorField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { useGetConnectionsQuery } from "@/redux/api/whatsappApi";
import { useCreateTemplateMutation, useGetTemplateByIdQuery, useUpdateTemplateMutation } from "@/redux/api/whatsappTemplateApi";
import { WhatsAppTemplateFormProps } from "@/types/waba";
import { AlignLeft, ArrowLeft, FileText, HelpCircle, Image as ImageIcon, Info, Layout, MapPin, Plus, Smartphone, Video, X } from 'lucide-react';
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { FormLivePreview } from "./FormLivePreview";

// Language codes supported by Meta WhatsApp Cloud API
const LANGUAGES = [
  { label: "English (US)", value: "en_US" },
  { label: "English (UK)", value: "en_GB" },
  { label: "Spanish (ES)", value: "es_ES" },
  { label: "Spanish (LA)", value: "es_LA" },
  { label: "French (FR)", value: "fr_FR" },
  { label: "German (DE)", value: "de_DE" },
  { label: "Portuguese (BR)", value: "pt_BR" },
  { label: "Portuguese (PT)", value: "pt_PT" },
  { label: "Hindi (IN)", value: "hi_IN" },
  { label: "Arabic", value: "ar" },
];

export default function WhatsAppTemplateForm({ templateId }: WhatsAppTemplateFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const isEditMode = !!templateId;

  // 1. Fetch WABA connections to map template to
  const { data: connectionsResponse, isLoading: isLoadingWabas } = useGetConnectionsQuery();
  const connections = useMemo(() => connectionsResponse?.data || [], [connectionsResponse]);

  // 2. Fetch template details if edit mode
  const { data: templateResponse, isLoading: isLoadingTemplate } = useGetTemplateByIdQuery(templateId!, { skip: !isEditMode });

  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: isEditing }] = useUpdateTemplateMutation();

  // Form Fields State
  const [wabaId, setWabaId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [language, setLanguage] = useState("en_US");
  const [category] = useState("UTILITY"); // Locked to Utility as requested
  const [templateType, setTemplateType] = useState<"none" | "text" | "image" | "video" | "document" | "location">("none");
  const [headerText, setHeaderText] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [footerText, setFooterText] = useState("");
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");

  // Variable examples state
  const [variablesExample, setVariablesExample] = useState<{ key: string; example: string }[]>([]);

  // Editor instance reference for direct cursor variable insertions
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track if initial edit data is mapped
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  // Modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Helper to extract raw text length from HTML content securely
  const getRawTextLength = (html: string) => {
    if (typeof window === "undefined") return 0;
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return (temp.textContent || temp.innerText || "").length;
  };

  // Default first connection
  useEffect(() => {
    if (connections.length > 0 && !wabaId && !isEditMode) {
      const timer = setTimeout(() => {
        setWabaId(connections[0]._id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [connections, wabaId, isEditMode]);

  // Populate data when editing
  useEffect(() => {
    if (isEditMode && templateResponse?.data && !isDataInitialized) {
      const template = templateResponse.data;
      const timer = setTimeout(() => {
        setWabaId(template.waba_id?._id || template.waba_id || "");
        setTemplateName(template.template_name || "");
        setLanguage(template.language || "en_US");

        // Map Header
        const headerFormat = template.header?.format?.toLowerCase() || "none";
        if (headerFormat === "text") {
          setTemplateType("text");
          setHeaderText(template.header?.text || "");
        } else if (["image", "video", "document", "location"].includes(headerFormat)) {
          setTemplateType(headerFormat as any);
          setMediaUrl(template.header?.media_url || "");
        } else {
          setTemplateType("none");
        }

        // Map Body & Footer
        setMessageBody(template.message_body || "");
        setFooterText(template.footer_text || "");

        // Map variable examples
        if (template.variables_example) {
          setVariablesExample(template.variables_example || []);
        } else if (template.body_variables) {
          setVariablesExample(template.body_variables || []);
        }

        setIsDataInitialized(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isEditMode, templateResponse, isDataInitialized]);

  // Process message body changes to extract {{1}}, {{2}} variables dynamically
  const handleBodyChange = (value: string) => {
    setMessageBody(value);

    const variableMatches = value.match(/{{([^}]+)}}/g);
    const uniqueKeys = variableMatches ? Array.from(new Set(variableMatches.map((m) => m.replace(/{{|}}/g, "")))) : [];

    setVariablesExample((prev) => {
      return uniqueKeys.map((key) => {
        const existing = prev.find((v) => v.key === key);
        return existing ? existing : { key, example: "" };
      });
    });
  };

  // Insert variable tag {{1}}, {{2}} at cursor inside CKEditor or append if editor is not initialized
  const addVariable = () => {
    const nextKey = (variablesExample.length + 1).toString();
    if (editorInstance) {
      editorInstance.model.change((writer: any) => {
        writer.insertText(`{{${nextKey}}}`, editorInstance.model.document.selection.getFirstPosition());
      });
      handleBodyChange(editorInstance.getData());
    } else {
      const appendedText = messageBody + ` {{${nextKey}}}`;
      handleBodyChange(appendedText);
    }
  };

  const updateVariableValue = (key: string, val: string) => {
    setVariablesExample((prev) => prev.map((v) => (v.key === key ? { ...v, example: val } : v)));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Standard WhatsApp names support only lowercase alphanumeric & underscores
    const filtered = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setTemplateName(filtered);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error(t("file_size_exceeds_limit"));
      }
      setHeaderFile(file);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeWabaId = wabaId || (isEditMode ? (templateResponse?.data?.waba_id?._id || templateResponse?.data?.waba_id) : "");

    if (!activeWabaId) return toast.error(t("waba_id_required"));
    if (!templateName) return toast.error(t("template_name_required"));
    if (!messageBody) return toast.error(t("message_body_required"));

    if (getRawTextLength(messageBody) > 1024) {
      return toast.error(t("message_body_too_long"));
    }

    // Validate that all variables have examples (Meta requirement)
    const missingExample = variablesExample.find((v) => !v.example.trim());
    if (missingExample) {
      return toast.error(
        t("variable_example_required", {
          defaultValue: `Please provide a realistic example value for variable {{${missingExample.key}}}`,
        })
      );
    }

    // Build Payload
    const payload = new FormData();
    payload.append("waba_id", activeWabaId);
    payload.append("template_name", templateName);
    payload.append("language", language);
    payload.append("category", category);
    payload.append("message_body", messageBody);
    payload.append("footer_text", footerText || "");

    // Formulate Header Payload (support both bold text titles and rich media attachments at the same time!)
    const headerObj: any = { format: "NONE" };
    if (templateType !== "none") {
      headerObj.format = templateType.toUpperCase();
    } else if (headerText.trim().length > 0) {
      headerObj.format = "TEXT";
    }

    if (headerText.trim().length > 0) {
      headerObj.text = headerText.trim();
      // Crucial: Backend extracts "header_text" directly from the root of req.body!
      payload.append("header_text", headerText.trim());
    }
    payload.append("header", JSON.stringify(headerObj));

    // Append variable examples
    payload.append("variables_example", JSON.stringify(variablesExample));

    // Append media file if selected
    if (headerFile) {
      payload.append("file", headerFile);
    }

    try {
      if (isEditMode) {
        await updateTemplate({ id: templateId, data: payload }).unwrap();
        toast.success(t("template_updated_successfully"));
      } else {
        await createTemplate(payload).unwrap();
        toast.success(t("template_created_successfully"));
      }
      router.push(`${ROUTES.WHATSAPP_TEMPLATES}`);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_save_template"));
    }
  };

  if (isLoadingWabas || (isEditMode && isLoadingTemplate)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Spinner />
        <p className="text-sm text-muted-foreground font-medium">{t("loading_template_editor")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="icon" onClick={() => router.push(`${ROUTES.WHATSAPP_TEMPLATES}`)} className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20">
            <ArrowLeft size={16} />
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-title-color dark:text-white tracking-tight">{isEditMode ? t("edit_whatsapp_template") : t("create_whatsapp_template")}</h1>
          </div>
        </div>

        {/* Top Action Ribbon */}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={() => setShowPreviewModal(true)} className="h-11 p-padding! border-transparent text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-lg transition-all font-bold text-xs min-[1480px]:hidden">
            {t("live_preview", "Live preview")}
          </Button>
          <Button type="submit" form="waba-template-form" disabled={isCreating || isEditing} className="h-11 p-padding! bg-primary text-white font-extrabold rounded-lg transition-all text-xs">
            {(isCreating || isEditing) && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
            {isEditMode ? t("save_changes") : t("create_template")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`${ROUTES.WHATSAPP_TEMPLATES}`)} className="h-11 p-padding! border-input-border-color text-subtitle-color bg-subcard rounded-lg transition-all font-bold text-xs">
            {t("cancel")}
          </Button>
        </div>
      </div>

      <form id="waba-template-form" onSubmit={onSubmit} className="grid grid-cols-1 min-[1480px]:grid-cols-3 gap-8 items-start">
        {/* Left Side Inputs Form */}
        <div className="min-[1480px]:col-span-2 space-y-6">
          {/* Card 1: Basic Info */}
          <Card className="sm:p-6 p-4 rounded-lg border-input-border-color bg-bg-card space-y-6">
            <div className="border-b flex-wrap gap-3 border-input-border-color pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center shadow-xs shrink-0">
                  <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-title tracking-tight">{t("basic_information")}</h3>
                  <p className="text-sm text-subtitle-color font-semibold leading-none mt-0.5">{t("basic_information_desc")}</p>
                </div>
              </div>
              <Badge variant="outline" className="font-extrabold uppercase text-[10px] bg-slate-50 dark:bg-zinc-950 px-2.5 py-0.5 border-zinc-200 dark:border-zinc-800 tracking-wider text-indigo-600 dark:text-indigo-400 shrink-0">
                {t("utility_locked")}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Template Name */}
              <div className="space-y-2">
                <Label className="text-md font-bold text-title-color dark:text-zinc-300">
                  {t("template_name_label")} <span className="text-destructive">*</span>
                </Label>
                <div title={isEditMode ? t("cannot_be_changed", "Cannot be changed after creation") : undefined} className={isEditMode ? "cursor-not-allowed" : ""}>
                  <Input disabled={isEditMode} placeholder="e.g. Delivery Update" value={templateName} onChange={handleNameChange} className={`h-11 border-input-border-color bg-input-color rounded-lg font-medium transition-all text-sm ${isEditMode ? 'pointer-events-none opacity-70' : 'focus:bg-white'}`} maxLength={512} />
                </div>
                <p className="text-xs text-subtitle-color font-semibold leading-tight">{t("name_rules")}</p>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <Label className="text-md font-bold text-title-color dark:text-zinc-300">
                  {t("template_language_label")} <span className="text-destructive">*</span>
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-11 border-input-border-color bg-slate-50/50 dark:bg-zinc-950 rounded-lg font-bold transition-all text-sm shadow-none">
                    <SelectValue placeholder={t('choose_language')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-input-border-color bg-white dark:bg-zinc-950 max-h-56">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="font-bold text-sm">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* WABA connection assignment */}
            <div className="space-y-2 pt-2">
              <Label className="text-md font-bold text-title-color dark:text-zinc-300">
                {t("waba_account_label")} <span className="text-destructive">*</span>
              </Label>
              <div title={isEditMode ? t("cannot_be_changed", "Cannot be changed after creation") : undefined} className={isEditMode ? "cursor-not-allowed" : ""}>
                <Select value={wabaId} onValueChange={setWabaId} disabled={isEditMode}>
                  <SelectTrigger className={`h-11 border-input-border-color bg-slate-50/50 dark:bg-zinc-950 rounded-lg font-bold transition-all text-sm shadow-none ${isEditMode ? 'pointer-events-none opacity-70' : ''}`}>
                    <span className="truncate">
                      {isEditMode && templateResponse?.data?.waba_id
                        ? (templateResponse.data.waba_id.name || templateResponse.data.waba_id.whatsapp_business_account_id || t('select_waba_account'))
                        : (connections.find((c: any) => c._id === wabaId)?.name || t('select_waba_account'))}
                    </span>
                  </SelectTrigger>
                <SelectContent className="rounded-lg border-input-border-color bg-white dark:bg-zinc-950">
                  {connections.map((conn: any) => (
                    <SelectItem key={conn._id} value={conn._id} className="font-bold text-sm">
                      {conn.name} ({conn.whatsapp_business_account_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            </div>
          </Card>

          {/* Card 2: Header Configuration */}
          <Card className="sm:p-6 p-4 rounded-lg border-input-border-color bg-bg-card space-y-6">
            <div className="border-b border-input-border-color pb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-400/10 border border-violet-400/20 flex items-center justify-center shadow-xs shrink-0">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-title tracking-tight">{t("template_header_config")}</h3>
                <p className="text-sm text-subtitle-color font-semibold leading-none mt-0.5">{t("header_desc")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Header Text */}
              <div className="space-y-2">
                <Label className="text-md font-bold text-title-color dark:text-zinc-300">{t("header_text_label")}</Label>
                <div className="relative">
                  <Input
                    placeholder={t("enter_bold_header")}
                    value={headerText}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 60);
                      setHeaderText(val);
                    }}
                    className="h-11 border-input-border-color bg-input-color rounded-lg font-medium focus:bg-input-color transition-all text-sm pr-12"
                    maxLength={60}
                  />
                  <div className="absolute right-3 top-3 text-[10px] font-black text-slate-400">{headerText.length}/60</div>
                </div>
                <p className="text-xs text-subtitle-color font-bold">{t("header_text_variables")}</p>
              </div>

              {/* Right Column: Media Header */}
              <div className="space-y-2">
                <Label className="text-md font-bold text-title-color dark:text-zinc-300">{t("media_header_label")}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "Image", value: "image", icon: <ImageIcon size={15} /> },
                    { label: "Video", value: "video", icon: <Video size={15} /> },
                    { label: "Document", value: "document", icon: <FileText size={15} /> },
                    { label: "Location", value: "location", icon: <MapPin size={15} /> },
                  ].map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        if (templateType === type.value) {
                          setTemplateType("none");
                          setHeaderFile(null);
                        } else {
                          setTemplateType(type.value as any);
                          setHeaderFile(null);
                        }
                      }}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border transition-all h-20 font-extrabold text-sm ${templateType === type.value ? "border-primary bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground" : "border-input-border-color bg-input-color text-slate-500"}`}
                    >
                      <div className={`p-1.5 rounded-lg ${templateType === type.value ? "bg-primary/20 text-primary" : "bg-subcard border border-input-border-color"}`}>{type.icon}</div>
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Media Upload Area or Location info */}
            {["image", "video", "document"].includes(templateType) && (
              <div className="space-y-4 pt-4 border-t border-input-border-color animate-in fade-in slide-in-from-top-1.5 duration-300">
                <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={templateType === "image" ? "image/*" : templateType === "video" ? "video/*" : ".pdf,.doc,.docx,.xls,.xlsx"} />

                {headerFile || mediaUrl ? (
                  <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500">
                        {templateType === "image" && <ImageIcon size={20} />}
                        {templateType === "video" && <Video size={20} />}
                        {templateType === "document" && <FileText size={20} />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-md font-bold text-title truncate leading-snug">{headerFile ? headerFile.name : t("meta_hosted_media")}</span>
                        <span className="text-sm text-emerald-500 font-extrabold uppercase tracking-wider truncate">{headerFile ? `${(headerFile.size / (1024 * 1024)).toFixed(2)} MB • Ready` : t("active_on_meta")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button type="button" onClick={() => fileInputRef.current?.click()} className="h-9 p-padding! bg-primary text-white text-xs font-bold rounded-lg">
                        {t("change")}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setHeaderFile(null);
                          setTemplateType("none");
                        }}
                        className="h-9 w-9 p-0! flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-all"
                      >
                        <X size={15} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 group border-dashed border-input-border-color rounded-lg sm:p-8 p-4 flex flex-col items-center justify-center bg-subcard transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-3 text-primary">
                      <Plus size={20} />
                    </div>
                    <p className="text-md font-bold text-title group-hover:text-primary">{t("upload_media_header")}</p>
                    <p className="text-sm text-subtitle-color font-semibold mt-1">{templateType === "image" ? "Supports PNG, JPG, JPEG (Max 5MB)" : templateType === "video" ? "Supports MP4 (Max 5MB)" : "Supports PDF, DOC, XLS (Max 5MB)"}</p>
                  </div>
                )}
              </div>
            )}

            {templateType === "location" && (
              <div className="p-4 bg-primary/5 rounded-lg text-xs font-medium text-slate-500 leading-relaxed flex gap-2.5 items-center">
                <MapPin className="text-primary shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-bold text-primary text-md break-all whitespace-normal line-clamp-1">{t("location_header_info")}</p>
                  <p className="mt-0.5 text-subtitle-color text-sm break-all whitespace-normal line-clamp-2">
                    {t("location_header_desc", {
                      defaultValue: "Location headers will resolve dynamically using latitude, longitude, name, and address variables inside campaign workflows.",
                    })}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Card 3: Message Body Section */}
          <Card className="sm:p-6 p-4 rounded-lg border-input-border-color bg-bg-card space-y-6">
            <div className="border-b border-input-border-color pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                  <AlignLeft className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-title tracking-tight">
                    {t("message_body_label")} <span className="text-destructive">*</span>
                  </h3>
                  <p className="text-sm text-subtitle-color font-medium mt-0.5">{t("body_desc")}</p>
                </div>
              </div>

              <Button type="button" onClick={addVariable} className="self-start sm:self-center h-11 p-padding! gap-1.5 bg-primary text-white! border border-zinc-200 dark:border-zinc-800 text-sm font-bold rounded-lg">
                <Plus className="text-white" size={12} />
                {t("add_variable")}
              </Button>
            </div>

            {/* Mounting decoupled CKEditor component */}
            <div className="space-y-2">
              <div className="relative group rounded-lg overflow-hidden border border-input-border-color">
                <CKEditorField
                  value={messageBody}
                  onChange={handleBodyChange}
                  onReady={setEditorInstance}
                  heightClass="min-h-[140px]"
                  placeholder={t("message_body_placeholder", {
                    defaultValue: "Hello {{1}}, your order {{2}} has been shipped successfully...",
                  })}
                />
              </div>
              <div className="flex justify-between items-center text-sm text-subtitle-color font-semibold leading-tight">
                <p>
                  {t("variables_usage_hint", {
                    defaultValue: 'To add dynamic fields, click "+ Add Variable" or type using double curly braces (e.g. {{1}}, {{2}}).',
                  })}
                </p>
                <div className={`font-black shrink-0 ml-4 ${getRawTextLength(messageBody) > 1024 ? "text-rose-500 font-black" : "text-slate-400"}`}>
                  {getRawTextLength(messageBody)}/1024
                </div>
              </div>
            </div>

            {/* Variable realistic example list (Meta review requirement) */}
            {variablesExample.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-input-border-color animate-in fade-in slide-in-from-top-1.5 duration-300">
                <div className="flex items-center gap-1.5">
                  <Label className="text-md font-black text-title-color dark:text-zinc-200">{t("variable_examples")}</Label>
                  <span title="Meta requires examples to review and approve your templates.">
                    <HelpCircle size={14} className="text-slate-400" />
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[430px] overflow-auto no-scrollbar">
                  {variablesExample.map((variable) => (
                    <div key={variable.key} className="p-3.5 rounded-lg border border-input-border-color bg-input-color space-y-1.5">
                      <span className="text-md font-extrabold text-primary leading-none">Variable {"{{" + variable.key + "}}"}</span>
                      <Input placeholder={`Real example for ${variable.key}`} value={variable.example} onChange={(e) => updateVariableValue(variable.key, e.target.value)} className="h-10 border-input-border-color bg-input-color rounded-lg font-medium text-sm focus:border-primary/50 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Card 4: Template Footer Section */}
          <Card className="sm:p-6 p-4 rounded-lg border-input-border-color bg-bg-card space-y-6">
            <div className="border-b border-input-border-color pb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                <Layout className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-title tracking-tight">{t("template_footer")}</h3>
                <p className="text-sm text-subtitle-color font-medium leading-none mt-0.5">{t("footer_desc")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input placeholder="Enter footer text (e.g. Reply STOP to opt out)" value={footerText} onChange={(e) => setFooterText(e.target.value.slice(0, 60))} className="h-11 border-input-border-color bg-input-color rounded-lg font-medium focus:bg-input-color transition-all text-sm pr-12" maxLength={60} />
                <div className="absolute right-3 top-3 text-[10px] font-black text-slate-400">{footerText.length}/60</div>
              </div>
            </div>
          </Card>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 justify-end">
            <Button type="submit" disabled={isCreating || isEditing} className="h-12 p-padding! bg-primary text-white font-extrabold rounded-lg transition-all text-sm">
              {(isCreating || isEditing) && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              {isEditMode ? t("save_changes") : t("create_template")}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(`${ROUTES.WHATSAPP_TEMPLATES}`)} className="h-12 p-padding border-input-border-color bg-subcard text-subtitle-color rounded-lg transition-all font-bold text-sm">
              {t("cancel")}
            </Button>
          </div>
        </div>

        {/* Right Side Sticky Phone Live Preview Card */}
        <div className="sticky top-6 hidden min-[1480px]:block">
          <div className="sm:p-5 p-4 bg-bg-card border border-input-border-color rounded-lg space-y-4">
            <div className="border-b border-input-border-color pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-400/10 border border-rose-400/20 flex items-center justify-center shadow-xs shrink-0">
                  <Smartphone className="w-5 h-5 text-rose-500" />
                </div>
                <span className="text-lg font-bold text-title">{t("live_preview")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] bg-emerald-400/10 px-1.5 py-0.5 rounded-full border border-emerald-400/20 text-emerald-500 font-bold uppercase shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>{t("interactive")}</span>
              </div>
            </div>
            <FormLivePreview templateType={templateType} headerText={headerText} messageBody={messageBody} variables_example={variablesExample} footerText={footerText} headerFile={headerFile} mediaUrl={mediaUrl} />
          </div>
        </div>
      </form>

      {/* Mobile Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity" onClick={() => setShowPreviewModal(false)} />
          <Button type="button" onClick={() => setShowPreviewModal(false)} className="absolute top-4 right-4 rtl:right-[unset] rtl:left-4 text-white p-0! transition-all w-9 h-9 rounded-full z-50">
            <X size={24} />
          </Button>
          <div className="relative z-10 w-full max-w-[340px] animate-in zoom-in-95 duration-200">
            <FormLivePreview templateType={templateType} headerText={headerText} messageBody={messageBody} variables_example={variablesExample} footerText={footerText} headerFile={headerFile} mediaUrl={mediaUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
