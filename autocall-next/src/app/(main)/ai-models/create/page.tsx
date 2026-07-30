'use client'

import AIModelForm from '@/components/features/ai-models/AIModelForm'
import { ROUTES } from '@/constants/routes'
import { useCreateAiModelMutation } from '@/redux/api/aiModelApi'
import { ApiError } from '@/types/api'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function CreateAIModelPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [createModel, { isLoading }] = useCreateAiModelMutation()

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        api_endpoint: values.provider === 'custom' ? values.api_endpoint || null : null,
        api_version: values.provider === 'custom' ? values.api_version || null : null,
      }
      const response = await createModel(payload).unwrap()
      toast.success(response.message || t('ai_model_created_successfully'))
      router.push(ROUTES.AI_MODELS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_create_ai_model'))
    }
  }

  return (
    <AIModelForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      title={t('create_ai_model_title')}
      button={t('create')}
    />
  )
}
