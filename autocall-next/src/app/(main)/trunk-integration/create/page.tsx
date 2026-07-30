'use client'

import SipTrunkForm from '@/components/features/sip-trunk/SipTrunkForm'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { useCreateSipTrunkMutation } from '@/redux/api/sipTrunkApi'
import { ApiError } from '@/types/api'
import { CreateSipTrunkPayload } from '@/types/sip-trunk'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function CreateTrunkIntegrationPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const [createTrunk, { isLoading }] = useCreateSipTrunkMutation()

  if (!hasPermission(PERMISSIONS.CREATE_TRUNKS)) {
    return (
      <div className="py-20 text-center text-subtitle-color">
        {t('access_denied')}
      </div>
    )
  }

  const handleSubmit = async (values: CreateSipTrunkPayload) => {
    try {
      const response = await createTrunk(values).unwrap()
      toast.success(response.message || t('trunk_created_successfully'))
      router.push(ROUTES.TRUNK_INTEGRATION)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_create_trunk'))
    }
  }

  return (
    <SipTrunkForm
      title={t('create_trunk_integration')}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}
