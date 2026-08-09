'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textArea"
import { cn } from "@/lib/utils"
import { TestimonialFormModalProps } from "@/types/testimonial"
import { ErrorMessage, Form, Formik } from "formik"
import { Camera, Star, X } from 'lucide-react'
import Image from "next/image"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"

const TestimonialFormModal = ({
  isOpen,
  onClose,
  onSave,
  testimonial,
  isLoading,
}: TestimonialFormModalProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('title_required') || t('title_is_required')),
    description: Yup.string().required(t('description_required') || t('description_is_required')),
    user_name: Yup.string().required(t('user_name_required') || t('user_name_is_required')),
    user_post: Yup.string().required(t('user_post_required') || t('user_post_is_required')),
    rating: Yup.number().min(1).max(5).required(),
    status: Yup.boolean().required(),
  })

  const initialValues = {
    title: testimonial?.title || "",
    description: testimonial?.description || "",
    user_name: testimonial?.user_name || "",
    user_post: testimonial?.user_post || "",
    rating: testimonial?.rating || 5,
    status: testimonial?.status ?? true,
  }

  const [prevTestimonial, setPrevTestimonial] = useState(testimonial)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)

  if (testimonial !== prevTestimonial || isOpen !== prevIsOpen) {
    setPrevTestimonial(testimonial)
    setPrevIsOpen(isOpen)
    if (testimonial) {
      setImagePreview(testimonial.user_image ? `${process.env.NEXT_PUBLIC_STORAGE_URL}${testimonial.user_image}` : null)
      setSelectedFile(null)
    } else {
      setImagePreview(null)
      setSelectedFile(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: unknown) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (setFieldValue: unknown) => {
    setSelectedFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (values: typeof initialValues) => {
    const data = new FormData()
    data.append("title", values.title)
    data.append("description", values.description)
    data.append("user_name", values.user_name)
    data.append("user_post", values.user_post)
    data.append("rating", values.rating.toString())
    data.append("status", values.status.toString())

    if (selectedFile) {
      data.append("user_image", selectedFile)
    }

    await onSave(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! border-none rounded-modal-radius bg-white p-0 overflow-auto max-h-[90vh] gap-0 no-scrollbar">
        <DialogHeader className="sm:px-6 px-4 py-5 mb-0 text-left rtl:text-right border-b border-input-border-color">
          <DialogTitle className="text-xl font-bold text-title">
            {testimonial ? t('edit_testimonial') : t('create_testimonial')}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form className="p-4 space-y-6">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-2 border-dashed border-primary/20 flex items-center justify-center transition-all group-hover:border-primary/40">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-full" />
                    ) : (
                      <Camera className="w-8 h-8 text-primary/40" />
                    )}
                  </div>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 -right-1 rtl:right-[unset] rtl:-left-1 w-8 h-8 rounded-radius bg-primary text-white hover:scale-110 transition-transform"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveImage(setFieldValue)}
                      className="absolute -top-1 right-2 rtl:right-[unset] rtl:left-2 w-6 h-6 bg-destructive! text-white rounded-lg"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <p className="text-md text-subtitle-color font-medium">{t('upload_user_photo')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label className="text-md font-bold text-title-color dark:text-white ">{t('title')}</Label>
                  <Input
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={cn(
                      "h-10 rounded-radius bg-input-color border-input-border-color",
                      touched.title && errors.title && "border-destructive"
                    )}
                    placeholder={t('testimonial_title_placeholder')}
                  />
                  <ErrorMessage name="title" component="div" className="text-xs text-destructive mt-1" />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label className="text-md font-bold text-title">{t('rating')}</Label>
                  <div className="flex items-center gap-2 h-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        onClick={() => setFieldValue('rating', star)}
                        className="transition-transform active:scale-125 h-4.5 bg-unset p-0!"
                      >
                        <Star
                          className={cn(
                            "w-6 h-6 transition-colors",
                            star <= values.rating ? "fill-amber-400 text-amber-400" : "text-subtitle-color"
                          )}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <Label className="text-md font-bold text-title-color dark:text-white">{t('description')}</Label>
                <Textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  className={cn(
                    "w-full p-4 rounded-radius bg-input-color border border-input-border-color focus:outline-none text-sm transition-all resize-none",
                    touched.description && errors.description && "border-destructive"
                  )}
                  placeholder={t('testimonial_description_placeholder')}
                />
                <ErrorMessage name="description" component="div" className="text-xs text-destructive mt-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label className="text-md font-bold text-gray-900 dark:text-white">{t('user_name')}</Label>
                  <Input
                    name="user_name"
                    value={values.user_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={cn(
                      "h-10 rounded-radius bg-input-color border-input-border-color",
                      touched.user_name && errors.user_name && "border-destructive"
                    )}
                    placeholder={t('user_name_placeholder')}
                  />
                  <ErrorMessage name="user_name" component="div" className="text-xs text-destructive mt-1" />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label className="text-md font-bold text-gray-900 dark:text-white">{t('user_post')}</Label>
                  <Input
                    name="user_post"
                    value={values.user_post}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={cn(
                      "h-10 rounded-radius bg-input-color border-input-border-color",
                      touched.user_post && errors.user_post && "border-destructive"
                    )}
                    placeholder={t('user_post_placeholder')}
                  />
                  <ErrorMessage name="user_post" component="div" className="text-xs text-destructive mt-1" />
                </div>
              </div>

              <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {testimonial ? t('save_changes') : t('create')}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default TestimonialFormModal

