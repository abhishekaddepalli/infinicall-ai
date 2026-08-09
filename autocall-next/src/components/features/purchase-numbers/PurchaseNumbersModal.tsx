'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ROUTES } from '@/constants/routes'
import { useGetAvailableNumbersQuery, useInitiatePurchaseMutation } from '@/redux/api/numberPurchaseApi'
import { PurchaseNumbersModalProps } from '@/types/number-purchase-components'
import { PhoneNumber } from '@/types/phone-number'
import { Clock, FileUp, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import InitiatePurchaseModal from './InitiatePurchaseModal'

export default function PurchaseNumbersModal({ isOpen, onClose }: PurchaseNumbersModalProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null)

  const { data: numbersData, isLoading, isFetching } = useGetAvailableNumbersQuery(undefined, {
    skip: !isOpen,
  })

  const [initiatePurchase, { isLoading: isInitiating }] = useInitiatePurchaseMutation()

  const handleInitiatePurchase = async (data: { phone_number_id: string; payment_gateway: string }) => {
    try {
      const res = await initiatePurchase(data).unwrap()
      if (res.data?.purchaseRequest?._id) {
        localStorage.setItem('pending_purchase_request_id', res.data.purchaseRequest._id)
      }

      if (res.data?.payment_link) {
        window.location.href = res.data.payment_link
      } else {
        toast.success(res.message || t('purchase_initiated_success'))
        setSelectedNumber(null)
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t('purchase_initiate_failed'))
    }
  }

  const allNumbers = numbersData?.data || []

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-auto no-scrollbar p-4 sm:p-6 gap-0! border-none">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              {t('purchase_numbers', 'Purchase Numbers')}
            </DialogTitle>
            <DialogDescription className='text-left rtl:text-right'>
              {t('purchase_numbers_desc', 'Browse and purchase available phone numbers for your workspace.')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
            {(isLoading || isFetching) ? (
              <div className="flex justify-center items-center py-10">
                <Spinner />
              </div>
            ) : allNumbers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="font-bold text-title">{t('no_available_numbers_title', 'No Numbers Available')}</p>
                <p className="text-sm text-subtitle-color mt-1">{t('no_available_numbers_desc', 'There are currently no phone numbers available for purchase.')}</p>
              </div>
            ) : (
              allNumbers.map(row => {
                const isAllDocsPresent = ['government_id_proof', 'business_registration_document', 'tax_identification_document', 'company_consent_letter'].every(field => row.purchase_request?.kyc_documents && (row.purchase_request.kyc_documents as any)[field]);
                const isUnderReview = row.purchase_request?.payment_status === 'paid' && (row.purchase_request?.kyc_status === 'under_review' || (row.purchase_request?.kyc_status === 'pending' && isAllDocsPresent));
                const hasPaidRequest = row.purchase_request?.payment_status === 'paid' && row.purchase_request?.kyc_status === 'pending' && !isUnderReview;

                return (
                  <div key={row._id || row.id} className="flex flex-wrap gap-3 items-center justify-between p-4 rounded-lg border border-input-border-color bg-subcard transition-colors hover:border-primary/30">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg text-title leading-none break-all whitespace-normal line-clamp-1">{row.phone_number}</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-primary break-all whitespace-normal line-clamp-1">${row.purchase_price?.toFixed(2) || '0.00'}</span>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/10">
                          {row.validity_days ? `${row.validity_days} ${t('days', 'Days')}` : t('lifetime', 'Lifetime')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {hasPaidRequest && (
                        <Button
                          size="sm"
                          onClick={() => {
                            onClose()
                            router.push(`${ROUTES.KYC_UPLOAD}/${row.purchase_request._id || row.purchase_request.id}`)
                          }}
                          className="rounded-lg font-bold p-padding! h-10 bg-amber-500 text-white"
                        >
                          <FileUp className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          {t('upload_kyc', 'Upload KYC')}
                        </Button>
                      )}
                      {isUnderReview && (
                        <Button
                          size="sm"
                          disabled
                          className="rounded-full font-bold px-6 opacity-70"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {t('under_review', 'Under Review')}
                        </Button>
                      )}
                      {!hasPaidRequest && !isUnderReview && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedNumber(row)}
                          className="rounded-lg h-10! font-bold p-padding! bg-primary text-white transition-all"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          {t('buy_now', 'Buy Now')}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      <InitiatePurchaseModal
        isOpen={!!selectedNumber}
        onClose={() => setSelectedNumber(null)}
        phoneNumber={selectedNumber}
        onSubmit={handleInitiatePurchase}
        isLoading={isInitiating}
      />
    </>
  )
}
