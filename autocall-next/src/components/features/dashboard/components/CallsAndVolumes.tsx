import { CallsAndVolumesProps } from '@/types/dashboard';
import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardChartCard } from './DashboardChartCard';

export const CallsAndVolumes: React.FC<CallsAndVolumesProps> = ({
  recentCallsOfCurrentUser,
  callsChartOptions,
  callsChartSeries,
  cardVariants,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left: Recent Calls table view (2 columns) */}
      <div className="lg:col-span-2">
        <motion.div
          variants={cardVariants}
          className="rounded-radius border border-input-border-color bg-bg-card  space-y-6 overflow-hidden flex flex-col h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between sm:p-6 p-4  border-b border-slate-50 dark:border-white/5 pb-4">
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-title tracking-tight">{t('recent_calls')}</h2>
                <span className="text-md font-medium text-subtitle-color mt-0.5">{t('desc_recent_calls', 'Review logs and status for recent interactions.')}</span>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-subcard dark:border-white/5">
                    <th className="p-3 pl-6 rtl:pr-6 rtl:pl-0 text-xs font-bold uppercase text-subtitle-color tracking-wider">{t('recipient')}</th>
                    <th className="p-3 rtl:pr-3 rtl:pl-0 text-xs font-bold uppercase text-subtitle-color tracking-wider">{t('type')}</th>
                    <th className="p-3 rtl:pr-3 rtl:pl-0 text-xs font-bold uppercase text-subtitle-color tracking-wider">{t('duration')}</th>
                    <th className="p-3 text-xs font-bold uppercase text-subtitle-color tracking-wider">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-input-border-color dark:divide-white/5">
                  {(recentCallsOfCurrentUser || []).map((call, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3 md560:min-w-[150px] pl-6 text-xs font-bold text-slate-800 dark:text-slate-100">
                        {call.direction === 'inbound'
                          ? (call.from_number || call.from_phone_number || '-')
                          : (call.to_number || call.to_phone_number || '-')}
                      </td>
                      <td className="p-3 md560:min-w-[150px]">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-sm font-bold  ${call.direction === 'inbound' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-indigo-500/10 text-indigo-500'
                          }`}>
                          {call.direction === 'inbound' ? t('inbound') : t('outbound')}
                        </span>
                      </td>
                      <td className="p-3 md560:min-w-[150px] text-xs font-semibold text-slate-500 dark:text-slate-400">{call.duration || 0}s</td>
                      <td className="p-3 md560:min-w-[150px]">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-sm font-bold ${call.status === 'completed' ? 'bg-edit/10 text-edit' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                          {t(`${call.status}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!recentCallsOfCurrentUser || recentCallsOfCurrentUser.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                        {t('no_calls_recorded')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right: Weekly Call Volume chart view (1 column) */}
      <div className="lg:col-span-2">
        <DashboardChartCard
          title={t('call_volumes')}
          category={t('desc_call_volumes', 'Visualize total call traffic and peak periods.')}
          chartType="bar"
          chartOptions={callsChartOptions}
          chartSeries={callsChartSeries}
          height={320}
        />
      </div>
    </div>
  );
};

export default CallsAndVolumes;
