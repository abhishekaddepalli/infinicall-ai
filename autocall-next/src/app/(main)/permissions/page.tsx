'use client'

import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import {
  useDeleteRoleMutation,
  useGetRolesQuery
} from '@/redux/api/roleApi'
import { ApiError } from '@/types/api'
import { Role } from '@/types/role'
import { formatDate } from '@/utils/validation-schemas'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const RolesPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const canManage = hasPermission(PERMISSIONS.UPDATE_ROLES)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [rolesToDelete, setRolesToDelete] = useState<string[]>([])

  const { data, isLoading } = useGetRolesQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder.toUpperCase(),
  })

  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation()

  const handleDeleteConfirm = async () => {
    try {
      const arg = rolesToDelete.length === 1 ? rolesToDelete[0] : { ids: rolesToDelete }
      await deleteRole(arg).unwrap()
      toast.success(t('roles_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setRolesToDelete([])
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const columns: Column<Role>[] = [
    {
      header: t('name'),
      className: 'xl1199:min-w-[200px]',
      accessorKey: 'name',
      sortable: true,
      cell: (row: Role) => (
        <div className="flex items-center gap-3">
          <div
            className={cn('w-10 h-10 rounded-radius flex items-center justify-center text-lg font-semibold bg-primary/10 text-primary')}
          >
            {row.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-md text-title">{t(row.name)}</span>
        </div>
      ),
    },
    {
      header: t('description'),
      className: 'xl1199:min-w-[360px]',
      accessorKey: 'description',
      cell: (row: Role) => <span className="text-subtitle-color text-md break-all whitespace-normal line-clamp-2">{row.description || '-'}</span>,
    },
    {
      header: t('created_at'),
      className: 'xl1199:min-w-[205px]',
      accessorKey: 'created_at',
      sortable: true,
      cell: (row: Role) => (
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-md text-subtitle-color font-medium">
            {formatDate(row.created_at)}
          </div>
        </div>
      ),
    },
    {
      header: t('action'),
      className: 'xl1199:min-w-[145px]',
      cell: (row: Role) => {
        return (
          <div className="flex items-center gap-2">
            {canManage ? (
              <>
                <Button variant="ghost" size="icon" title={t("edit_role")} className={cn("h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all")} onClick={() => router.push(`${ROUTES.PERMISSIONS}/edit/${row._id}`)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title={t("delete_role")}
                  disabled={row.system_reserved || row.name === "super_admin"}
                  className={cn("h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all", (row.system_reserved || row.name === "super_admin") && "disabled:opacity-50 disabled:cursor-not-allowed")}
                  onClick={() => {
                    setRolesToDelete([row._id]);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <span className="text-[10px] text-muted-foreground italic px-2">{t("view_only")}</span>
            )}
          </div>
        );
      },
    },
  ]

  return (
    <>
      <div className="space-y-8">
        <TableLayout
          title={t('permissions')}
          showBackButton={false}
          primaryAction={
            canManage
              ? {
                label: t('create_role'),
                onClick: () => router.push(`${ROUTES.PERMISSIONS}/add`),
                icon: <Plus className="w-5 h-5 text-white" strokeWidth={2.5}  />,
                className: 'bg-primary  text-white font-medium transition-all duration-300 rounded-radius p-padding',
              }
              : undefined
          }
          columns={columns}
          data={data?.data?.roles || []}
          totalResults={data?.data?.pagination?.totalItems || 0}
          currentPage={page}
          totalPages={data?.data?.pagination?.totalPages || 0}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyStateTitle={t("no_roles_title", "No Roles Found")}
          emptyMessage={t("no_roles_desc", "Create roles with specific access boundaries for your team.")}
          emptyStateActionLabel={t('create_role')}
          onEmptyStateAction={canManage ? () => router.push(`${ROUTES.PERMISSIONS}/add`) : undefined}
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
          enableSelection={canManage}
          onBulkDelete={(rows) => {
            const ids = rows.filter((r) => !r.system_reserved && r.name !== 'super_admin').map((r) => r._id)
            if (ids.length > 0) {
              setRolesToDelete(ids)
              setIsDeleteModalOpen(true)
            } else {
              toast.error(t('cannot_delete_system_reserved_roles'))
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
          searchPlaceholder={t('search_roles')}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setRolesToDelete([])
          }}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title={t('delete_role_title')}
          description={t('delete_role_description')}
        />
      </div>
    </>
  )
}

export default RolesPage
