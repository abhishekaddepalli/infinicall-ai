'use client'

import { DataViewEmptyState, DataViewLayout, DataViewPagination, DataViewToolbar } from "@/components/reusable/data-view"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { PageHeader } from "@/components/reusable/PageHeader"
import { ROUTES } from "@/constants/routes"
import { useDebounce } from "@/hooks/useDebounce"
import {
  useDeleteCampaignMutation,
  useGetCampaignsQuery,
  useUpdateCampaignMutation
} from "@/redux/api/campaignApi"
import { ApiError } from "@/types/api"
import { Campaign } from "@/types/campaign"
import { Plus, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { CampaignItem } from "./CampaignItem"

export const CampaignTab = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null)

  const { data: response, isLoading, refetch } = useGetCampaignsQuery({
    page,
    limit,
    search: debouncedSearch,
  })

  const [updateCampaign] = useUpdateCampaignMutation()
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation()

  const campaigns = response?.data || []
  const totalResults = response?.pagination?.total || 0

  const handleCreateOpen = () => {
    router.push(ROUTES.AI_CAMPAIGN_CREATE)
  }

  const handleEditOpen = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsModalOpen(true)
  }

  const handleDeleteOpen = (id: string) => {
    setCampaignToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleUpdateStatus = async (campaign: Campaign, newStatus: string) => {
    try {
      const id = campaign.id || campaign._id || ""
      const formData = new FormData()
      formData.append("campaignStatus", newStatus)
      
      await updateCampaign({ id, data: formData }).unwrap()
      if (newStatus === 'Active') {
        toast.success(campaign.campaignStatus === 'Paused' ? t("campaign_resumed_successfully", "Campaign Resumed Successfully") : t("campaign_started_successfully", "Campaign Started Successfully"))
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
      await deleteCampaign(campaignToDelete).unwrap()
      toast.success(t("campaign_deleted_successfully"))
      setIsDeleteModalOpen(false)
      setCampaignToDelete(null)
      refetch()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }
    
  return (
    <>
      <div className="pb-6">
        <PageHeader
          title={t("campaigns_hub")}
          icon={<Target className="w-8 h-8 text-primary" />}
          primaryAction={{
            label: t("create_campaign"),
            onClick: handleCreateOpen,
            icon: <Plus className="h-5 w-5" strokeWidth={2.5} />,
            className: 'bg-primary hover:bg-primary/90 text-white font-medium rounded-radius p-padding',
          }}
          showBackButton={false}
        />
      </div>

      <DataViewToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("search_campaigns")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <DataViewLayout<Campaign>
        items={campaigns}
        isLoading={isLoading}
        viewMode={viewMode}
        emptyState={
          <DataViewEmptyState
            icon={<Target className="w-8 h-8 text-primary" />}
            title={t('no_campaigns_found')}
            description={t('no_campaigns_description')}
            actionLabel={t("create_campaign")}
            onAction={handleCreateOpen}
          />
        }
        renderListItem={(campaign, index) => (
          <CampaignItem
            key={campaign._id || campaign.id}
            campaign={campaign}
            viewMode="list"
            isLastItem={index === campaigns.length - 1}
            onStatusChange={handleUpdateStatus}
            onHistory={(id) => router.push(`/ai-campaign-hub/${id}/history`)}
            onEdit={(id) => router.push(`/ai-campaign-hub/${id}/edit`)}
            onDelete={handleDeleteOpen}
          />
        )}
        renderGridItem={(campaign) => (
          <CampaignItem
            key={campaign._id || campaign.id}
            campaign={campaign}
            viewMode="grid"
            onStatusChange={handleUpdateStatus}
            onHistory={(id) => router.push(`/ai-campaign-hub/${id}/history`)}
            onEdit={(id) => router.push(`/ai-campaign-hub/${id}/edit`)}
            onDelete={handleDeleteOpen}
          />
        )}
      />

      <DataViewPagination
        currentPage={page}
        totalItems={totalResults}
        itemsPerPage={limit}
        onPageChange={setPage}
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
