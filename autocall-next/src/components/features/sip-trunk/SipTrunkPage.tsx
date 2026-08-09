'use client'

import { DataViewEmptyState, DataViewLayout, DataViewPagination, DataViewToolbar } from '@/components/reusable/data-view'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import {
  useDeleteSipTrunkMutation,
  useGetSipTrunksQuery,
} from '@/redux/api/sipTrunkApi'
import { SipTrunk } from '@/types/sip-trunk'
import { Network, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { SipTrunkItem } from './SipTrunkItem'

const SipTrunkPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()

  const canView = hasPermission(PERMISSIONS.VIEW_TRUNKS)
  const canCreate = hasPermission(PERMISSIONS.CREATE_TRUNKS)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_TRUNKS)
  const canDelete = hasPermission(PERMISSIONS.DELETE_TRUNKS)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const { data, isLoading, isFetching } = useGetSipTrunksQuery({
    page,
    limit,
    search,
  })
  const [deleteTrunk, { isLoading: isDeleting }] = useDeleteSipTrunkMutation()

  const trunks = data?.data || []
  const pagination = data?.pagination

  const handleCreate = () => router.push(ROUTES.TRUNK_INTEGRATION_CREATE)

  const handleEdit = (trunk: SipTrunk) => {
    const id = trunk._id || trunk.id
    if (id) router.push(`/trunk-integration/${id}/edit`)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteTrunk(idToDelete).unwrap()
      toast.success(res.message || t('trunk_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setIdToDelete(null)
    } catch (error: any) {
      toast.error(error?.data?.message || t('delete_failed'))
    }
  }

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-bold text-title">{t('access_denied')}</p>
        <p className="text-sm text-subtitle-color mt-2">
          {t('no_permission_trunks')}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="pb-6">
        <PageHeader
          title={t('trunk_integrations')}
          icon={<Network className="w-8 h-8 text-primary" />}
          primaryAction={
            canCreate
              ? {
                  label: t('create_trunk'),
                  onClick: handleCreate,
                  icon: <Plus className="h-5 w-5 mr-1" strokeWidth={2.5} />,
                  className: 'bg-primary hover:bg-primary/90 text-white font-medium rounded-radius p-padding',
                }
              : undefined
          }
          showBackButton={false}
        />
      </div>

      <DataViewToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_trunks')}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <DataViewLayout<SipTrunk>
        items={trunks}
        isLoading={isLoading || isFetching}
        viewMode={viewMode}
        emptyState={
          <DataViewEmptyState
            icon={<Network className="w-8 h-8 text-primary" />}
            title={t('no_trunks_found')}
            description={t('no_trunks_description')}
            actionLabel={t('create_trunk')}
            onAction={canCreate ? handleCreate : undefined}
          />
        }
        renderListItem={(trunk, index) => (
          <SipTrunkItem
            key={trunk._id || trunk.id}
            trunk={trunk}
            viewMode="list"
            isLastItem={index === trunks.length - 1}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={(id) => {
              setIdToDelete(id)
              setIsDeleteModalOpen(true)
            }}
          />
        )}
        renderGridItem={(trunk) => (
          <SipTrunkItem
            key={trunk._id || trunk.id}
            trunk={trunk}
            viewMode="grid"
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={(id) => {
              setIdToDelete(id)
              setIsDeleteModalOpen(true)
            }}
          />
        )}
      />

      <DataViewPagination
        currentPage={page}
        totalItems={pagination?.total ?? trunks.length}
        itemsPerPage={limit}
        onPageChange={setPage}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setIdToDelete(null)
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title={t('delete_trunk_title')}
        description={t('delete_trunk_desc', {
          defaultValue: 'Are you sure you want to delete this trunk? Associated SIP numbers will also be removed.',
        })}
      />
    </>
  )
}

export default SipTrunkPage
