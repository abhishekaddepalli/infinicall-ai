'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { GoogleSheet } from '@/types/google-workspace'
import { ArrowLeft, Plus, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GoogleSheetsTable from './GoogleSheetsTable'
import SheetDataModal from './SheetDataModal'
import SyncSheetsModal from './SyncSheetsModal'

export default function GoogleSheetsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [syncModalOpen, setSyncModalOpen] = useState(false)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')
  const [activeSheet, setActiveSheet] = useState<GoogleSheet | null>(null)

  const openEditModal = (sheet: GoogleSheet) => {
    setActiveSheet(sheet)
    setModalMode('edit')
    setActionModalOpen(true)
  }

  const openViewModal = (sheet: GoogleSheet) => {
    setActiveSheet(sheet)
    setModalMode('view')
    setActionModalOpen(true)
  }

  return (
    <div className="w-full space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-title flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE)}
              className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {t('googleSheets', 'Google Sheets')}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            onClick={() => setSyncModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2 rounded-radius! p-padding! border-input-border-color bg-subcard text-subtitle-color font-bold transition-all duration-300 justify-center"
          >
            <RefreshCw className="h-4 w-4" />
            {t('syncSheets', 'Sync Sheets')}
          </Button>

          <Button
            onClick={() => router.push(ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_SHEETS_CREATE)}
            className="rounded-radius! p-padding! bg-primary text-white font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {t('createSheet', 'Create Sheet')}
          </Button>
        </div>
      </div>

      <GoogleSheetsTable onEdit={openEditModal} onView={openViewModal} />

      <SheetDataModal
        isOpen={actionModalOpen}
        onClose={() => { setActionModalOpen(false); setActiveSheet(null) }}
        sheet={activeSheet}
        mode={modalMode}
      />

      <SyncSheetsModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
      />
    </div>
  )
}
