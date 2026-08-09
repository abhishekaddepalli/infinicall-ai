'use client'

import { SparklineChartProps } from '@/types/shared'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export function SparklineChart({
  data = [],
  color = '#8b5cf6', 
  height = 35,
  width = '100%',
  className = '',
}: SparklineChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const mockData = [20, 18, 55, 25, 35, 25, 55, 15, 25, 20]
  
  const finalData = Array.isArray(data) && data.length > 0 ? data : mockData

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        sparkline: { enabled: true },
        animations: { enabled: true, easing: 'easeinout', speed: 800 },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      colors: [color],
      grid: {
        padding: {
          top: 5,
          bottom: 5,
          left: 0,
          right: 0,
        }
      },
      tooltip: {
        fixed: { enabled: false },
        x: { show: false },
        y: {
          title: { formatter: () => '' },
        },
        marker: { show: false },
      },
      dropShadow: {
        enabled: true,
        top: 4,
        left: 0,
        blur: 3,
        color: color,
        opacity: isDark ? 0.4 : 0.25,
      },
    }),
    [color, isDark]
  )

  const series = [{ data: finalData }]

  return (
    <div className={`flex items-center ${className}`}>
      <Chart options={options} series={series} type="line" height={height} width={width} />
    </div>
  )
}
