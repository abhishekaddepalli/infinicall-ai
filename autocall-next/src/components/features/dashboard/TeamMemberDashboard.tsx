'use client'

import { TeamMemberDashboardProps } from '@/types/dashboard'
import { motion } from 'framer-motion'
import { ArrowRightLeft, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TeamMemberCounters, TeamMemberRecentCalls } from './components'

export const TeamMemberDashboard = ({ stats, onSearchChange }: TeamMemberDashboardProps) => {
  const { t } = useTranslation()

  const statistics = stats?.statistics || {}
  
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if (h > 0) return `${h}h ${m}m ${s}s`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  // 4 stats counter definitions
  const counterCards = useMemo(() => {
    return [
      {
        title: t('total_transferred'),
        value: statistics.totalTransferredCalls || 0,
        description: t('total_calls_handled'),
        icon: ArrowRightLeft,
        colorClass: 'from-indigo-500/10 to-blue-500/10 text-indigo-500 border-indigo-500/20',
        glowClass: 'shadow-indigo-500/5 hover:border-indigo-500/30'
      },
      {
        title: t('success_calls'),
        value: statistics.successCalls || 0,
        description: `${statistics.successRate || 0}% ${t('success_rate')}`,
        icon: CheckCircle2,
        colorClass: 'from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20',
        glowClass: 'shadow-emerald-500/5 hover:border-emerald-500/30'
      },
      {
        title: t('failed_calls'),
        value: statistics.failedCalls || 0,
        description: `${statistics.failedRate || 0}% ${t('failed_rate')}`,
        icon: XCircle,
        colorClass: 'from-rose-500/10 to-pink-500/10 text-rose-500 border-rose-500/20',
        glowClass: 'shadow-rose-500/5 hover:border-rose-500/30'
      },
      {
        title: t('total_duration'),
        value: formatDuration(statistics.totalDuration || 0),
        description: t('total_time_spent'),
        icon: Clock,
        colorClass: 'from-cyan-500/10 to-teal-500/10 text-cyan-500 border-cyan-500/20',
        glowClass: 'shadow-cyan-500/5 hover:border-cyan-500/30'
      }
    ]
  }, [statistics, t])

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
      <TeamMemberCounters counterCards={counterCards} />

      <TeamMemberRecentCalls
        stats={stats}
        cardVariants={cardVariants}
        t={t}
        onSearchChange={onSearchChange}
      />
    </motion.div>
  )
}
