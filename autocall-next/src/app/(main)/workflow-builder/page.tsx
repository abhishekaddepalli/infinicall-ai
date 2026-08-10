'use client'

import AIFlowGeneratorModal from '@/components/features/workflow-builder/AIFlowGeneratorModal'
import { FlowItem } from '@/components/features/workflow-builder/FlowItem'
import TestFlowModal from '@/components/features/workflow-builder/TestFlowModal'
import { DataViewEmptyState, DataViewLayout, DataViewPagination, DataViewToolbar } from '@/components/reusable/data-view'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { useCreateFlowMutation, useDeleteFlowMutation, useGetFlowsQuery, useUpdateFlowMutation } from '@/redux/api/flowApi'
import { Flow } from '@/types/flow'
import { Network, Plus, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function FlowBuilderPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [filterType, setFilterType] = useState<'predefined' | 'custom'>('custom')

  const { data, isLoading } = useGetFlowsQuery({
    page,
    limit,
    search: debouncedSearch,
  })

  const [createFlow] = useCreateFlowMutation()
  const [deleteFlow, { isLoading: isDeleting }] = useDeleteFlowMutation()
  const [updateFlow] = useUpdateFlowMutation()

  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [flowToTest, setFlowToTest] = useState<Flow | null>(null)

  const handleAiGenerated = async (generatedData: any) => {
    try {
      const res = await createFlow({
        name: generatedData.name,
        description: generatedData.description,
        nodes: generatedData.nodes,
        edges: generatedData.edges,
        status: 'active'
      }).unwrap()

      const flowData = res?.data as any
      const newFlowId = flowData?._id || flowData?.id || flowData?.virtualId
      if (newFlowId) {
        router.push(`/workflow-builder/${newFlowId}`)
      } else {
        router.push(ROUTES.WORKFLOW_BUILDER)
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create AI flow')
    }
  }

  const handleTest = (flow: Flow) => {
    setFlowToTest(flow)
    setIsTestModalOpen(true)
  }

  const handleEdit = (flow: Flow) => {
    const flowId = flow._id || flow.id
    router.push(`/workflow-builder/${flowId}`)
  }

  const handleCreate = () => {
    router.push(ROUTES.WORKFLOW_BUILDER_CREATE)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteFlow(idToDelete).unwrap()
      toast.success(res.message || t('flow_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_delete_flow'))
    }
  }

  const handleStatusChange = async (flow: Flow) => {
    try {
      const flowId = flow._id || flow.id
      const newStatus = flow.status === 'active' ? 'inactive' : 'active'
      const res = await updateFlow({ id: flowId, status: newStatus }).unwrap()
      toast.success(res.message || t(newStatus === 'active' ? 'flow_activated' : 'flow_deactivated'))
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_update_status'))
    }
  }

  const filteredItems = (data?.data || []).filter(flow => {
    if (filterType === 'predefined') return flow.system_flow === true
    return flow.system_flow === false || flow.system_flow === undefined
  })

  return (
    <>
      <div className="pb-6">
        <PageHeader
          title={t('workflow_builder_title')}
          icon={<Network className="w-8 h-8 text-primary" />}
          primaryAction={{
            label: t('create_flow'),
            onClick: handleCreate,
            icon: <Plus className="h-5 w-5" strokeWidth={2.5} />,
            className: 'bg-primary hover:bg-primary/90 text-white font-medium rounded-radius p-padding',
          }}
          endContent={
            <Button
              onClick={() => setIsAiModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold rounded-radius p-padding gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
              <span>AI Flow Generator</span>
            </Button>
          }
          showBackButton={false}
        />
      </div>

      <DataViewToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_flows')}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterNode={
          <div className="flex items-center h-12 bg-input-color! p-1 rounded-lg border border-input-border-color shrink-0">
            <Button
              variant="ghost"
              className={cn(
                "h-10 px-5 text-sm font-bold rounded-md transition-all duration-300",
                filterType === 'predefined'
                  ? "bg-primary! text-white shadow-sm"
                  : "text-subtitle-color bg-transparent! hover:bg-transparent! hover:text-title"
              )}
              onClick={() => setFilterType('predefined')}
            >
              {t('predefined', 'Predefined')}
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "h-10 px-5 text-sm font-bold rounded-md transition-all duration-300",
                filterType === 'custom'
                  ? "bg-primary! text-white shadow-sm"
                  : "text-subtitle-color bg-transparent! hover:bg-transparent! hover:text-title"
              )}
              onClick={() => setFilterType('custom')}
            >
              {t('custom', 'Custom')}
            </Button>
          </div>
        }
      />

      <DataViewLayout<Flow>
        items={filteredItems}
        isLoading={isLoading}
        viewMode={viewMode}
        emptyState={
          <DataViewEmptyState
            icon={<Network className="w-8 h-8 text-primary" />}
            title={t('no_flows_found')}
            description={t('no_flows_description')}
            actionLabel={t('create_flow')}
            onAction={handleCreate}
          />
        }
        renderListItem={(flow, index) => (
          <FlowItem
            key={flow._id || flow.id}
            flow={flow}
            viewMode="list"
            isLastItem={index === filteredItems.length - 1}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTest={handleTest}
          />
        )}
        renderGridItem={(flow) => (
          <FlowItem
            key={flow._id || flow.id}
            flow={flow}
            viewMode="grid"
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTest={handleTest}
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
        title={t('delete_flow_title')}
        description={t('delete_flow_description')}
        isLoading={isDeleting}
      />

      <TestFlowModal
        flow={flowToTest}
        isOpen={isTestModalOpen}
        onClose={() => {
          setIsTestModalOpen(false)
          setFlowToTest(null)
        }}
      />

      <AIFlowGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerate={handleAiGenerated}
      />
    </>
  )
}
