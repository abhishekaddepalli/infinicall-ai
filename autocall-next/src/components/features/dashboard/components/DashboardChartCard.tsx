'use client'

import { DashboardChartCardProps } from '@/types/dashboard'
import { isBrowser } from '@/utils/environment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function DashboardChartCard({
  title,
  category,
  chartType,
  chartOptions,
  chartSeries,
  height = '100%',
  width = '100%',
  colSpan = ''
}: DashboardChartCardProps) {
  const [ChartComponent, setChartComponent] = useState<any>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (isBrowser) {
      import('react-apexcharts').then((mod) => {
        setChartComponent(() => mod.default)
      })
    }
  }, [])

  const isDonut = chartType === 'donut'
  const isDonutEmpty = isDonut && (!chartSeries || chartSeries.reduce((a: number, b: number) => a + b, 0) === 0)

  return (
    <div
      className={`sm:p-6 p-4 rounded-radius border border-input-border-color bg-bg-card flex flex-col h-full animate-in fade-in slide-in-from-bottom-5 duration-500 ${colSpan}`}
    >
      <div className="flex flex-wrap gap-3 items-center justify-between border-b border-input-border-color pb-4 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-title tracking-tight">
            {title}
          </h2>
          <span className="text-md font-medium text-subtitle-color mt-0.5">
            {category}
          </span>
        </div>
      </div>
      <div className="relative flex-1 mt-4 w-full" style={{ minHeight: typeof height === 'number' ? `${height}px` : height }}>
        {isDonutEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/50 font-bold uppercase tracking-wider">
            {t('no_share_data_logs')}
          </div>
        ) : (
          ChartComponent && <ChartComponent options={chartOptions} series={chartSeries} type={chartType} height="100%" width={width} />
        )}
      </div>
    </div>
  )
}
