'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { useGetAvailableNumbersQuery, useUploadKycDocumentsMutation } from '@/redux/api/numberPurchaseApi'
import { DocumentType, KycUploadPageProps } from '@/types/number-purchase-components'
import { Check, CheckCircle2, FileText, UploadCloud, X } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function KycUploadPage({ purchaseRequestId }: KycUploadPageProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const { data: numbersData } = useGetAvailableNumbersQuery()
  const purchaseRequest = numbersData?.data?.find(n => n.purchase_request?._id === purchaseRequestId || n.purchase_request?.id === purchaseRequestId)?.purchase_request

  const [uploadDocuments, { isLoading }] = useUploadKycDocumentsMutation()

  const [files, setFiles] = useState<Record<DocumentType, File | null>>({
    government_id_proof: null,
    business_registration_document: null,
    tax_identification_document: null,
    company_consent_letter: null,
  })

  const [existingDocs, setExistingDocs] = useState<Record<DocumentType, string | null>>({
    government_id_proof: null,
    business_registration_document: null,
    tax_identification_document: null,
    company_consent_letter: null,
  })

  useEffect(() => {
    if (purchaseRequest?.kyc_documents) {
      setExistingDocs({
        government_id_proof: purchaseRequest.kyc_documents.government_id_proof || null,
        business_registration_document: purchaseRequest.kyc_documents.business_registration_document || null,
        tax_identification_document: purchaseRequest.kyc_documents.tax_identification_document || null,
        company_consent_letter: purchaseRequest.kyc_documents.company_consent_letter || null,
      })
    }
  }, [purchaseRequest])

  const handleFileChange = (docType: DocumentType, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error(t('file_too_large', 'File size must be less than 5MB'))
      return
    }
    setFiles(prev => ({ ...prev, [docType]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all files are present (either newly selected or existing)
    const missingDocs = Object.keys(files).filter(k => {
      const key = k as DocumentType
      return !files[key] && !existingDocs[key]
    })

    if (missingDocs.length > 0) {
      toast.error(t('upload_all_documents_required', 'Please upload all 4 required documents to proceed.'))
      return
    }

    const formData = new FormData()
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file)
    })

    try {
      await uploadDocuments({ id: purchaseRequestId, formData }).unwrap()
      toast.success(t('kyc_documents_uploaded', 'KYC Documents uploaded successfully. Under review.'))
      router.push(ROUTES.PHONE_NUMBERS)
    } catch (error: any) {
      toast.error(error?.data?.message || t('kyc_upload_failed', 'Failed to upload KYC documents.'))
    }
  }

  const DocumentUploadCard = ({ type, title, desc }: { type: DocumentType, title: string, desc: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const currentFile = files[type]
    const existingFile = existingDocs[type]
    const hasAnyFile = currentFile || existingFile

    return (
      <div className="bg-bg-card sm:p-6 p-4 rounded-lg border border-input-border-color flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-title text-lg">{title}</h3>
          <p className="text-md text-subtitle-color">{desc}</p>
        </div>

        <div
          onClick={() => !hasAnyFile && fileInputRef.current?.click()}
          className={`flex-1 border-2 border-dashed rounded-lg sm:p-6 p-4 flex flex-col items-center justify-center text-center transition-colors
            ${hasAnyFile ? 'border-primary/50 bg-primary/5' : 'border-input-border-color cursor-pointer hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5'}
          `}
        >
          <Input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
          />

          {currentFile ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-title text-base max-w-[200px] truncate">{currentFile.name}</span>
                <span className="text-md text-subtitle-color">{(currentFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); handleFileChange(type, null); }}
                className="text-destructive bg-destructive/10 hover:bg-destructive hover:text-white text-sm p-padding! h-9 mt-2"
              >
                <X className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" /> {t('remove', 'Remove')}
              </Button>
            </div>
          ) : existingFile ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Check className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-title dark:text-white text-sm max-w-[200px] truncate">
                  {existingFile.split('/').pop()}
                </span>
                <span className="text-xs text-emerald-500 font-bold">{t('uploaded_previously', 'Uploaded Previously')}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); setExistingDocs(prev => ({ ...prev, [type]: null })); }}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs h-7"
                >
                  <X className="w-3 h-3 mr-1" /> {t('remove', 'Remove')}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="font-bold text-title dark:text-white text-base">{t('click_to_upload', 'Click to upload')}</span>
              <span className="text-md text-subtitle-color">{t('supported_formats', 'PDF, JPG, PNG (Max 5MB)')}</span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-title dark:text-white mb-2 flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          {t('kyc_verification', 'Identity Verification')}
        </h1>
        <p className="text-md text-subtitle-color">
          {t('kyc_desc', 'To activate your purchased phone number, you must upload the required compliance documents.')}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DocumentUploadCard
            type="government_id_proof"
            title={t('gov_id', 'Government ID Proof')}
            desc={t('gov_id_desc', 'Passport, National ID, or Driver\'s License of the authorized representative.')}
          />
          <DocumentUploadCard
            type="business_registration_document"
            title={t('business_registration', 'Business Registration')}
            desc={t('business_registration_desc', 'Certificate of Incorporation or Business Registration Document.')}
          />
          <DocumentUploadCard
            type="tax_identification_document"
            title={t('tax_id', 'Tax Identification')}
            desc={t('tax_id_desc', 'VAT/Tax ID certificate or official tax registration document.')}
          />
          <DocumentUploadCard
            type="company_consent_letter"
            title={t('consent_letter', 'Company Consent Letter')}
            desc={t('consent_letter_desc', 'A signed letter on company letterhead authorizing the purchase.')}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-input-border-color">
          <Button type="button" variant="outline" onClick={() => router.push(ROUTES.PHONE_NUMBERS)} className="mr-4 rtl:mr-0 rtl:ml-4 rounded-lg p-padding! border-none bg-primary/10 text-primary hover:bg-primary hover:text-white ">
            {t('do_it_later', 'Do it later')}
          </Button>
          <Button type="submit" disabled={isLoading} className="  rounded-lg p-padding! bg-primary text-white font-bold">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />}
            {t('submit_kyc', 'Submit Documents')}
          </Button>
        </div>
      </form>
    </div>
  )
}
