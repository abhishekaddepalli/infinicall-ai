'use client'

import { DataCardGrid } from "@/components/reusable/DataCardGrid"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { PageHeader } from "@/components/reusable/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ROUTES } from "@/constants/routes"
import { useDebounce } from "@/hooks/useDebounce"
import { cn } from "@/lib/utils"
import {
  useBulkDeleteKnowledgeBaseMutation,
  useEditKnowledgeBaseMutation,
  useGetKnowledgeBaseQuery
} from "@/redux/api/knowledgeBaseApi"
import { KnowledgeBaseItem } from "@/types/knowledgeBase"
import { Plus, Search, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import EditKnowledgeBaseModal from "./EditKnowledgeBaseModal"
import KnowledgeBaseCard from "./KnowledgeBaseCard"
import { StorageIndicator } from "./StorageIndicator"

const KnowledgeBasePage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [type, setType] = useState("All")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const debouncedSearch = useDebounce(search, 500)
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<KnowledgeBaseItem | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([])

  const { data: response, isLoading } = useGetKnowledgeBaseQuery({
    page,
    limit,
    search: debouncedSearch,
    type: type,
  })

  const [editKB, { isLoading: isEditing }] = useEditKnowledgeBaseMutation()
  const [deleteKB, { isLoading: isDeleting }] = useBulkDeleteKnowledgeBaseMutation()

  const items = response?.data || []
  const totalResults = response?.total || 0
  const totalPages = response?.page ? Math.ceil(totalResults / limit) : 0


  const handleEditSave = async (id: string, formData: FormData) => {
    try {
      await editKB({ id, data: formData }).unwrap()
      toast.success(t('knowledge_base_updated_successfully'))
      setIsEditModalOpen(false)
      setSelectedItemForEdit(null)
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || t('failed_to_update_knowledge_base'))
    }
  }

  const handleDeleteSingle = (item: KnowledgeBaseItem) => {
    setItemsToDelete([item.id])
    setIsDeleteModalOpen(true)
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    setItemsToDelete(selectedIds)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (itemsToDelete.length === 0) return
    try {
      await deleteKB({ ids: itemsToDelete }).unwrap()
      toast.success(t('knowledge_base_deleted_successfully', {
        count: itemsToDelete.length,
        defaultValue: `${itemsToDelete.length} item(s) deleted successfully`
      }))
      setIsDeleteModalOpen(false)
      setItemsToDelete([])
      setSelectedIds([])
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row flex-wrap xl:flex-nowrap items-center justify-between gap-4 w-full">
        <div className="flex-1 min-w-[150px] order-1">
          <PageHeader
            title={t("knowledge_base")}
            showBackButton={false}
          />
        </div>

        {response && (
          <div className="w-full xl:w-auto order-3 xl:order-2">
            <StorageIndicator
              used={response.storageUsed}
              limit={response.storageLimit}
            />
          </div>
        )}

        <div className="w-full sm:w-auto order-2 xl:order-3">
          <Button
            onClick={() => router.push(ROUTES.KNOWLEDGE_BASE_CREATE)}
            className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm transition-all duration-300 rounded-radius px-3 sm:px-padding h-11 sm:h-12 w-full sm:w-auto flex items-center justify-center"
          >
            <Plus className="w-4 h-4 sm:mr-2" strokeWidth={2.5} />
            <span className="inline-block">{t("create_knowledge")}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-row flex-wrap xl:flex-nowrap items-center gap-4 w-full">
        <div className="relative transition-all duration-300 ease-in-out flex-1 min-w-[100px] xl:max-w-md order-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color pointer-events-none" />
          <Input
            placeholder={t("search_knowledge_base")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 w-full bg-input-color rounded-radius transition-all"
          />
        </div>

        <div className="w-[110px] sm:w-[180px] order-2 xl:order-3">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full h-11 bg-white border-gray-200 dark:border-white/10 rounded-xl focus:ring-0">
              <SelectValue placeholder={t('all_types')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t('all_types')}</SelectItem>
              <SelectItem value="url">{t('website_url')}</SelectItem>
              <SelectItem value="file">{t('document')}</SelectItem>
              <SelectItem value="text">{t('text')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 w-auto order-3 xl:order-2 xl:ml-auto">
          <Button
            variant={selectedIds.length > 0 ? 'destructive' : 'outline'}
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className={cn(
              "h-11 flex-1 xl:flex-none rounded-radius px-3 sm:px-padding hover:bg-destructive! hover:text-white! font-bold transition-all duration-300",
              selectedIds.length === 0 && "opacity-50 grayscale bg-input-color border-none"
            )}
          >
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline-block truncate">{t('bulk_delete')}</span>
            <span className="sm:hidden truncate">{t('delete')}</span>
            {selectedIds.length > 0 && <span className="ml-1">({selectedIds.length})</span>}
          </Button>

          {selectedIds.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="h-11 flex-1 xl:flex-none text-xs text-gray-500 hover:text-primary whitespace-nowrap bg-primary/10 text-primary hover:bg-primary hover:text-white"
            >
              <span className="truncate">{t('clear_selection')}</span>
            </Button>
          )}
        </div>
      </div>

      <DataCardGrid
        data={items}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        rowsPerPage={limit}
        emptyStateTitle={t("no_knowledge_base_title", "No Knowledge Base Found")}
        emptyMessage={t("no_knowledge_base_desc", "Upload documents or add web links to provide your AI agents with context.")}
        emptyStateActionLabel={t("create_knowledge")}
        onEmptyStateAction={() => router.push(ROUTES.KNOWLEDGE_BASE_CREATE)}
        gridClassName="xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1"
        renderCard={(item: any) => (
          <KnowledgeBaseCard
            item={item}
            onDelete={handleDeleteSingle}
            onEdit={(editItem: any) => {
              setSelectedItemForEdit(editItem)
              setIsEditModalOpen(true)
            }}
            isSelected={selectedIds.includes(item.id)}
            onSelect={toggleSelect}
          />
        )}
      />


      <EditKnowledgeBaseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedItemForEdit(null)
        }}
        onSave={handleEditSave}
        isLoading={isEditing}
        initialData={selectedItemForEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setItemsToDelete([])
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t("delete_kb_item_title", {
          defaultValue: itemsToDelete.length > 1 ? t('bulk_delete_sources') : t('delete_knowledge_source')
        })}
        description={t("delete_kb_item_desc", {
          defaultValue: itemsToDelete.length > 1
            ? `Are you sure you want to delete ${itemsToDelete.length} selected sources? This action cannot be undone.`
            : 'Are you sure you want to delete this source? This will remove the learned knowledge from your AI agents.'
        })}
      />
    </div>
  )
}

export default KnowledgeBasePage
