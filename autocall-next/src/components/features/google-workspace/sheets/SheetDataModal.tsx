'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useReadSheetQuery, useWriteSheetMutation } from '@/redux/api/googleSheetsApi'
import { SheetDataModalProps } from '@/types/google-workspace'
import { FileSpreadsheet, Plus, Save, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function SheetDataModal({ isOpen, onClose, sheet, mode }: SheetDataModalProps) {
  const { t } = useTranslation()
  const sheetId = (sheet as any)?.id || sheet?._id || ''

  const { data, isLoading, isFetching, refetch } = useReadSheetQuery(
    { id: sheetId },
    { skip: !isOpen || !sheet }
  )
  const [writeSheet, { isLoading: isSaving }] = useWriteSheetMutation()

  const [tableData, setTableData] = useState<string[][]>([])
  const [isDirty, setIsDirty] = useState(false)

  // Reset table state whenever the modal opens with new data
  useEffect(() => {
    if (!isOpen) {
      setIsDirty(false)
      return
    }
    if (data?.values && data.values.length > 0) {
      setTableData(data.values.map(row => row.map(cell => String(cell ?? ''))))
    } else if (!isLoading && !isFetching) {
      setTableData([['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']])
    }
    setIsDirty(false)
  }, [data, isLoading, isFetching, isOpen])

  const handleCellChange = useCallback((rowIndex: number, colIndex: number, value: string) => {
    setTableData(prev => {
      const next = prev.map(r => [...r])
      if (!next[rowIndex]) next[rowIndex] = []
      next[rowIndex][colIndex] = value
      return next
    })
    setIsDirty(true)
  }, [])

  const addRow = () => {
    const cols = tableData[0]?.length || 5
    setTableData(prev => [...prev, Array(cols).fill('')])
    setIsDirty(true)
  }

  const removeSpecificRow = (rowIndex: number) => {
    if (tableData.length <= 1) return
    setTableData(prev => prev.filter((_, i) => i !== rowIndex))
    setIsDirty(true)
  }

  const addColumn = () => {
    setTableData(prev => prev.map(row => [...row, '']))
    setIsDirty(true)
  }

  const removeSpecificColumn = (colIndex: number) => {
    if ((tableData[0]?.length ?? 0) <= 1) return
    setTableData(prev => prev.map(row => row.filter((_, i) => i !== colIndex)))
    setIsDirty(true)
  }

  const handleSave = async () => {
    if (!sheet) return
    const oldRows = data?.values?.length || 0
    const oldCols = data?.values?.[0]?.length || 0
    const maxCols = Math.max(...tableData.map(r => r.length), oldCols, 0)
    const targetRows = Math.max(tableData.length, oldRows, 0)

    const filledData = []
    for (let i = 0; i < targetRows; i++) {
      const row = tableData[i] ? [...tableData[i]] : []
      while (row.length < maxCols) row.push('')
      filledData.push(row)
    }
    try {
      await writeSheet({
        id: sheetId,
        range: data?.range || sheet.range || t('a1'),
        values: filledData,
        majorDimension: 'ROWS',
      }).unwrap()
      toast.success(t('sheetDataSaved', 'Sheet data saved to Google Sheets'))
      setIsDirty(false)
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || t('failed_to_save_sheet_data'))
    }
  }

  const colCount = tableData[0]?.length ?? 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-[calc(100%-2rem)]! sm:max-w-2xl w-[1300px] max-h-[90vh] flex flex-col p-0 gap-0! overflow-auto no-scrollbar border-none">

        {/* ── Toolbar ── */}
        <DialogHeader className="shrink-0 border-b text-left rtl:text-right border-input-border-color mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 sm:py-3.5 pr-12 sm:pr-14 rtl:pr-5 rtl:pl-12 rtl:sm:pl-14">
            {/* Left: title */}
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                <FileSpreadsheet className="w-5 h-5 sm:w-4 sm:h-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl text-title font-semibold leading-tight truncate">
                  {mode === 'edit' ? t('editSheetData', 'Edit Sheet Data') : t('viewSheetData', 'View Sheet Data')}
                </DialogTitle>
                {sheet && (
                  <p className="text-sm text-subtitle-color font-medium mt-0.5 truncate">
                    {sheet.name}
                    {sheet.sheet_name && <span className="mx-1 opacity-40">·</span>}
                    {sheet.sheet_name}
                  </p>
                )}
              </div>
            </div>

            {/* Right: toolbar actions */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {mode === 'edit' && (
                <>

                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                    size="sm"
                    className="gap-1.5 bg-primary hover:bg-primary/90 text-white rounded-radius h-9"
                  >
                    {isSaving
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Save className="w-3.5 h-3.5" />
                    }
                    {isSaving ? 'Saving…' : 'Save to Google'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>


        {/* ── Spreadsheet body ── */}
        <div className="flex-1 overflow-auto bg-bg-card no-scrollbar">
          {(isLoading || isFetching) ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
              <p className="text-sm">{t('loadingSheetData', 'Loading sheet data…')}</p>
            </div>
          ) : tableData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
              <FileSpreadsheet className="w-10 h-10 opacity-30" />
              <p className="text-sm">No data found in this range.</p>
              {mode === 'edit' && (
                <Button size="sm" variant="outline" onClick={addRow} className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" />{t('add_a_row')}</Button>
              )}
            </div>
          ) : (
            <div className="sm:p-6 p-4 max-w-full overflow-x-auto no-scrollbar">
              {mode === 'edit' && (
                <div className="flex items-center justify-end mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addColumn}
                    disabled={isSaving}
                    className="text-primary bg-primary/10 hover:bg-primary hover:text-white  gap-2 h-11 rounded-lg p-padding! border-none"
                  >
                    <Plus className="w-4 h-4" /> {t('addColumn', 'Add Column')}
                  </Button>
                </div>
              )}

              <div className="border border-input-border-color rounded-radius overflow-auto bg-bg-card w-full no-scrollbar">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-subcard border-b border-input-border-color">
                      <th className="w-12 text-center py-3 text-subtitle-color font-medium text-xs border-r border-input-border-color sticky left-0 z-10 bg-subcard">#</th>
                      {Array.from({ length: colCount }).map((_, ci) => (
                        <th key={ci} className="py-3 px-4 text-left font-medium text-subtitle-color text-[13px] border-r border-input-border-color relative group min-w-[150px]">
                          <div className="flex items-center justify-between">
                            <span className='text-sm capitalize font-bold'>COL {ci + 1}</span>
                            {mode === 'edit' && colCount > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeSpecificColumn(ci)}
                                className="text-muted-foreground bg-transparent hover:bg-transparent hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-1"
                                title={t('remove_column')}
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </th>
                      ))}
                      {mode === 'edit' && (
                        <th className="w-[50px] py-3 text-center border-l border-input-border-color sticky right-0 z-10 bg-subcard"></th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, ri) => (
                      <tr key={ri} className="border-b border-input-border-color last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                        <td className="text-center py-3 text-subtitle-color font-medium text-xs border-r border-input-border-color bg-subcard sticky left-0 z-10 group-hover:bg-slate-50/50 dark:group-hover:bg-zinc-900/30 transition-colors">
                          {ri + 1}
                        </td>
                        {Array.from({ length: colCount }).map((_, ci) => (
                          <td key={ci} className="p-0 border-r border-input-border-color relative group">
                            {mode === 'edit' ? (
                              <Input
                                type="text"
                                value={row[ci] ?? ''}
                                onChange={e => handleCellChange(ri, ci, e.target.value)}
                                className="w-full h-[46px] px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary bg-transparent text-title font-semibold border-none rounded-none"
                                placeholder={`Enter value...`}
                              />
                            ) : (
                              <div className="px-4 py-3 text-sm text-title font-semibold min-h-[46px] flex items-center break-words whitespace-normal max-w-xs">
                                {row[ci]}
                              </div>
                            )}
                          </td>
                        ))}
                        {mode === 'edit' && (
                          <td className="text-center py-0 px-0 border-l border-input-border-color  right-0 z-10 bg-bg-card group-hover:bg-slate-50/50 dark:group-hover:bg-zinc-900/30 transition-colors">
                            <Button
                              type="button"
                              onClick={() => removeSpecificRow(ri)}
                              disabled={tableData.length <= 1}
                              className="w-9 h-9 p-0! rounded-lg bg-destructive/10 hover:bg-destructive hover:text-white! text-destructive! flex items-center justify-center transition-colors disabled:opacity-40"
                              title={t('remove_row')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {mode === 'edit' && (
                  <div className="border-t border-input-border-color bg-subcard hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <Button
                      type="button"
                      onClick={addRow}
                      className="w-full h-11 flex bg-transparent hover:bg-transparent items-center justify-center text-subtitle-color hover:text-title font-bold text-sm gap-2"
                    >
                      <Plus className="w-4 h-4" /> {t('addRow', 'Add Row')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
