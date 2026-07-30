'use client'

import { Column, DataTable } from '@/components/reusable/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GoogleSheet, GoogleSheetsTableProps } from '@/types/google-workspace'
import { format } from 'date-fns'
import { CloudUpload, Edit2, Eye, Link, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteSourceModal from '../DeleteSourceModal'
import { useGoogleSheets } from './hooks/useGoogleSheets'

export default function GoogleSheetsTable({ onEdit, onView }: GoogleSheetsTableProps) {
  const { t } = useTranslation()
  const { sheets, isLoading, handleDelete, handleBulkDelete, handleLinkSheet, isLinking } = useGoogleSheets()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Single delete state
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; sheetId: string | null }>({ open: false, sheetId: null })
  const [isDeleting, setIsDeleting] = useState(false)

  // Bulk delete state
  const [bulkDeleteModal, setBulkDeleteModal] = useState<{ open: boolean; ids: string[] }>({ open: false, ids: [] })
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const openDeleteModal = (id: string) => setDeleteModal({ open: true, sheetId: id })
  const closeDeleteModal = () => !isDeleting && setDeleteModal({ open: false, sheetId: null })

  const confirmDelete = async (deleteFrom: 'system' | 'google') => {
    if (!deleteModal.sheetId) return
    setIsDeleting(true)
    try {
      await handleDelete(deleteModal.sheetId, deleteFrom)
      setDeleteModal({ open: false, sheetId: null })
    } catch { /* handled in hook */ } finally {
      setIsDeleting(false)
    }
  }

  const openBulkDeleteModal = (ids: string[]) => setBulkDeleteModal({ open: true, ids })
  const closeBulkDeleteModal = () => !isBulkDeleting && setBulkDeleteModal({ open: false, ids: [] })

  const confirmBulkDelete = async (deleteFrom: 'system' | 'google') => {
    if (bulkDeleteModal.ids.length === 0) return
    setIsBulkDeleting(true)
    try {
      await handleBulkDelete(bulkDeleteModal.ids, deleteFrom)
      setBulkDeleteModal({ open: false, ids: [] })
    } catch { /* handled in hook */ } finally {
      setIsBulkDeleting(false)
    }
  }

  const columns: Column<GoogleSheet>[] = [
    {
      header: 'Connection Name',
      accessorKey: 'name',
      sortable: true,
      className: 'font-semibold text-title xl1580:min-w-[350px]',
      cell: (row) => <span className="text-subtitle-color break-all whitespace-normal line-clamp-2">{row.name}</span>
    },
    {
      header: 'Spreadsheet ID',
      className: 'xl1580:min-w-[435px]',
      accessorKey: 'spreadsheet_id',
      sortable: true,
      cell: (row) => (
        <a
          href={`https://docs.google.com/spreadsheets/d/${row.spreadsheet_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium flex items-center gap-1 break-all whitespace-normal line-clamp-2"
        >
          {row.spreadsheet_id}
          <Link className="h-3 w-3 shrink-0" />
        </a>
      )
    },
    {
      header: 'Status',
      className: 'xl1580:min-w-[150px]',
      accessorKey: 'is_active',
      sortable: true,
      cell: (row) => (
        <Badge className={`rounded-lg border px-2.5 py-0.5 text-[10px] uppercase font-black tracking-wide ${row.is_active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Linked Status',
      className: 'xl1580:min-w-[180px]',
      accessorKey: 'is_linked',
      sortable: true,
      cell: (row) => (
        <Badge className={`rounded-lg border px-2.5 py-0.5 text-[10px] uppercase font-black tracking-wide ${row.is_linked ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
          {row.is_linked ? 'Linked' : 'Unlinked'}
        </Badge>
      ),
    },
    {
      header: 'Created At',
      className: 'xl1580:min-w-[200px]',
      accessorKey: 'created_at',
      sortable: true,
      cell: (row) => row.created_at ? format(new Date(row.created_at), 'MMM d, yyyy') : '—',
    },
    {
      header: 'Actions',
      className: 'xl1580:min-w-[200px]',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onView(row)}
            className="h-9 w-9 p-0! rounded-lg border border-input-border-color bg-primary/10  text-primary hover:bg-primary hover:text-white transition-all"
            title="View Sheet"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onEdit(row)}
            className="h-9 w-9 p-0! rounded-lg border border-input-border-color bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
            title="Edit Sheet"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => openDeleteModal((row as any).id || row._id)}
            className="h-9 w-9 p-0! rounded-lg border border-input-border-color bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-xs"
            title="Delete Sheet"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {!row.is_linked && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleLinkSheet((row as any).id || row._id)}
              disabled={isLinking}
              className="h-8 w-11 rounded-lg border border-input-border-color bg-subcard text-subtitle-color hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:border-amber-500/20 dark:hover:text-amber-400 transition-all shadow-xs"
              title="Link to Google"
            >
              <CloudUpload className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const totalPages = Math.max(1, Math.ceil(sheets.length / rowsPerPage))
  const paginatedData = sheets.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={sheets.length}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1) }}
        showRowsPerPageAtTop={true}
        onBulkDelete={(rows) => openBulkDeleteModal(rows.map(r => (r as any).id || r._id))}
        enableSelection={true}
        emptyStateTitle={t("no_google_sheets_title", "No Google Sheets Found")}
        emptyMessage={t("no_google_sheets_desc", "Connect your Google Sheets to sync data automatically.")}
      />

      {/* Single Delete Modal */}
      <DeleteSourceModal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Google Sheet"
        description="This will remove the sheet connection from your account."
      />

      {/* Bulk Delete Modal */}
      <DeleteSourceModal
        isOpen={bulkDeleteModal.open}
        onClose={closeBulkDeleteModal}
        onConfirm={confirmBulkDelete}
        isDeleting={isBulkDeleting}
        title="Delete Google Sheets"
        description="This will remove the selected sheet connections from your account."
        itemCount={bulkDeleteModal.ids.length}
      />
    </>
  )
}
