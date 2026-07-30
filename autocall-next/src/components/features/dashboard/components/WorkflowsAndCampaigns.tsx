import { ROUTES } from '@/constants/routes';
import { WorkflowsAndCampaignsProps } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const WorkflowsAndCampaigns: React.FC<WorkflowsAndCampaignsProps> = ({
  systemFlow,
  recentCampaigns,
  cardVariants,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: System Workflows list view (1 column) */}
      <div className="lg:col-span-1">
        <motion.div
          variants={cardVariants}
          className="sm:p-6 p-4 rounded-radius border border-input-border-color bg-bg-card space-y-6 overflow-hidden justify-between h-full"
        >
          <div>
            <div className="flex items-center justify-between pb-4">
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-title tracking-tight">{t('system_workflows')}</h2>
                <span className="text-md font-medium text-subtitle-color mt-0.5">{t('desc_system_workflows', 'Manage your active AI conversational pathways.')}</span>
              </div>
              <Link href={ROUTES.WORKFLOW_BUILDER} className="text-md font-bold text-subtitle-color cursor-pointer shrink-0">
                {t('see_all', 'See All')}
              </Link>
            </div>

            {/* AutoCall Horizontal List View */}
            <div className="max-h-[318px] overflow-auto no-scrollbar">
              {(systemFlow || []).map((flow, i) => (
                <div key={i} className="flex items-center justify-between p-3 mb-3 rounded-lg border border-input-border-color bg-subcard transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-md font-bold text-title truncate">{flow.name}</span>
                      <span className="text-md text-subtitle-color font-medium truncate mt-0.5">{flow.language || t('english')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-600/10 text-green-600">
                      {flow.flowStatus || t('active')}
                    </span>
                  </div>
                </div>
              ))}
              {(!systemFlow || systemFlow.length === 0) && (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  {t('no_system_flows')}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right: Recent Campaigns table view (2 columns) */}
      <div className="lg:col-span-2">
        <motion.div
          variants={cardVariants}
          className="rounded-radius border border-input-border-color bg-bg-card space-y-6 overflow-hidden justify-between h-full"
        >
          <div>
            <div className="flex flex-wrap gap-3 items-center sm:p-6 p-4  justify-between border-b border-slate-50 dark:border-white/5 pb-4">
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-title tracking-tight">{t('recent_campaigns')}</h2>
                <span className="text-md font-medium text-subtitle-color mt-0.5">{t('desc_recent_campaigns', 'Track the status of your recent outbound campaigns.')}</span>
              </div>
              <Link href={ROUTES.CAMPAIGNS} className="text-md font-bold text-subtitle-color cursor-pointer">
                {t('see_all', 'See All')}
              </Link>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="border-b border-input-border-color bg-subcard">
                    <th className="p-3 pl-6 rtl:pr-6 rtl:pl-0 text-xs font-bold uppercase text-subtitle-color tracking-wider">{t('campaign')}</th>
                    <th className="p-3 rtl:pr-3 rtl:pl-0 text-xs font-bold uppercase text-subtitle-color tracking-wider">{t('type')}</th>
                    <th className="p-3 rtl:pr-3 rtl:pl-0 text-xs font-bold uppercase text-subtitle-color tracking-wider">{t('number')}</th>
                    <th className="p-3 text-xs font-bold uppercase text-subtitle-color tracking-wider">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-input-border-color dark:divide-white/5">
                  {(recentCampaigns || []).map((cpn, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3 md560:min-w-[200px] pl-6 text-xs font-bold text-slate-800 dark:text-slate-100">{cpn.name}</td>
                      <td className="p-3 md560:min-w-[200px] text-sm font-medium capitalize text-subtitle-color">{cpn.typeId?.name || t('manual')}</td>
                      <td className="p-3 md560:min-w-[200px] text-sm text-subtitle-color font-medium">{cpn.phoneNumberId?.phone_number || t('default')}</td>
                      <td className="p-3 md560:min-w-[200px]">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium tracking-wider ${(cpn.campaignStatus || '').toLowerCase() === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : (cpn.campaignStatus || '').toLowerCase() === 'active'
                            ? 'bg-blue-500/10 text-blue-500'
                            : (cpn.campaignStatus || '').toLowerCase() === 'failed'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-slate-500/10 text-slate-500'
                          }`}>
                          {cpn.campaignStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!recentCampaigns || recentCampaigns.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center items-center justify-center text-xs text-subtitle-color font-semibold uppercase tracking-wider">
                        {t('no_campaigns')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkflowsAndCampaigns;
