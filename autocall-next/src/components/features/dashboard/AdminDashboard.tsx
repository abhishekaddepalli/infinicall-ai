'use client'

import { AdminDashboardProps } from '@/types/dashboard'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { AdminAdditionalCounters, AdminLowerSection, CallsAndVolumes, RevenueAndRegistrations, WelcomeAndCounters, WorkflowsAndCampaigns } from './components'

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const { t } = useTranslation()
  const statistics = stats?.statistics || {}
  const charts = stats?.charts || {}
  const tables = stats?.tables || {}
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Monthly Revenue Chart Options
  const revenueChartOptions = {
    chart: {
      id: 'revenue-chart',
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      animations: {
        enabled: false
      }
    },
    colors: ['#06b6d4', '#6366f1'],
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: (charts.monthWiseRevenueChart || []).map(item => item.month),
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: 600
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `₹${val}`,
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: 600
        }
      }
    },
    grid: {
      borderColor: isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.2)',
      strokeDashArray: 5
    },
    theme: {
      mode: isDark ? 'dark' as const : 'light' as const
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light'
    }
  }

  const revenueChartSeries = [
    {
      name: t('revenue'),
      data: (charts.monthWiseRevenueChart || []).map(item => item.revenue)
    }
  ]

  // Weekly Calls Chart Options
  const callsChartOptions = {
    chart: {
      id: 'calls-chart',
      toolbar: { show: false },
      background: 'transparent',
      stacked: false,
      animations: {
        enabled: false
      }
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 6
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: (charts.currentWeekCallChart || []).map(item => item.day),
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: 600
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: 600
        }
      }
    },
    grid: {
      borderColor: isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.2)',
      strokeDashArray: 5
    },
    fill: {
      opacity: 1
    },
    theme: {
      mode: isDark ? 'dark' as const : 'light' as const
    },
    legend: {
      labels: {
        colors: isDark ? '#f8fafc' : '#475569'
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light'
    }
  }

  const callsChartSeries = [
    {
      name: t('inbound'),
      data: (charts.currentWeekCallChart || []).map(item => item.incoming)
    },
    {
      name: t('outbound'),
      data: (charts.currentWeekCallChart || []).map(item => item.outgoing)
    },
    {
      name: t('all_calls'),
      data: (charts.currentWeekCallChart || []).map(item => item.all)
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 animate-in fade-in duration-700"
    >
      {/* Row 1: Unified Welcome & Counters Section */}
      <WelcomeAndCounters statistics={statistics} />

      {/* Row 1.5: Additional Statistics Counters */}
      <AdminAdditionalCounters statistics={statistics} />

      {/* Row 2: Monthly Revenue Chart & Recent Registrations */}
      <RevenueAndRegistrations
        revenueChartOptions={revenueChartOptions}
        revenueChartSeries={revenueChartSeries}
        recentRegisteredUsers={tables.recentRegisteredUsers}
        cardVariants={cardVariants}
      />

      {/* Row 3: System Workflows & Recent Campaigns */}
      <WorkflowsAndCampaigns
        systemFlow={tables.systemFlow}
        recentCampaigns={tables.recentCampaigns}
        cardVariants={cardVariants}
      />

      {/* Row 3.5: Lower Section (Recent Contacts, Pie Chart, Recent SMS Campaigns) */}
      <AdminLowerSection
        recentContacts={tables.recentContactOfCurrentUser}
        recentSmsCampaigns={tables.recentSmsCampaignsOfCurrentUser}
        agentPieChart={charts.allTimeAgentPieChart}
        cardVariants={cardVariants}
      />

      {/* Row 4: Recent Calls & Weekly Call Volume */}
      <CallsAndVolumes
        recentCallsOfCurrentUser={tables.recentCallsOfCurrentUser}
        callsChartOptions={callsChartOptions}
        callsChartSeries={callsChartSeries}
        cardVariants={cardVariants}
      />
    </motion.div>
  )
}
