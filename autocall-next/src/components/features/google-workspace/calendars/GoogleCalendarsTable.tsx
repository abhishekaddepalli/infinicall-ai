'use client'

import { Column, DataTable } from '@/components/reusable/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GoogleCalendar, GoogleCalendarsTableProps } from '@/types/google-workspace'
import { format } from 'date-fns'
import { CalendarDays, CloudUpload, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteSourceModal from '../DeleteSourceModal'
import { useGoogleCalendars } from './hooks/useGoogleCalendars'

export default function GoogleCalendarsTable({ onViewEvents }: GoogleCalendarsTableProps) {
  const { t } = useTranslation()
  const { calendars, isLoading, handleDelete, handleBulkDelete, handleLinkCalendar, isLinking } = useGoogleCalendars()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; calendarId: string | null }>({ open: false, calendarId: null })
  const [isDeleting, setIsDeleting] = useState(false)

  const [bulkDeleteModal, setBulkDeleteModal] = useState<{ open: boolean; ids: string[] }>({ open: false, ids: [] })
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const openDeleteModal = (id: string) => setDeleteModal({ open: true, calendarId: id })
  const closeDeleteModal = () => !isDeleting && setDeleteModal({ open: false, calendarId: null })

  const confirmDelete = async (deleteFrom: 'system' | 'google') => {
    if (!deleteModal.calendarId) return
    setIsDeleting(true)
    try {
      await handleDelete(deleteModal.calendarId, deleteFrom)
      setDeleteModal({ open: false, calendarId: null })
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

  const columns: Column<GoogleCalendar>[] = [
    {
      header: 'Calendar Name',
      accessorKey: 'name',
      sortable: true,
      className: 'font-semibold xl1580:min-w-[350px]',
      cell: (row) => (
          <span className="text-md capitalize text-title break-all whitespace-normal line-clamp-1">{row.name}</span>

      ),
    },
    {
      header: 'Calendar ID',
      className: 'xl1580:min-w-[380px]',
      accessorKey: 'calendar_id',
      sortable: true,
      cell: (row) => (
          <span className="text-md capitalize text-title break-all whitespace-normal line-clamp-1">{row.calendar_id}</span>
      ),
    },
    {
      header: 'Status',
      className: 'xl1580:min-w-[200px]',
      accessorKey: 'is_active',
      sortable: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Badge className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold ${row.is_linked ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-100 dark:bg-amber-900/20 dark:border-amber-900/20 text-amber-600 border-amber-200'}`}>
            {row.is_linked ? 'Linked' : 'Unlinked'}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Timezone',
      className: 'xl1580:min-w-[180px]',
      accessorKey: 'timezone',
      cell: (row) => (
        <span className="text-xs text-subtitle-color">{row.timezone || 'UTC'}</span>
      ),
    },
    {
      header: 'Created At',
      className: 'xl1580:min-w-[180px]',
      accessorKey: 'created_at',
      sortable: true,
      cell: (row) => row.created_at ? format(new Date(row.created_at), 'MMM d, yyyy') : '—',
    },
    {
      header: 'Actions',
      className: 'xl1580:min-w-[180px]',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            onClick={() => onViewEvents(row)}
            className="inline-flex items-center gap-1.5 w-9 h-9 p-0! text-xs font-medium rounded-lg text-primary bg-primary/10 hover:bg-primary hover:text-white transition-colors"
            title="View & manage events"
          >
            <CalendarDays className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            onClick={() => openDeleteModal((row as any).id || row._id)}
            className="w-9 h-9 p-0! text-destructive hover:text-white bg-destructive/10 hover:bg-destructive rounded-lg transition-colors"
            title="Delete Calendar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {!row.is_linked && (
            <Button
              type="button"
              onClick={() => handleLinkCalendar((row as any).id || row._id)}
              disabled={isLinking}
              className="w-9 h-9 p-0! text-amber-600 hover:text-white bg-amber-400/10 hover:bg-amber-400 rounded-lg transition-colors"
              title="Link to Google"
            >
              <CloudUpload className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const totalPages = Math.max(1, Math.ceil(calendars.length / rowsPerPage))
  const paginatedData = calendars.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <>
        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={calendars.length}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1) }}
          showRowsPerPageAtTop={true}
          onBulkDelete={(rows) => openBulkDeleteModal(rows.map(r => (r as any).id || r._id))}
          enableSelection={true}
          emptyStateTitle={t("no_google_calendars_title", "No Google Calendars Found")}
          emptyMessage={t("no_google_calendars_desc", "Connect your Google Calendars to sync events automatically.")}
        />

      <DeleteSourceModal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Google Calendar"
        description="This will remove the calendar connection from your account."
      />

      <DeleteSourceModal
        isOpen={bulkDeleteModal.open}
        onClose={closeBulkDeleteModal}
        onConfirm={confirmBulkDelete}
        isDeleting={isBulkDeleting}
        title="Delete Google Calendars"
        description="This will remove the selected calendar connections from your account."
        itemCount={bulkDeleteModal.ids.length}
      />
    </>
  )
}
