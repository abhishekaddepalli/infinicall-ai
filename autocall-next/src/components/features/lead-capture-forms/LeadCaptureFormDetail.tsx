'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { PageHeader } from '@/components/reusable/PageHeader'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textArea'
import { ROUTES } from '@/constants/routes'
import {
  useCreateFormMutation,
  useGetFormQuery,
  useUpdateFormMutation,
} from '@/redux/api/formApi'
import { LeadCaptureFormDetailProps } from '@/types/dashboard'
import { Form, FormField, FormFieldType } from '@/types/form'
import { FileText, GripVertical, Plus, Save, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function LeadCaptureFormDetail({ id }: LeadCaptureFormDetailProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const isEditMode = !!id

  const { data: response, isLoading: isLoadingForm } = useGetFormQuery(id || '', {
    skip: !isEditMode,
  })

  const [createForm, { isLoading: isCreating }] = useCreateFormMutation()
  const [updateForm, { isLoading: isUpdating }] = useUpdateFormMutation()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [fields, setFields] = useState<FormField[]>([])

  // Drag and Drop refs
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position
  }

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const updatedFields = [...fields]
      const draggedFieldContent = updatedFields[dragItem.current]
      updatedFields.splice(dragItem.current, 1)
      updatedFields.splice(dragOverItem.current, 0, draggedFieldContent)
      setFields(updatedFields)
    }
    dragItem.current = null
    dragOverItem.current = null
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  // Populate data when in edit mode
  useEffect(() => {
    if (isEditMode && response?.data) {
      const form = response.data
      setName(form.name || '')
      setDescription(form.description || '')
      setStatus(form.status || 'active')
      setFields(form.fields || [])
    }
  }, [isEditMode, response])

  // Helper to snakeify labels for unique database keys
  const generateUniqueKey = (label: string, index: number) => {
    const slug = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_|_$)/g, '')

    return slug || `field_${index}_${Math.random().toString(36).substring(2, 6)}`
  };

  const handleAddField = () => {
    const newField: FormField = {
      label: '',
      key: '',
      question: '',
      required: true,
      type: 'text',
    }
    setFields([...fields, newField])
  }

  const handleRemoveField = (index: number) => {
    const updated = [...fields]
    updated.splice(index, 1)
    setFields(updated)
  }

  const handleFieldChange = (index: number, key: keyof FormField, value: any) => {
    const updated = [...fields]
    updated[index] = {
      ...updated[index],
      [key]: value,
    }
    setFields(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error(t('form_name_required'))
      return
    }

    if (fields.length === 0) {
      toast.error(t('form_fields_required'))
      return
    }

    // Validate fields and dynamically assign keys
    const processedFields: FormField[] = []
    const labelSet = new Set<string>()

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      if (!field.label.trim()) {
        toast.error(t('field_label_required'))
        return
      }
      if (!field.question.trim()) {
        toast.error(t('field_question_required'))
        return
      }

      const generatedKey = generateUniqueKey(field.label, i)
      if (labelSet.has(generatedKey)) {
        toast.error(t('field_label_must_be_unique'))
        return
      }
      labelSet.add(generatedKey)

      processedFields.push({
        ...field,
        key: generatedKey,
      })
    }

    const payload: Partial<Form> = {
      name,
      description,
      status,
      fields: processedFields,
    }

    try {
      if (isEditMode) {
        await updateForm({ id: id!, data: payload }).unwrap()
        toast.success(t('form_updated_successfully'))
      } else {
        await createForm(payload).unwrap()
        toast.success(t('form_created_successfully'))
      }
      router.push(ROUTES.LEAD_CAPTURE_FORMS)
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_save_form'))
    }
  }

  const isSaving = isCreating || isUpdating

  if (isEditMode && isLoadingForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner />
        <p className="mt-4 text-sm text-subtitle-color font-semibold">
          {t('loading_form_details')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
      <PageHeader
        title={
          isEditMode
            ? t('edit_lead_form')
            : t('new_lead_form')
        }
        showBackButton={true}
        onBack={() => router.push(ROUTES.LEAD_CAPTURE_FORMS)}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core details card */}
        <div className="grid grid-cols-12 xl1199:grid-cols-1 gap-6">
          <div className="sm:p-6 p-4 col-span-4 xl1199:col-span-1 h-fit rounded-radius border border-input-border-color bg-bg-card space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-4">
              {t('form_details')}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="form-name" className="text-md font-bold">
                  {t('form_name_label')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="form-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('form_name_placeholder')}
                  className="h-11 rounded-xl bg-input-color"
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="form-description" className="text-md font-bold">
                  {t('description')}
                </Label>
                <Textarea
                  id="form-description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder={t('form_description_placeholder', {
                    defaultValue: 'Provide a brief description of callers or information captured.',
                  })}
                  className="min-h-24 rounded-xl bg-input-color"
                  maxLength={500}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="form-status" className="text-md font-bold">
                  {t('status')}
                </Label>
                <div className="flex items-center gap-3 h-11">
                  <Switch
                    id="form-status"
                    checked={status === 'active'}
                    onCheckedChange={(checked) => setStatus(checked ? 'active' : 'inactive')}
                    className="data-[state=checked]:bg-switch-background"
                  />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 capitalize">
                    {status === 'active' ? t('active') : t('inactive')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic fields card */}
          <div className="sm:p-6 p-4 col-span-8 xl1199:col-span-1 h-fit rounded-radius border border-input-border-color bg-bg-card space-y-6">
            <div className="flex flex-wrap gap-3 justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="space-y-0.5">
                <h2 className="text-xl font-bold text-title">
                  {t('form_fields_title')}
                </h2>
                <p className="text-md text-subtitle-color">
                  {t('form_fields_desc')}
                </p>
              </div>
              <Button
                type="button"
                onClick={handleAddField}
                className="bg-primary text-white transition-all font-medium rounded-lg p-padding! flex items-center gap-1 border-none"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>{t('add_field')}</span>
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center sm:p-12 p-4 text-center rounded-lg bg-subcard border border-dashed border-input-border-color">
                <FileText className="w-12 h-12 text-primary mb-4" />
                <p className="text-base text-title font-bold">
                  {t('no_fields_added')}
                </p>
                <p className="text-md text-subtitle-color font-medium max-w-sm mb-4">
                  {t('no_fields_added_hint', {
                    defaultValue: 'Click the Add Field button to configure dynamic fields to capture call data.',
                  })}
                </p>
                <Button
                  type="button"
                  onClick={handleAddField}
                  className="bg-primary text-white font-medium rounded-lg p-padding!"
                >
                  {t('add_first_field')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 no-scrollbar overflow-y-auto overflow-x-hidden max-h-[625px] sm:pr-8 sm:-mr-8 rtl:sm:pr-0 rtl:sm:mr-0 rtl:sm:pl-8 rtl:sm:-ml-8">
                {fields.map((field, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    className="sm:p-5 p-4 pt-12 sm:pt-12 rounded-lg border border-input-border-color bg-subcard grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-end gap-4 relative animate-in fade-in zoom-in duration-300 group cursor-move"
                  >
                    <div className="absolute top-3 right-3 rtl:right-[unset] rtl:left-3 sm:top-4 sm:right-4 rtl:sm:right-[unset] rtl:sm:left-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(val) => handleFieldChange(index, 'required', val)}
                          className="data-[state=checked]:bg-switch-background scale-[0.85] cursor-pointer"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveField(index)}
                        className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-none z-10"
                        title={t('remove_field')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="absolute top-3 left-3 translate-y-0 rtl:left-auto rtl:right-3 sm:top-1/2 sm:-translate-y-1/2 sm:left-auto sm:right-[-19px] rtl:sm:right-auto rtl:sm:left-[-19px] bg-primary/10 text-primary rounded-lg h-9 w-9 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-move z-10">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-md font-bold text-title  tracking-wider">
                        {t('field_label')} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={field.label}
                        onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                        placeholder={t('field_label_placeholder')}
                        className="h-10 rounded-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-md font-bold text-title tracking-wider">
                        {t('field_question')}{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={field.question}
                        onChange={(e) => handleFieldChange(index, 'question', e.target.value)}
                        placeholder={t('field_question_placeholder', {
                          defaultValue: 'e.g. What is your email address?',
                        })}
                        className="h-10 rounded-lg "
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-md font-bold text-title tracking-wider">
                        {t('field_type')}
                      </Label>
                      <Select
                        value={field.type}
                        onValueChange={(val: FormFieldType) => handleFieldChange(index, 'type', val)}
                      >
                        <SelectTrigger className="h-10 rounded-lg shadow-none mb-0">
                          <SelectValue placeholder={t('type')} />
                        </SelectTrigger>
                        <SelectContent className="bg-bg-card border-input-border-color">
                          <SelectItem value="text">{t('text')}</SelectItem>
                          <SelectItem value="number">{t('number')}</SelectItem>
                          <SelectItem value="date">{t('date')}</SelectItem>
                          <SelectItem value="time">{t('time')}</SelectItem>
                          <SelectItem value="email">{t('email')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => router.push(ROUTES.LEAD_CAPTURE_FORMS)}
              className=" rounded-lg h-12 font-medium text-md p-padding! bg-subcard border border-input-border-color"
            >
              {t('cancel')}
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white text-md font-medium rounded-lg h-12 p-padding! flex items-center gap-2 border-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('saving')}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>
                    {isEditMode
                      ? t('save_changes')
                      : t('create_form_btn')}
                  </span>
                </>
              )}
            </Button>
          </div>

        </div>
      </form>
    </div>
  )
}
