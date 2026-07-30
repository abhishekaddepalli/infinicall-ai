'use client'

import { Column, DataTable } from '@/components/reusable/DataTable'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PhoneNumber, PhoneNumbersTableProps } from '@/types/waba'
import { Phone } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PhoneNumbersTable({ phoneNumbers, isLoading = false }: PhoneNumbersTableProps) {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string>('display_phone_number')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // 1. Filter data based on search
  const filteredData = useMemo(() => {
    return phoneNumbers.filter((phone) => {
      const search = searchValue.toLowerCase().trim()
      if (!search) return true
      return (
        phone.display_phone_number?.toLowerCase().includes(search) ||
        phone.verified_name?.toLowerCase().includes(search) ||
        phone.status?.toLowerCase().includes(search)
      )
    })
  }, [phoneNumbers, searchValue])

  // 2. Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData]
    if (!sortColumn) return sorted

    sorted.sort((a: any, b: any) => {
      const aVal = (a[sortColumn] || '').toString().toLowerCase()
      const bVal = (b[sortColumn] || '').toString().toLowerCase()

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredData, sortColumn, sortOrder])

  // 3. Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedData.slice(startIndex, startIndex + rowsPerPage)
  }, [sortedData, currentPage, rowsPerPage])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage))

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  // Define Columns
  const columns: Column<PhoneNumber>[] = [
    {
      header: t('display_phone_number', 'Phone Number'),
      accessorKey: 'display_phone_number',
      sortable: true,
      className: 'font-semibold xl1480:min-w-[250px]',
      cell: (row) => (
        <div className="flex items-center gap-2 text-md">
          <Phone className="w-4 h-4 text-subtitle-color" />
          {row.display_phone_number}
        </div>
      ),
    },
    {
      header: t('verified_name', 'Verified Name'),
      accessorKey: 'verified_name',
      className: 'xl1480:min-w-[220px]',
      sortable: true,
      cell: (row) => <span className='text-md break-all whitespace-normal line-clamp-2'>{row.verified_name || <span className="text-slate-400 dark:text-zinc-500">—</span>}</span>,
    },
    {
      header: t('created_date', 'Created Date'),
      accessorKey: 'created_at',
      className: 'xl1480:min-w-[220px]',
      sortable: true,
      cell: (row) => (
        <span className="text-md text-subtitle-color">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
            : <span className="text-slate-400 dark:text-zinc-500">—</span>}
        </span>
      ),
    },
    {
      header: t('waba_status', 'Status'),
      accessorKey: 'status',
      className: 'xl1480:min-w-[150px]',
      sortable: true,
      cell: (row) => {
        const status = row.status || t('unknown')
        const isApproved = ['APPROVED', 'ACTIVE', 'VERIFIED'].includes(status.toUpperCase())
        const badgeStyle = isApproved
          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400'
          : 'bg-subcard text-subtitle-color border-input-border-color'

        return (
          <Badge className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold ${badgeStyle}`}>
            {t(`status_${status.toLowerCase()}`, status)}
          </Badge>
        )
      },
    },
  ]

  return (
    <Card className="rounded-lg border border-input-border-color bg-bg-card overflow-hidden sm:p-6 p-4 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-title">
            {t('waba_phone_numbers_title', 'WABA Phone Numbers')}
          </h3>
          <p className="text-md text-subtitle-color mt-0.5">
            {t('waba_phone_numbers_desc', 'List of phone numbers registered under your connected WhatsApp Business Account')}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={sortedData.length}
        onPageChange={(page) => setCurrentPage(page)}
        isLoading={isLoading}
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val)
          setCurrentPage(1)
        }}
        searchPlaceholder={t('search_phone_numbers_placeholder', 'Search by number, name or status...')}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows)
          setCurrentPage(1)
        }}
        showRowsPerPageAtTop={true}
        emptyStateTitle={t("no_waba_numbers_title", "No WABA Numbers Found")}
        emptyMessage={t("no_waba_numbers_desc", "There are no phone numbers connected to this WABA account.")}
      />
    </Card>
  )
}
