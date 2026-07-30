import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RowsPerPageSelectorProps } from '@/types/reusable'
import React from 'react'

export const RowsPerPageSelector: React.FC<RowsPerPageSelectorProps> = ({ rowsPerPage, onRowsPerPageChange }) => {

  return (
    <div className="flex items-center gap-3">
      <Select value={rowsPerPage?.toString() || '10'} onValueChange={(value) => onRowsPerPageChange(parseInt(value))}>
        <SelectTrigger className="h-9 w-[72px] border-input-border-color! border shadow-none rounded-radius text-sm font-medium focus:ring-0 cursor-pointer">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent className="bg-subcard rounded-lg border-input-border-color">
          {[10, 25, 50, 100].map((pageSize) => (
            <SelectItem key={pageSize} value={pageSize.toString()} className="text-xs font-medium rounded-lg hover:bg-light-primary">
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
