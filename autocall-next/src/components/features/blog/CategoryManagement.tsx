'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Pagination } from '@/components/reusable/Pagination'
import Spinner from '@/components/reusable/Spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PERMISSIONS } from '@/constants/permissions'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useDeleteCategoryMutation, useGetCategoriesQuery } from '@/redux/api/categoryApi'
import { ApiError } from '@/types/api'
import { Category } from '@/types/blog'
import { CheckCircle2, FolderTree, Pencil, Plus, Search, Trash2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import CategoryModal from './CategoryModal'

const CategoryManagement = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: categoriesResponse, isLoading } = useGetCategoriesQuery({ search: debouncedSearch, page, limit })
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const allCategories = categoriesResponse?.categories || []
  const totalResults = allCategories.length
  const totalPages = Math.ceil(totalResults / limit)
  const startIndex = (page - 1) * limit
  const categories = allCategories.slice(startIndex, startIndex + limit)

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return
    try {
      await deleteCategory(categoryToDelete).unwrap()
      toast.success(t('category_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setCategoryToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
      <div className="pb-6">
        <PageHeader
          title={t('categories')}
          subtitle={t('manage_blog_categories')}
          primaryAction={hasPermission(PERMISSIONS.CREATE_BLOG_CATEGORIES) ? {
            label: t('create_category'),
            onClick: handleCreate,
            icon: <Plus className="w-5 h-5" />,
            className: 'dark:border-white/10',
          } : undefined}
          showBackButton={false}
        />
      </div>

      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color z-10 pointer-events-none" />
            <Input
              placeholder={t('search_categories')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-bg-card rounded-radius border-input-border-color text-md focus-visible-outline-unset! transition-all"
            />
          </div>
        </div>

        {/* Card Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner size="lg" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-input-border-color rounded-[20px] bg-bg-card">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
              <div className="relative w-16 h-16 bg-primary/10 text-primary rounded-[16px] flex items-center justify-center">
                <FolderTree className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-title mb-2">{t('no_categories_found', 'No Categories Found')}</h3>
            <p className="text-md text-subtitle-color font-medium">
              {t('no_blog_categories_desc', 'Create blog categories to organize your blog posts.')}
            </p>
            {hasPermission(PERMISSIONS.CREATE_BLOG_CATEGORIES) && (
              <Button onClick={handleCreate} className="mt-6 font-bold" variant="premium">
                <Plus className="w-4 h-4 mr-2" />
                {t('create_category')}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((row) => (
              <div
                key={row._id || row.id}
                className="group p-4 rounded-lg bg-bg-card border border-input-border-color hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col"
              >
                {/* Top Row: Icon & Actions */}
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FolderTree className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasPermission(PERMISSIONS.UPDATE_BLOG_CATEGORIES) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
                        onClick={() => handleEdit(row)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {hasPermission(PERMISSIONS.DELETE_BLOG_CATEGORIES) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                        onClick={() => {
                          setCategoryToDelete(row._id || row.id)
                          setIsDeleteModalOpen(true)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4 mb-3">
                  <h3 className="font-bold text-lg text-title truncate">{row.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-bold rounded-full px-2.5 h-6 flex items-center gap-1 border-none',
                      row.status
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-red-500/10 text-red-600',
                    )}
                  >
                    {row.status ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {row.status ? t('active') : t('inactive')}
                  </Badge>
                </div>

                {/* Subtitle / Description */}
                {row.slug && <p className="text-sm text-subtitle-color truncate mb-3">{row.slug}</p>}

                {/* Separator & Footer Badge */}
                <div className="pt-3 border-t border-input-border-color mt-auto">
                  <Badge className="bg-primary hover:bg-primary/90 text-white rounded-full px-3 py-1 text-[11px] font-medium border-none shadow-none">
                    {row.name.toLowerCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 0 && (
          <div className="border-t border-input-border-color pt-4 mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalResults={totalResults || (totalPages <= 1 ? categories.length : 0)}
              showRowsPerPage={true}
              rowsPerPage={limit}
              onRowsPerPageChange={(newLimit) => {
                setLimit(newLimit)
                setPage(1)
              }}
            />
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t('delete_category')}
        description={t('delete_category_description')}
      />
    </div>
  )
}

export default CategoryManagement
