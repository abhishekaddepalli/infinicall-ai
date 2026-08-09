import { ROUTES } from '@/constants/routes';
import { AdminAdditionalCountersProps } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { Bot, Megaphone, MessageSquare, Network, Send } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CountUp from "react-countup";
import { useTranslation } from 'react-i18next';

export const AdminAdditionalCounters: React.FC<AdminAdditionalCountersProps> = ({ statistics }) => {
  const { t } = useTranslation();

  const items = [
    {
      title: t('total_ai_agents'),
      value: statistics.totalAgentOfCurrentUser || 0,
      description: t('total_ai_agents_desc'),
      icon: Bot,
      colorTheme: 'blue',
      colorClass: 'bg-primary/10 text-primary',
      dashClass: 'bg-primary',
      href: ROUTES.AI_ASSISTANTS
    },
    {
      title: t('total_sms_agents'),
      value: statistics.totalSmsAgentOfCurrentUser || 0,
      description: t('total_sms_agents_desc'),
      icon: MessageSquare,
      colorTheme: 'emerald',
      colorClass: 'bg-incoming-color/10 text-incoming-color',
      dashClass: 'bg-incoming',
      href: ROUTES.SMS_AGENTS
    },
    {
      title: t('total_teams'),
      value: statistics.totalTeamsAcrossAllUser || 0,
      description: t('total_teams_desc'),
      icon: Network,
      colorTheme: 'purple',
      colorClass: 'bg-build-color/10 text-build-color',
      dashClass: 'bg-build',
      href: ROUTES.TEAMS
    },
    {
      title: t('total_campaigns'),
      value: statistics.totalCampaignsOfCurrentUser || 0,
      description: t('total_campaigns_desc'),
      icon: Megaphone,
      colorTheme: 'orange',
      colorClass: 'bg-campaign-color/10 text-campaign-color',
      dashClass: 'bg-campaign',
      href: ROUTES.CAMPAIGNS
    },
    {
      title: t('total_sms_campaigns'),
      value: statistics.totalSmsCampaignOfCurrentUser || 0,
      description: t('total_sms_campaigns_desc'),
      icon: Send,
      colorTheme: 'rose',
      colorClass: 'bg-outgoing-color/10 text-outgoing-color',
      dashClass: 'bg-outgoing',
      href: ROUTES.SMS_CAMPAIGNS
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      className="rounded-radius xl1580:rounded-none overflow-hidden xl1580:overflow-visible shadow-sm xl1580:shadow-none border border-input-border-color xl1580:border-transparent bg-bg-card xl1580:bg-transparent"
    >
      <div className="grid grid-cols-5 xl1580:grid-cols-3 lg870:grid-cols-2! md560:grid-cols-1! gap-0 xl1580:gap-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className={`relative sm:p-6 p-4 flex flex-col items-start gap-4 transition-colors group bg-transparent xl1580:bg-bg-card xl1580:border xl1580:border-input-border-color xl1580:rounded-radius xl1580:shadow-sm ${item.href !== '#' ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${item.colorClass} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-base font-bold text-title mb-1">{item.title}</span>
                <h3 className="text-2xl font-extrabold text-title tracking-tight mb-1">
                  <CountUp end={item.value} duration={2} separator="," />
                </h3>
                <span className="text-md font-medium text-subtitle-color">{item.description}</span>
              </div>

              {/* Custom Divider Lines (Desktop Only) */}
              {index !== items.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-[60%] bg-input-border-color z-10 xl1580:hidden" />
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};
