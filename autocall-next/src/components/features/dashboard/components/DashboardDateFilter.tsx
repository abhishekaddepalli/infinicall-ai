"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DashboardDateFilterProps } from "@/types/dashboard";
import { format, startOfMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

export const presets = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
  { label: "Custom", value: "custom" },
];

export function DashboardDateFilter({ onFilterChange }: DashboardDateFilterProps) {
  const { t } = useTranslation()
  const [dateRange, setDateRange] = React.useState<string>("this_year");
  const [customRange, setCustomRange] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const handlePresetChange = (value: string) => {
    setDateRange(value);
    if (value !== "custom") {
      onFilterChange({ dateRange: value });
    } else if (customRange?.from && customRange?.to) {
      onFilterChange({
        dateRange: value,
        startDate: format(customRange.from, "yyyy-MM-dd"),
        endDate: format(customRange.to, "yyyy-MM-dd"),
      });
    }
  };

  const handleCustomRangeChange = (range: DateRange | undefined) => {
    setCustomRange(range);
    if (range?.from && range?.to) {
      onFilterChange({
        dateRange: "custom",
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: format(range.to, "yyyy-MM-dd"),
      });
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Select value={dateRange} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-40 h-10 py-4.5 bg-bg-card rounded-radius border-input-border-color! outline-none! font-medium text-sm  transition-all hover:border-primary/50">
          <SelectValue placeholder={t('select_range')} />
        </SelectTrigger>
        <SelectContent className="bg-bg-body dark:bg-input-border-color rounded-xl shadow-xl">
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value} className="font-medium rounded-lg m-1">
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {dateRange === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("h-10 justify-start text-left font-bold rounded-lg bg-bg-card min-w-60 transition-all focus:shadow-none focus:border-none! border-none!", !customRange && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4 text-primary" />
              {customRange?.from ? (
                customRange.to ? (
                  <span className="text-foreground">
                    {format(customRange.from, "LLL dd, y")} - {format(customRange.to, "LLL dd, y")}
                  </span>
                ) : (
                  <span className="text-foreground">{format(customRange.from, "LLL dd, y")}</span>
                )
              ) : (
                <span>{t('pick_a_date')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white rounded-radius shadow-2xl border-none!  z-[100]" align="end">
            <Calendar initialFocus mode="range" defaultMonth={customRange?.from} selected={customRange} onSelect={handleCustomRangeChange} numberOfMonths={1} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
