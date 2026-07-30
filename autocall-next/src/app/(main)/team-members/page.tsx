'use client'

import { TeamMemberModal } from '@/components/features/team-members/TeamMemberModal'
import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { DataTable } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { useGetTeamsQuery } from '@/redux/api/teamApi'
import { useGetTeamMembersQuery, useRemoveTeamMemberMutation } from '@/redux/api/teamMemberApi'
import { useAppSelector } from '@/redux/hooks'
import { ApiError } from '@/types/api'
import { Column } from '@/types/table'
import { TeamMember } from '@/types/teamMember'
import { getMediaUrl } from '@/utils/auth'
import { formatDate } from '@/utils/validation-schemas'
import { Plus, Trash2, Users } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function TeamMembersPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canManage = hasPermission(PERMISSIONS.UPDATE_TEAMS)
  const canView = hasPermission(PERMISSIONS.VIEW_TEAMS)

  const user = useAppSelector((state) => state.auth.user)
  const isSystemAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idsToDelete, setIdsToDelete] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: teamsData, isLoading: isLoadingTeams } = useGetTeamsQuery({
    page: 1,
    limit: 1000,
  }, { skip: !canView })

  const { data: membersData, isLoading: isLoadingMembers } = useGetTeamMembersQuery(selectedTeam, {
    skip: !selectedTeam || !canView,
  })

  const [removeMember, { isLoading: isRemoving }] = useRemoveTeamMemberMutation()

  // Derive isAdmin flag from the currently selected team
  const selectedTeamObj = teamsData?.data?.teams?.find(t => t._id === selectedTeam)
  const selectedTeamIsAdmin = !!selectedTeamObj?.isAdmin

  const handleCreate = () => {
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setIdsToDelete([id])
    setIsDeleteModalOpen(true)
  }



  const confirmDelete = async () => {
    if (!selectedTeam || idsToDelete.length === 0) return
    try {
      const res = await removeMember({ teamId: selectedTeam, memberIds: idsToDelete }).unwrap()
      toast.success(res.message || t('team_member_removed_successfully', 'Team member removed successfully'))
      setIsDeleteModalOpen(false)
      setIdsToDelete([])
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_remove_team_member', 'Failed to remove team member'))
    }
  }

  const filteredMembers = useMemo(() => {
    let members = membersData?.data || []
    if (search) {
      const lowerSearch = search.toLowerCase()
      members = members.filter(m =>
        m.first_name.toLowerCase().includes(lowerSearch) ||
        m.last_name?.toLowerCase().includes(lowerSearch) ||
        m.email.toLowerCase().includes(lowerSearch)
      )
    }
    return members
  }, [membersData, search])

  // simple pagination since API doesn't paginate team members internally
  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * limit
    return filteredMembers.slice(start, start + limit)
  }, [filteredMembers, page, limit])

  const totalPages = Math.ceil(filteredMembers.length / limit)

  const columns: Column<TeamMember>[] = [
    {
      header: t('member', 'Member'),
      className: 'lg991:min-w-[300px] min-w-[200px]',
      accessorKey: 'first_name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 rounded-radius">
            <AvatarImage src={getMediaUrl(row.avatar)} />
            <AvatarFallback className={cn('text-lg font-semibold', getAvatarColorClass(row.first_name))}>
              {row.first_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-base text-title break-all whitespace-normal line-clamp-1">{row.first_name} {row.last_name}</span>
            <CopyEmailCell email={row.email} />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: t('phone_number', 'Phone Number'),
      className: 'lg991:min-w-[175px]',
      accessorKey: 'phone_number',
      cell: (row) => <span className="text-title/80 font-medium text-sm">{row.phone_number}</span>,
    },
    {
      header: t('status', 'Status'),
      className: 'lg991:min-w-[135px]',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <Badge className={cn('gap-1.5 px-3 font-semibold rounded-full border shadow-none capitalize',
          row.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-edit/15 dark:border-edit/10' : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-primary/10 dark:text-primary dark:border-primary/20'
        )}>
          {t(row.status)}
        </Badge>
      ),
    },
    {
      header: t('joined', 'Joined'),
      className: 'lg991:min-w-[187px]',
      accessorKey: 'created_at',
      sortable: true,
      cell: (row) => (
        <span className="text-title/80 font-bold text-sm">{formatDate(row.created_at)}</span>
      ),
    },
    {
      header: t('actions', 'Actions'),
      className: 'lg991:min-w-[100px]',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {canManage ? (
            <Button
              variant="ghost"
              size="icon"
              disabled={isSystemAdmin ? !selectedTeamIsAdmin : false}
              className={cn(
                "h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all",
                (isSystemAdmin && !selectedTeamIsAdmin) && "opacity-50 cursor-not-allowed hover:bg-destructive/10 hover:text-destructive"
              )}
              onClick={() => handleDelete(row._id)}
              title={t('remove_team_member', 'Remove')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground italic px-2">{t('view_only', 'View Only')}</span>
          )}
        </div>
      ),
    },
  ]

  if (!canView) {
    return <div className="p-8 text-center text-subtitle-color font-medium">{t('no_permission_to_view_members', 'You do not have permission to view team members.')}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-title">{t('team_members', 'Team Members')}</h1>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-bg-card border border-input-border-color p-4 sm:p-5 rounded-radius">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Label className="text-sm font-bold text-title whitespace-nowrap">{t('select_team', 'Select Team')}:</Label>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-full md:w-[300px] h-10 border-input-border-color rounded-radius focus:ring-1 focus:ring-primary/20 shadow-none">
              <SelectValue placeholder={isLoadingTeams ? t('loading', 'Loading...') : t('select_team_placeholder', 'Select a team to view its members')} />
            </SelectTrigger>
            <SelectContent className="rounded-radius border-input-border-color">
              {teamsData?.data?.teams?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 gap-3">
                  <span className="text-sm font-bold text-title">{t('no_team_available', 'No Teams Available')}</span>
                  <Link href={ROUTES.TEAMS} className="w-full">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-9 px-4 rounded-radius w-full flex items-center justify-center gap-2">
                      <Plus className="h-4 w-4" strokeWidth={3} />
                      {t('create_new_team', 'Create New Team')}
                    </Button>
                  </Link>
                </div>
              ) : (
                teamsData?.data?.teams?.map(team => (
                  <SelectItem key={team._id} value={team._id} className="rounded-radius">{team.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto flex items-center gap-3">
          <Button
            onClick={handleCreate}
            disabled={!selectedTeam || !canManage || (isSystemAdmin ? !selectedTeamIsAdmin : false)}
            className="bg-primary hover:bg-primary/90 text-white font-bold h-12 p-padding! rounded-radius w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            {t('create_team_member', 'Create Team Member')}
          </Button>
        </div>
      </div>

      {selectedTeam ? (
        <>
          <div className="mt-2">
            <DataTable
              columns={columns}
              data={paginatedMembers}
              totalResults={filteredMembers.length}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isLoadingMembers}
              emptyStateTitle={t("no_team_members_title", "No Team Members Found")}
              emptyMessage={t("no_team_members_desc", "Add team members to collaborate efficiently.")}
              sortColumn=""
              sortOrder="desc"
              onSort={() => { }}
              enableSelection={canManage && (isSystemAdmin ? selectedTeamIsAdmin : true)}
              onBulkDelete={async (rows) => {
                const ids = rows.map((r) => r._id)
                if (ids.length > 0) {
                  try {
                    const res = await removeMember({ teamId: selectedTeam, memberIds: ids }).unwrap()
                    toast.success(res.message || t('team_member_removed_successfully', 'Team member removed successfully'))
                  } catch (error) {
                    const apiError = error as ApiError
                    toast.error(apiError?.data?.message || t('failed_to_remove_team_member', 'Failed to remove team member'))
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
              searchPlaceholder={t('search_team_members', 'Search team members by name or email...')}
            />
          </div>

          <TeamMemberModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            teamId={selectedTeam}
          />

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title={t('remove_team_member_title', 'Remove Team Member')}
            description={t('remove_team_member_description', 'Are you sure you want to remove the selected team member(s)? This action cannot be undone.')}
            isLoading={isRemoving}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[450px] border border-input-border-color rounded-radius bg-white dark:bg-bg-card mt-6 p-8 text-center">
          <div className="w-15 h-15 mb-6 bg-primary/10 dark:bg-slate-800/50 rounded-radius flex items-center justify-center">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-title mb-2 tracking-tight">{t('no_team_selected', 'No Team Selected')}</h3>
          <p className="text-md text-subtitle-color max-w-[400px] mb-6">
            {t('no_team_selected_desc', 'Select a team from the dropdown above to manage its members, or create a new team to get started.')}
          </p>
          <Link href={ROUTES.TEAMS}>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-radius shadow-sm">
              <Plus className="h-4 w-4 mr-2" strokeWidth={3} />
              {t('manage_teams', 'Manage Teams')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
