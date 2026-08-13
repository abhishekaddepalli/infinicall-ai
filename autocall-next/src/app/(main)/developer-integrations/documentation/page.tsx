'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { useGetTenantGuidesQuery } from '@/redux/api/tenantGuideApi'
import { ArrowLeft, BookOpen, Check, ChevronRight, Copy, Search, Terminal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function ApiDocumentationPage() {
  const { t } = useTranslation()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Fetch active guides based on search
  const { data, isLoading } = useGetTenantGuidesQuery({
    page: 1,
    limit: 100, // fetch all active guides
    is_active: true,
    search: debouncedSearchTerm
  })

  const guides = data?.tenantGuide || []

  // Set the first guide as default selected
  const activeGuide =
    guides.find((g: any) => g._id === selectedGuideId) || guides[0]

  useEffect(() => {
    const mainScroll = document.querySelector('main')
    if (mainScroll) {
      mainScroll.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeGuide?._id])

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(id)
      toast.success(t('copied_success'))
      setTimeout(() => setCopiedText(null), 2000)
    } catch {
      toast.error(t('copied_failed'))
    }
  }

  const getMethodBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      case 'POST':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'PUT':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20'
      case 'PATCH':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20'
    }
  }

  const renderJsonBlock = (obj: any, id: string) => {
    let jsonStr = ''
    try {
      jsonStr = typeof obj === 'string' ? JSON.stringify(JSON.parse(obj), null, 2) : JSON.stringify(obj, null, 2)
    } catch {
      jsonStr = JSON.stringify(obj, null, 2)
    }

    if (jsonStr === '{}' || jsonStr === 'null' || !jsonStr) {
      return (
        <div className="text-xs text-muted-foreground italic px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          {t('no_schema')}
        </div>
      )
    }

    return (
      <div className="relative group">
        <pre className="text-xs font-mono bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto border border-input-border-color leading-relaxed max-h-[250px] no-scrollbar">
          <code>{jsonStr}</code>
        </pre>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCopy(jsonStr, id)}
          className="absolute top-2 right-2 h-8 w-8 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
        >
          {copiedText === id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.API_INTEGRATION)} className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-title flex items-center gap-2.5">
            <span>{t("api_documentation")}</span>
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh]">
          <Spinner />
          <p className="text-sm text-subtitle-color mt-3">{t("loading")}</p>
        </div>
      ) : guides.length === 0 && !searchTerm && !debouncedSearchTerm ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed rounded-2xl bg-white p-8">
          <BookOpen className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-title">{t("no_documentation_available")}</h3>
          <p className="text-sm text-subtitle-color text-center max-w-sm mt-1">{t("no_documentation_desc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Left panel: List of guides */}
          <div className="md:col-span-1 space-y-4 md:sticky md:top-6 md:z-10">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtitle-color" />
              <Input placeholder={t("search_guides")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-11 w-full rounded-lg bg-bg-card focus-visible-outline-unset! transition-all" />
            </div>

            <div className="flex flex-col gap-1 bg-bg-card border border-input-border-color p-4  rounded-radius max-h-[60vh] overflow-y-auto no-scrollbar">
              {guides.map((guide) => (
                <Button key={guide._id} onClick={() => setSelectedGuideId(guide._id)} className={cn("w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg transition-all font-semibold text-sm", activeGuide?._id === guide._id ? "bg-primary/10 text-primary border-l-3 border-primary" : "hover:bg-slate-50 dark:hover:bg-slate-900 dark:hover:text-slate-200 bg-[unset] text-subtitle-color hover:text-slate-800")}>
                  <span className="truncate pr-2 rtl:pr-0 rtl:pl-2 text-md">{guide.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
                </Button>
              ))}

              {guides.length === 0 && <span className="text-md text-subtitle-color text-center py-6">{t("no_results")}</span>}
            </div>
          </div>

          {/* Middle & Right panel: Detailed guide view */}
          <div className="md:col-span-3 bg-bg-card border border-input-border-color rounded-radius p-4 sm:p-6 space-y-8 ">
            {guides.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                <div className="p-4 bg-primary/10 rounded-lg mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-title">{t("no_documents_found")}</h3>
                <p className="text-md text-subtitle-color mt-2 max-w-sm">
                  {t("try_adjusting_search")}
                </p>
              </div>
            ) : activeGuide ? (
              <div className="space-y-4">
                {/* Title & description */}
                <div className="pb-3 border-b border-input-border-color">
                  <h2 className="text-2xl font-bold text-title">{activeGuide.title}</h2>
                  {activeGuide.description && <p className="text-sm leading-relaxed text-subtitle-color mt-2 whitespace-pre-wrap">{activeGuide.description}</p>}
                </div>

                {/* Endpoints */}
                <div className="space-y-12">
                  {activeGuide.endpoints && activeGuide.endpoints.length > 0 ? (
                    activeGuide.endpoints.map((ep, idx) => {
                      const epId = `${activeGuide._id}_ep_${idx}`;
                      return (
                        <div key={idx} className="space-y-4">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="text-lg font-bold text-title">{ep.sub_title}</h3>
                              <p className="text-md text-subtitle-color leading-relaxed">{ep.sub_description}</p>
                            </div>
                          </div>

                          {/* Method & Path banner */}
                          <div className="flex items-center gap-3 p-3 bg-subcard rounded-lg border border-input-border-color font-mono text-sm">
                            <span className={cn("text-[11px] font-extrabold uppercase px-2.5 py-1 border rounded-lg shrink-0 tracking-wider", getMethodBadgeClass(ep.http_method))}>{ep.http_method}</span>
                            <span className="flex-1 select-all font-semibold text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">{ep.url_path}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(ep.url_path, `${epId}_path`)} className="h-9 w-9 bg-primary/10 dark:bg-slate-800 border border-input-border-color hover:bg-primary hover:text-white text-primary rounded-lg shrink-0 ">
                              {copiedText === `${epId}_path` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>

                          {/* Payload & Response Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                            {/* Request Payload */}
                            {ep.http_method !== "GET" && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-md font-bold text-title">
                                  <Terminal className="h-4 w-4 text-primary" />
                                  <span>{t("request_body")}</span>
                                </div>
                                {renderJsonBlock(ep.payload, `${epId}_req`)}
                              </div>
                            )}
                            {/* Response Payload */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-md font-bold text-title">
                                <Terminal className="h-4 w-4 text-emerald-500" />
                                <span>{t("response_body")}</span>
                              </div>
                              {renderJsonBlock(ep.response, `${epId}_res`)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground italic">{t("no_endpoints_documented")}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-sm text-subtitle-color">{t("select_guide_hint")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
