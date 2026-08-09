'use client'

import { DataViewEmptyState, DataViewLayout, DataViewPagination, DataViewToolbar } from "@/components/reusable/data-view"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { PageHeader } from "@/components/reusable/PageHeader"
import { PERMISSIONS } from "@/constants/permissions"
import { ROUTES } from "@/constants/routes"
import { useDebounce } from "@/hooks/useDebounce"
import { usePermission } from "@/hooks/usePermission"
import {
  useDeleteSmsCampaignMutation,
  useGetSmsCampaignsQuery,
  useUpdateSmsCampaignMutation,
} from "@/redux/api/smsCampaignApi"
import { ApiError } from "@/types/api"
import { Plus, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { SmsCampaignItem } from "./SmsCampaignItem"

export const SmsCampaignsPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()

  const canView = hasPermission(PERMISSIONS.VIEW_SMS_CAMPAIGN)
  const canCreate = hasPermission(PERMISSIONS.CREATE_SMS_CAMPAIGN)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SMS_CAMPAIGN)
  const canDelete = hasPermission(PERMISSIONS.DELETE_SMS_CAMPAIGN)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null)

  const { data: response, isLoading, refetch } = useGetSmsCampaignsQuery(
    { page, limit, search: debouncedSearch },
    { skip: !canView }
  )

  const [updateSmsCampaign] = useUpdateSmsCampaignMutation()
  const [deleteSmsCampaign, { isLoading: isDeleting }] = useDeleteSmsCampaignMutation()

  const campaigns = response?.data || []
  const totalResults = response?.pagination?.total || 0

  const handleCreateOpen = () => {
    router.push(ROUTES.SMS_CAMPAIGNS_CREATE)
  }

  const handleDeleteOpen = (id: string) => {
    setCampaignToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleUpdateStatus = async (campaign: any, newStatus: string) => {
    try {
      const id = campaign.id || campaign._id || ""
      const formData = new FormData()
      formData.append("status", newStatus)

      await updateSmsCampaign({ id, data: formData }).unwrap()
      if (newStatus === 'Active') {
        toast.success(campaign.status === 'Paused' ? t("campaign_resumed_successfully", "Campaign Resumed Successfully") : t("campaign_started_successfully", "Campaign Started Successfully"))
      } else if (newStatus === 'Paused') {
        toast.success(t("campaign_paused_successfully", "Campaign Paused Successfully"))
      } else if (newStatus === 'Cancelled') {
        toast.success(t("campaign_cancelled_successfully", "Campaign Cancelled Successfully"))
      } else {
        toast.success(t("campaign_status_updated_successfully", "Campaign Status Updated Successfully"))
      }
      refetch()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("failed_to_update_campaign_status", "Failed to update campaign status"))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return
    try {
      await deleteSmsCampaign(campaignToDelete).unwrap()
      toast.success(t("campaign_deleted_successfully"))
      setIsDeleteModalOpen(false)
      setCampaignToDelete(null)
      refetch()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        {t("no_permission_to_view")}
      </div>
    )
  }

  return (
    <>
      <div>
        <PageHeader
          title={t("sms_campaigns")}
          icon={<Target className="w-8 h-8 text-primary" />}
          primaryAction={
            canCreate ? {
              label: t("create_sms_campaign"),
              onClick: handleCreateOpen,
              icon: <Plus className="h-5 w-5" strokeWidth={2.5} />,
              className: 'bg-primary hover:bg-primary/90 text-white font-medium rounded-radius p-padding',
            } : undefined
          }
          showBackButton={false}
        />
      </div>

      <DataViewToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("search_sms_campaigns")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <DataViewLayout<any>
        items={campaigns}
        isLoading={isLoading}
        viewMode={viewMode}
        emptyState={
          <DataViewEmptyState
            icon={<Target className="w-8 h-8 text-primary" />}
            title={t("no_campaigns_found")}
            description={t("no_campaigns_description")}
            actionLabel={t("create_sms_campaign")}
            onAction={canCreate ? handleCreateOpen : undefined}
          />
        }
        renderListItem={(campaign, index) => (
          <SmsCampaignItem
            key={campaign.id || campaign._id}
            campaign={campaign}
            viewMode="list"
            isLastItem={index === campaigns.length - 1}
            canUpdate={canUpdate}
            canDelete={canDelete}
            canView={canView}
            onStatusChange={handleUpdateStatus}
            onHistory={(id) => router.push(`/sms-campaigns/${id}/history`)}
            onEdit={(id) => router.push(`/sms-campaigns/${id}/edit`)}
            onDelete={handleDeleteOpen}
          />
        )}
        renderGridItem={(campaign) => (
          <SmsCampaignItem
            key={campaign.id || campaign._id}
            campaign={campaign}
            viewMode="grid"
            canUpdate={canUpdate}
            canDelete={canDelete}
            canView={canView}
            onStatusChange={handleUpdateStatus}
            onHistory={(id) => router.push(`/sms-campaigns/${id}/history`)}
            onEdit={(id) => router.push(`/sms-campaigns/${id}/edit`)}
            onDelete={handleDeleteOpen}
          />
        )}
      />

      <DataViewPagination
        currentPage={page}
        totalItems={totalResults}
        itemsPerPage={response?.pagination?.limit || limit}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t("delete_campaign")}
        description={t("delete_campaign_desc")}
      />
    </>
  )
}
