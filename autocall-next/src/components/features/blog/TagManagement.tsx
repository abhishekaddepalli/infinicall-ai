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
import { useDeleteTagMutation, useGetTagsQuery } from '@/redux/api/tagApi'
import { ApiError } from '@/types/api'
import { Tag } from '@/types/blog'
import { Hash, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import TagModal from './TagModal'

const TagManagement = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data: tagsResponse, isLoading } = useGetTagsQuery({ page, search: debouncedSearch, limit })
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

  const tags = tagsResponse?.tags || []
  const totalPages = tagsResponse?.totalPages || 0
  const totalResults = tagsResponse?.total || 0

  const handleDeleteConfirm = async () => {
    if (!tagToDelete) return
    try {
      await deleteTag(tagToDelete).unwrap()
      toast.success(t('tag_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setTagToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedTag(null)
    setIsModalOpen(true)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
      <div className="pb-6">
        <PageHeader
          title={t('tags')}
          subtitle={t('manage_blog_tags')}
          primaryAction={hasPermission(PERMISSIONS.CREATE_BLOG_TAGS) ? {
            label: t('create_tag'),
            onClick: handleCreate,
            icon: <Plus className="w-5 h-5" />,
            className: ' dark:border-white/10',
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
              placeholder={t('search_tags')}
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
        ) : tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-input-border-color rounded-[20px] bg-bg-card">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
              <div className="relative w-16 h-16 bg-primary/10 text-primary rounded-[16px] flex items-center justify-center">
                <Hash className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-title mb-2">{t('no_tags_found', 'No Tags Found')}</h3>
            <p className="text-md text-subtitle-color font-medium">
              {t('no_blog_tags_desc', 'Create blog tags to categorize your blog posts.')}
            </p>
            {hasPermission(PERMISSIONS.CREATE_BLOG_TAGS) && (
              <Button onClick={handleCreate} className="mt-6 font-bold" variant="premium">
                <Plus className="w-4 h-4 mr-2" />
                {t('create_tag')}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tags.map((row) => (
              <div
                key={row._id || row.id}
                className="group p-4 rounded-lg bg-bg-card border border-input-border-color hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col"
              >
                {/* Top Row: Icon & Actions */}
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Hash className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasPermission(PERMISSIONS.UPDATE_BLOG_TAGS) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
                        onClick={() => handleEdit(row)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {hasPermission(PERMISSIONS.DELETE_BLOG_TAGS) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                        onClick={() => {
                          setTagToDelete(row._id || row.id)
                          setIsDeleteModalOpen(true)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Middle Row: Title */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-title break-all whitespace-normal line-clamp-2">{row.title}</h3>
                </div>

                {/* Separator & Footer Badge */}
                <div className="pt-3 border-t border-input-border-color mt-auto">
                  <Badge className="bg-primary hover:bg-primary/90 text-white rounded-full px-3 py-1 text-[11px] font-medium border-none shadow-none">
                    #{row.title.toLowerCase()}
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
              totalResults={totalResults || (totalPages <= 1 ? tags.length : 0)}
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

      <TagModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tag={selectedTag} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t('delete_tag')}
        description={t('delete_tag_description')}
      />
    </div>
  )
}

export default TagManagement
