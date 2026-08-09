'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Pagination } from '@/components/reusable/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { PERMISSIONS } from '@/constants/permissions'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useDeleteBlogMutation, useGetBlogsQuery } from '@/redux/api/blogApi'
import { ApiError } from '@/types/api'
import { Blog } from '@/types/blog'
import { LayoutGrid, Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import BlogCard from './BlogCard'
import BlogForm from './BlogForm'

const BlogList = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(9)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data: blogsResponse, isLoading } = useGetBlogsQuery({
    page,
    limit,
    search: debouncedSearch,
  })

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null)

  const blogs = blogsResponse?.blogs || []
  const totalPages = blogsResponse?.totalPages || 0
  const totalResults = blogsResponse?.total || 0

  const handleDelete = async () => {
    if (!blogToDelete) return
    try {
      await deleteBlog(blogToDelete).unwrap()
      toast.success(t('blog_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setBlogToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog)
    setView('edit')
  }

  const handleDetails = (blog: Blog) => {
    router.push(`/blog/${blog._id || blog.id}`)
  }

  if (view === 'create' || view === 'edit') {
    return <BlogForm blog={selectedBlog} onClose={() => setView('list')} />
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header with Search and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder={t('search_blogs_placeholder')}
              className="pl-10 h-10 rounded-radius bg-input-color border-input-border-color focus:bg-input-color transition-all duration-200 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {hasPermission(PERMISSIONS.CREATE_BLOGS) && (
            <Button
              onClick={() => {
                setSelectedBlog(null)
                setView('create')
              }}
              className="h-12 w-full lg:w-auto p-padding! rounded-radius bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('create_blog')}</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video rounded-[2.5rem]" />
              <Skeleton className="h-8 w-3/4 rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id || blog.id}
              blog={blog}
              onEdit={handleEdit}
              onClick={handleDetails}
              onDelete={(id) => {
                setBlogToDelete(id)
                setIsDeleteModalOpen(true)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 rounded-lg border-2 border-dashed border-input-border-color bg-bg-card animate-in fade-in zoom-in-95 duration-700">
          <div className="relative">
            <div className="relative w-16 h-16 rounded-lg bg-primary/10  border border-input-border-color flex items-center justify-center">
              <LayoutGrid className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-title">{t('no_blogs_found')}</h3>
            <p className="text-subtitle-color text-md max-w-sm mx-auto font-medium leading-relaxed">
              {t('no_blogs_desc')}
            </p>
          </div>
          {hasPermission(PERMISSIONS.CREATE_BLOGS) && (
            <Button
              onClick={() => setView('create')}
              className="h-12 p-padding! rounded-lg bg-primary text-white font-bold text-sm transition-all flex items-center gap-2 group"
            >
              <Plus className="w-5 h-5" />
              {t('create_first_post')}
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="pt-10">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalResults={totalResults || (totalPages <= 1 ? blogs.length : 0)}
            showRowsPerPage={true}
            rowsPerPage={limit}
            onRowsPerPageChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
          />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setBlogToDelete(null)
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={t('delete_blog_title')}
        description={t('delete_blog_description')}
      />
    </div>
  )
}

export default BlogList
