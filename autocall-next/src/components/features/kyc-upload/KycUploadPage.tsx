'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/constants/routes'
import { useGetAvailableNumbersQuery, useUploadKycDocumentsMutation } from '@/redux/api/numberPurchaseApi'
import { useGetPublicSettingsQuery } from '@/redux/api/adminSettingApi'
import { KycUploadPageProps } from '@/types/number-purchase-components'
import { AlertCircle, Check, CheckCircle2, FileText, Info, UploadCloud, X } from 'lucide-react';
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

  const { data: settingsData, isLoading: isSettingsLoading } = useGetPublicSettingsQuery({})
  const settings = settingsData?.settings || {}
  const kycMaxFiles = settings.kyc_max_files ?? 3
  const kycAllowPdf = settings.kyc_allow_pdf_upload !== false
  const kycRequired = settings.kyc_required !== false
  const kycFormFields = settings.kyc_form_fields || []

  const [uploadDocuments, { isLoading }] = useUploadKycDocumentsMutation()

  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [existingDocs, setExistingDocs] = useState<Record<string, string | null>>({})
  const [formDataState, setFormDataState] = useState<Record<string, string>>({})

  useEffect(() => {
    if (purchaseRequest?.kyc_files) {
      const docs: Record<string, string> = {}
      purchaseRequest.kyc_files.forEach((f: any) => {
        if (f.fieldname) docs[f.fieldname] = f.originalname || f.filename
      })
      setExistingDocs(docs)
    }
    if (purchaseRequest?.kyc_form_data) {
      setFormDataState(purchaseRequest.kyc_form_data)
    }
  }, [purchaseRequest])

  const handleFileChange = (docType: string, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error(t('file_too_large', 'File size must be less than 5MB'))
      return
    }
    setFiles(prev => ({ ...prev, [docType]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required dynamic fields
    for (const field of kycFormFields) {
      if (field.required) {
        if (field.type === 'File') {
          if (!files[field.label] && !existingDocs[field.label]) {
            toast.error(t('upload_required_document', { doc: field.label, defaultValue: `Please upload ${field.label}` }))
            return
          }
        } else {
          const val = formDataState[field.label]
          if (!val || val.trim() === '') {
            toast.error(t('field_required', { field: field.label, defaultValue: `${field.label} is required` }))
            return
          }
        }
      }
    }

    const formData = new FormData()
    
    // Add dynamic form fields (Text, Number, Date, etc.)
    kycFormFields.forEach((field: any) => {
      if (field.type !== 'File') {
        const val = formDataState[field.label]
        if (val !== undefined && val !== null) formData.append(field.label, val)
      }
    })

    // Add all files
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

  const DocumentUploadCard = ({ type, title, desc }: { type: string, title: string, desc: string }) => {
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
            accept={kycAllowPdf ? ".pdf,.jpg,.jpeg,.png" : ".jpg,.jpeg,.png"}
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
                type="button"
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
                  type="button"
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
              <span className="text-md text-subtitle-color">
                {kycAllowPdf ? t('supported_formats', 'PDF, JPG, PNG (Max 5MB)') : t('supported_formats_no_pdf', 'JPG, PNG (Max 5MB)')}
              </span>
            </>
          )}
        </div>
      </div>
    )
  }

  if (isSettingsLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-title dark:text-white mb-6 flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          {t('kyc_verification', 'Identity Verification')}
        </h1>
        
        {kycRequired ? (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold text-base block mb-1">{t('kyc_mandatory_title', 'Mandatory Verification')}</span>
              {t('kyc_mandatory_desc', 'Your purchased number requires identity verification before it can be activated. Please submit the required documents below. If you skip this step, your number will remain inactive.')}
            </div>
          </div>
        ) : (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 p-4 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold text-base block mb-1">{t('kyc_optional_title', 'Optional Verification')}</span>
              {t('kyc_optional_desc', 'Identity verification is currently optional. You can skip this step and start using your services immediately, or provide documents now to expedite future compliance.')}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        

        {kycFormFields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {kycFormFields.map((field: any) => {
              if (field.type === 'File') {
                return (
                  <DocumentUploadCard
                    key={field.label}
                    type={field.label}
                    title={field.label}
                    desc={field.placeholder || t('upload_file', 'Upload file')}
                  />
                )
              }
              return (
                <div key={field.label} className="bg-bg-card sm:p-6 p-4 rounded-lg border border-input-border-color flex flex-col gap-2 justify-center">
                  <Label className="font-bold text-title text-lg">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  <Input 
                    type={field.type.toLowerCase() === 'number' ? 'number' : field.type.toLowerCase() === 'date' ? 'date' : 'text'}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formDataState[field.label] || ''}
                    onChange={(e) => setFormDataState(prev => ({ ...prev, [field.label]: e.target.value }))}
                    className="mt-2 h-12 bg-subcard"
                  />
                </div>
              )
            })}
          </div>
        )}

        {kycMaxFiles === 0 && kycFormFields.length === 0 && (
           <div className="text-center py-10 bg-bg-card rounded-lg border border-input-border-color mb-8 text-subtitle-color">
             {t('no_kyc_fields_configured', 'No KYC fields configured.')}
           </div>
        )}

        <div className="flex justify-end pt-4 border-t border-input-border-color">
          {!kycRequired && (
            <Button type="button" variant="outline" onClick={() => router.push(ROUTES.PHONE_NUMBERS)} className="mr-4 rtl:mr-0 rtl:ml-4 rounded-lg p-padding! border-none bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
              {t('skip', 'Skip')}
            </Button>
          )}
          {kycRequired && (
             <Button type="button" variant="outline" onClick={() => {
                 if (window.confirm(t('kyc_mandatory_warning', 'Are you sure? Your number will remain inactive until identity verification is completed.'))) {
                   router.push(ROUTES.PHONE_NUMBERS)
                 }
               }} className="mr-4 rtl:mr-0 rtl:ml-4 rounded-lg p-padding! border-none bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
               {t('do_it_later', 'Do it later')}
             </Button>
          )}
          
          <Button type="submit" disabled={isLoading || (kycMaxFiles === 0 && kycFormFields.length === 0)} className="rounded-lg p-padding! bg-primary text-white font-bold transition-all">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />}
            {t('submit_kyc', 'Submit Documents')}
          </Button>
        </div>
      </form>
    </div>
  )
}

