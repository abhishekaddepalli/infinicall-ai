'use client'

import { useCreateBlogMutation, useUpdateBlogMutation } from '@/redux/api/blogApi'
import { useGetCategoriesQuery } from '@/redux/api/categoryApi'
import { useGetTagsQuery } from '@/redux/api/tagApi'
import { ApiError } from '@/types/api'
import { Blog, Category, Tag } from '@/types/blog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'

export function useBlogForm(blog: Blog | null | undefined, onClose: () => void) {
  const { t } = useTranslation()
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()

  const { data: categoriesData } = useGetCategoriesQuery({ limit: 100 })
  const { data: tagsData } = useGetTagsQuery({ limit: 100 })

  const categories = categoriesData?.categories || []
  const tags = tagsData?.tags || []

  const isEditing = !!blog
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(blog?.thumbnail || null)
  const [metaImageUrl, setMetaImageUrl] = useState<string | null>(blog?.meta_image || null)

  const extractIds = (items: (string | Category | Tag)[]) => {
    if (!items || !Array.isArray(items)) return []
    return items.map((item) => typeof item === 'string' ? item : item.id || item._id)
  }

  const initialValues = {
    title: blog?.title || '',
    slug: blog?.slug || '',
    description: blog?.description || '',
    content: blog?.content || '',
    thumbnail: null as File | null,
    meta_image: null as File | null,
    categories: extractIds(blog?.categories || []),
    tags: extractIds(blog?.tags || []),
    status: blog?.status ?? true,
    meta_title: blog?.meta_title || '',
    meta_description: blog?.meta_description || '',
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('title_required') || t('title_is_required')),
    slug: Yup.string().required(t('slug_required') || t('slug_is_required')),
    description: Yup.string().required(t('description_required') || t('description_is_required')),
    content: Yup.string().required(t('content_required') || t('content_is_required')),
    categories: Yup.array().min(1, t('at_least_one_category') || t('at_least_one_category_is_required')),
    tags: Yup.array().min(1, t('at_least_one_tag') || t('at_least_one_tag_is_required')),
    thumbnail: Yup.mixed().nullable().test('required', t('thumbnail_required') || 'Thumbnail is required', (value) => {
      if (isEditing && blog?.thumbnail) return true;
      return value !== null && value !== undefined;
    }),
  })

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData()

      formData.append('title', values.title)
      formData.append('slug', values.slug)
      formData.append('description', values.description)
      formData.append('content', values.content)
      formData.append('status', String(values.status))
      formData.append('meta_title', values.meta_title)
      formData.append('meta_description', values.meta_description)

      // Append categories and tags
      values.categories.forEach(id => formData.append('categories[]', id))
      values.tags.forEach(id => formData.append('tags[]', id))

      // Append files if they exist
      if (values.thumbnail) {
        formData.append('thumbnail', values.thumbnail)
      }
      if (values.meta_image) {
        formData.append('meta_image', values.meta_image)
      }

      if (isEditing && blog) {
        const id = blog.id || blog._id
        const res = await updateBlog({ id, data: formData }).unwrap()
        toast.success(res.message || t('blog_updated_successfully'))
      } else {
        const res = await createBlog(formData).unwrap()
        toast.success(res.message || t('blog_created_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const isLoading = isCreating || isUpdating

  return {
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
  }
}
