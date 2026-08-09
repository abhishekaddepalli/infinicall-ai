'use client'

import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { useGetUserSubscriptionQuery } from '@/redux/api/subscriptionApi'
import { UserDashboardProps } from '@/types/dashboard'
import { motion } from 'framer-motion'
import {
  BookOpen,
  CalendarDays,
  FileCode2,
  FileSpreadsheet,
  Megaphone,
  PhoneCall,
  UserCheck,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  UserChartsAndTables,
  UserCounters,
  UserHeaderSection
} from './components'

export function UserDashboard({ stats }: UserDashboardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { user, hasPermission } = usePermission()
  const { data: subscriptionResp } = useGetUserSubscriptionQuery()

  const sub = (
    !subscriptionResp?.data ||
    (Array.isArray(subscriptionResp.data) && subscriptionResp.data.length === 0) ||
    subscriptionResp.data.status === 'incomplete'
  ) ? null : subscriptionResp.data
  const userName = user?.name || t('user')
  const userRole = user?.role || 'user'

  // Dynamic permission-based Quick Access list (renders 3 relevant pages)
  const quickAccessItems = useMemo(() => {
    const pages = [
      {
        title: t('quick_agents'),
        desc: t('quick_agents_desc'),
        icon: UserCheck,
        path: ROUTES.AI_ASSISTANTS,
        permission: PERMISSIONS.VIEW_AGENTS
      },
      {
        title: t('quick_campaigns'),
        desc: t('quick_campaigns_desc'),
        icon: Megaphone,
        path: ROUTES.CAMPAIGNS,
        permission: PERMISSIONS.VIEW_CAMPAIGNS
      },
      {
        title: t('quick_templates'),
        desc: t('quick_templates_desc'),
        icon: FileCode2,
        path: ROUTES.PROMPT_TEMPLATES,
        permission: PERMISSIONS.VIEW_TEMPLATES
      },
      {
        title: t('quick_kb'),
        desc: t('quick_kb_desc'),
        icon: BookOpen,
        path: ROUTES.KNOWLEDGE_BASE,
        permission: PERMISSIONS.VIEW_KNOWLEDGE_BASE
      }
    ]

    const isWorkspaceOwner = userRole === 'user' || userRole === 'admin' || userRole === 'super_admin'

    return pages.filter(p => isWorkspaceOwner || hasPermission(p.permission)).slice(0, 4)
  }, [hasPermission, t, userRole])

  // 10 stats counter definitions
  const counterCards = useMemo(() => {
    const statistics = stats.statistics
    return [
      {
        title: t('total_calls'),
        value: statistics.totalCalls || 0,
        description: t('calls_recorded'),
        icon: PhoneCall,
        colorClass: 'from-purple-500/10 to-pink-500/10 text-purple-500 border-purple-500/20',
        glowClass: 'shadow-purple-500/5 hover:border-purple-500/30'
      },
      {
        title: t('ai_agents'),
        value: statistics.totalAiAgent || 0,
        description: t('active_voice_agents'),
        icon: UserCheck,
        colorClass: 'from-blue-500/10 to-indigo-500/10 text-blue-500 border-blue-500/20',
        glowClass: 'shadow-blue-500/5 hover:border-blue-500/30'
      },
      {
        title: t('sms_agents'),
        value: statistics.totalSmsAgents || 0,
        description: t('active_sms_agents'),
        icon: Megaphone,
        colorClass: 'from-orange-500/10 to-red-500/10 text-orange-500 border-orange-500/20',
        glowClass: 'shadow-orange-500/5 hover:border-orange-500/30'
      },
      {
        title: t('appointments_booked'),
        value: statistics.totalAppointmentsBooked || 0,
        description: t('calendar_bookings'),
        icon: CalendarDays,
        colorClass: 'from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20',
        glowClass: 'shadow-emerald-500/5 hover:border-emerald-500/30'
      },
      {
        title: t('form_submissions'),
        value: statistics.totalFormSubmissions || 0,
        description: t('lead_forms_submitted'),
        icon: FileSpreadsheet,
        colorClass: 'from-sky-500/10 to-cyan-500/10 text-sky-500 border-sky-500/20',
        glowClass: 'shadow-sky-500/5 hover:border-sky-500/30'
      }
    ]
  }, [stats.statistics, t])

  // Weekly call area chart settings
  const weeklyChartOptions = {
    chart: {
      id: 'user-calls-chart',
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      animations: { enabled: false }
    },
    colors: ['#06b6d4', '#6366f1'],
    stroke: { curve: 'smooth' as const, width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: (stats.charts.currentWeekCallChart || []).map(item => item.day),
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
      borderColor: 'rgba(148, 163, 184, 0.08)',
      strokeDashArray: 5
    },
    legend: {
      labels: {
        colors: '#64748b'
      }
    },
    tooltip: { theme: 'dark' }
  }

  const weeklyChartSeries = [
    {
      name: t('inbound'),
      data: (stats.charts.currentWeekCallChart || []).map(item => item.incoming)
    },
    {
      name: t('outbound'),
      data: (stats.charts.currentWeekCallChart || []).map(item => item.outgoing)
    }
  ]

  // Campaign Bar Chart Settings
  const campaignChartOptions = {
    chart: {
      id: 'campaign-bar-chart',
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    colors: ['#8b5cf6', '#f43f5e'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: (stats.charts.currentWeekCampaignChart || []).map((_, idx) => `Week ${idx + 1}`),
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: 'inherit'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: 'inherit'
        }
      }
    },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.1)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    legend: {
      labels: {
        colors: '#64748b'
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `${val || 0} Campaigns`
      }
    }
  }

  const campaignChartSeries = [
    {
      name: t('ai_campaigns'),
      data: (stats.charts.currentWeekCampaignChart || []).map(item => item.ai_campaigns || 0)
    },
    {
      name: t('sms_campaigns'),
      data: (stats.charts.currentWeekCampaignChart || []).map(item => item.sms_campaigns || 0)
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
      className="space-y-8 animate-in fade-in duration-700 p-1"
    >
      <UserHeaderSection
        userName={userName}
        quickAccessItems={quickAccessItems}
        sub={sub}
        router={router}
        t={t}
        cardVariants={cardVariants}
      />

      <UserCounters counterCards={counterCards} />

      <UserChartsAndTables
        stats={stats}
        weeklyChartOptions={weeklyChartOptions}
        weeklyChartSeries={weeklyChartSeries}
        campaignChartOptions={campaignChartOptions}
        campaignChartSeries={campaignChartSeries}
        cardVariants={cardVariants}
        t={t}
      />
    </motion.div>
  )
}
