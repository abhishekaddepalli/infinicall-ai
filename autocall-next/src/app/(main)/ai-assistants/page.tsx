'use client'

import { AgentItem } from '@/components/features/agents/AgentItem'
import { TestAgentFlowModal } from '@/components/features/agents/TestAgentFlowModal'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { DataViewEmptyState, DataViewLayout, DataViewPagination, DataViewToolbar } from '@/components/reusable/data-view'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import {
  useDeleteAgentMutation,
  useGetAgentsQuery,
  useUpdateAgentMutation
} from '@/redux/api/agentApi'
import { useGetVoicesQuery } from '@/redux/api/voiceApi'
import { Agent } from '@/types/agent'
import {
  Activity,
  Filter,
  Plus,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function AgentListingPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const canManage = hasPermission(PERMISSIONS.UPDATE_AGENTS)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading } = useGetAgentsQuery({
    page,
    limit,
    search: debouncedSearch,
  })

  const { data: voicesData } = useGetVoicesQuery()

  const getVoiceName = (voiceId: string) => {
    if (!voicesData?.data) return voiceId
    const voice = voicesData.data.find((v: any) => v.voice_id === voiceId)
    return voice ? voice.name : voiceId
  }

  const [updateAgent] = useUpdateAgentMutation()
  const [deleteAgent, { isLoading: isDeleting }] = useDeleteAgentMutation()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [selectedAgentForTest, setSelectedAgentForTest] = useState<Agent | null>(null)

  const handleTestFlowOpen = (agent: Agent) => {
    setSelectedAgentForTest(agent)
    setIsTestModalOpen(true)
  }

  const handleEdit = (agent: Agent) => {
    const agentId = agent._id || agent.id
    router.push(`/ai-assistants/create?id=${agentId}`)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteAgent(idToDelete).unwrap()
      toast.success(res.message || t('agent_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_delete_agent'))
    }
  }

  const handleStatusChange = async (agent: Agent) => {
    try {
      const agentId = agent._id || agent.id
      const newStatus = agent.status === 'active' ? 'inactive' : 'active'
      await updateAgent({ id: agentId, status: newStatus }).unwrap()
      toast.success(t(newStatus === 'active' ? 'agent_activated' : 'agent_deactivated'))
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_update_status'))
    }
  }

  const filteredAgents = data?.data?.filter((agent: Agent) => {
    if (statusFilter !== 'all' && agent.status !== statusFilter) return false
    if (typeFilter !== 'all' && agent.type !== typeFilter) return false
    return true
  }) || []

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out ">
      <div className="pb-6">
        <PageHeader
          title={t('agents_title')}
          icon={<Users className="w-8 h-8 text-primary" />}
          primaryAction={{
            label: t('create_agent'),
            onClick: () => router.push(ROUTES.AI_ASSISTANT_CREATE),
            icon: <Plus className="h-5 w-5" strokeWidth={2.5} />,
            className: 'bg-primary hover:bg-primary/90 text-white font-medium rounded-radius p-padding',
          }}
          showBackButton={false}
        />
      </div>

      <DataViewToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_agents')}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterNode={
          <>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 w-full sm:w-36 rounded-lg shadow-none bg-bg-card border-input-border-color font-semibold text-sm">
                <div className="flex items-center gap-2 whitespace-nowrap [&>span[data-placeholder]]:font-normal [&>span[data-placeholder]]:text-subtitle-color">
                  <Filter className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_types')}</SelectItem>
                <SelectItem value="incoming">{t('incoming')}</SelectItem>
                <SelectItem value="flow">{t('outgoing')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full sm:w-36 rounded-lg shadow-none  bg-bg-card border-input-border-color font-semibold text-sm">
                <div className="flex items-center gap-2 whitespace-nowrap [&>span[data-placeholder]]:font-normal [&>span[data-placeholder]]:text-subtitle-color">
                  <Activity className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  <SelectValue placeholder="All Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_status')}</SelectItem>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="inactive">{t('inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      <DataViewLayout<Agent>
        items={filteredAgents}
        isLoading={isLoading}
        viewMode={viewMode}
        emptyState={
          <DataViewEmptyState
            icon={<Users className="w-8 h-8 text-primary" />}
            title={t('no_agents_found')}
            description={t('no_agents_description')}
            actionLabel={t('create_agent')}
            onAction={() => router.push(ROUTES.AI_ASSISTANT_CREATE)}
          />
        }
        renderListItem={(agent, index) => (
          <AgentItem
            key={agent._id || agent.id}
            agent={agent}
            viewMode="list"
            isLastItem={index === filteredAgents.length - 1}
            onStatusChange={handleStatusChange}
            onTestFlow={handleTestFlowOpen}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getVoiceName={getVoiceName}
          />
        )}
        renderGridItem={(agent) => (
          <AgentItem
            key={agent._id || agent.id}
            agent={agent}
            viewMode="grid"
            onStatusChange={handleStatusChange}
            onTestFlow={handleTestFlowOpen}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getVoiceName={getVoiceName}
          />
        )}
      />

      <DataViewPagination
        currentPage={page}
        totalItems={data?.total || 0}
        itemsPerPage={limit}
        onPageChange={setPage}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_agent_title')}
        description={t('delete_agent_description')}
        isLoading={isDeleting}
      />

      <TestAgentFlowModal
        isOpen={isTestModalOpen}
        agent={selectedAgentForTest}
        onClose={() => {
          setIsTestModalOpen(false)
          setSelectedAgentForTest(null)
        }}
      />
    </div>
  )
}
