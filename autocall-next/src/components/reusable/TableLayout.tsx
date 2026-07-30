'use client'

import { TableLayoutProps } from '@/types/shared'
import { DataTable } from './DataTable'
import { PageHeader } from './PageHeader'
/**
 * A standardized layout component for pages featuring a header and a data table.
 */
export function TableLayout<T>({
  title,
  subtitle,
  headerIcon,
  primaryAction,
  endContent,
  children,
  showBackButton = true,
  onBack,
  loadingText,
  ...dataTableProps
}: TableLayoutProps<T> & { children?: React.ReactNode, showBackButton?: boolean, loadingText?: string }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
      <div className="pb-6">
        <PageHeader
          title={title}
          subtitle={subtitle}
          icon={headerIcon}
          primaryAction={primaryAction}
          endContent={endContent}
          showBackButton={showBackButton}
          onBack={onBack}
        />
      </div>
      <div className="space-y-8">
        {children}
        <DataTable {...dataTableProps} loadingText={loadingText} />
      </div>
    </div>
  )
}
