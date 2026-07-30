'use client'

import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import {
  useDeleteTeamMutation,
  useGetTeamsQuery,
  useToggleTeamStatusMutation
} from '@/redux/api/teamApi'
import { useAppSelector } from '@/redux/hooks'
import { ApiError } from '@/types/api'
import { Team } from '@/types/team'
import { formatDate } from '@/utils/validation-schemas'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const TeamsPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()

  const canView = hasPermission(PERMISSIONS.VIEW_TEAMS)
  const canManage = hasPermission(PERMISSIONS.UPDATE_TEAMS)
  const canCreate = hasPermission(PERMISSIONS.CREATE_TEAMS)
  const canDelete = hasPermission(PERMISSIONS.DELETE_TEAMS)

  const user = useAppSelector((state) => state.auth.user)
  const isSystemAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [teamsToDelete, setTeamsToDelete] = useState<string[]>([])

  const { data, isLoading, refetch } = useGetTeamsQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder.toUpperCase(),
  }, {
    skip: !canView,
  })

  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation()
  const [toggleStatus] = useToggleTeamStatusMutation()

  const handleDeleteConfirm = async () => {
    try {
      await deleteTeam({ ids: teamsToDelete }).unwrap()
      toast.success(t('teams_deleted_successfully', 'Teams deleted successfully'))
      setIsDeleteModalOpen(false)
      setTeamsToDelete([])
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong', 'Something went wrong'))
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await toggleStatus(id).unwrap()
      toast.success(t('team_status_updated', 'Team status updated'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_status', 'Failed to update status'))
    }
  }

  const columns: Column<Team>[] = [
    {
      header: t('name', 'Name'),
      className: 'min-w-[250px] xl1199:min-w-[345px]',
      accessorKey: 'name',
      sortable: true,
      cell: (row: Team) => (
        <div className="flex items-center gap-3">
          <div
            className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-lg font-semibold bg-primary/10 text-primary shrink-0')}
          >
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium text-base text-title break-all whitespace-normal line-clamp-1">{row.name}</span>
        </div>
      ),
    },
    {
      header: t('description', 'Description'),
      className: 'xl1199:min-w-[360px] max-w-[500px]',
      accessorKey: 'description',
      cell: (row: Team) => <span className="text-subtitle-color text-md break-all whitespace-normal line-clamp-2">{row.description || '-'}</span>,
    },
    {
      header: t('status', 'Status'),
      className: 'xl1199:min-w-[140px]',
      accessorKey: 'status',
      sortable: true,
      cell: (row: Team) => (
        <div className="flex items-center gap-2">
          {canManage ? (
            <Switch
              checked={row.status === 'active'}
              onCheckedChange={() => handleToggleStatus(row._id, row.status)}
              disabled={isSystemAdmin ? !row.isAdmin : false}
              className="data-[state=checked]:bg-emerald-500"
            />
          ) : (
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold",
              row.status === 'active'
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400"
            )}>
              {row.status === 'active' ? t('active', 'Active') : t('inactive', 'Inactive')}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t('created_at', 'Created At'),
      className: 'xl1199:min-w-[180px]',
      accessorKey: 'created_at',
      sortable: true,
      cell: (row: Team) => (
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-md text-title/70 font-medium">
            {formatDate(row.created_at)}
          </div>
        </div>
      ),
    },
    {
      header: t('action', 'Action'),
      className: 'xl1199:min-w-[145px]',
      cell: (row: Team) => {
        return (
          <div className="flex items-center gap-2">
            {canManage && (
              <Button
                variant="ghost"
                size="icon"
                title={t("edit_team", "Edit Team")}
                disabled={isSystemAdmin ? !row.isAdmin : false}
                className={cn(
                  "h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all",
                  (isSystemAdmin && !row.isAdmin) && "opacity-50 cursor-not-allowed hover:bg-edit/10 hover:text-edit"
                )}
                onClick={() => router.push(`${ROUTES.TEAMS}/edit/${row._id}`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                title={t("delete_team", "Delete Team")}
                disabled={isSystemAdmin ? !row.isAdmin : false}
                className={cn(
                  "h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all",
                  (isSystemAdmin && !row.isAdmin) && "opacity-50 cursor-not-allowed hover:bg-destructive/10 hover:text-destructive"
                )}
                onClick={() => {
                  setTeamsToDelete([row._id]);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {!canManage && !canDelete && (
              <span className="text-[10px] text-muted-foreground italic px-2">{t("view_only", "View Only")}</span>
            )}
          </div>
        );
      },
    },
  ]

  if (!canView) {
    return <div className="p-8 text-center text-subtitle-color font-medium">{t('no_permission_to_view', 'You do not have permission to view teams.')}</div>
  }

  return (
    <>
      <div className="space-y-8">
        <TableLayout
          title={t('teams', 'Teams')}
          showBackButton={false}
          primaryAction={
            canCreate
              ? {
                label: t('create_team', 'Create Team'),
                onClick: () => router.push(`${ROUTES.TEAMS}/create`),
                icon: <Plus className="w-5 h-5 text-white" />,
                className: 'bg-primary text-white font-bold transition-all duration-300 rounded-radius p-padding',
              }
              : undefined
          }
          columns={columns}
          data={data?.data?.teams || []}
          totalResults={data?.data?.pagination?.totalItems || 0}
          currentPage={page}
          totalPages={data?.data?.pagination?.totalPages || 0}
          onPageChange={setPage}
          emptyStateTitle={t("no_teams_title", "No Teams Found")}
          emptyMessage={t("no_teams_desc", "Define team groups to delegate responsibilities and manage workflows.")}
          emptyStateActionLabel={t('create_team', 'Create Team')}
          onEmptyStateAction={canCreate ? () => router.push(`${ROUTES.TEAMS}/create`) : undefined}
          isLoading={isLoading}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          onSort={(col) => {
            if (sortColumn === col) {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
            } else {
              setSortColumn(col)
              setSortOrder('asc')
            }
          }}
          enableSelection={canDelete && (isSystemAdmin ? !!data?.data?.teams?.some(t => t.isAdmin) : true)}
          onBulkDelete={async (rows) => {
            const ids = rows.map((r) => r._id)
            if (ids.length > 0) {
              try {
                await deleteTeam({ ids }).unwrap()
                toast.success(t('teams_deleted_successfully', 'Teams deleted successfully'))
              } catch (error) {
                const apiError = error as ApiError
                toast.error(apiError?.data?.message || t('something_went_wrong', 'Something went wrong'))
              }
            }
          }}
          rowsPerPage={limit}
          onRowsPerPageChange={(l) => {
            setLimit(l)
            setPage(1)
          }}
          showRowsPerPageAtTop={true}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('search_teams', 'Search teams by name or description...')}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setTeamsToDelete([])
          }}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title={t('delete_team_title', 'Delete Team')}
          description={t('delete_team_description', 'Are you sure you want to delete the selected team(s)? This action cannot be undone.')}
        />
      </div>
    </>
  )
}

export default TeamsPage
