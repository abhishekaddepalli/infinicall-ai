import { ROUTES } from '@/constants/routes';
import { AdminLowerSectionProps } from '@/types/dashboard';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { MessageSquare, PieChart, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardChartCard } from './DashboardChartCard';

export const AdminLowerSection: React.FC<AdminLowerSectionProps> = ({
  recentContacts,
  recentSmsCampaigns,
  agentPieChart,
  cardVariants,
}) => {
  const { t } = useTranslation();

  // Agent Pie Chart configuration
  const pieChartLabels = [
    t('ai_agents'),
    t('sms_agents')
  ];

  const pieChartSeries = [
    agentPieChart?.agent || 0,
    agentPieChart?.sms_agent || 0
  ];

  const pieChartOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    labels: pieChartLabels,
    colors: ['#3b82f6', '#10b981'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              color: 'var(--title)'
            },
            value: {
              show: true,
              color: 'var(--title)',
              formatter: (val: number) => val.toString(),
            },
            total: {
              show: true,
              showAlways: true,
              label: t('total'),
              color: 'var(--title)',
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#64748b'
      }
    },
    stroke: {
      show: true,
      colors: ['transparent'],
      width: 2
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Recent Contacts */}
      <div className="lg:col-span-1">
        <motion.div
          variants={cardVariants}
          className="sm:p-6 p-4 rounded-radius border border-input-border-color bg-bg-card flex flex-col h-full"
        >
          <div className="flex items-center justify-between pb-4 shrink-0">
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-title tracking-tight break-all whitespace-normal line-clamp-1">{t('recent_contacts')}</h2>
              <span className="text-md font-medium text-subtitle-color mt-0.5">{t('desc_recent_contacts', 'Review recently added customer profiles and leads.')}</span>
            </div>
            <Link href={ROUTES.CONTACT_HUB} className="text-md font-bold text-subtitle-color cursor-pointer hover:bg-primary/10 p-2 hover:text-primary rounded-lg whitespace-nowrap shrink-0 ml-4">
              {t('see_all', 'See All')}
            </Link>
          </div>

          <div className="overflow-y-auto no-scrollbar pr-2 max-h-[334px]">
            {(recentContacts || []).map((contact: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 mb-3 rounded-lg border border-input-border-color bg-subcard transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-md font-bold text-title truncate">{contact.name || contact.first_name || t('unknown')}</span>
                    <span className="text-md text-subtitle-color font-medium truncate mt-0.5">{contact.phone_number || contact.phone || ''}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-sm font-medium text-subtitle-color">
                    {formatDate(contact.created_at)}
                  </span>
                </div>
              </div>
            ))}
            {(!recentContacts || recentContacts.length === 0) && (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                {t('no_contacts_recorded')}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Center: Agent Pie Chart */}
      <div className="lg:col-span-1">
        <DashboardChartCard
          title={t('agent_distribution')}
          category={t('desc_agent_distribution', 'Analyze your active AI versus SMS agents.')}
          badgeText={t('all_time')}
          badgeIcon={PieChart}
          badgeColorClass="bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
          chartType="donut"
          chartOptions={pieChartOptions}
          chartSeries={pieChartSeries}
          height={280}
        />
      </div>

      {/* Right: Recent SMS Campaigns */}
      <div className="lg:col-span-1">
        <motion.div
          variants={cardVariants}
          className="sm:p-6 p-4 rounded-radius border border-input-border-color bg-bg-card flex flex-col h-full"
        >
          <div className="flex items-center justify-between pb-4 shrink-0">
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-title tracking-tight">{t('recent_sms_campaigns')}</h2>
              <span className="text-md font-medium text-subtitle-color mt-0.5">{t('desc_recent_sms_campaigns', 'Monitor delivery and status of recent text campaigns.')}</span>
            </div>
            <Link href={ROUTES.SMS_CAMPAIGNS} className="text-md font-bold text-subtitle-color cursor-pointer hover:bg-primary/10 p-2 hover:text-primary rounded-lg whitespace-nowrap shrink-0 ml-4">
              {t('see_all', 'See All')}
            </Link>
          </div>

          <div className="overflow-y-auto no-scrollbar pr-2 max-h-[334px]">
            {(recentSmsCampaigns || []).map((campaign: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 mb-3 rounded-lg border border-input-border-color bg-subcard transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-md font-bold text-title truncate">{campaign.name || t('untitled_campaign')}</span>
                    <span className="text-md text-subtitle-color font-medium truncate mt-0.5">{formatDate(campaign.created_at)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${(campaign.status || campaign.campaignStatus || '').toLowerCase() === 'completed'
                    ? 'bg-edit/10 text-edit'
                    : (campaign.status || campaign.campaignStatus || '').toLowerCase() === 'active'
                      ? 'bg-blue-500/10 text-blue-500'
                      : (campaign.status || campaign.campaignStatus || '').toLowerCase() === 'failed'
                        ? 'bg-destructive/10 text-destructive'
                        : (campaign.status || campaign.campaignStatus || '').toLowerCase() === 'pending'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-slate-500/10 text-slate-500'
                    }`}>
                    {t(`${campaign.status || campaign.campaignStatus || t('draft')}`)}
                  </span>
                </div>
              </div>
            ))}
            {(!recentSmsCampaigns || recentSmsCampaigns.length === 0) && (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                {t('no_sms_campaigns')}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
