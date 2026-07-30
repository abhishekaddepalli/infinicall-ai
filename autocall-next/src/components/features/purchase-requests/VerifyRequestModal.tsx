import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { NumberPurchaseRequest } from '@/types/number-purchase'
import { VerifyRequestModalProps } from '@/types/number-purchase-components'
import { CheckCircle, ExternalLink, FileText, XCircle } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function VerifyRequestModal({
  isOpen,
  onClose,
  request,
  onSubmit,
  isLoading,
}: VerifyRequestModalProps) {
  const { t } = useTranslation()
  const [reason, setReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        setReason('')
        setShowRejectInput(false)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [isOpen])

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!request) return
    const id = request._id || request.id
    await onSubmit({ id, status, reason })
  }

  const renderDocumentLink = (label: string, url?: string) => {
    if (!url) return <span className="text-sm text-subtitle-color italic">{t('not_provided', 'Not provided')}</span>

    return (
      <Link
        href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${url}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 p-3 rounded-lg border border-input-border-color hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
      >
        <FileText className="w-5 h-5 text-primary" />
        <span className="flex-1 text-md font-semibold text-title truncate">{label}</span>
        <ExternalLink className="w-4 h-4 text-subtitle-color group-hover:text-primary" />
      </Link>
    )
  }

  const getDisplayKycStatus = (req: NumberPurchaseRequest | null) => {
    if (!req) return 'pending';
    if (req.kyc_status !== 'pending') return req.kyc_status;
    const isAllDocsPresent = ['government_id_proof', 'business_registration_document', 'tax_identification_document', 'company_consent_letter'].every(field => req.kyc_documents && (req.kyc_documents as any)[field]);
    return isAllDocsPresent ? 'under_review' : 'pending';
  };

  const displayStatus = getDisplayKycStatus(request);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! rounded-modal-radius gap-0! border-none max-h-[90vh] no-scrollbar overflow-auto sm:p-6 p-4">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl">
              {t('verify_kyc_request', 'Verify KYC Request')}
            </DialogTitle>
          </div>
          <DialogDescription className='text-subtitile-color text-left rtl:text-right'>
            {t('verify_kyc_desc', 'Review the submitted documents and approve or reject the request.')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          {request && (
            <div className="bg-subcard p-4 rounded-lg border border-input-border-color grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-md font-semibold text-title">{t('user', 'User')}</span>
                <p className="font-semibold text-title dark:text-white">{(request.user_id as any)?.first_name} {(request.user_id as any)?.last_name}</p>
                <p className="text-md text-subtitle-color">{(request.user_id as any)?.email}</p>
              </div>
              <div>
                <span className="text-md font-semibold text-title">{t('phone_number', 'Phone Number')}</span>
                <p className="font-semibold text-title dark:text-white">{(request.phone_number_id as any)?.phone_number}</p>
                <p className="text-md text-primary font-semibold">${request.amount?.toFixed(2)}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-semibold">{t('uploaded_documents', 'Uploaded Documents')}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderDocumentLink(t('gov_id', 'Government ID Proof'), request?.kyc_documents?.government_id_proof)}
              {renderDocumentLink(t('business_registration', 'Business Registration'), request?.kyc_documents?.business_registration_document)}
              {renderDocumentLink(t('tax_id', 'Tax Identification'), request?.kyc_documents?.tax_identification_document)}
              {renderDocumentLink(t('consent_letter', 'Company Consent Letter'), request?.kyc_documents?.company_consent_letter)}
            </div>
          </div>

          {displayStatus === 'rejected' && request?.admin_notes && (
            <div className="space-y-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mt-2">
              <Label className="text-base font-semibold break-all whitespace-normal line-clamp-1">{t('rejection_reason', 'Rejection Reason')}</Label>
              <p className="text-md break-all whitespace-normal line-clamp-3">{request.admin_notes}</p>
            </div>
          )}

          {showRejectInput && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label className="text-sm font-semibold text-destructive">{t('rejection_reason', 'Rejection Reason')}</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('rejection_reason_placeholder', 'Please provide a reason for rejecting these documents...')}
                className="min-h-[100px] border-destructive/20 focus-visible:ring-destructive"
                required
              />
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 mt-4 pt-4 border-t border-input-border-color">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-lg p-padding! h-10 bg-subcard border border-input-border-color">
              {t('close', 'Close')}
            </Button>

            {displayStatus === 'under_review' && (
              <>
                {!showRejectInput ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRejectInput(true)}
                      className="rounded-lg p-padding! h-10 border-none text-destructive hover:bg-destructive hover:text-white bg-destructive/10"
                    >
                      <XCircle className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t('reject', 'Reject')}
                    </Button>
                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleAction('approved')}
                      className="rounded-lg p-padding! bg-edit h-10 text-white"
                    >
                      {isLoading && <Loader2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />}
                      <CheckCircle className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t('approve', 'Approve')}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    disabled={isLoading || !reason.trim()}
                    onClick={() => handleAction('rejected')}
                    className="rounded-lg h-10 p-padding! bg-destructive text-white"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />}
                    {t('confirm_rejection', 'Confirm Rejection')}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
