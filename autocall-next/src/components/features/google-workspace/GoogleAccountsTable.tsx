'use client'

import { Column, DataTable } from '@/components/reusable/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { GoogleAccount } from '@/types/google-workspace'
import { format } from 'date-fns'
import { CalendarDays, Link2Off, TableProperties } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DisconnectAccountModal from './DisconnectAccountModal'
import { useGoogleWorkspace } from './hooks/useGoogleWorkspace'

export default function GoogleAccountsTable() {
  const { t } = useTranslation()
  const {
    accounts,
    isLoading,
    isDisconnecting,
    handleDisconnect
  } = useGoogleWorkspace()
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const openDisconnectModal = (id: string) => {
    setSelectedAccountId(id)
    setDisconnectModalOpen(true)
  }

  const closeDisconnectModal = () => {
    setDisconnectModalOpen(false)
    setSelectedAccountId(null)
  }

  const confirmDisconnect = async () => {
    if (selectedAccountId) {
      try {
        await handleDisconnect(selectedAccountId)
        closeDisconnectModal()
      } catch (err) {
        // Error handled in hook
      }
    }
  }

  const columns: Column<GoogleAccount>[] = [
    {
      header: 'Account Name',
      className: "lg991:min-w-[200px]",
      accessorKey: 'email',
      cell: (row) => <span className="text-subtitle-color">{row.email.split('@')[0]}</span>,
      sortable: true,
    },
    {
      header: 'Email',
      className: "lg991:min-w-[200px]",
      accessorKey: 'email',
      sortable: true,
    },
    {
      header: 'Status',
      className: "lg991:min-w-[200px]",
      accessorKey: 'status',
      sortable: true,
      cell: (row) => {
        const isConnected = row.status === 'active'
        const badgeStyle = isConnected
          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
          : 'bg-zinc-100 text-zinc-600 border-zinc-200'

        return (
          <Badge className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold ${badgeStyle}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        )
      },
    },
    {
      header: 'Connected At',
      className: "lg991:min-w-[200px]",
      accessorKey: 'created_at',
      sortable: true,
      cell: (row) => row.created_at ? format(new Date(row.created_at), 'MMM d, yyyy') : '—',
    },
    {
      header: 'Actions',
      className: "lg991:min-w-[200px]",
      accessorKey: '_id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_SHEETS}
            className="w-9 h-9 text-edit hover:text-white bg-edit/10 hover:bg-edit rounded-lg flex justify-center items-center transition-colors"
            title="Manage Google Sheets"
          >
            <TableProperties className="h-4 w-4" />
          </Link>

          <Link
            href={ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_CALENDERS}
            className="w-9 h-9 text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-lg flex justify-center items-center transition-colors"
            title="Manage Google Calendars"
          >
            <CalendarDays className="h-4 w-4" />
          </Link>

          <Button
            type="button"
            onClick={() => openDisconnectModal(row._id)}
            className="w-9 h-9 text-destructive hover:text-white bg-destructive/10 hover:bg-destructive rounded-lg p-0! transition-colors"
            title="Disconnect Account"
          >
            <Link2Off className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const totalPages = Math.max(1, Math.ceil(accounts.length / rowsPerPage))
  const paginatedData = accounts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={accounts.length}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows)
          setCurrentPage(1)
        }}
        showRowsPerPageAtTop={false}
        emptyStateTitle={t("no_google_accounts_title", "No Google Accounts Found")}
        emptyMessage={t("no_google_accounts_desc", "Authenticate with Google to integrate Sheets and Calendars.")}
      />
      <DisconnectAccountModal
        isOpen={disconnectModalOpen}
        onClose={closeDisconnectModal}
        onConfirm={confirmDisconnect}
        isDeleting={isDisconnecting}
      />
    </>
  )
}
