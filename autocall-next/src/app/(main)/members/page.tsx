'use client'

import { BonusCreditsModal } from '@/components/features/members/BonusCreditsModal'
import { MemberModal } from '@/components/features/members/MemberModal'
import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { StatusSwitch } from '@/components/reusable/StatusSwitch'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PERMISSIONS } from '@/constants/permissions'
import { useDebounce } from '@/hooks/useDebounce'
import { useFileManagement } from '@/hooks/useFileManagement'
import { usePermission } from '@/hooks/usePermission'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { useDeleteUsersMutation, useGetUsersQuery, useUpdateUserStatusMutation } from '@/redux/api/userApi'
import { User } from '@/types'
import { ApiError } from '@/types/api'
import { Column } from '@/types/table'
import { getMediaUrl, authUtils } from '@/utils/auth'
import { formatDate } from '@/utils/validation-schemas'
import { ArrowRightLeft, Gift, Pencil, Plus, Trash2, MoreVertical } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useStartImpersonationMutation } from '@/redux/api/impersonationApi'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function UsersPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canManage = hasPermission(PERMISSIONS.UPDATE_MEMBERS)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading, refetch } = useGetUsersQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder,
  })

  const [deleteUsers, { isLoading: isDeleting }] = useDeleteUsersMutation()
  const [updateUserStatus] = useUpdateUserStatusMutation()
  const [startImpersonation] = useStartImpersonationMutation()
  const [isImpersonatingId, setIsImpersonatingId] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const { downloadFile, downloadTemplate, uploadFile } = useFileManagement()

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleBonus = (user: User) => {
    setSelectedUser(user)
    setIsBonusModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteUsers([idToDelete]).unwrap()
      toast.success(res.message || t('user_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_user'))
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await deleteUsers(ids).unwrap()
      toast.success(res.message || t('users_deleted_successfully'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_users'))
    }
  }

  const handleImpersonate = async (id: string) => {
    setIsImpersonatingId(id)
    try {
      const res = await startImpersonation({ targetUserId: id }).unwrap()
      authUtils.setToken(res.token)
      if (res.targetUser) {
        authUtils.setUser(res.targetUser)
      }
      toast.success(res.message || t('impersonation_started', 'Impersonation started successfully'))
      window.location.href = ROUTES.DASHBOARD
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_start_impersonation', 'Failed to start impersonation'))
    } finally {
      setIsImpersonatingId(null)
    }
  }

  const handleStatusChange = React.useCallback(
    async (id: string, currentStatus: boolean) => {
      try {
        const res = await updateUserStatus({ id, status: !currentStatus }).unwrap()
        toast.success(res.message || t(!currentStatus ? 'user_activated' : 'user_deactivated'))
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || t('failed_to_update_status'))
      }
    },
    [updateUserStatus, t],
  )

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const columns: Column<User>[] = [
    {
      header: t('member'),
      className: 'lg991:min-w-[300px] min-w-[200px]',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 rounded-radius">
            <AvatarImage src={getMediaUrl(row.avatar)} />
            <AvatarFallback className={cn('text-lg font-semibold', getAvatarColorClass(row.name))}>
              {row.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-base text-title">{row.name}</span>
            <CopyEmailCell email={row.email} />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: t('role'),
      className: 'lg991:min-w-[175px]',
      accessorKey: 'role',
      sortable: true,
      cell: (row) => {
        if (!row.role) return 'N/A';

        const role = row.role.toLowerCase();
        let styles = 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-primary/10 dark:text-primary dark:border-primary/20';

        if (role.includes('admin')) {
          styles = 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-primary/20 dark:text-primary dark:border-primary/30';
        } else if (role.includes('assigner')) {
          styles = 'bg-emerald-50 text-emerald-700 border-emerald-100';
        } else if (role.includes('user')) {
          styles = 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-primary/20 dark:text-primary dark:border-primary/30';
        }

        return (
          <Badge className={cn('gap-1.5 px-3 font-semibold rounded-full border shadow-none capitalize', styles)}>
            {t(row.role)}
          </Badge>
        );
      },
    },
    {
      header: t('status'),
      className: 'lg991:min-w-[135px]',
      accessorKey: 'isActive',
      sortable: true,
      cell: (row) => (
        <StatusSwitch
          isActive={row.isActive}
          canManage={canManage}
          onToggle={() => handleStatusChange(row.id, row.isActive)}
        />
      ),
    },
    {
      header: t('last_login'),
      className: 'lg991:min-w-[187px]',
      accessorKey: 'lastLogin',
      sortable: true,
      cell: (row) => (
        <span className="text-subtitle-color font-medium text-md">{row.lastLogin ? formatDate(row.lastLogin) : t('never')}</span>
      ),
    },
    {
      header: t('actions'),
      className: 'lg991:min-w-[175px]',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {canManage ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg border-none bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
                onClick={() => handleEdit(row)}
                title={t('edit')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg border-none bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                onClick={() => handleDelete(row.id)}
                title={t('delete')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg bg-primary/10 border-none text-primary hover:text-white hover:bg-primary transition-all"
                    title={t('more_actions', 'More Actions')}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-lg border border-input-border-color bg-bg-card p-2 shadow-xl! ">
                  {!row.role?.toLowerCase().includes('admin') && (
                    <DropdownMenuItem
                      onClick={() => handleImpersonate(row.id)}
                      disabled={isImpersonatingId === row.id}
                      className="cursor-pointer flex items-center gap-2.5 rounded-lg px-3 py-2 text-md font-medium text-orange-600 hover:bg-orange-50 focus:bg-orange-50 dark:text-orange-500 dark:hover:bg-orange-500/10 dark:focus:bg-orange-500/10 transition-colors"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      {t('impersonate_user', 'Impersonate User')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleBonus(row)}
                    className="cursor-pointer flex items-center gap-2.5 rounded-lg px-3 py-2 text-md font-medium text-purple-600 hover:bg-purple-50 focus:bg-purple-50 dark:text-purple-500 dark:hover:bg-purple-500/10 dark:focus:bg-purple-500/10 transition-colors"
                  >
                    <Gift className="h-4 w-4" />
                    {t('add_bonus_credits', 'Add Bonus Credits')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic px-2">{t('view_only')}</span>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <TableLayout
        title={t('members')}
        showBackButton={false}
        primaryAction={
          canManage
            ? {
              label: t('create_member'),
              onClick: handleCreate,
              icon: <Plus className="h-4 w-4" strokeWidth={2.5} />,
              className: 'bg-primary text-white p-(--padding) font-medium transition-all duration-300 rounded-radius hover-button px-6',
            }
            : undefined
        }
        columns={columns}
        data={data?.users || []}
        totalResults={data?.total || 0}
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyStateTitle={t("no_members_title", "No Members Found")}
        emptyMessage={t("no_members_desc", "Invite collaborators to assign roles, share access, and manage tasks.")}
        emptyStateActionLabel={t('create_member')}
        onEmptyStateAction={canManage ? handleCreate : undefined}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={canManage}
        onBulkDelete={(rows) => {
          const ids = rows.map((r) => r.id)
          handleBulkDelete(ids)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_members')}
        onExportExcel={() =>
          downloadFile('/api/user/export', { format: 'excel', ...(search ? { search } : {}) }, 'users')
        }
        onExportCSV={() => downloadFile('/api/user/export', { format: 'csv', ...(search ? { search } : {}) }, 'users')}
        onImport={async (file) => {
          await uploadFile('/api/user/import', file).catch(() => { })
          refetch()
        }}
        onDownloadTemplate={() => downloadTemplate('/api/user/import-template', 'excel', 'users_template')}
      />

      <MemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} />
      <BonusCreditsModal isOpen={isBonusModalOpen} onClose={() => setIsBonusModalOpen(false)} user={selectedUser} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_user_title') || t('delete_confirmation')}
        description={t('delete_user_description') || t('delete_confirmation_message')}
        isLoading={isDeleting}
      />
    </>
  )
}
