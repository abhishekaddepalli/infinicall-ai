'use client'

import { DataTable } from "@/components/reusable/DataTable"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { PageHeader } from "@/components/reusable/PageHeader"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useDebounce } from "@/hooks/useDebounce"
import {
  useCreateTemplateCategoryMutation,
  useDeleteTemplateCategoriesMutation,
  useGetTemplateCategoriesQuery,
  useUpdateTemplateCategoryMutation,
} from "@/redux/api/templateCategoryApi"
import { ApiError } from "@/types/api"
import { TemplateCategory } from "@/types/prompt-template"
import { Column } from "@/types/table"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { CategoryModal } from "./CategoryModal"

export const CategoryTab = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const { data: response, isLoading } = useGetTemplateCategoriesQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy: sortColumn,
    sortOrder: sortOrder,
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const [createCategory, { isLoading: isCreating }] = useCreateTemplateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateTemplateCategoryMutation()
  const [deleteCategories, { isLoading: isDeleting }] = useDeleteTemplateCategoriesMutation()

  const categories = response?.categories || []
  const totalResults = response?.total || 0

  const handleCreateOpen = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleEditOpen = (category: TemplateCategory) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleDeleteOpen = (id: string) => {
    setCategoryToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleSave = async (data: { name: string; description: string }) => {
    try {
      if (selectedCategory) {
        await updateCategory({
          id: selectedCategory.id || selectedCategory._id || "",
          data,
        }).unwrap()
        toast.success(t("category_updated_successfully"))
      } else {
        await createCategory(data).unwrap()
        toast.success(t("category_created_successfully"))
      }
      setIsModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return
    try {
      await deleteCategories({ ids: [categoryToDelete] }).unwrap()
      toast.success(t("category_deleted_successfully"))
      setIsDeleteModalOpen(false)
      setCategoryToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  const columns: Column<TemplateCategory>[] = [
    {
      header: t("name"),
      className: "xl1580:min-w-[350px]",
      accessorKey: "name",
      sortable: true,
      cell: (row) => <div className="font-semibold text-title break-all whitespace-normal line-clamp-2">{row.name}</div>,
    },
    {
      header: t("description"),
      className: "xl1580:min-w-[250px]",
      accessorKey: "description",
      sortable: true,
      cell: (row) => <div className="max-w-100 truncate text-subtitle-color">{row.description}</div>,
    },
    {
      header: t("is_system"),
      className: "xl1580:min-w-[250px]",
      accessorKey: "is_system",
      sortable: true,
      cell: (row) => <div className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${row.is_system ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-subcard text-subtitle-color"}`}>{row.is_system ? t("yes") : t("no")}</div>,
    },
    {
      header: t("actions"),
      className: "xl1580:min-w-[200px]",
      cell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled={row.is_system || false} onClick={() => handleEditOpen(row)} className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled={row.is_system || false} onClick={() => handleDeleteOpen(row.id || row._id || "")} className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("template_categories")}
        showBackButton={true}
        onBack={() => router.push(ROUTES.ATTRIBUTE)}
        primaryAction={{
          label: t("create_category"),
          onClick: handleCreateOpen,
          icon: <Plus className="w-5 h-5" />,
          className: "bg-primary text-white"
        }}
      />

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        totalResults={totalResults}
        totalPages={page}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("search_categories")}
        emptyStateTitle={t("no_categories_title", "No Categories Found")}
        emptyMessage={t("no_categories_desc", "Create template categories to organize your prompt templates.")}
        emptyStateActionLabel={t("create_category")}
        onEmptyStateAction={handleCreateOpen}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
        showRowsPerPageAtTop={true}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t("delete_category")}
        description={t("delete_category_desc")}
      />
    </div>
  )
}
