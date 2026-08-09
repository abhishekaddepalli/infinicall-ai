'use client'

import { DataViewEmptyState, DataViewLayout, DataViewPagination, DataViewToolbar } from "@/components/reusable/data-view"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { PageHeader } from "@/components/reusable/PageHeader"
import { PERMISSIONS } from "@/constants/permissions"
import { ROUTES } from "@/constants/routes"
import { useDebounce } from "@/hooks/useDebounce"
import { usePermission } from "@/hooks/usePermission"
import {
  useDeleteSMSAgentMutation,
  useGetSMSAgentsQuery,
} from "@/redux/api/smsAgentApi"
import { ApiError } from "@/types/api"
import { SMSAgent } from "@/types/sms-campaign"
import { Plus, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { SmsAgentItem } from "./SmsAgentItem"

export const SmsAgentsPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()

  const canView = hasPermission(PERMISSIONS.VIEW_SMS_AGENTS)
  const canCreate = hasPermission(PERMISSIONS.CREATE_SMS_AGENTS)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SMS_AGENTS)
  const canDelete = hasPermission(PERMISSIONS.DELETE_SMS_AGENTS)

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null)

  const { data: response, isLoading, refetch } = useGetSMSAgentsQuery(
    { page, limit, search: debouncedSearch },
    { skip: !canView }
  )

  const [deleteSmsAgent, { isLoading: isDeleting }] = useDeleteSMSAgentMutation()

  const agents = response?.data || []
  const totalResults = response?.total || 0

  const handleCreateOpen = () => {
    router.push(ROUTES.SMS_AGENTS_CREATE)
  }

  const handleDeleteOpen = (id: string) => {
    setAgentToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!agentToDelete) return
    try {
      await deleteSmsAgent(agentToDelete).unwrap()
      toast.success(t("agent_deleted_successfully"))
      setIsDeleteModalOpen(false)
      setAgentToDelete(null)
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
          title={t("sms_agents")}
          icon={<Users className="w-8 h-8 text-primary" />}
          primaryAction={
            canCreate ? {
              label: t("create_sms_agent"),
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
        searchPlaceholder={t("search_sms_agents")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <DataViewLayout<SMSAgent>
        items={agents}
        isLoading={isLoading}
        viewMode={viewMode}
        emptyState={
          <DataViewEmptyState
            icon={<Users className="w-8 h-8 text-primary" />}
            title={t("no_agents_found")}
            description={t("no_agents_description_sms")}
            actionLabel={t("create_sms_agent")}
            onAction={canCreate ? handleCreateOpen : undefined}
          />
        }
        renderListItem={(agent, index) => (
          <SmsAgentItem
            key={(agent as any)._id || (agent as any).id}
            agent={agent}
            viewMode="list"
            isLastItem={index === agents.length - 1}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={() => router.push(`${ROUTES.SMS_AGENTS}/${(agent as any)._id || (agent as any).id}/edit`)}
            onDelete={handleDeleteOpen}
          />
        )}
        renderGridItem={(agent) => (
          <SmsAgentItem
            key={(agent as any)._id || (agent as any).id}
            agent={agent}
            viewMode="grid"
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={() => router.push(`${ROUTES.SMS_AGENTS}/${(agent as any)._id || (agent as any).id}/edit`)}
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
        title={t("delete_agent")}
        description={t("delete_agent_desc")}
      />
    </>
  )
}
