'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import {
  useCreateContactGroupMutation,
  useDeleteContactGroupMutation,
  useGetContactGroupsQuery,
  useUpdateContactGroupMutation
} from '@/redux/api/contactGroupApi'
import { ContactGroup, CreateContactGroupPayload } from '@/types/contact-group'
import { Column } from '@/types/table'
import { Contact, Edit2, Plus, Trash2, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ContactGroupModal } from './ContactGroupModal'

const ContactGroupPage = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<ContactGroup | null>(null)

  const canView = hasPermission(PERMISSIONS.VIEW_CONTACT_GROUP)
  const canCreate = hasPermission(PERMISSIONS.CREATE_CONTACT_GROUP)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_CONTACT_GROUP)
  const canDelete = hasPermission(PERMISSIONS.DELETE_CONTACT_GROUP)

  const { data: groupsData, isLoading, isFetching } = useGetContactGroupsQuery(
    { search, page, limit, sortBy: sortColumn, sortOrder: sortOrder },
    { skip: !canView }
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
  const [createGroup, { isLoading: isCreating }] = useCreateContactGroupMutation()
  const [updateGroup, { isLoading: isUpdating }] = useUpdateContactGroupMutation()
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteContactGroupMutation()

  const handleCreateOrUpdate = async (payload: CreateContactGroupPayload) => {
    try {
      if (selectedGroup) {
        const id = selectedGroup._id || selectedGroup.id
        if (!id) return
        const response = await updateGroup({ id, data: payload }).unwrap()
        toast.success(response?.message || t('group_updated_successfully'))
      } else {
        const response = await createGroup(payload).unwrap()
        toast.success(response?.message || t('group_created_successfully'))
      }
      setIsModalOpen(false)
      setSelectedGroup(null)
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || t('operation_failed'))
    }
  }

  const handleDelete = async () => {
    if (!selectedGroup) return
    try {
      const id = selectedGroup._id || selectedGroup.id
      if (!id) return
      const response = await deleteGroup(id).unwrap()
      toast.success(response?.message || t('group_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setSelectedGroup(null)
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || t('delete_failed'))
    }
  }

  const columns: Column<ContactGroup>[] = useMemo(() => [
    {
      header: t('group_name'),
      accessorKey: 'group_name',
      sortable: true,
      className: 'min-w-[260px]',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Contact className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-base text-title line-clamp-1 break-all whitespace-normal">{row.group_name}</p>
            <p className="text-md text-subtitle-color line-clamp-1 break-all whitespace-normal">
              {row.group_description || t('no_description')}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: t('total_contacts'),
      className: 'min-w-[150px]',
      cell: (row) => <span className="font-medium tetx-md text-title break-all whitespace-normal line-clamp-1">{Array.isArray(row.group_contacts) ? row.group_contacts.length : 0} Contacts</span>,
    },
    {
      header: t('actions'),
      className: 'min-w-[180px]',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {canUpdate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedGroup(row)
                setIsModalOpen(true)
              }}
              className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedGroup(row)
                setIsDeleteModalOpen(true)
              }}
              className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ], [t, canUpdate, canDelete])

  if (!canView) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t('access_restricted')}
      </div>
    )
  }

  return (
    <>
      <TableLayout
        title={t('contact_group')}
        headerIcon={<Users className="w-8 h-8 text-primary" strokeWidth={2.5} />}
        primaryAction={canCreate ? {
          label: t('create_contact_group'),
          icon: <Plus className="w-4 h-4" strokeWidth={2.5} />,
          onClick: () => {
            setSelectedGroup(null)
            setIsModalOpen(true)
          },
        } : undefined}
        columns={columns}
        data={groupsData?.data || []}
        isLoading={isLoading || isFetching}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_contact_groups')}
        emptyStateTitle={t("no_contact_groups_title", "No Contact Groups Found")}
        emptyMessage={t("no_contact_groups_desc", "Create groups to organize your audience and target specific demographics.")}
        emptyStateActionLabel={t('create_contact_group')}
        onEmptyStateAction={canCreate ? () => {
          setSelectedGroup(null)
          setIsModalOpen(true)
        } : undefined}
        totalResults={groupsData?.pagination?.total || 0}
        currentPage={page}
        totalPages={groupsData?.pagination?.pages || 1}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
        showRowsPerPageAtTop={true}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        showBackButton={false}
      />

      <ContactGroupModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedGroup(null)
        }}
        initialData={selectedGroup}
        onConfirm={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedGroup(null)
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={t('delete_contact_group_title')}
        description={t('delete_contact_group_warning')}
      />
    </>
  )
}

export default ContactGroupPage
