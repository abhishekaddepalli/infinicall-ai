'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useCreateRestrictedWordMutation, useUpdateRestrictedWordMutation } from '@/redux/api/restrictedWordsApi'
import { CreateRestrictedWordPayload, RestrictedWordModalProps } from '@/types/restricted-words'
import { useFormik } from 'formik'
import { Loader2 } from '@/components/reusable/Loader2';
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'

export default function RestrictedWordModal({ isOpen, onClose, wordToEdit }: RestrictedWordModalProps) {
  const { t } = useTranslation()
  const isEditing = !!wordToEdit

  const [createWord, { isLoading: isCreating }] = useCreateRestrictedWordMutation()
  const [updateWord, { isLoading: isUpdating }] = useUpdateRestrictedWordMutation()

  const isLoading = isCreating || isUpdating

  const formik = useFormik<CreateRestrictedWordPayload>({
    initialValues: {
      word: '',
      severity_level: 'medium',
      is_active: true,
    },
    validationSchema: Yup.object({
      word: Yup.string().required(t('text_required') || 'Text is required'),
      severity_level: Yup.string().oneOf(['low', 'medium', 'high']).required(),
    }),
    onSubmit: async (values) => {
      try {
        if (isEditing && wordToEdit) {
          await updateWord({ id: wordToEdit._id || wordToEdit.id, ...values }).unwrap()
          toast.success(t('restricted_word_updated_successfully'))
        } else {
          await createWord(values).unwrap()
          toast.success(t('restricted_word_created_successfully'))
        }
        handleClose()
      } catch (error: any) {
        toast.error(error?.data?.error || t('something_went_wrong'))
      }
    },
  })

  useEffect(() => {
    if (isOpen && wordToEdit) {
      formik.setValues({
        word: wordToEdit.word,
        severity_level: wordToEdit.severity_level,
        is_active: wordToEdit.is_active,
      })
    } else if (isOpen && !wordToEdit) {
      formik.resetForm()
    }
  }, [isOpen, wordToEdit])

  const handleClose = () => {
    formik.resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]! max-w-[calc(100%-2rem)]! border-none bg-bg-card sm:p-6 p-4 gap-0! rounded-modal-radius">
        <DialogHeader className="mb-4 text-left rtl:text-right">
          <DialogTitle className="text-xl font-bold text-title">
            {isEditing ? t('edit_restricted_word') : t('create_restricted_word')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="word" className="text-sm font-semibold text-title">
              {t('text')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="word"
              name="word"
              placeholder={t('enter_text') || 'Enter text'}
              value={formik.values.word}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-10 bg-input-color border-input-border-color text-title rounded-lg ${formik.touched.word && formik.errors.word ? 'border-destructive' : ''
                }`}
            />
            {formik.touched.word && formik.errors.word && (
              <div className="text-xs text-destructive mt-1">{formik.errors.word}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity_level" className="text-sm font-semibold text-title">
              {t('priority_level')} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formik.values.severity_level}
              onValueChange={(val) => formik.setFieldValue('severity_level', val)}
            >
              <SelectTrigger className="h-10 bg-input-color border-input-border-color text-title rounded-lg shadow-none">
                <SelectValue placeholder={t('select_priority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('low') || 'Low'}</SelectItem>
                <SelectItem value="medium">{t('medium') || 'Medium'}</SelectItem>
                <SelectItem value="high">{t('high') || 'High'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-radius border border-input-border-color bg-input-bg/50">
            <Label htmlFor="is_active" className="text-sm font-semibold text-title cursor-pointer">
              {t('status')}
            </Label>
            <Switch
              id="is_active"
              checked={formik.values.is_active}
              onCheckedChange={(val) => formik.setFieldValue('is_active', val)}
            />
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-input-border-color gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="h-11 w-full flex-1 p-padding! font-semibold border-input-border-color text-title bg-subcard border rounded-radius"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 flex-1 p-padding! w-full font-semibold bg-primary text-white rounded-lg"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? t('update') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
