'use client'

import { Button } from '@/components/ui/button'
import { BlogFormProps } from '@/types/blog'
import { Form, Formik } from 'formik'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BlogGeneralInfo from './form/BlogGeneralInfo'
import BlogSEOInfo from './form/BlogSEOInfo'
import BlogSidebar from './form/BlogSidebar'
import { useBlogForm } from './hooks/useBlogForm'

export default function BlogForm({ blog, onClose }: BlogFormProps) {
  const { t } = useTranslation()
  const {
    categories,
    tags,
    isEditing,
    thumbnailUrl,
    setThumbnailUrl,
    metaImageUrl,
    setMetaImageUrl,
    initialValues,
    validationSchema,
    handleSubmit,
    isLoading,
  } = useBlogForm(blog, onClose)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
      <div className="flex flex-col md:flex-row md:items-center w-full justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20 hover:text-primary rounded-radius transition-all shrink-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-title line-clamp-1 ">
              {isEditing ? t('edit_blog') : t('add_blog')}
            </h1>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <BlogGeneralInfo 
                setFieldValue={setFieldValue} 
                values={values} 
                isEditing={isEditing}
                errors={errors}
                touched={touched}
              />
            </div>

            <BlogSidebar
              values={values}
              setFieldValue={setFieldValue}
              touched={touched}
              errors={errors}
              categories={categories}
              tags={tags}
              thumbnailUrl={thumbnailUrl}
              setThumbnailUrl={setThumbnailUrl}
              isLoading={isLoading}
              isEditing={isEditing}
              onClose={onClose}
            />

            <div className="xl:col-span-3">
              <BlogSEOInfo 
                setFieldValue={setFieldValue} 
                values={values} 
                metaImageUrl={metaImageUrl} 
                setMetaImageUrl={setMetaImageUrl} 
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
