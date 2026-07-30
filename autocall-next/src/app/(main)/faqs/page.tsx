'use client'

import { FaqModal } from '@/components/features/faqs/FaqModal'
import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS } from '@/constants/permissions'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useDeleteFaqsMutation, useGetFaqsQuery, useUpdateFaqStatusMutation } from '@/redux/api/faqApi'
import { ApiError, Faq } from '@/types/api'
import { formatDate } from '@/utils/validation-schemas'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function HelpCenterPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canManage = hasPermission(PERMISSIONS.UPDATE_FAQS)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading } = useGetFaqsQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder,
  })

  const [deleteFaqs, { isLoading: isDeleting }] = useDeleteFaqsMutation()
  const [updateFaqStatus] = useUpdateFaqStatusMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const handleEdit = (faq: Faq) => {
    setSelectedFaq(faq)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedFaq(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteFaqs([idToDelete]).unwrap()
      toast.success(res.message || t('faq_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_faq'))
    }
  }

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      const res = await updateFaqStatus({ id, status: !currentStatus }).unwrap()
      toast.success(res.message || t(!currentStatus ? 'faq_activated' : 'faq_deactivated'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_status'))
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const columns: Column<Faq>[] = [
    {
      header: t("title"),
      accessorKey: "title",
      className: "font-semibold text-title-color dark:text-white w-[25%] xl1580:min-w-[250px]",
      sortable: true,
      cell: (row) => (
        <p className="line-clamp-2 text-title text-md font-medium leading-relaxed break-all whitespace-normal" title={row.title}>
          {row.title}
        </p>
      ),
    },
    {
      header: t("description"),
      accessorKey: "description",
      cell: (row) => (
        <p className="line-clamp-2 text-subtitle-color/80 text-md leading-relaxed" title={row.description}>
          {row.description}
        </p>
      ),
      className: "w-[35%] xl1580:min-w-[285px]",
    },
    {
      header: t("status"),
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          {canManage ? <Switch checked={row.status} onCheckedChange={() => handleStatusChange(row.id, row.status)} className="shadow-sm bg-switch-background dark:bg-switch-background " /> : <Switch checked={row.status} disabled />}
        </div>
      ),
      className: "w-[15%]",
    },
    {
      header: t("last_updated"),
      className: "xl1580:min-w-[180px] w-[15%]",
      accessorKey: "updated_at",
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-subtitle-color  font-medium text-md">{formatDate(row.updated_at)}</span>
        </div>
      ),
    },
    {
      header: t("actions"),
      cell: (row) => (
        <div className="flex items-center gap-3">
          {canManage ? (
            <>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all" onClick={() => handleEdit(row)} title={t("edit")}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all" onClick={() => handleDelete(row.id)} title={t("delete")}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground/30 font-extrabold uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg">{t("view_only")}</span>
          )}
        </div>
      ),
      className: " w-[10%]",
    },
  ];

  return (
    <>
      <TableLayout
        title={t('faq')}
        primaryAction={
          canManage
            ? {
              label: t('create_faq'),
              onClick: handleCreate,
              icon: <Plus className="h-5 w-5" strokeWidth={2.5} />,
              className: 'bg-primary text-white font-bold transition-all duration-300 rounded-radius p-padding',
            }
            : undefined
        }
        columns={columns}
        data={data?.faqs || []}
        totalResults={data?.total || 0}
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyStateTitle={t("no_faqs_title", "No FAQs Found")}
        emptyMessage={t("no_faqs_desc", "Compile common questions and answers to reduce support tickets.")}
        emptyStateActionLabel={t('create_faq')}
        onEmptyStateAction={canManage ? handleCreate : undefined}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={canManage}
        onBulkDelete={async (rows) => {
          const ids = rows.map((r) => r.id)
          try {
            const res = await deleteFaqs(ids).unwrap()
            toast.success(res.message || t('faqs_deleted_successfully'))
          } catch (error) {
            const apiError = error as ApiError
            toast.error(apiError?.data?.message || t('failed_to_delete_faqs'))
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
        searchPlaceholder={t('search_faqs')}
        showBackButton={false}
      />

      <FaqModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} faq={selectedFaq} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_faq_title') || t('delete_confirmation')}
        description={t('delete_faq_description') || t('delete_confirmation_message')}
        isLoading={isDeleting}
      />
    </>
  )
}
