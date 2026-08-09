'use client'

import { RadialProgressChartProps } from '@/types/shared'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export function RadialProgressChart({
  value,
  color = '#10b981', 
  height = 45,
  width = 45,
  className = '',
  showLabel = false,
}: RadialProgressChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'radialBar',
        sparkline: { enabled: true },
        animations: { enabled: true, easing: 'easeinout', speed: 800 },
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          hollow: {
            margin: 0,
            size: '50%',
            background: 'transparent',
          },
          track: {
            background: isDark ? '#064e3b' : '#d1fae5', 
            margin: 0,
            strokeWidth: '100%',
          },
          dataLabels: {
            show: showLabel,
            name: { show: false },
            value: {
              show: showLabel,
              offsetY: 4,
              fontSize: '11px',
              fontWeight: 700,
              color: isDark ? '#ffffff' : '#18181b',
              formatter: (val) => `${Math.round(val)}`,
            },
          },
        },
      },
      stroke: {
        lineCap: 'round',
      },
      colors: [color],
    }),
    [color, isDark, showLabel]
  )

  const series = [value]

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Chart options={options} series={series} type="radialBar" height={height} width={width} />
    </div>
  )
}
