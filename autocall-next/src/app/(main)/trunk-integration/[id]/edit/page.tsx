'use client'

import SipTrunkForm from '@/components/features/sip-trunk/SipTrunkForm'
import Spinner from '@/components/reusable/Spinner'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { useGetSipTrunksQuery, useUpdateSipTrunkMutation } from '@/redux/api/sipTrunkApi'
import { ApiError } from '@/types/api'
import { CreateSipTrunkPayload } from '@/types/sip-trunk'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function EditTrunkIntegrationPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { hasPermission } = usePermission()

  const { data, isLoading: isLoadingTrunk } = useGetSipTrunksQuery({ limit: 200 })
  const [updateTrunk, { isLoading: isUpdating }] = useUpdateSipTrunkMutation()

  const trunk = useMemo(
    () => data?.data?.find((item) => (item._id || item.id) === id),
    [data?.data, id],
  )

  const handleSubmit = async (values: CreateSipTrunkPayload) => {
    try {
      const response = await updateTrunk({ id, body: values }).unwrap()
      toast.success(response.message || t('trunk_updated_successfully'))
      router.push(ROUTES.TRUNK_INTEGRATION)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_trunk'))
    }
  }

  if (!hasPermission(PERMISSIONS.UPDATE_TRUNKS)) {
    return (
      <div className="py-20 text-center text-subtitle-color">
        {t('access_denied')}
      </div>
    )
  }

  if (isLoadingTrunk) {
    return <Spinner className="h-auto py-20" size="md" />
  }

  if (!trunk) {
    return (
      <div className="py-20 text-center text-subtitle-color">
        {t('trunk_not_found')}
      </div>
    )
  }

  return (
    <SipTrunkForm
      isEdit
      title={t('edit_trunk')}
      initialValues={{
        ...trunk,
        password: '',
      }}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
    />
  )
}
