import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { Column, DataTableProps } from '@/types/table'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Download,
  FileDown,
  FileSpreadsheet,
  FileText,
  Plus,
  Search,
  Trash2,
  Upload,
  UserCog,
} from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '../ui/checkbox'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { ImportModal } from './ImportModal'
import { Pagination } from './Pagination'
import Spinner from './Spinner'

export type { Column, DataTableProps }

export function DataTable<T>({
  columns,
  data,
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  onPageChange,
  isLoading = false,
  loadingText,
  emptyMessage,
  emptyStateTitle,
  emptyStateActionLabel,
  onEmptyStateAction,
  sortColumn,
  sortOrder,
  onSort,
  enableSelection = false,
  onSelectionChange,
  onBulkDelete,
  onRowsPerPageChange,
  rowsPerPage,
  showRowsPerPageAtTop = false,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  onImport,
  onDownloadTemplate,
  filters,
}: DataTableProps<T>) {
  const { t } = useTranslation()
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const direction = useAppDirection()

  const defaultEmptyMessage = emptyMessage || t('no_results')

  const hasExport = !!(onExportPDF || onExportExcel || onExportCSV)
  const hasImport = !!onImport
  const showToolbar = !!(onSearchChange || hasExport || hasImport || showRowsPerPageAtTop || filters)

  useEffect(() => {
    onSelectionChange?.(selectedRows)
  }, [selectedRows, onSelectionChange])

  useEffect(() => {
    setTimeout(() => {
      setSelectedRows([])
    }, 10)
  }, [data])

  const handleHeaderClick = (col: Column<T>) => {
    if (col.sortable && onSort) {
      const key = col.sortKey || (col.accessorKey as string)
      if (key) {
        onSort(key)
      }
    }
  }

  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable) return null

    const key = col.sortKey || (col.accessorKey as string)
    if (!key) return null

    if (sortColumn === key) {
      return sortOrder === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
    }

    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
  }

  const toggleAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([])
    } else {
      setSelectedRows([...data])
    }
  }

  const toggleRow = (row: T) => {
    const rowId = (row as any).id || (row as any)._id
    const isSelected = selectedRows.some((r: any) => {
      const rId = r.id || r._id
      if (rowId && rId) return rId === rowId
      return r === row
    })

    if (isSelected) {
      setSelectedRows(
        selectedRows.filter((r: any) => {
          const rId = r.id || r._id
          if (rowId && rId) return rId !== rowId
          return r !== row
        }),
      )
    } else {
      setSelectedRows([...selectedRows, row])
    }
  }

  const isRowSelected = (row: T) => {
    const rowId = (row as any).id || (row as any)._id
    return selectedRows.some((r: any) => {
      const rId = r.id || r._id
      if (rowId && rId) return rId === rowId
      return r === row
    })
  }

  return (
    <div className="space-y-3">
      {/* Toolbar Card: Search + Rows-per-page + Export */}
      {showToolbar && (
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            {/* Search Input */}
            {onSearchChange && (
              <div className={cn("relative overflow-visible transition-all duration-300 ease-in-out group w-full sm:w-[500px]", isSearchFocused ? "" : "")}>
                <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10 pointer-events-none", isSearchFocused ? "text-primary" : "text-subtitle-color")} />
                <Input placeholder={searchPlaceholder || t("search")} value={searchValue || ""} onChange={(e) => onSearchChange(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} className="relative placeholder:text-md text-md border-input-border-color pl-10 h-11 w-full rounded-radius bg-input-color focus-visible-outline-unset! transition-all" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 ml-auto rtl:ml-0 rtl:mr-auto">
            {filters && (
              <div className="flex items-center gap-2">
                {filters}
              </div>
            )}
            {/* Bulk Delete - Only visible when items are selected */}
            {enableSelection && selectedRows.length > 0 && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-2 duration-300 flex-wrap">
                <Button variant={selectedRows.length > 0 ? "destructive" : "ghost"} size="sm" className={cn(" rounded-radius h-10 px-4 font-bold transition-all duration-300 border border-input-border-color bg-bg-card", selectedRows.length === 0 ? "bg-input-color text-muted-foreground/30 cursor-not-allowed" : "bg-destructive/10 dark:hover:bg-destructive text-destructive border-destructive/10 hover:bg-destructive hover:text-white hover:shadow-destructive/20")} onClick={() => selectedRows.length > 0 && setShowDeleteConfirm(true)} disabled={selectedRows.length === 0}>
                  <Trash2 className={cn("size-4 mr-1", selectedRows.length === 0 && "opacity-90")} />
                  <span>{t("bulk_delete")}{selectedRows.length > 0 ? ` (${selectedRows.length})` : ''}</span>
                </Button>
              </div>
            )}
            {hasImport && (
              <>
                <div className="flex items-center border-input-border-color h-[45px] border p-2 bg-bg-card rounded-radius">
                  {/* Import Button */}
                  {hasImport && (
                    <>
                      <Button variant="outline" className="gap-2 rounded-xl border-none transition-all font-medium text-sm" onClick={() => setShowImportModal(true)}>
                        <Upload className="w-4 h-4 text-primary" />
                        <span className="hidden md:inline">{t("import")}</span>
                      </Button>
                      <ImportModal
                        isOpen={showImportModal}
                        onClose={() => setShowImportModal(false)}
                        onImport={(file: File) => {
                          onImport!(file);
                          setShowImportModal(false);
                        }}
                        onDownloadTemplate={onDownloadTemplate}
                        title={t("import_data")}
                      />
                    </>
                  )}

                  {hasImport && hasExport && <div className="w-[1px] h-6 bg-gray-200 dark:bg-white/10 mx-1" />}

                  {/* Export Dropdown */}
                  {hasExport && (
                    <DropdownMenu dir={direction}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className=" gap-2 rounded-xl border-none transition-all font-medium text-sm">
                          <Download className="w-4 h-4 text-primary" />
                          <span className="hidden md:inline">{t("export")}</span>
                          <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-radius p-1 bg-bg-card border border-input-border-color">
                        {onExportPDF && (
                          <DropdownMenuItem onClick={onExportPDF} className="gap-2 p-2.5 rounded-lg cursor-pointer">
                            <div className="bg-red-500/10 p-1.5 rounded-md">
                              <FileText className="w-4 h-4 text-red-500" />
                            </div>
                            {t("export_pdf")}
                          </DropdownMenuItem>
                        )}
                        {onExportExcel && (
                          <DropdownMenuItem onClick={onExportExcel} className="gap-2 p-2.5 rounded-lg text-title hover:bg-primary/10 cursor-pointer">
                            <div className="bg-green-500/10 p-1.5 rounded-md">
                              <FileSpreadsheet className="w-4 h-4 text-green-600" />
                            </div>
                            {t("export_excel")}
                          </DropdownMenuItem>
                        )}
                        {onExportCSV && (
                          <DropdownMenuItem onClick={onExportCSV} className="gap-2 p-2.5 rounded-lg text-title hover:bg-primary/10 cursor-pointer">
                            <div className="bg-blue-500/10 p-1.5 rounded-md">
                              <FileDown className="w-4 h-4 text-blue-500" />
                            </div>
                            {t("export_csv")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="rounded-radius border border-input-border-color overflow-hidden  transition-all duration-500">
        <Table className="border-collapse border-hidden">
          <TableHeader className="bg-slate-100 dark:bg-white/5 border-b border-input-border-color">
            <TableRow className="hover:bg-transparent border-none">
              {enableSelection && (
                <TableHead className="w-12 h-12 text-center px-4">
                  <div className="flex justify-center items-center">
                    <Checkbox checked={data.length > 0 && selectedRows.length === data.length} indeterminate={selectedRows.length > 0 && selectedRows.length < data.length} onChange={toggleAll} className="border-primary/20 data-[state=checked]:bg-switch-background data-[state=checked]:border-primary transition-all duration-300" />
                  </div>
                </TableHead>
              )}
              {columns.map((col, index) => (
                <TableHead key={index} className={cn("h-12 text-md font-bold text-primary px-4", col.className, col.sortable && "cursor-pointer select-none text-primary transition-colors duration-300")} onClick={() => handleHeaderClick(col)}>
                  <div className="flex items-center space-x-2">
                    <span>{col.header}</span>
                    {renderSortIcon(col)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (enableSelection ? 1 : 0)} className="h-64 text-center">
                  <Spinner className="min-h-48" size="lg" text={loadingText || t("loading_data")} />
                </TableCell>
              </TableRow>
            ) : data.length ? (
              data.map((row, rowIndex) => (
                <TableRow key={(row as any).id || (row as any)._id || rowIndex} className={cn("group h-14 hover:bg-primary/1 transition-all duration-500 border-b border-input-border-color last:border-0 relative", isRowSelected(row) && "bg-primary/4 dark:bg-primary/6")}>
                  {enableSelection && (
                    <TableCell className="py-4 text-center w-12 px-4">
                      <div className="flex justify-center items-center">
                        <Checkbox checked={isRowSelected(row)} onChange={() => toggleRow(row)} className="border-primary/20 data-[state=checked]:bg-switch-background data-[state=checked]:border-primary transition-all duration-300" />
                      </div>
                    </TableCell>
                  )}
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className={cn("py-4 text-sm font-medium! px-4 text-title", col.className)}>
                      {col.cell ? col.cell(row, rowIndex) : col.accessorKey ? (row[col.accessorKey] as ReactNode) : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (enableSelection ? 1 : 0)} className="h-80 text-center text-sm text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                      <div className="relative w-13 h-13 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                        <UserCog className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2 max-w-sm mx-auto">
                      <h3 className="text-xl font-bold text-title mb-1">{emptyStateTitle || t("no_results_found")}</h3>
                      <p className="text-md text-subtitle-color font-medium">{defaultEmptyMessage}</p>
                      {emptyStateActionLabel && onEmptyStateAction && (
                        <div className="pt-4 flex justify-center">
                          <Button onClick={onEmptyStateAction} className="bg-primary hover:bg-primary/90 text-white font-bold h-10 p-padding! rounded-lg flex items-center justify-center gap-2">
                            <Plus className="h-4 w-4" strokeWidth={3} />
                            {emptyStateActionLabel}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {onPageChange && totalPages > 0 && (
          <div className="border-t border-input-border-color bg-bg-card">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} rowsPerPage={rowsPerPage} onRowsPerPageChange={onRowsPerPageChange} showRowsPerPage={true} totalResults={totalResults || (totalPages <= 1 ? data.length : 0)} />
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onBulkDelete?.(selectedRows);
          setShowDeleteConfirm(false);
          setSelectedRows([]);
        }}
        title={t("confirm_bulk_delete")}
        description={t("bulk_delete_warning", {
          count: selectedRows.length,
          defaultValue: `Are you sure you want to delete ${selectedRows.length} selected items? This action cannot be undone.`,
        })}
      />
    </div>
  );
}
