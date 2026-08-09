'use client'

import KycUploadPage from '@/components/features/kyc-upload/KycUploadPage'
import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams()
  const id = params?.id as string

  return <KycUploadPage purchaseRequestId={id} />
}
