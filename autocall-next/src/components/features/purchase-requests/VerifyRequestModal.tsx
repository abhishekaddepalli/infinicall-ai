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
import { AlertCircle, CheckCircle, ExternalLink, FileText, Info, XCircle } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useGetAdminSettingsQuery } from '@/redux/api/adminSettingApi'
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

  const { data: settingsData } = useGetAdminSettingsQuery({})
  const settings = settingsData?.settings || {}
  const kycRequired = settings.kyc_required !== false

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

  const renderDocumentLink = (label: string, url?: string, isFile = false) => {
    if (!url) return <span className="text-sm text-subtitle-color italic">{t('not_provided', 'Not provided')}</span>

    // Handle generic field labels replacing underscores
    const displayLabel = label.replace(/_/g, ' ')

    return (
      <Link
        href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${url}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 p-3 rounded-lg border border-input-border-color hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
      >
        <FileText className="w-5 h-5 text-primary" />
        <span className="flex-1 text-md font-semibold text-title truncate capitalize">{displayLabel}</span>
        <ExternalLink className="w-4 h-4 text-subtitle-color group-hover:text-primary" />
      </Link>
    )
  }

  const getDisplayKycStatus = (req: NumberPurchaseRequest | null) => {
    if (!req) return 'pending';
    return req.kyc_status || 'pending';
  };

  const displayStatus = getDisplayKycStatus(request);

  // Extract all files correctly
  const filesToRender = request?.kyc_files?.length 
    ? request.kyc_files 
    : Object.entries(request?.kyc_documents || {}).map(([key, url]) => ({ fieldname: key, url }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! rounded-modal-radius gap-0! border-none max-h-[90vh] no-scrollbar overflow-auto sm:p-6 p-4">
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
          
          {kycRequired ? (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold text-base block mb-1">{t('kyc_mandatory_title', 'Mandatory Verification')}</span>
                {t('kyc_admin_mandatory_desc', 'KYC is currently configured as mandatory. Users must provide valid documents to have their number activated.')}
              </div>
            </div>
          ) : (
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 p-4 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold text-base block mb-1">{t('kyc_optional_title', 'Optional Verification')}</span>
                {t('kyc_admin_optional_desc', 'KYC is currently configured as optional. If the user skipped uploading documents, you can safely approve the request.')}
              </div>
            </div>
          )}

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

          {/* Dynamic Form Data Rendering */}
          {request?.kyc_form_data && Object.keys(request.kyc_form_data).length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">{t('form_data', 'Submitted Form Data')}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-bg-card p-4 rounded-lg border border-input-border-color">
                {Object.entries(request.kyc_form_data).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-subtitle-color block capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-md font-semibold text-title block">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-semibold">{t('uploaded_documents', 'Uploaded Documents')}</Label>
            {filesToRender && filesToRender.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filesToRender.map((file, idx) => (
                  <div key={idx}>
                    {renderDocumentLink(file.fieldname || t('document', 'Document'), file.url, true)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg border border-input-border-color bg-subcard text-subtitle-color text-sm">
                {t('no_documents_uploaded', 'No documents were uploaded by the user.')}
              </div>
            )}
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
                className="min-h-[100px] border-destructive/20 focus-visible:ring-destructive bg-subcard"
                required
              />
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 mt-4 pt-4 border-t border-input-border-color">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-lg p-padding! h-10 bg-subcard border border-input-border-color">
              {t('close', 'Close')}
            </Button>

            {(displayStatus === 'under_review' || displayStatus === 'pending') && (
              <>
                {!showRejectInput ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRejectInput(true)}
                      className="rounded-lg p-padding! h-10 border-none text-destructive hover:bg-destructive hover:text-white bg-destructive/10 transition-all"
                    >
                      <XCircle className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t('reject', 'Reject')}
                    </Button>
                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleAction('approved')}
                      className="rounded-lg p-padding! bg-edit h-10 text-white transition-all"
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
                    className="rounded-lg h-10 p-padding! bg-destructive text-white transition-all"
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
