'use client'

import { ProgressBarProps } from "@/types/shared"

export function ProgressBar({
  value,
  colorClass = 'bg-primary',
  trackColorClass = 'bg-zinc-200 dark:bg-zinc-700',
  className = '',
  height = 6,
}: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100)

  return (
    <div
      className={`w-full overflow-hidden rounded-full ${trackColorClass} ${className}`}
      style={{ height }}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-in-out ${colorClass}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
}
