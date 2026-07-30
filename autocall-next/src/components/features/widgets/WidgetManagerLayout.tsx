'use client'

import { ROUTES } from '@/constants/routes'
import { WidgetManagerLayoutProps } from '@/types/dashboard'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { WidgetForm } from './WidgetForm'

export function WidgetManagerLayout({
  title,
  initialValues,
  onSubmit,
  isLoading,
}: WidgetManagerLayoutProps) {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Redesigned Header: High-end Minimalist Back & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.TOOLBOX_EMBEDDED_WIDGETS}
            className="flex items-center justify-center h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold text-title line-clamp-1">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Modern Spacing Grid Layout */}
      <div className="w-full">
        <WidgetForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
