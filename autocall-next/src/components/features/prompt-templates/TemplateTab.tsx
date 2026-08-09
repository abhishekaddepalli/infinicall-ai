'use client'

import { DataViewEmptyState, DataViewLayout, DataViewPagination, DataViewToolbar } from "@/components/reusable/data-view"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useDebounce } from "@/hooks/useDebounce"
import { cn } from "@/lib/utils"
import {
  useDeletePromptTemplatesMutation,
  useGetPromptTemplatesQuery,
} from "@/redux/api/promptTemplateApi"
import { useGetTemplateCategoriesQuery } from "@/redux/api/templateCategoryApi"
import { ApiError } from "@/types/api"
import { PromptTemplate } from "@/types/prompt-template"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { PromptTemplateItem } from "./PromptTemplateItem"

export const TemplateTab = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit] = useState(8)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
  const debouncedSearch = useDebounce(search, 500)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  const { data: categoriesResponse } = useGetTemplateCategoriesQuery({ limit: 100 })
  const categories = categoriesResponse?.categories || []

  const { data: response, isLoading } = useGetPromptTemplatesQuery({
    page,
    limit,
    search: debouncedSearch,
    category: selectedCategoryId === "all" ? undefined : selectedCategoryId,
    sort_by: 'created_at',
    sort_order: 'DESC',
  })

  const [deleteTemplates, { isLoading: isDeleting }] = useDeletePromptTemplatesMutation()

  const templates = response?.templates || []
  const totalResults = response?.total || 0

  const handleEditOpen = (template: PromptTemplate) => {
    router.push(`/conversation-templates/create?id=${template.id || template._id}`)
  }

  const handleDeleteOpen = (id: string) => {
    setTemplateToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return
    try {
      await deleteTemplates({ ids: [templateToDelete] }).unwrap()
      toast.success(t("template_deleted_successfully"))
      setIsDeleteModalOpen(false)
      setTemplateToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="w-full overflow-x-auto whitespace-nowrap pb-3 table-custom-scrollbar">
          <div className="flex w-max space-x-2">
            <Button
              variant={selectedCategoryId === "all" ? "default" : "outline"}
              size="default"
              onClick={() => {
                setSelectedCategoryId("all")
                setPage(1)
              }}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold transition-all border-none",
                selectedCategoryId === "all"
                  ? "bg-primary dark:border-white/10 text-white shadow-md shadow-primary/20"
                  : "bg-slate-100 dark:bg-slate-800 dark:bg-white/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {t("all_templates")}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id || cat._id}
                variant={selectedCategoryId === (cat.id || cat._id) ? "default" : "outline"}
                size="default"
                onClick={() => {
                  setSelectedCategoryId(cat.id || cat._id || "")
                  setPage(1)
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-bold transition-all border-none",
                  selectedCategoryId === (cat.id || cat._id)
                    ? "bg-primary  dark:border-white/10 text-white shadow-md shadow-primary/20"
                    : "bg-slate-100 dark:bg-slate-800 dark:bg-white/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        <DataViewToolbar
          search={search}
          onSearchChange={(val) => {
            setSearch(val)
            setPage(1)
          }}
          searchPlaceholder={t("search_templates_hint")}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <DataViewLayout<PromptTemplate>
          items={templates}
          isLoading={isLoading}
          viewMode={viewMode}
          emptyState={
            <DataViewEmptyState
              icon={<Search className="w-8 h-8 text-primary" />}
              title={t("no_templates_found")}
              description={t("no_templates_description")}
              actionLabel={t("create_template")}
              onAction={() => router.push(ROUTES.PROMPT_TEMPLATE_CREATE)}
            />
          }
          renderListItem={(template, index) => (
            <PromptTemplateItem
              key={template.id || template._id}
              template={template}
              viewMode="list"
              isLastItem={index === templates.length - 1}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
            />
          )}
          renderGridItem={(template) => (
            <PromptTemplateItem
              key={template.id || template._id}
              template={template}
              viewMode="grid"
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
            />
          )}
        />

        {totalResults > limit && (
          <DataViewPagination
            currentPage={page}
            totalItems={totalResults}
            itemsPerPage={limit}
            onPageChange={setPage}
          />
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t("delete_template")}
        description={t("delete_template_desc")}
      />
    </div>
  )
}
