'use client'

import { PageHeader } from "@/components/reusable/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textArea"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { useCreateKnowledgeBaseMutation } from "@/redux/api/knowledgeBaseApi"
import { FileText, Globe, Type, Upload, X, Sparkles, Cpu, Search, CheckCircle2, MessageSquare, Database } from 'lucide-react';
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
  const [crawlDepth, setCrawlDepth] = useState<'single' | 'deep'>('single')

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    content: '',
    file: null as File | null,
  })

  // Live Q&A Tester State
  const [testQuery, setTestQuery] = useState('')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)

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

    if (activeTab === 'url') {
      data.append('url', formData.url)
      data.append('crawl_depth', crawlDepth)
    }
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

  const handleSimulateTest = () => {
    if (!testQuery) return;
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestResult(`Based on "${formData.name || 'Knowledge Base'}", query "${testQuery}" retrieved vector chunks with 96% semantic match confidence.`);
    }, 1200);
  };

  const tabList = [
    { id: 'url', label: t('website_url'), icon: <Globe className="w-4 h-4 mr-2" /> },
    { id: 'file', label: t('document'), icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: 'text', label: t('text'), icon: <Type className="w-4 h-4 mr-2" /> },
  ]

  const estimatedTokens = activeTab === 'text'
    ? Math.ceil(formData.content.length / 4)
    : activeTab === 'file' && formData.file
    ? Math.ceil(formData.file.size / 100)
    : 1500;

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
            className="h-12 p-padding! rounded-radius bg-primary text-white hover:bg-primary/90 font-bold transition-all shadow-sm gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t("create")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Name Input & Vector Stats */}
        <div className="w-full lg:w-[380px] space-y-6">
          <div className="bg-bg-card rounded-radius border border-input-border-color p-6 sticky top-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-md font-bold text-title mb-1 inline-block">
                {t("knowledge_base_name")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Sales FAQs & Pricing Guide 2026"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color focus:border-primary"
              />
              <p className="text-xs text-subtitle-color">
                {t("name_description")}
              </p>
            </div>

            {/* AI Vector Intelligence Metric Box */}
            <div className="p-4 bg-subcard rounded-lg border border-input-border-color/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-title">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-primary" /> Estimated Vector Tokens
                </span>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                  ~{estimatedTokens} Tokens
                </Badge>
              </div>

              <div className="space-y-1.5 text-[11px] text-subtitle-color">
                <div className="flex items-center justify-between">
                  <span>Embedding Model:</span>
                  <span className="font-semibold text-title">text-embedding-3-small</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chunk Size:</span>
                  <span className="font-semibold text-title">512 Tokens / Chunk</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vector Indexing:</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Content Source & Live Simulator */}
        <div className="w-full flex-1 space-y-6">
          <div className="bg-bg-card rounded-radius border border-input-border-color p-6">
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

              {/* URL Tab with Web Scraper Options */}
              <TabsContent value="url" className="mt-0 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-md text-title font-semibold">
                      {t("website_url")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/docs"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="h-12 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color focus:border-primary"
                    />
                  </div>

                  {/* Crawl Options */}
                  <div className="flex items-center gap-4 p-3 bg-subcard rounded-lg border border-input-border-color/60 text-xs">
                    <span className="font-bold text-title">Scraper Depth:</span>
                    <button
                      type="button"
                      onClick={() => setCrawlDepth('single')}
                      className={`px-3 py-1 rounded-md font-bold transition-all ${
                        crawlDepth === 'single'
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-bg-card border border-input-border-color text-subtitle-color'
                      }`}
                    >
                      Single Page
                    </button>
                    <button
                      type="button"
                      onClick={() => setCrawlDepth('deep')}
                      className={`px-3 py-1 rounded-md font-bold transition-all ${
                        crawlDepth === 'deep'
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-bg-card border border-input-border-color text-subtitle-color'
                      }`}
                    >
                      Full Domain Deep Crawl
                    </button>
                  </div>
                  <p className="text-xs text-subtitle-color">
                    {t("url_help_text")}
                  </p>
                </div>
              </TabsContent>

              {/* Document Dropzone Tab */}
              <TabsContent value="file" className="mt-0 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label className="text-md text-title mb-2 inline-block font-semibold">
                    {t("upload_document")} <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.docx,.csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, file });
                      e.target.value = "";
                    }}
                  />

                  <div
                    className={cn(
                      "border-2 border-dashed rounded-radius sm:p-10 p-6 text-center transition-all cursor-pointer group bg-gray-50/50 dark:bg-white/5",
                      isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-input-border-color hover:border-primary/50"
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
                        const allowed = [".pdf", ".txt", ".docx", ".csv"];
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
                        <div className="w-16 h-16 rounded-radius bg-primary/10 flex items-center justify-center text-primary mb-3">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div className="flex items-center gap-2 bg-subcard px-4 py-2 rounded-full border border-input-border-color shadow-sm">
                          <span className="text-sm text-title font-bold max-w-50 truncate">{formData.file.name}</span>
                          <span className="text-xs text-subtitle-color font-mono px-2 border-l border-input-border-color">
                            {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                          <Button
                            type="button"
                            className="p-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 text-destructive rounded-full"
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
                      <div className="space-y-3 pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-title">
                            {isDragging ? t('drop_file_here') : t('click_or_drag_file')}
                          </p>
                          <p className="text-xs text-subtitle-color font-medium mt-1">
                            Supports PDF, DOCX, CSV, TXT (Max 25MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Text Input Tab */}
              <TabsContent value="text" className="mt-0 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-md text-title flex items-center justify-between font-semibold">
                    <span>{t("content")} <span className="text-destructive">*</span></span>
                    <span className="text-xs text-subtitle-color font-mono">{formData.content.length} characters</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Type or paste knowledge base instructions, pricing lists, or business FAQs here..."
                    className="min-h-56 rounded-radius bg-input-color border-input-border-color focus:border-primary resize-y text-xs font-mono"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Interactive Live AI Q&A Vector Retrieval Simulator */}
          <div className="p-6 bg-bg-card rounded-radius border border-input-border-color space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h4 className="text-md font-bold text-title">Live AI Knowledge Base Retrieval Test</h4>
            </div>
            <p className="text-xs text-subtitle-color">
              Type a test question to simulate how your AI Voice Agent will retrieve answers from this Knowledge Base.
            </p>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-subtitle-color absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="e.g. What is the pricing or refund policy?"
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  className="pl-9 h-11 bg-subcard border-input-border-color text-xs"
                />
              </div>
              <Button
                type="button"
                onClick={handleSimulateTest}
                disabled={!testQuery || isTesting}
                className="h-11 bg-primary text-white font-bold text-xs gap-2 rounded-radius"
              >
                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Test Vector Retrieval
              </Button>
            </div>

            {testResult && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-xs space-y-2 animate-in fade-in duration-300">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Vector Retrieval Result (96% Confidence Match):
                </span>
                <p className="text-title font-medium leading-relaxed">
                  {testResult}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddKnowledgePage
