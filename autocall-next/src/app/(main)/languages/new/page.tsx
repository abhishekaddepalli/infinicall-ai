'use client'

import { LanguageForm } from '@/components/features/languages/LanguageForm'
import { ROUTES } from '@/constants/routes'
import { useCreateLanguageMutation } from '@/redux/api/languageApi'
import { ApiError } from '@/types/api'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function AddLanguagePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [createLanguage, { isLoading }] = useCreateLanguageMutation()

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await createLanguage(formData).unwrap()
      toast.success(res.message || t('language_created_successfully'))
      router.push(ROUTES.LANGUAGES)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  return (
    <div>
      <LanguageForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
