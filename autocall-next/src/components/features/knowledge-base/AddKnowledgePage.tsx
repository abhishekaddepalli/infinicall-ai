'use client'

import { PageHeader } from "@/components/reusable/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textArea"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { useCreateKnowledgeBaseMutation } from "@/redux/api/knowledgeBaseApi"
import { FileText, Globe, Type, Upload, X } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

const AddKnowledgePage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'text'>('url')

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    content: '',
    file: null as File | null,
  })

  const [createKB, { isLoading }] = useCreateKnowledgeBaseMutation()

  const handleSave = async () => {
    if (!formData.name) {
      toast.error(t('name_required'))
      return
    }

    if (activeTab === 'url' && !formData.url) {
      toast.error(t('url_required'))
      return
    }

    if (activeTab === 'text' && !formData.content) {
      toast.error(t('content_required'))
      return
    }

    if (activeTab === 'file' && !formData.file) {
      toast.error(t('file_required'))
      return
    }

    const data = new FormData()
    data.append('type', activeTab)
    data.append('name', formData.name)

    if (activeTab === 'url') data.append('url', formData.url)
    if (activeTab === 'text') data.append('content', formData.content)
    if (activeTab === 'file' && formData.file) data.append('file', formData.file)

    try {
      await createKB(data).unwrap()
      toast.success(t('knowledge_base_created_successfully'))
      router.push(ROUTES.KNOWLEDGE_BASE)
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_create_knowledge_base'))
    }
  }

  const tabList = [
    { id: 'url', label: t('website_url'), icon: <Globe className="w-4 h-4 mr-2" /> },
    { id: 'file', label: t('document'), icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: 'text', label: t('text'), icon: <Type className="w-4 h-4 mr-2" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title={t("create_knowledge_base")}
          showBackButton={true}
        />

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.KNOWLEDGE_BASE)}
            className="h-12 p-padding! rounded-radius border-input-border-color bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10"
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !formData.name}
            className="h-12 p-padding! rounded-radius bg-primary text-white hover:bg-primary/90 font-bold transition-all shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("create")
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Name Input */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-bg-card  rounded-radius border border-input-border-color sm:p-6 p-4 sticky top-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-md font-bold text-title mb-2 inline-block">
                {t("knowledge_base_name")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder={t("enter_name_placeholder")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color focus:border-primary"
              />
              <p className="text-sm text-slate-500 mt-2">
                {t("name_description")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Tabs for content types */}
        <div className="w-full flex-1">
          <div className="bg-bg-card rounded-radius border border-input-border-color sm:p-6 p-4">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'url' | 'file' | 'text')}
              className="w-full"
            >
              <TabsList className="w-full flex justify-start sm:justify-center p-1 h-14 bg-card-color rounded-radius mb-6 overflow-x-auto no-scrollbar scroll-smooth">
                {tabList.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    onClick={(e) => {
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className="flex-1 min-w-[140px] h-full rounded-radius data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                  >
                    <div className="flex items-center justify-center font-medium">
                      {tab.icon}
                      {tab.label}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="url" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-md text-title">
                      {t("website_url")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/docs"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="h-12 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color dark:border-white/10 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("url_help_text")}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="file" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label className="text-md text-title mb-2 inline-block">
                    {t("upload_document")} <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, file });
                      e.target.value = "";
                    }}
                  />

                  <div
                    className={cn(
                      "border-2 border-dashed rounded-radius sm:p-12 p-6 text-center transition-all cursor-pointer group bg-gray-50/50 dark:bg-white/5",
                      isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-gray-200 dark:border-white/10 hover:border-primary/50"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                      const dropped = e.dataTransfer.files?.[0];
                      if (dropped) {
                        const allowed = [".pdf", ".txt", ".docx"];
                        const ext = "." + dropped.name.split(".").pop()?.toLowerCase();
                        if (allowed.includes(ext)) {
                          setFormData({ ...formData, file: dropped });
                        } else {
                          toast.error(t('invalid_file_type'))
                        }
                      }
                    }}
                  >
                    {formData.file ? (
                      <div className="flex flex-col items-center animate-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-radius bg-primary/10 flex items-center justify-center text-primary mb-4">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div className="flex items-center gap-2 bg-white  px-4 py-2 rounded-full border border-gray-100 dark:border-white/10 shadow-sm">
                          <span className="text-sm text-title max-w-50 truncate">{formData.file.name}</span>
                          <span className="text-xs text-gray-400 font-medium px-2 border-l border-gray-200 dark:border-white/10">
                            {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                          <Button
                            type="button"
                            className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-full text-destructive transition-colors ml-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setFormData({ ...formData, file: null });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 pointer-events-none">
                        <div className={cn(
                          "w-15 h-15 rounded-full flex items-center justify-center mx-auto transition-all duration-300",
                          isDragging ? "bg-primary/10 text-primary scale-110" : "bg-primary/10 text-primary shadow-sm"
                        )}>
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-bold text-title">
                            {isDragging ? t('drop_file_here') : t('click_or_drag_file')}
                          </p>
                          <p className="text-md text-subtitle-color font-medium">
                            {t("file_require")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-md text-title flex items-center justify-between mb-2">
                    <span>{t("content")} <span className="text-destructive">*</span></span>
                    <span className="text-xs text-gray-400 font-normal">{formData.content.length} characters</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder={t("text_content_placeholder")}
                    className="min-h-62.5 rounded-radius bg-input-color border-input-border-color dark:border-white/10 focus:ring-primary/20 focus:border-primary resize-y"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddKnowledgePage
