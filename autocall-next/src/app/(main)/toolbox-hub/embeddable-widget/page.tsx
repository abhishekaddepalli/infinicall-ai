'use client'

import { EmbedModal } from '@/components/features/widgets/EmbedModal'
import { WidgetAnalyticsCards } from '@/components/features/widgets/WidgetAnalyticsCards'
import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { useGetAgentsQuery } from '@/redux/api/agentApi'
import {
  useDeleteWidgetMutation,
  useGetWidgetAnalyticsQuery,
  useGetWidgetsQuery,
  useLazyGetEmbedCodeQuery,
  useUpdateWidgetMutation
} from '@/redux/api/widgetApi'
import { Widget } from '@/types/widget'
import { formatDate } from '@/utils/validation-schemas'
import { Code2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function WidgetListingPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()

  const canView = hasPermission(PERMISSIONS.VIEW_WIDGETS)
  const canCreate = hasPermission(PERMISSIONS.CREATE_WIDGETS)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_WIDGETS)
  const canDelete = hasPermission(PERMISSIONS.DELETE_WIDGETS)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // API Queries & Mutations
  const { data: widgetsData, isLoading } = useGetWidgetsQuery(
    { page, limit, search, status: statusFilter === 'all' ? undefined : statusFilter, sortBy: sortColumn, sortOrder: sortOrder },
    { skip: !canView }
  )
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useGetWidgetAnalyticsQuery(undefined, { skip: !canView })
  const { data: agentsData } = useGetAgentsQuery(undefined)
  const [updateWidget] = useUpdateWidgetMutation()
  const [deleteWidget, { isLoading: isDeleting }] = useDeleteWidgetMutation()
  const [triggerGetEmbedCode] = useLazyGetEmbedCodeQuery()

  // State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false)
  const [activeEmbedCode, setActiveEmbedCode] = useState('')
  const [activeWidgetName, setActiveWidgetName] = useState('')

  const widgets = widgetsData?.data || []
  const agents = agentsData?.data || []
  const analytics = analyticsData?.data
  const analyticsReports = analytics?.individualReports || []

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  // Use server side filtered widgets instead of local
  const filteredWidgets = widgets

  const handleEdit = (widget: Widget) => {
    router.push(`/toolbox-hub/embeddable-widget/${widget._id || widget.id}/edit`)
  }

  const handleCreate = () => {
    router.push(ROUTES.TOOLBOX_EMBEDDED_WIDGET_CREATE)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      await deleteWidget({ widgetIds: [idToDelete] }).unwrap()
      toast.success(t('widget_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_delete_widget'))
    }
  }

  const handleStatusChange = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await updateWidget({ id, status: newStatus }).unwrap()
      toast.success(t('status_updated_successfully'))
    } catch (error: any) {
      toast.error(error?.data?.message || t('something_went_wrong'))
    }
  }

  const handleShowEmbed = async (widget: Widget) => {
    try {
      const widgetId = widget._id || widget.id
      if (!widgetId) return
      const res = await triggerGetEmbedCode(widgetId).unwrap()
      setActiveEmbedCode(res.embed_code)
      setActiveWidgetName(widget.name)
      setIsEmbedModalOpen(true)
    } catch (err) {
      toast.error('Failed to generate embed code')
    }
  }

  const handleCopyKey = async (e: React.MouseEvent, key: string) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      toast.success(t('copied_to_clipboard'))
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const columns: Column<Widget>[] = [
    {
      header: t('name'),
      accessorKey: 'name',
      className: 'font-semibold text-title w-[25%] xl1580:min-w-[250px]',
      sortable: true,
      cell: (row) => <span className='text-md break-all whitespace-normal line-clamp-2'>{row.name}</span>,
    },
    {
      header: t('assigned_agent'),
      accessorKey: 'agent_id',
      className: 'w-[20%] xl1580:min-w-[250px]',
      cell: (row) => {
        const assignedAgent = agents.find((a: any) => (a._id || a.id) === row.agent_id)
        return (
          <span className="font-bold text-sm text-subtitle-color break-all whitespace-normal line-clamp-2">
            {assignedAgent ? assignedAgent.name : <span className="text-zinc-400 italic">Not Assigned</span>}
          </span>
        )
      },
    },
    {
      header: t('call_count', 'Call Count'),
      accessorKey: 'call_count' as any,
      className: 'w-[10%] xl1580:min-w-[180px]',
      cell: (row) => {
        const stats = analyticsReports.find((r: any) => r._id === (row._id || row.id))
        return <span className="font-bold text-sm text-title">{stats?.totalCalls || 0}</span>
      }
    },
    {
      header: t('duration', 'Duration'),
      accessorKey: 'duration' as any,
      className: 'w-[10%] xl1580:min-w-[140px]',
      cell: (row) => {
        const stats = analyticsReports.find((r: any) => r._id === (row._id || row.id))
        const seconds = stats?.totalSeconds || 0;
        const formatDuration = (secs: number) => {
          if (!secs) return '0s';
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          return m > 0 ? `${m}m ${s}s` : `${s}s`;
        };
        return <span className="font-bold text-sm text-title">{formatDuration(seconds)}</span>
      }
    },
    {
      header: t('status'),
      accessorKey: 'status',
      sortable: true,
      className: 'w-[12%] xl1580:min-w-[120px]',
      cell: (row) => (
        <Switch
          checked={row.status === 'active'}
          onCheckedChange={() => handleStatusChange(row._id || row.id || '', row.status)}
          className="shadow-sm bg-switch-background dark:bg-switch-background"
        />
      ),
    },
    {
      header: t('last_updated'),
      accessorKey: 'updated_at',
      sortable: true,
      className: 'w-[13%] xl1580:min-w-[150px]',
      cell: (row) => (
        <span className="text-foreground/80 dark:text-white/80 font-bold text-sm">
          {formatDate(row.updated_at)}
        </span>
      ),
    },
    {
      header: t('actions'),
      className: 'text-right w-[10%] xl1580:min-w-[180px]',
      cell: (row) => (
        <div className="flex items-center gap-2 justify-start">
          {canUpdate && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-radius text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all"
                onClick={() => handleShowEmbed(row)}
                title={t('embed_code')}
              >
                <Code2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
                onClick={() => handleEdit(row)}
                title={t('edit')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
              onClick={() => handleDelete(row._id || row.id || '')}
              title={t('delete')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (!canView) {
    return (
      <div className="py-20 text-center text-subtitle-color">
        {t('access_denied')}
      </div>
    )
  }

  return (
    <>
      <TableLayout
        title={t('embeddable_widget')}
        primaryAction={
          canCreate
            ? {
              label: t('create_widget'),
              onClick: handleCreate,
              icon: <Plus className="h-5 w-5" strokeWidth={2.5} />,
              className: 'bg-primary text-white font-bold transition-all duration-300 rounded-radius p-padding',
            }
            : undefined
        }
        columns={columns}
        data={filteredWidgets}
        totalResults={(widgetsData as any)?.pagination?.total || filteredWidgets.length}
        currentPage={page}
        totalPages={(widgetsData as any)?.pagination?.pages || 1}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyStateTitle={t("no_widgets_title", "No Widgets Found")}
        emptyMessage={t("no_widgets_desc", "Configure chat widgets to provide automated visitor support.")}
        emptyStateActionLabel={t('create_widget')}
        onEmptyStateAction={canCreate ? handleCreate : undefined}
        enableSelection={canDelete}
        onBulkDelete={
          canDelete
            ? async (rows) => {
              const ids = rows.map((r: Widget) => r._id || r.id).filter(Boolean) as string[]
              try {
                await deleteWidget({ widgetIds: ids }).unwrap()
                toast.success(t('widget_deleted_successfully'))
              } catch (error: any) {
                toast.error(error?.data?.message || t('something_went_wrong'))
              }
            }
            : undefined
        }
        showRowsPerPageAtTop={true}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_widgets')}
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-[180px] border-input-border-color rounded-radius bg-input-color font-medium shadow-none">
              <SelectValue placeholder={t('filter_by_status')} />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-bg-body">
              <SelectItem value="all">{t('all_status', 'All Status')}</SelectItem>
              <SelectItem value="active">{t('active', 'Active')}</SelectItem>
              <SelectItem value="inactive">{t('inactive', 'Inactive')}</SelectItem>
            </SelectContent>
          </Select>
        }
        onBack={() => router.push(ROUTES.TOOLBOX)}
      >
        <WidgetAnalyticsCards analytics={analytics} isLoading={isLoadingAnalytics} />
      </TableLayout>

      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        embedCode={activeEmbedCode}
        widgetName={activeWidgetName}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_widget')}
        description={t('delete_widget_desc')}
        isLoading={isDeleting}
      />
    </>
  )
}
