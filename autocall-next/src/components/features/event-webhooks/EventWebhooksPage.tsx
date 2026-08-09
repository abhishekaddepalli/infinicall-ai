'use client'

import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import {
  useDeleteWebhookMutation,
  useGetWebhooksQuery,
} from '@/redux/api/eventWebhooksApi'
import { EventWebhook } from '@/types/event-webhook'
import { Column } from '@/types/table'
import { format } from 'date-fns'
import { Edit2, Plus, Trash2, Webhook } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import EventWebhookModal from './EventWebhookModal'

export default function EventWebhooksPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()

  const canView = hasPermission(PERMISSIONS.VIEW_WEBHOOKS)
  const canCreate = hasPermission(PERMISSIONS.CREATE_WEBHOOKS)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_WEBHOOKS)
  const canDelete = hasPermission(PERMISSIONS.DELETE_WEBHOOKS)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<EventWebhook | undefined>(undefined)

  const { data: response, isLoading, isFetching } = useGetWebhooksQuery({
    page,
    limit,
    search,
    sortBy,
    sortOrder
  })

  const [deleteWebhook] = useDeleteWebhookMutation()

  const handleEdit = (webhook: EventWebhook) => {
    setSelectedWebhook(webhook)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedWebhook(undefined)
    setIsModalOpen(true)
  }

  const handleDelete = async (webhookId: string) => {
    try {
      await deleteWebhook(webhookId).unwrap()
      toast.success(t('webhook_deleted_successfully', 'Webhook deleted successfully'))
    } catch (error) {
      toast.error(t('failed_to_delete_webhook', 'Failed to delete webhook'))
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const columns: Column<EventWebhook>[] = [
    {
      header: t('name', 'Name'),
      className: "xl1580:min-w-[240px]",
      sortable: true,
      sortKey: 'name',
      cell: (row) => <span className="font-bold text-title text-base break-all whitespace-normal line-clamp-2">{row.name}</span>,
    },
    {
      header: t('webhook_url', 'Webhook URL'),
      className: "xl1580:min-w-[300px]",
      sortable: true,
      sortKey: 'endpoint_url',
      cell: (row) => <span className="text-md font-medium text-subtitle-color break-all whitespace-normal line-clamp-2">{row.endpoint_url}</span>,
    },
    {
      header: t('hooks', 'Hooks'),
      className: "xl1580:min-w-[270px]",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.events?.slice(0, 2).map((event, idx) => (
            <Badge key={idx} variant="outline" className="text-xs bg-subcard text-subtitle-color border-input-border-color">
              {event}
            </Badge>
          ))}
          {(row.events?.length || 0) > 2 && (
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              +{(row.events?.length || 0) - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: t('status', 'Status'),
      className: "xl1580:min-w-[140px]",
      sortable: true,
      sortKey: 'is_active',
      cell: (row) => (
        <Badge variant="outline" className={row.is_active ? 'bg-edit/10 text-edit border-edit/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}>
          {row.is_active ? t('active', 'Active') : t('inactive', 'Inactive')}
        </Badge>
      ),
    },
    {
      header: t('created_at', 'Created At'),
      className: "xl1580:min-w-[190px]",
      sortable: true,
      sortKey: 'created_at',
      cell: (row) => <span className="text-md text-title font-semibold">{row.created_at ? format(new Date(row.created_at), 'MMM dd, yyyy') : '-'}</span>,
    },
    {
      header: t('action', 'Action'),
      className: "xl1580:min-w-[150px]",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {canUpdate && (
            <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all">
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {canDelete && (
            <Button variant="ghost" size="icon" onClick={() => handleDelete(row.id || (row as any)._id)} className="h-9 w-9 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const totalPages = response?.pagination?.pages || 1

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        {t("no_permission_to_view", "You do not have permission to view this page.")}
      </div>
    )
  }

  return (
    <>
      <TableLayout
        title={t('event_webhooks', 'Event Webhooks')}
        headerIcon={<Webhook className="w-8 h-8 text-primary" />}
        columns={columns}
        data={response?.data || []}
        isLoading={isLoading || isFetching}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        searchPlaceholder={t('search_webhooks', 'Search webhooks...')}
        emptyStateTitle={t('no_webhooks_found', 'No Webhooks Found')}
        emptyMessage={t('no_webhooks_desc', 'Create your first event webhook to start receiving notifications.')}
        emptyStateActionLabel={canCreate ? t('create_webhook', 'Create Webhook') : undefined}
        onEmptyStateAction={canCreate ? handleCreate : undefined}
        showBackButton={true}
        enableSelection={false}
        currentPage={page}
        totalPages={totalPages}
        totalResults={response?.pagination?.total || 0}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(val) => {
          setLimit(val)
          setPage(1)
        }}
        sortColumn={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        filters={
          canCreate ? (
            <div className="flex items-center gap-2">
              <Button onClick={handleCreate} className="gap-2 h-11 p-padding! text-md font-semibold rounded-lg bg-primary text-white">
                <Plus className="w-5 h-5" />
                {t('create_webhook', 'Create Webhook')}
              </Button>
            </div>
          ) : undefined
        }
      />

      <EventWebhookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        webhookToEdit={selectedWebhook}
      />
    </>
  )
}
