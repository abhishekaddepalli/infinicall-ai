'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { AppointmentFilterToolbarProps } from '@/types/appointment'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function AppointmentFilterToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: AppointmentFilterToolbarProps) {
  const { t } = useTranslation()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <div className="flex sm:flex-row flex-col items-center justify-between gap-3 w-full">
      {/* Search Input */}
        <div className={cn("relative overflow-visible transition-all duration-300 ease-in-out group w-full sm:w-125", isSearchFocused && "")}>
          <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10 pointer-events-none", isSearchFocused ? "text-primary" : "text-subtitle-color")} />
          <Input placeholder={t("search_appointments")} value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} className="relative pl-11 h-11 w-full  rounded-radius bg-input-color focus-visible-outline-unset! transition-all" />
        </div>

        {/* Filters */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-11 w-full sm:w-44 border border-input-border-color rounded-radius bg-input-color font-semibold shadow-none">
            <SelectValue placeholder={t("filter_by_status")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{t("all_status")}</SelectItem>
            <SelectItem value="scheduled">{t("scheduled")}</SelectItem>
            <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
            <SelectItem value="completed">{t("completed")}</SelectItem>
            <SelectItem value="rescheduled">{t("rescheduled")}</SelectItem>
            <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
          </SelectContent>
        </Select>
    </div>
  );
}
