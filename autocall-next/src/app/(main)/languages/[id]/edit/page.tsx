'use client'

import { LanguageForm } from '@/components/features/languages/LanguageForm'
import DataLoader from '@/components/reusable/DataLoader'
import { ROUTES } from '@/constants/routes'
import { useGetLanguageByIdQuery, useUpdateLanguageMutation } from '@/redux/api/languageApi'
import { ApiError } from '@/types/api'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function EditLanguagePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: languageData, isLoading: isFetching } = useGetLanguageByIdQuery(id)
  const [updateLanguage, { isLoading: isUpdating }] = useUpdateLanguageMutation()

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await updateLanguage({ id, data: formData }).unwrap()
      toast.success(res.message || t('language_updated_successfully'))
      router.push(ROUTES.LANGUAGES)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  if (isFetching) return <DataLoader fullPage />

  return (
    <div>
      <LanguageForm 
        initialValues={languageData?.data} 
        onSubmit={handleSubmit} 
        isLoading={isUpdating} 
        isEdit 
      />
    </div>
  )
}
