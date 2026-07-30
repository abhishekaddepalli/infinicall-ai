'use client'

import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import { useCreateContactInquiryMutation } from '@/redux/api/contactInquiryApi'
import { useGetFaqsQuery } from '@/redux/api/faqApi'
import { useGetPagesQuery } from '@/redux/api/pageApi'
import DOMPurify from 'dompurify'
import { useFormik } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, FileText, HelpCircle, MessageSquare, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as yup from 'yup'

export default function SupportCenterPage() {
  const { t } = useTranslation()

  const { data: faqData, isLoading: faqsLoading } = useGetFaqsQuery({ page: 1, limit: 100 })
  const { data: pageData, isLoading: pagesLoading } = useGetPagesQuery({ page: 1, limit: 100 })
  const [createInquiry, { isLoading: isSubmitting }] = useCreateContactInquiryMutation()

  const [activeTab, setActiveTab] = useState('faq')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const faqs = faqData?.faqs?.filter(f => f.status) || []
  const pages = pageData?.pages?.filter(p => p.status) || []

  const decodeHtml = (html: string) => {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema: yup.object({
      name: yup.string().required(t('name_required')),
      email: yup.string().email(t('invalid_email')).required(t('email_required')),
      subject: yup.string().required(t('subject_required')),
      message: yup.string().required(t('message_required')),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await createInquiry(values).unwrap()
        toast.success(t('inquiry_sent_successfully'))
        resetForm()
        setIsContactModalOpen(false)
      } catch (err: any) {
        toast.error(err?.data?.message || t('inquiry_failed'))
      }
    },
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title={t('support_center')}
      />

      {/* Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar pb-2 items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => setActiveTab('faq')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
            activeTab === 'faq'
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-subcard text-subtitle-color hover:text-title border border-transparent"
          )}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t('faq')}</span>
        </Button>
        {pages.map(page => (
          <Button
            variant="ghost"
            key={page.id || page._id}
            onClick={() => setActiveTab(page.id || page._id || page.slug)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === (page.id || page._id || page.slug)
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-subcard text-subtitle-color hover:text-title border border-transparent"
            )}
          >
            <FileText className="w-4 h-4" />
            <span>{page.title}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content Area */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'faq' ? (
            faqsLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-subcard rounded-2xl w-full" />
                ))}
              </div>
            ) : faqs.length > 0 ? (
              <div className="space-y-4">
                {faqs.map(faq => {
                  const isOpen = openFaq === faq.id
                  return (
                    <div
                      key={faq.id}
                      className={cn(
                        "rounded-2xl transition-all duration-300 overflow-hidden",
                        isOpen ? "bg-primary/[0.02] border border-primary/20 shadow-sm" : "bg-bg-card border border-input-border-color shadow-sm"
                      )}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                        className="w-full h-auto flex items-center justify-between p-5 text-left hover:bg-transparent"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
                            isOpen ? "bg-primary text-white" : "border border-input-border-color text-subtitle-color"
                          )}>
                            <HelpCircle className="w-4 h-4" />
                          </div>
                          <span className={cn(
                            "font-bold text-base",
                            isOpen ? "text-primary" : "text-title"
                          )}>
                            {faq.title}
                          </span>
                        </div>
                        <ChevronDown className={cn(
                          "w-5 h-5 transition-transform duration-300",
                          isOpen ? "rotate-180 text-primary" : "text-subtitle-color"
                        )} />
                      </Button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 pt-0 pl-17 text-subtitle-color text-sm leading-relaxed">
                              {faq.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-subtitle-color">
                {t('no_faqs_found')}
              </div>
            )
          ) : (
            pagesLoading ? (
              <div className="h-64 bg-subcard rounded-3xl animate-pulse" />
            ) : (
              (() => {
                const activePage = pages.find(p => (p.id || p._id || p.slug) === activeTab)
                if (!activePage) return null
                return (
                  <div className="bg-bg-card rounded-lg sm:p-6 p-4 border border-input-border-color shadow-sm">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                      {t('information')}
                    </span>
                    <h2 className="text-2xl font-bold text-title mb-6">{activePage.title}</h2>
                    {activePage.content ? (
                      <div
                        className="
                          text-zinc-600 dark:text-zinc-400 leading-relaxed text-base break-words
                          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-zinc-900 dark:[&_h1]:text-white [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:tracking-tight
                          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-zinc-900 dark:[&_h2]:text-white [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:tracking-tight
                          [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-zinc-900 dark:[&_h3]:text-white [&_h3]:mb-3 [&_h3]:mt-5
                          [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-zinc-900 dark:[&_h4]:text-white [&_h4]:mb-2 [&_h4]:mt-4
                          [&_p]:mb-4
                          [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline
                          [&_strong]:text-zinc-900 dark:[&_strong]:text-white [&_strong]:font-bold
                          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-1.5 [&_ul_li::marker]:text-zinc-400
                          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:mb-1.5 [&_ol_li::marker]:text-zinc-400
                          [&_img]:rounded-2xl [&_img]:shadow-lg [&_img]:my-8 [&_img]:max-w-full [&_img]:h-auto
                          [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-zinc-500
                          [&_pre]:bg-zinc-100 dark:[&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:mb-4
                          [&_code]:bg-zinc-100 dark:[&_code]:bg-zinc-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-sm
                        "
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(decodeHtml(activePage.content || ''), {
                            ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'br', 'a', 'span', 'div', 'img', 'blockquote', 'code', 'pre', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                            ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style', 'width', 'height'],
                          })
                        }}
                      />
                    ) : (
                      <div className="text-subtitle-color text-sm italic">
                        {t('no_content')}
                      </div>
                    )}
                  </div>
                )
              })()
            )
          )}
        </div>

        {/* Right Content Area - Contact Support Card */}
        <div className="lg:col-span-1">
          {(activeTab === 'faq' ? faqsLoading : pagesLoading) ? (
            <div className="sticky top-6 bg-bg-card rounded-lg sm:p-6 p-4 border border-input-border-color shadow-sm space-y-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-subcard shrink-0" />
                <div className="space-y-3 flex-1 pt-1">
                  <div className="h-5 bg-subcard rounded-md w-2/3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-subcard rounded-md w-full" />
                    <div className="h-4 bg-subcard rounded-md w-4/5" />
                  </div>
                </div>
              </div>
              <div className="h-12 bg-subcard rounded-xl w-full" />
              <div className="flex items-center gap-2 pt-2">
                <div className="w-2 h-2 rounded-full bg-subcard" />
                <div className="h-3 bg-subcard rounded-md w-24" />
              </div>
            </div>
          ) : (
            <div className="sticky top-6 bg-bg-card rounded-lg sm:p-6 p-4 border border-input-border-color shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-title">
                    {t('contact_support')}
                  </h3>
                  <p className="text-md text-subtitle-color mt-1 leading-relaxed">
                    {t('contact_support_desc')}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2"
              >
                <span>{t('send_message')}</span>
                <Send className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2 text-xs font-bold text-subtitle-color pt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('support_online')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-md bg-bg-card border-input-border-color rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-title">
              <MessageSquare className="w-5 h-5 text-primary" />
              {t('contact_support')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-1">
              <Label className="text-md font-bold text-title">{t('name')}</Label>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn("bg-input-color border-input-border-color text-title h-11", formik.touched.name && formik.errors.name && "border-rose-500")}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-xs text-rose-500 font-medium">{formik.errors.name as string}</div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-md font-bold text-title">{t('email')}</Label>
              <Input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn("bg-input-color border-input-border-color text-title h-11", formik.touched.email && formik.errors.email && "border-rose-500")}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-xs text-rose-500 font-medium">{formik.errors.email as string}</div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-md font-bold text-title">{t('subject')}</Label>
              <Input
                name="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn("bg-input-color border-input-border-color text-title h-11", formik.touched.subject && formik.errors.subject && "border-rose-500")}
              />
              {formik.touched.subject && formik.errors.subject && (
                <div className="text-xs text-rose-500 font-medium">{formik.errors.subject as string}</div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-md font-bold text-title">{t('message')}</Label>
              <Textarea
                name="message"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={cn("bg-input-color border-input-border-color text-title resize-none", formik.touched.message && formik.errors.message && "border-rose-500")}
              />
              {formik.touched.message && formik.errors.message && (
                <div className="text-xs text-rose-500 font-medium">{formik.errors.message as string}</div>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContactModalOpen(false)}
                className="h-11 rounded-xl"
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formik.isValid || !formik.dirty}
                className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-6"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('send')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
