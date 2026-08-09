import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SyncSheetsModalProps } from '@/types/google-workspace'
import { Cloud, Download, FileSpreadsheet, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoogleSheets } from './hooks/useGoogleSheets'

export default function SyncSheetsModal({ isOpen, onClose }: SyncSheetsModalProps) {
  const { t } = useTranslation()
  const { accounts, handleFetchSheets, handleSync, isSyncing } = useGoogleSheets()
  const [availableSheets, setAvailableSheets] = useState<any[]>([])
  const [selectedSheetIds, setSelectedSheetIds] = useState<Set<string>>(new Set())
  const [isFetching, setIsFetching] = useState(false)
  const [currentAccountId, setCurrentAccountId] = useState('')

  const handleFetch = async (accountId: string) => {
    if (!accountId) return
    setCurrentAccountId(accountId)
    setIsFetching(true)
    try {
      const sheets = await handleFetchSheets(accountId)
      setAvailableSheets(sheets)
      setSelectedSheetIds(new Set())
    } finally {
      setIsFetching(false)
    }
  }

  const toggleSheet = (id: string) => {
    const newSet = new Set(selectedSheetIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedSheetIds(newSet)
  }

  const toggleAll = () => {
    if (selectedSheetIds.size === availableSheets.length) {
      setSelectedSheetIds(new Set())
    } else {
      setSelectedSheetIds(new Set(availableSheets.map(s => s.id)))
    }
  }

  const submitSync = async () => {
    const sheetsToSync = availableSheets
      .filter(s => selectedSheetIds.has(s.id))
      .map(s => ({ id: s.id, name: s.name }))

    if (sheetsToSync.length > 0 && currentAccountId) {
      await handleSync(currentAccountId, sheetsToSync)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)] gap-0 max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-radius border-none shadow-xl">
        <DialogHeader className="px-6 py-5 border-b border-input-border-color shrink-0 bg-card mb-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg text-left rtl:text-right font-semibold text-title-color">{t('sync_google_sheets', 'Sync Google Sheets')}</DialogTitle>
              <p className="text-sm text-left rtl:text-right text-subtitle-color mt-0.5">{t('fetch_sheets_from_your_google_account_and_sync_them', 'Fetch sheets from your Google account and sync them')}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto sm:p-6 p-4 bg-bg-card flex flex-col gap-6 border-input-border-color">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium text-title-color">{t('select_google_account', 'Select Google Account')}</Label>
              <Select value={currentAccountId} onValueChange={handleFetch}>
                <SelectTrigger className="h-11 rounded-radius border-input-border-color bg-bg-card text-title">
                  <SelectValue placeholder={t('select_a_google_account', 'Select a Google Account')} />
                </SelectTrigger>
                <SelectContent className="rounded-radius border-input-border-color">
                  {accounts.length === 0 ? (
                    <SelectItem value="__none__" disabled>{t('no_accounts_connected', 'No accounts connected')}</SelectItem>
                  ) : accounts.map(a => (
                    <SelectItem key={a._id} value={a._id}>{a.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={() => handleFetch(currentAccountId)}
              disabled={!currentAccountId || isFetching}
              className="h-11 rounded-radius bg-primary text-white font-medium border-none px-6 gap-2 hover:bg-primary/90 transition-colors"
            >
              {isFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {t('fetch_sheets', 'Fetch Sheets')}
            </Button>
          </div>

          {availableSheets.length > 0 && (
            <div className="border border-input-border-color rounded-radius overflow-hiddenbg-bg-cardflex-1 min-h-0 flex flex-col">
              <div className="overflow-y-auto max-h-[300px] no-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-subcard sticky top-0 border-b border-input-border-color z-10">
                    <tr>
                      <th className="p-3 w-12 border-r border-input-border-color text-center">
                        <Checkbox
                          checked={selectedSheetIds.size === availableSheets.length && availableSheets.length > 0}
                          onCheckedChange={toggleAll}
                          className="rounded"
                        />
                      </th>
                      <th className="p-3 font-semibold text-title-color text-xs uppercase tracking-wider">{t('all_selected', 'All Selected')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-input-border-color">
                    {availableSheets.map(sheet => (
                      <tr key={sheet.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-3 border-r border-input-border-color text-center">
                          <Checkbox
                            checked={selectedSheetIds.has(sheet.id)}
                            onCheckedChange={() => toggleSheet(sheet.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-3 font-medium text-title-color flex items-center gap-2.5">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">{sheet.name}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end flex-wrap gap-3 px-6 py-4 border-t border-input-border-color bg-bg-card shrink-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-radius h-11 sm:px-6 px-4 bg-subcard border-input-border-color text-subtitle-color font-medium transition-colors"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={submitSync}
            disabled={selectedSheetIds.size === 0 || (isSyncing && !isFetching)}
            className="rounded-radius h-11 bg-primary text-white font-medium border-none px-6 gap-2 hover:bg-primary/90 transition-colors"
          >
            {(isSyncing && !isFetching) ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
            {t('sync_selected', 'Sync Selected')} ({selectedSheetIds.size})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
