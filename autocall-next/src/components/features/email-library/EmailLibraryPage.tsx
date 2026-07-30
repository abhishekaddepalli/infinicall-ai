'use client'

import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  useBulkDeleteEmailLibraryTemplatesMutation,
  useGetEmailLibraryTemplatesQuery,
} from '@/redux/api/emailLibraryApi'
import { EmailTemplate } from '@/types/email-library'
import { Column } from '@/types/table'
import { format } from 'date-fns'
import { Edit2, Eye, MailOpen, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import EmailLibraryModal from './EmailLibraryModal'
import EmailLibraryViewModal from './EmailLibraryViewModal'

export default function EmailLibraryPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | undefined>(undefined)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [templateToViewId, setTemplateToViewId] = useState<string | undefined>(undefined)

  const { data: response, isLoading, isFetching } = useGetEmailLibraryTemplatesQuery({
    page,
    limit,
    search,
  })

  const [bulkDelete, { isLoading: isDeleting }] = useBulkDeleteEmailLibraryTemplatesMutation()

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsModalOpen(true)
  }

  const handleView = (template: EmailTemplate) => {
    setTemplateToViewId(template._id || template.id)
    setIsViewModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedTemplate(undefined)
    setIsModalOpen(true)
  }

  const handleBulkDeleteClick = async (selectedRows: EmailTemplate[]) => {
    if (selectedRows.length === 0) return
    const ids = selectedRows.map(r => r._id || r.id)
    try {
      await bulkDelete({ ids }).unwrap()
      toast.success(t('email_templates_deleted_successfully', 'Email templates deleted successfully'))
    } catch (error) {
      toast.error(t('failed_to_delete_email_templates', 'Failed to delete email templates'))
    }
  }

  const columns: Column<EmailTemplate>[] = [
    {
      header: t('name', 'Name'),
      className: "xl1580:min-w-[240px]",
      sortable: true,
      sortKey: 'name',
      cell: (row) => <span className="font-bold text-title text-base break-all whitespace-normal line-clamp-2">{row.name}</span>,
    },
    {
      header: t('subject', 'Subject'),
      className: "xl1580:min-w-[250px]",
      sortable: true,
      sortKey: 'subject',
      cell: (row) => <span className="text-md font-medium text-subtitle-color break-all whitespace-normal line-clamp-2">{row.subject}</span>,
    },
    {
      header: t('type', 'Type'),
      className: "xl1580:min-w-[150px]",
      sortable: true,
      sortKey: 'type',
      cell: (row) => (
        <Badge variant="outline" className="capitalize border-input-border-color text-title bg-subcard">
          {row.type}
        </Badge>
      ),
    },
    {
      header: t('status', 'Status'),
      className: "xl1580:min-w-[120px]",
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
      className: "xl1580:min-w-[180px]",
      sortable: true,
      sortKey: 'created_at',
      cell: (row) => <span className="text-md text-title font-semibold">{row.created_at ? format(new Date(row.created_at), 'MMM dd, yyyy') : '-'}</span>,
    },
    {
      header: t('action', 'Action'),
      className: "xl1580:min-w-[140px]",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleView(row)} className="h-9 w-9 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const totalPages = response?.total ? Math.ceil(response.total / limit) : 1

  return (
    <>
      <TableLayout
        title={t('email_library', 'Email Library')}
        headerIcon={<MailOpen className="w-8 h-8 text-primary" />}
        columns={columns}
        data={response?.data || []}
        isLoading={isLoading || isFetching}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        searchPlaceholder={t('search_email_templates', 'Search email templates...')}
        emptyStateTitle={t('no_email_templates_found', 'No Email Templates Found')}
        emptyMessage={t('no_email_templates_desc', 'Create your first email template to get started.')}
        showBackButton={false}
        enableSelection={true}
        onBulkDelete={handleBulkDeleteClick}
        currentPage={page}
        totalPages={totalPages}
        totalResults={response?.total || 0}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(val) => {
          setLimit(val)
          setPage(1)
        }}
        filters={
          <div className="flex items-center gap-2">
            <Button onClick={handleCreate} className="gap-2 h-11 p-padding! text-sm font-semibold rounded-radius bg-primary text-white">
              <Plus className="w-5 h-5" />
              {t('create_template', 'Create Template')}
            </Button>
          </div>
        }
      />

      <EmailLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templateToEdit={selectedTemplate}
      />

      <EmailLibraryViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        templateId={templateToViewId}
      />
    </>
  )
}
