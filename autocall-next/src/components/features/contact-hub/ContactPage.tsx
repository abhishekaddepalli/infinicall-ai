'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import {
  useBulkDeleteContactsMutation,
  useCreateContactMutation,
  useGetContactsQuery,
  useImportContactsMutation,
  useLazyDownloadImportTemplateQuery,
  useLazyExportContactsQuery,
  useUpdateContactMutation
} from '@/redux/api/contactApi'
import {
  Contact,
  CreateContactPayload
} from '@/types/contact'
import { Column } from '@/types/table'
import {
  Edit2,
  Plus,
  Trash2,
  User
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ContactModal } from './ContactModal'

const ContactPage = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { data: contactsData, isLoading, isFetching } = useGetContactsQuery({
    search,
    page,
    limit,
    sortBy: sortColumn,
    sortOrder: sortOrder
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation()
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation()
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteContactsMutation()
  const [importContacts] = useImportContactsMutation()
  const [triggerExport] = useLazyExportContactsQuery()
  const [triggerDownloadTemplate] = useLazyDownloadImportTemplateQuery()

  const handleAddOrUpdate = async (data: CreateContactPayload) => {
    try {
      if (selectedContact) {
        const id = selectedContact._id || selectedContact.id
        await updateContact({ id, data }).unwrap()
        toast.success(t('contact_updated_successfully'))
      } else {
        await createContact(data).unwrap()
        toast.success(t('contact_created_successfully'))
      }
      setIsModalOpen(false)
      setSelectedContact(null)
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || t('operation_failed'))
    }
  }

  const handleDelete = async () => {
    if (!selectedContact) return
    try {
      const id = selectedContact._id || selectedContact.id
      await bulkDelete({ contactIds: [id] }).unwrap()
      toast.success(t('contact_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setSelectedContact(null)
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || t('delete_failed'))
    }
  }

  const handleBulkDelete = async (rows: Contact[]) => {
    const ids = rows.map(r => r._id || r.id)
    try {
      await bulkDelete({ contactIds: ids }).unwrap()
      toast.success(t('contacts_deleted_successfully'))
      setSelectedIds([])
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || t('bulk_delete_failed'))
    }
  }

  const handleImport = async (file: File) => {
    const formData = new FormData()
    formData.append('contactFile', file)
    try {
      const res = await importContacts(formData).unwrap()
      toast.success(res.message)
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || t('import_failed'))
    }
  }

  const handleSelectionChange = useCallback((rows: Contact[]) => {
    setSelectedIds(rows.map(r => r._id || r.id))
  }, [])


  const handleExport = async () => {
    try {
      const blob = await triggerExport().unwrap()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'contacts.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error(t('export_failed'))
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const blob = await triggerDownloadTemplate().unwrap()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'import-template.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error(t('download_template_failed', 'Failed to download template'))
    }
  }

  const columns: Column<Contact>[] = [
    {
      header: t("contact_name"),
      accessorKey: 'first_name',
      sortable: true,
      className: "xl1199:min-w-[375px]",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-md text-title break-all whitespace-normal line-clamp-2">{row.first_name || row.last_name ? `${row.first_name} ${row.last_name}` : t("unnamed_contact")}</span>
          </div>
        </div>
      ),
    },
    {
      header: t("phone_number"),
      accessorKey: 'phone_number',
      sortable: true,
      className: "xl1199:min-w-[225px]",
      cell: (row) => <div className="flex items-center gap-2 text-subtitle-color font-medium text-md break-all whitespace-normal line-clamp-2">{row.phone_number}</div>,
    },
    {
      header: t("email"),
      accessorKey: 'email',
      sortable: true,
      className: "xl1199:min-w-[305px]",
      cell: (row) => <div className="flex items-center gap-2 text-subtitle-color font-medium text-md break-all whitespace-normal line-clamp-2">{row.email ? <>{row.email}</> : <span className="text-muted-foreground/20 text-xs ">{t("no_email")}</span>}</div>,
    },
    {
      header: t("actions"),
      className: "text-right xl1199:min-w-[210px]",
      cell: (row) => (
        <div className="flex items-center justify-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedContact(row);
              setIsModalOpen(true);
            }}
            className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedContact(row);
              setIsDeleteModalOpen(true);
            }}
            className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <TableLayout
        title={t('contact_hub')}
        headerIcon={<User className="w-8 h-8 text-primary" />}
        primaryAction={{
          label: t('create_contact'),
          icon: <Plus className="w-4 h-4" />,
          onClick: () => { setSelectedContact(null); setIsModalOpen(true); }
        }}
        columns={columns}
        data={contactsData?.data || []}
        isLoading={isLoading || isFetching}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_contacts')}
        emptyStateTitle={t("no_contacts_title", "No Contacts Found")}
        emptyMessage={t("no_contacts_desc", "Import or manually add contacts to manage your audience.")}
        emptyStateActionLabel={t('create_contact')}
        onEmptyStateAction={() => { setSelectedContact(null); setIsModalOpen(true); }}
        totalResults={contactsData?.pagination?.total || 0}
        currentPage={page}
        totalPages={contactsData?.pagination?.pages || 1}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
        showRowsPerPageAtTop={true}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection
        onSelectionChange={handleSelectionChange}
        onBulkDelete={handleBulkDelete}
        onExportCSV={handleExport}
        onImport={handleImport}
        onDownloadTemplate={handleDownloadTemplate}
        showBackButton={false}
      />

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedContact(null); }}
        onConfirm={handleAddOrUpdate}
        initialData={selectedContact}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedContact(null); }}
        onConfirm={handleDelete}
        isLoading={isBulkDeleting}
        title={t('delete_contact_title')}
        description={t('delete_contact_warning')}
      />
    </>
  )
}

export default ContactPage
