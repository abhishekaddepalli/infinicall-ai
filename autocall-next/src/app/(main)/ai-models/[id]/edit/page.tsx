'use client'

import AIModelForm from '@/components/features/ai-models/AIModelForm'
import DataLoader from '@/components/reusable/DataLoader'
import { ROUTES } from '@/constants/routes'
import { useGetAiModelQuery, useUpdateAiModelMutation } from '@/redux/api/aiModelApi'
import { ApiError } from '@/types/api'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function EditAIModelPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: modelData, isLoading: isFetching } = useGetAiModelQuery(id, {
    skip: !id,
  })
  const [updateModel, { isLoading: isUpdating }] = useUpdateAiModelMutation()

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        api_endpoint: values.provider === 'custom' ? values.api_endpoint || null : null,
        api_version: values.provider === 'custom' ? values.api_version || null : null,
      }
      const response = await updateModel({ id, body: payload }).unwrap()
      toast.success(response.message || t('ai_model_updated_successfully'))
      router.push(ROUTES.AI_MODELS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_ai_model'))
    }
  }

  if (isFetching) {
    return <DataLoader fullPage />
  }

  return (
    <AIModelForm
      initialValues={modelData?.data}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
      title={t('edit_ai_model_title')}
      button={t('save_changes')}
    />
  )
}
