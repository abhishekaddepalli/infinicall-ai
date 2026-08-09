"use client"

import { Loader2 } from '@/components/reusable/Loader2'
import Spinner from '@/components/reusable/Spinner'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scrollArea"
import { Switch } from "@/components/ui/switch"
import { PERMISSIONS } from "@/constants/permissions"
import { useAppDirection } from "@/hooks/useAppDirection"
import { usePermission } from "@/hooks/usePermission"
import { cn } from "@/lib/utils"
import { useGetSystemEmailTemplatesQuery, useUpdateSystemEmailTemplateMutation } from "@/redux/api/systemEmailTemplateApi"
import { ApiError } from "@/types/api"
import { EmailTemplate, Shortcode } from "@/types/email-library"
import { BellRing, CheckCircle, ChevronLeft, ChevronRight, Code, Eye, Info, KeyRound, Mail, MonitorSmartphone, RotateCcw, Save, ShieldCheck, Sparkles, UserPlus, Zap } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css'
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import OriginalEditor from 'react-simple-code-editor'
import { toast } from "sonner"

// Strongly type the editor to include textareaProps which is missing from the library's types
const Editor = OriginalEditor as unknown as React.FC<
  React.ComponentProps<typeof OriginalEditor> & {
    textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  }
>;

const getIconForTemplate = (name: string, slug: string) => {
  const normalizedName = name?.toLowerCase() || slug?.toLowerCase() || '';

  if (normalizedName.includes('welcome')) return <Sparkles className="w-5 h-5" />
  if (normalizedName.includes('team member')) return <UserPlus className="w-5 h-5" />

  if (normalizedName.includes('password') && normalizedName.includes('success')) return <ShieldCheck className="w-5 h-5" />
  if (normalizedName.includes('password') && normalizedName.includes('otp')) return <KeyRound className="w-5 h-5" />

  if (normalizedName.includes('registration')) return <MonitorSmartphone className="w-5 h-5" />

  if (normalizedName.includes('activation')) return <Zap className="w-5 h-5" />
  if (normalizedName.includes('reminder')) return <BellRing className="w-5 h-5" />

  // Generic fallbacks
  if (normalizedName.includes('password')) return <KeyRound className="w-5 h-5" />
  if (normalizedName.includes('otp')) return <MonitorSmartphone className="w-5 h-5" />

  return <Mail className="w-5 h-5" />
}

const getPreviewHtml = (html: string, shortcodes: Shortcode[] = []) => {
  let finalHtml = html || "";

  shortcodes.forEach((sc) => {
    const dummyVal = `[${sc.text}]`;
    finalHtml = finalHtml.replaceAll(sc.action, dummyVal);
  });

  return finalHtml;
}

export const EmailTemplatesPage = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const direction = useAppDirection()

  const canView = hasPermission(PERMISSIONS.VIEW_SETTINGS)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)

  const { data: response, isLoading: isFetching } = useGetSystemEmailTemplatesQuery(undefined, { skip: !canView })
  const [updateTemplate, { isLoading: isSaving }] = useUpdateSystemEmailTemplateMutation()

  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [cursorPos, setCursorPos] = useState<number | null>(null)

  const [originalTemplates, setOriginalTemplates] = useState<EmailTemplate[]>([])

  useEffect(() => {
    let fetchedTemplates: EmailTemplate[] = [];

    // Handle different possible API response structures
    if (Array.isArray(response)) {
      fetchedTemplates = response;
    } else if (response?.data && Array.isArray(response.data)) {
      fetchedTemplates = response.data;
    } else if (response?.templates && Array.isArray(response.templates)) {
      fetchedTemplates = response.templates;
    } else if (response?.data?.templates && Array.isArray(response.data.templates)) {
      fetchedTemplates = response.data.templates;
    }

    if (fetchedTemplates.length > 0) {
      setTemplates(fetchedTemplates)
      setOriginalTemplates(fetchedTemplates)
      if (!selectedSlug) {
        setSelectedSlug(fetchedTemplates[0].slug)
      }
    }
  }, [response])

  const selectedTemplate = templates.find(t => t.slug === selectedSlug)
  const originalTemplate = originalTemplates.find(t => t.slug === selectedSlug)

  const scrollEvents = (dir: 'left' | 'right') => {
    const root = document.getElementById('events-scroll-root')
    if (root) {
      const viewport = root.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
      if (viewport) {
        const amount = 320;
        const start = viewport.scrollLeft;
        const target = dir === 'left' ? start - amount : start + amount;
        const startTime = performance.now();
        const duration = 300; // ms

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          viewport.scrollLeft = start + (target - start) * easeProgress;

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };
        requestAnimationFrame(animateScroll);
      }
    }
  }

  const handleUpdateLocal = (updates: Partial<EmailTemplate>) => {
    if (!selectedSlug) return
    setTemplates(prev => prev.map(t => t.slug === selectedSlug ? { ...t, ...updates } : t))
  }

  const handleReset = () => {
    if (!selectedSlug || !originalTemplate) return
    handleUpdateLocal({
      subject: originalTemplate.default_subject || originalTemplate.subject,
      content: originalTemplate.default_content || originalTemplate.content,
      status: true
    })
  }

  const insertVariable = (variableAction: string) => {
    if (!selectedTemplate) return
    const content = selectedTemplate.content || ""
    if (cursorPos !== null) {
      const newContent = content.slice(0, cursorPos) + variableAction + content.slice(cursorPos)
      handleUpdateLocal({ content: newContent })
      setCursorPos(cursorPos + variableAction.length)
    } else {
      handleUpdateLocal({ content: content + variableAction })
    }
  }

  const handleSave = async () => {
    if (!selectedTemplate) return
    try {
      await updateTemplate({
        slug: selectedTemplate.slug,
        data: {
          subject: selectedTemplate.subject,
          content: selectedTemplate.content,
          status: selectedTemplate.status
        }
      }).unwrap()
      toast.success(t("email_template_updated_successfully", "Email template updated successfully"))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("failed_to_update_template", "Failed to update template"))
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        {t("no_permission_to_view", "You do not have permission to view this page.")}
      </div>
    )
  }

  return (
    <>
      {templates.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center min-h-[400px] border border-input-border-color rounded-lg bg-bg-card text-center p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <Spinner />
              <p className="font-bold text-subtitle-color">{t("loading_templates", "Loading templates...")}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-title mb-2">
                {t("no_templates_found", "No Templates Found")}
              </h3>
              <p className="text-subtitle-color font-medium max-w-md">
                {t("no_templates_found_desc", "There are currently no email templates available in the system.")}
              </p>
            </div>
          )}
        </div>
      ) : (
      <div className="flex flex-col gap-6 min-h-[600px]">
        {/* Top Row: Available Events */}
        <Card className="w-full flex flex-col shrink-0 border-input-border-color rounded-lg bg-bg-card">
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-input-border-color">
            <div className="flex items-center gap-2">
              <Info className="w-[18px] h-[18px] text-primary" />
              <span className="font-bold text-title text-lg">{t("available_events", "Available Events")}</span>
            </div>
            {canUpdate && (
              <Button onClick={handleSave} disabled={isSaving || !selectedTemplate} className="bg-primary text-white font-bold shadow-none border-none rounded-lg p-padding! h-9 transition-colors">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />}
                {t("save_templates", "Save Templates")}
              </Button>
            )}
          </div>
          <div className="relative group w-full flex items-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute left-1 md:left-2 z-[50] w-7 h-7 rounded-lg bg-subcard border-none  shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-title hover:bg-primary hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollEvents('left');
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <ScrollArea id="events-scroll-root" className="w-full px-4 py-4 table-custom-scrollbar" dir={direction}>
              <div className="flex gap-3 pb-2 ">
                {templates.map(template => {
                  const isSelected = selectedTemplate?.slug === template.slug;
                  return (
                    <Button
                      variant="ghost"
                      key={template.slug}
                      onClick={() => setSelectedSlug(template.slug)}
                      className={cn(
                        "w-[280px] md560:w-[240px] max-w-[85vw] shrink-0 text-left rtl:text-right p-4 h-auto flex flex-col items-start justify-start gap-3 whitespace-normal rounded-lg border group relative overflow-hidden",
                        isSelected
                          ? "bg-primary text-white border-primary hover:bg-primary hover:text-white"
                          : "bg-subcard text-title border-input-border-color"
                      )}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className={cn("shrink-0", isSelected ? "text-white" : "text-subtitle-color group-hover:text-primary")}>
                          {getIconForTemplate(template.name, template.slug)}
                        </div>
                        {(isSelected || template.status) && (
                          <CheckCircle className={cn("w-4 h-4 shrink-0", isSelected ? "text-white" : "text-primary/40")} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 relative z-10 flex flex-col items-start justify-start text-left rtl:text-right w-full">
                        <div className="font-bold text-md tracking-wide truncate w-full text-left rtl:text-right">{template.name}</div>
                        <div className={cn("text-sm line-clamp-1 font-medium w-full text-left rtl:text-right", isSelected ? "text-white/80" : "text-subtitle-color")}>
                          {template.description}
                        </div>
                      </div>
                    </Button>
                  )
                })}
                {/* Spacer to prevent clipping of the last item's right edge */}
                <div className="w-1 shrink-0" aria-hidden="true"></div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-1 md:right-2 z-[50] w-7 h-7 rounded-lg bg-subcard border-none  shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-title hover:bg-primary hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollEvents('right');
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Bottom Row: Editor and Variables */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
          {/* Middle Column -> Now Left Editor / Preview */}
          <Card className="flex-1 flex flex-col min-w-0 border-input-border-color rounded-lg bg-bg-card">
            {selectedTemplate ? (
              <>
                <div className="px-5 py-4 border-b border-input-border-color flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
                  <div className="flex items-center gap-2 text-title font-bold shrink-0">
                    <Code className="w-[18px] h-[18px] text-primary" />
                    <span className="text-lg text-title">{isPreviewMode ? t('email_preview', 'Email Preview') : t('code_editor', 'Code Editor')}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 xl:gap-5 w-full xl:w-auto">
                    <Button
                      variant={isPreviewMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className={cn("rounded-full h-9 p-padding! font-bold transition-all duration-300", isPreviewMode ? "bg-primary text-white border-transparent shadow-md shadow-primary/20" : "border-input-border-color shadow-none text-primary hover:bg-primary hover:text-white bg-primary/10")}
                    >
                      {isPreviewMode ? <><Code className="w-4 h-4" /> {t('view_code', 'View Code')}</> : <><Eye className="w-4 h-4" /> {t('live_view', 'Live View')}</>}
                    </Button>
                    <div className="flex items-center gap-2.5 bg-bg-body px-3 py-1.5 rounded-full border border-input-border-color">
                      <span className="text-sm font-bold text-title">{t('status', 'Status')}</span>
                      <Switch checked={selectedTemplate.status} onCheckedChange={(val) => handleUpdateLocal({ status: val })} className="scale-90" />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset} className="text-subtitle-color text-md bg-subcard border-input-border-color h-9 p-padding! rounded-full font-bold transition-colors">
                      <RotateCcw className="w-4 h-4" /> {t('reset', 'Reset')}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 sm:p-6 p-4 flex flex-col gap-6 overflow-hidden bg-bg-body rounded-b-lg">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-bold text-title">{t('email_title', 'Email Title')}</Label>
                    <Input
                      value={selectedTemplate.subject}
                      onChange={(e) => handleUpdateLocal({ subject: e.target.value })}
                      className="bg-input-color border-input-border-color h-10 rounded-lg focus-visible:ring-primary/20 text-sm text-title font-medium"
                    />
                  </div>

                  {!isPreviewMode ? (
                    <div className="flex-1 flex flex-col gap-2 min-h-0">
                      <Label className="text-sm font-bold text-title">{t('message_content', 'Message Content')}</Label>
                      <div className="flex-1 bg-[#1e1e1e] rounded-lg overflow-hidden relative border border-input-border-color flex flex-col">
                        <ScrollArea className="flex-1" dir={direction}>
                          <Editor
                            value={selectedTemplate.content || ""}
                            onValueChange={code => handleUpdateLocal({ content: code })}
                            highlight={code => Prism.highlight(code, Prism.languages.markup, 'markup')}
                            padding={24}
                            textareaProps={{
                              onSelect: (e: React.SyntheticEvent<HTMLTextAreaElement>) => setCursorPos(e.currentTarget.selectionStart),
                              onClick: (e: React.MouseEvent<HTMLTextAreaElement>) => setCursorPos(e.currentTarget.selectionStart),
                              onKeyUp: (e: React.KeyboardEvent<HTMLTextAreaElement>) => setCursorPos(e.currentTarget.selectionStart),
                            }}
                            style={{
                              fontFamily: 'var(--font-mono), monospace',
                              fontSize: '0.875rem',
                              lineHeight: 1.6,
                              minHeight: '100%',
                              backgroundColor: '#1e1e1e',
                              color: '#d4d4d4',
                            }}
                            className="editor-container text-left rtl:text-right"
                          />
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col gap-2 min-h-0">
                      <Label className="text-sm font-bold text-title">{t('preview', 'Preview')}</Label>
                      <div className="flex-1 border border-input-border-color rounded-lg overflow-hidden bg-subcard flex items-center justify-center sm:p-6 p-4 relative">
                        <div className="absolute inset-0 bg-bg-body pattern-grid-lg opacity-50" />
                        <div className="w-full h-full max-w-[700px] border border-input-border-color rounded-lg overflow-hidden bg-bg-card relative z-10 flex flex-col">
                          <div className="h-8 bg-zinc-100 border-b border-zinc-200 flex items-center px-4 gap-1.5 shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          </div>
                          <iframe
                            title="Preview"
                            srcDoc={getPreviewHtml(selectedTemplate.content, selectedTemplate.shortcodes)}
                            className="w-full flex-1 border-none bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-subtitle-color flex-col gap-4">
                {isFetching ? (
                  <Spinner />
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-bg-body flex items-center justify-center">
                      <Mail className="w-8 h-8 text-subtitle-color/50" />
                    </div>
                    <p className="font-medium text-sm">{t('select_a_template_to_edit', 'Select a template from the left to start editing')}</p>
                  </>
                )}
              </div>
            )}
          </Card>

          {/* Right Column: Available Variables */}
          <Card className="w-full lg:w-[280px] xl:w-[300px] flex flex-col shrink-0 border-input-border-color rounded-lg bg-bg-card">
            <div className="px-5 py-4 flex items-center gap-2 border-b border-input-border-color">
              <Info className="w-[18px] h-[18px] text-primary" />
              <span className="font-bold text-title text-lg">{t('dynamic_fields', 'Dynamic Fields')}</span>
            </div>
            <ScrollArea className="flex-1 sm:px-5 px-4 py-5" dir={direction}>
              <p className="text-sm text-subtitle-color sm:mb-6 mb-4 font-medium leading-relaxed">
                {t('click_a_variable', 'Click a variable to insert it at the current cursor position.')}
              </p>

              <div className="space-y-3 no-scrollbar overflow-auto max-h-[500px]">
                {selectedTemplate?.shortcodes?.map((variable: Shortcode) => (
                  <Button
                    variant="ghost"
                    key={variable.action}
                    onClick={() => insertVariable(variable.action)}
                    className="w-full h-auto flex flex-col items-start justify-start whitespace-normal text-left p-3.5 rounded-lg border border-input-border-color bg-subcard transition-all group"
                  >
                    <div className="font-mono text-md font-bold text-title mb-1.5 group-hover:text-primary transition-colors text-left rtl:text-right w-full break-all whitespace-normal line-clamp-1">{variable.action}</div>
                    <div className="text-md font-bold text-subtitle-color group-hover:text-primary/70 transition-colors text-left rtl:text-right w-full break-all whitespace-normal line-clamp-1">{variable.text}</div>
                  </Button>
                ))}

                {!selectedTemplate?.shortcodes?.length && selectedTemplate && (
                  <div className="text-center p-4 text-sm font-medium text-subtitle-color bg-bg-body rounded-xl border border-input-border-color">
                    {t('no_variables_available', 'No variables available for this template.')}
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary mb-2.5">
                  <Info className="w-[18px] h-[18px]" />
                  <span className="font-bold text-md">{t('how_it_works', 'How it works')}</span>
                </div>
                <p className="text-sm text-primary leading-relaxed font-medium">
                  {t('how_it_works_desc_1', 'Variables like ')} <code className="bg-primary/10 dark:bg-primary/20 px-1 py-0.5 rounded font-mono text-xs text-primary">{`{{user_email}}`}</code> {t('how_it_works_desc_2', 'are replaced with real values. Ensure you keep the double curly braces.')}
                </p>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
      )}
    </>
  )
}
