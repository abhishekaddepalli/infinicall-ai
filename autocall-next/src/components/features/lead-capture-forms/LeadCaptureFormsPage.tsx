'use client'

import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ROUTES } from '@/constants/routes'
import { useDeleteFormsMutation, useGetFormsQuery, useUpdateFormMutation } from '@/redux/api/formApi'
import { Form } from '@/types/form'
import { FileText, Pencil, Plus, Trash2, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormResponsesModal } from './FormResponsesModal'

export default function LeadCaptureFormsPage() {
  const { t } = useTranslation()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const debouncedSearch = search // Use debounce if wanted, or just search. I'll stick to basic search state.
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data: response, isLoading } = useGetFormsQuery({
    page,
    limit,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter,
    sortBy: sortColumn,
    sortOrder: sortOrder,
  })
  const [updateForm] = useUpdateFormMutation()
  const [deleteForms, { isLoading: isDeleting }] = useDeleteFormsMutation()

  const [idToDelete, setIdToDelete] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [viewResponsesFormId, setViewResponsesFormId] = useState<string | null>(null)

  const forms = useMemo(() => response?.data || [], [response])

  const totalResults = (response as any)?.pagination?.total || forms.length
  const totalPages = (response as any)?.pagination?.pages || 1

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const handleEdit = (form: Form) => {
    const formId = form.id || form._id
    if (formId) {
      router.push(`${ROUTES.LEAD_CAPTURE_FORMS}/${formId}`)
    }
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      await deleteForms({ formIds: [idToDelete] }).unwrap()
      toast.success(t('form_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setIdToDelete(null)
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_delete_form'))
    }
  }

  const handleStatusChange = async (form: Form) => {
    try {
      const formId = form.id || form._id
      if (!formId) return
      const newStatus = form.status === 'active' ? 'inactive' : 'active'
      await updateForm({
        id: formId,
        data: { status: newStatus },
      }).unwrap()
      toast.success(t('status_updated_successfully'))
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_update_status'))
    }
  }

  const columns: Column<Form>[] = [
    {
      header: t('form_name'),
      accessorKey: 'name',
      sortable: true,
      className: 'font-bold text-title-color dark:text-white w-[30%] xl1199:min-w-[400px]',
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="break-all whitespace-normal line-clamp-1 font-medium text-base text-title tracking-tight" title={row.name}>
            {row.name}
          </span>
          {row.description && (
            <span className="break-all whitespace-normal line-clamp-2 text-md text-subtitle-color  font-medium ">
              {row.description}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t('fields_count'),
      className: 'w-[15%] xl1199:min-w-[200px]',
      cell: (row) => (
        <span className="text-sm font-semibold text-subtitle-color">
          {row.fields?.length || 0} {t('fields')}
        </span>
      ),
    },
    {
      header: t('status'),
      accessorKey: 'status',
      sortable: true,
      className: 'w-[15%] xl1199:min-w-[150px]',
      cell: (row) => (
        <Switch
          checked={row.status === 'active'}
          onCheckedChange={() => handleStatusChange(row)}
          className="data-[state=checked]:bg-switch-background shadow-sm"
        />
      ),
    },
    {
      header: t('created_at'),
      accessorKey: 'created_at',
      sortable: true,
      className: 'w-[20%] xl1199:min-w-[130px]',
      cell: (row) => (
        <span className="text-subtitle-color font-medium text-sm">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: t('actions'),
      className: 'text-right w-[20%] xl1199:min-w-[150px]',
      cell: (row) => {
        const formId = row.id || row._id
        return (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              onClick={() => formId && setViewResponsesFormId(formId)}
              title={t('view_responses', 'View Responses')}
            >
              <Eye className="h-4 w-4" />
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
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => formId && handleDelete(formId)}
              title={t('delete')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <TableLayout
        title={t('lead_capture_forms')}
        headerIcon={<FileText className="w-8 h-8 text-primary" />}
        primaryAction={{
          label: t('add_form'),
          onClick: () => router.push(`${ROUTES.LEAD_CAPTURE_FORMS}/new`),
          icon: <Plus className="h-5 w-5" strokeWidth={2.5} />,
          className: 'bg-primary  text-white font-medium rounded-radius p-padding text-md',
        }}
        columns={columns}
        data={forms}
        totalResults={totalResults}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyStateTitle={t("no_forms_title", "No Lead Capture Forms Found")}
        emptyMessage={t('no_forms_desc', "Design and embed forms to start collecting visitor information.")}
        emptyStateActionLabel={t('add_form')}
        onEmptyStateAction={() => router.push(`${ROUTES.LEAD_CAPTURE_FORMS}/new`)}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        searchPlaceholder={t('search_forms')}
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
        enableSelection={true}
        onBulkDelete={async (rows) => {
          const formIds = rows.map((r) => r.id || r._id).filter(Boolean) as string[]
          if (formIds.length === 0) return
          try {
            await deleteForms({ formIds }).unwrap()
            toast.success(t('forms_deleted_successfully'))
          } catch (error: any) {
            toast.error(error?.data?.message || t('failed_to_delete_forms'))
          }
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        onBack={() => router.push(ROUTES.TOOLBOX)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_form_title')}
        description={t('delete_form_description', {
          defaultValue: 'Are you sure you want to delete this lead form? This action cannot be undone.',
        })}
        isLoading={isDeleting}
      />

      <FormResponsesModal
        isOpen={!!viewResponsesFormId}
        onClose={() => setViewResponsesFormId(null)}
        formId={viewResponsesFormId}
      />
    </>
  )
}
