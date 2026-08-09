'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetContactInquiryByIdQuery } from '@/redux/api/contactInquiryApi'
import { InquiryDetailModalProps } from '@/types/shared'
import { formatDate } from '@/utils/validation-schemas'
import { FileText, Mail, MessageSquare, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function InquiryDetailModal({ inquiryId, isOpen, onClose }: InquiryDetailModalProps) {
  const { t } = useTranslation()
  const { data: inquiry, isLoading } = useGetContactInquiryByIdQuery(inquiryId!, {
    skip: !inquiryId || !isOpen,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! max-h-[90vh] gap-0!  p-0 overflow-auto no-scrollbar border-none rounded-modal-radius bg-subcard dark:border-white/10 shadow-2xl">
        {/* Header with Background/Icon */}
        <div className="sm:p-6 p-4 pb-5 border-b border-input-border-color bg-gray-50/50 dark:bg-gray-800/20 rounded-t-modal-radius">
          <DialogHeader className="relative z-10 mb-0 text-left items-start sm:text-left">
            <div className="flex items-start gap-3.5">
              <div className="flex flex-col gap-1.5">
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground leading-none">{t("contact_inquiry_details")}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground font-medium">{t("view_full_inquiry_information")}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content Body */}
        <div className="sm:p-6 p-4 pt-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Spinner />
              <p className="text-sm font-medium animate-pulse">{t("loading_details")}</p>
            </div>
          ) : inquiry ? (
            <div className="grid gap-4">
              {/* Main Info Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex items-start gap-3 p-4 rounded-xl border border-input-border-color bg-subcard transition-colors hover:bg-white dark:hover:bg-white/[0.04]">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 shrink-0 mt-0.5 border border-blue-100 dark:border-blue-500/20">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-md font-bold uppercase tracking-wider text-title mb-1">{t("name")}</p>
                    <p className="text-sm font-semibold text-subtitle-color break-words leading-tight">{inquiry.inquiry.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-4 rounded-xl border border-input-border-color bg-subcard transition-colors hover:bg-white dark:hover:bg-white/[0.04]">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 shrink-0 mt-0.5 border border-purple-100 dark:border-purple-500/20">
                    <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-md font-bold uppercase tracking-wider text-title mb-1">{t("email")}</p>
                    <p className="text-sm font-semibold text-subtitle-color break-words leading-tight">{inquiry.inquiry.email}</p>
                  </div>
                </div>
              </div >

              {/* Subject */}
              < div className="flex flex-col gap-2 p-4 rounded-xl border border-input-border-color bg-subcard transition-colors" >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-500/10 shrink-0 border border-orange-100 dark:border-orange-500/20">
                    <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t("subject", { defaultValue: "Subject" })}</p>
                </div>
                <div className="min-w-0 pl-1 mt-0.5">
                  <p className="text-[15px] font-semibold text-foreground break-words leading-relaxed">{inquiry.inquiry.subject}</p>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-3 p-4 rounded-xl border border-input-border-color bg-subcard transition-colors ">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 shrink-0 border border-emerald-100 dark:border-emerald-500/20">
                    <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t("message")}</p>
                </div >
                <div className="prose prose-sm dark:prose-invert max-w-none p-3.5 bg-input-color rounded-lg border border-gray-200/60 dark:border-white/5 mt-0.5">
                  <p className="text-[14px] text-gray-800 dark:text-gray-200 font-medium leading-relaxed whitespace-pre-wrap break-words m-0">{inquiry.inquiry.message}</p>
                </div>
              </div >

              {/* Created On & Status */}
              <div className="pt-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center">
                    {t("created_on")}
                    <span className="ml-6 rtl:ml-0 rtl:mr-6 text-gray-900 dark:text-white font-semibold">{formatDate(inquiry.inquiry.created_at)}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-destructive">
              <p className="text-sm font-semibold">{t("error_loading_inquiry")}</p>
            </div>
          )
          }
        </div >

        {/* Footer */}
        < DialogFooter className="px-6 pb-6 pt-2" >
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-full p-padding! rounded-radius border border-input-border-color bg-subcard text-foreground text-md font-medium transition-all">
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}
