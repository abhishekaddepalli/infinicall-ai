'use client'

import { DataTable } from '@/components/reusable/DataTable'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} from '@/redux/api/appointmentApi'
import { Appointment } from '@/types/appointment'
import { Column } from '@/types/table'
import {
  Clock,
  Eye,
  LayoutGrid,
  List,
  Phone,
  Settings
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

// Modular sub-components
import { AppointmentCalendarView } from './AppointmentCalendarView'
import { AppointmentDetailModal } from './AppointmentDetailModal'
import { AppointmentFilterToolbar } from './AppointmentFilterToolbar'

export default function AppointmentScheduling() {
  const { t } = useTranslation()
  const router = useRouter()

  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data: appointmentsData, isLoading, refetch, isFetching } = useGetAppointmentsQuery({
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: viewMode === 'calendar' ? 1000 : limit, // Load more for calendar
    sortBy: sortColumn,
    sortOrder: sortOrder,
  })
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation()

  const appointmentsList = useMemo(() => {
    return appointmentsData?.data || []
  }, [appointmentsData])

  const filteredAppointments = appointmentsList // Search & filter handled by backend, but we keep the name for minimal refactor


  const calendarEvents = useMemo(() => {
    return filteredAppointments.map((appt) => {
      let backgroundColor = '#2563eb'
      let borderColor = '#2563eb'

      switch (appt.status) {
        case 'confirmed':
          backgroundColor = '#16a34a'
          borderColor = '#16a34a'
          break
        case 'completed':
          backgroundColor = '#0284c7'
          borderColor = '#0284c7'
          break
        case 'rescheduled':
          backgroundColor = '#7c3aed'
          borderColor = '#7c3aed'
          break
        case 'cancelled':
          backgroundColor = '#dc2626'
          borderColor = '#dc2626'
          break
        case 'scheduled':
        default:
          backgroundColor = '#2563eb'
          borderColor = '#2563eb'
          break
      }

      const dateStr = (appt.appointment_date || new Date().toISOString()).split('T')[0]
      const timeStr = appt.appointment_time || '00:00'
      const startDateTime = `${dateStr}T${timeStr.padStart(5, '0')}:00`

      return {
        id: appt.id || appt._id,
        title: `${appt.name || 'Unknown'} (${appt.appointment_type || t('general')})`,
        start: startDateTime,
        backgroundColor,
        borderColor,
        extendedProps: appt,
      }
    })
  }, [filteredAppointments])

  const handleEventClick = (arg: any) => {
    const appt = arg.event.extendedProps as Appointment
    setSelectedAppointment(appt)
    setIsDetailOpen(true)
  }

  const handleStatusChange = async (newStatus: string, newDate?: string, newTime?: string) => {
    if (!selectedAppointment) return
    const apptId = selectedAppointment.id || selectedAppointment._id
    try {
      const payload: any = { id: apptId, status: newStatus }
      if (newDate) payload.appointment_date = newDate
      if (newTime) payload.appointment_time = newTime

      await updateStatus(payload).unwrap()
      toast.success(t('status_updated_successfully'))

      setSelectedAppointment((prev) => prev ? { 
        ...prev, 
        status: newStatus as any,
        ...(newDate && { appointment_date: newDate }),
        ...(newTime && { appointment_time: newTime })
      } : null)
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_update_status'))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-edit/10  text-edit font-bold">{t('confirmed')}</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-sky-500 hover:bg-sky-600 text-white font-bold">{t('completed')}</Badge>
      case 'rescheduled':
        return <Badge variant="default" className="bg-violet-500 hover:bg-violet-600 text-white font-bold">{t('rescheduled')}</Badge>
      case 'cancelled':
        return <Badge variant="destructive" className="font-bold">{t('cancelled')}</Badge>
      case 'scheduled':
      default:
        return <Badge variant="secondary" className="font-bold">{t('scheduled')}</Badge>
    }
  }

  const columns: Column<Appointment>[] = [
    {
      header: t('appointment_name'),
      className: "lg991:min-w-[200px]",
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            {(row.name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-title text-md break-all whitespace-normal line-clamp-1">{row.name || 'Unknown'}</div>
            <div className="text-sm text-subtitle-color break-all whitespace-normal line-clamp-1">{row.appointment_type || t('general')}</div>
          </div>
        </div>
      ),
    },
    {
      header: t('appointment_phone'),
      className: "lg991:min-w-[200px]",
      accessorKey: 'phone',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2 text-subtitle-color font-medium">
          {row.phone ? (
            <>
              <Phone className="w-4 h-4 text-subtitle-color" />
              {row.phone}
            </>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      header: t('appointment_date'),
      className: "lg991:min-w-[200px]",
      accessorKey: 'appointment_date',
      sortable: true,
      cell: (row) => {
        const formattedDate = row.appointment_date
          ? new Date(row.appointment_date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          : 'N/A'
        return (
          <div className="flex flex-col">
            <span className="font-bold text-title">{formattedDate}</span>
            <span className="text-xs text-subtitle-color flex items-center gap-1 mt-0.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {row.appointment_time || 'N/A'}
            </span>
          </div>
        )
      },
    },
    {
      header: t('appointment_status'),
      className: "lg991:min-w-[200px]",
      accessorKey: 'status',
      sortable: true,
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: t('actions'),
      className: "lg991:min-w-[200px]",
      cell: (row) => (
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-lg w-9 h-9 font-bold bg-primary/5 hover:bg-primary hover:text-white border-none text-primary"
          onClick={() => {
            setSelectedAppointment(row)
            setIsDetailOpen(true)
          }}
        >
          <Eye className="w-4.5 h-4.5" />
        </Button>
      ),
    },
  ]

  const endHeaderContent = (
    <div className="flex items-center justify-end gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-subcard p-1 rounded-xl border border-input-border-color shadow-inner h-11">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 h-9 rounded-lg font-bold transition-all flex items-center gap-2 ${viewMode === 'table'
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          <List className="w-4 h-4" />
          <span className="text-xs">{t('list_view')}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 h-9 rounded-lg font-bold transition-all flex items-center gap-2 ${viewMode === 'calendar'
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-xs">{t('calendar_view')}</span>
        </Button>
      </div>
      <Button
        onClick={() => router.push(`${ROUTES.TOOLBOX}/appointment-setting`)}
        className=" p-padding rounded-radius bg-primary! text-white font-medium transition-all flex items-center gap-2 shrink-0"
      >
        <Settings className="w-4.5 h-4.5" />
        <span>{t('appointment_settings')}</span>
      </Button>
    </div>
  )

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={t('toolbox_appointment_config')}
        showBackButton={true}
        onBack={() => router.push(ROUTES.TOOLBOX)}
        endContent={endHeaderContent}
      />

      <AppointmentFilterToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={refetch}
        isFetching={isLoading || isFetching}
      />

      {viewMode === 'table' ? (
        <DataTable<Appointment>
          columns={columns}
          data={filteredAppointments}
          isLoading={isLoading}
          emptyStateTitle={t("no_appointments_title", "No Appointments Found")}
          emptyMessage={t("no_appointments_desc", "There are no appointments scheduled at this time.")}
          totalResults={(appointmentsData as any)?.pagination?.total || appointmentsList.length}
          currentPage={page}
          totalPages={(appointmentsData as any)?.pagination?.pages || 1}
          onPageChange={setPage}
          rowsPerPage={limit}
          onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
          showRowsPerPageAtTop={true}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          onSort={(col) => {
            if (sortColumn === col) {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
            } else {
              setSortColumn(col)
              setSortOrder('asc')
            }
            setPage(1)
          }}
        />
      ) : (
        <AppointmentCalendarView
          events={calendarEvents}
          onEventClick={handleEventClick}
        />
      )}

      <AppointmentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        appointment={selectedAppointment}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
      />
    </div>
  )
}
