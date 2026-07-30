'use client'

import { DataTable } from "@/components/reusable/DataTable"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { PageHeader } from "@/components/reusable/PageHeader"
import { StatusSwitch } from "@/components/reusable/StatusSwitch"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useDebounce } from "@/hooks/useDebounce"
import {
  useCreateCampaignTypeMutation,
  useDeleteCampaignTypesMutation,
  useGetCampaignTypesQuery,
  useUpdateCampaignTypeMutation,
  useUpdateCampaignTypeStatusMutation
} from "@/redux/api/campaignApi"
import { ApiError } from "@/types/api"
import { CampaignType } from "@/types/campaign"
import { Column } from "@/types/table"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { CampaignTypeModal } from "./CampaignTypeModal"

export const CampaignTypeTab = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCampaignType, setSelectedCampaignType] = useState<CampaignType | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [campaignTypeToDelete, setCampaignTypeToDelete] = useState<string | null>(null)

  const { data: response, isLoading } = useGetCampaignTypesQuery({
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

  const [createCampaignType, { isLoading: isCreating }] = useCreateCampaignTypeMutation()
  const [updateCampaignType, { isLoading: isUpdating }] = useUpdateCampaignTypeMutation()
  const [updateStatus] = useUpdateCampaignTypeStatusMutation()
  const [deleteCampaignTypes, { isLoading: isDeleting }] = useDeleteCampaignTypesMutation()

  const campaignTypes = response?.campaignTypes || []
  const totalResults = response?.total || 0

  const handleCreateOpen = () => {
    setSelectedCampaignType(null)
    setIsModalOpen(true)
  }

  const handleEditOpen = (campaignType: CampaignType) => {
    setSelectedCampaignType(campaignType)
    setIsModalOpen(true)
  }

  const handleDeleteOpen = (id: string) => {
    setCampaignTypeToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleSave = async (data: { name: string; description: string }) => {
    try {
      if (selectedCampaignType) {
        await updateCampaignType({
          id: selectedCampaignType.id || selectedCampaignType._id || "",
          data,
        }).unwrap()
        toast.success(t("campaign_type_updated_successfully"))
      } else {
        await createCampaignType(data).unwrap()
        toast.success(t("campaign_type_created_successfully"))
      }
      setIsModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  const handleStatusToggle = async (campaignType: CampaignType) => {
    try {
      const id = campaignType.id || campaignType._id || ""
      await updateStatus(id).unwrap()
      toast.success(t("status_updated_successfully"))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("failed_to_update_status"))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!campaignTypeToDelete) return
    try {
      await deleteCampaignTypes({ ids: [campaignTypeToDelete] }).unwrap()
      toast.success(t("campaign_type_deleted_successfully"))
      setIsDeleteModalOpen(false)
      setCampaignTypeToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  const columns: Column<CampaignType>[] = [
    {
      header: t("name"),
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          {row.name}
        </div>
      ),
    },
    {
      header: t("description"),
      accessorKey: "description",
      sortable: true,
      cell: (row) => (
        <div className="max-w-[400px] truncate text-slate-500 dark:text-slate-400">
          {row.description || '-'}
        </div>
      ),
    },
    {
      header: t("status"),
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <StatusSwitch
          isActive={row.status}
          onToggle={() => handleStatusToggle(row)}
          canManage={true}
        />
      ),
    },
    {
      header: t("actions"),
      cell: (row) => {
        const id = row.id || row._id || ""
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditOpen(row)}
              className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
              title={t("edit")}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteOpen(id)}
              className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
              title={t("delete")}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("campaign_types")}
        showBackButton={true}
        onBack={() => router.push(ROUTES.ATTRIBUTE)}
        primaryAction={{
          label: t("create_campaign_type"),
          onClick: handleCreateOpen,
          icon: <Plus className="w-5 h-5" />,
          className: "bg-primary text-white"
        }}
      />

      <DataTable
        columns={columns}
        data={campaignTypes}
        isLoading={isLoading}
        totalResults={totalResults}
        totalPages={page}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("search_campaign_types")}
        emptyStateTitle={t("no_campaign_types_title", "No Campaign Types Found")}
        emptyMessage={t("no_campaign_types_desc", "Create a campaign type to categorize your outbound campaigns.")}
        emptyStateActionLabel={t("create_campaign_type")}
        onEmptyStateAction={handleCreateOpen}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
        showRowsPerPageAtTop={true}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <CampaignTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        campaignType={selectedCampaignType}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t("delete_campaign_type")}
        description={t("delete_campaign_type_desc")}
      />
    </div>
  )
}
