import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ROUTES } from '@/constants/routes';
import { getImageUrl } from '@/lib/utils';
import { RevenueAndRegistrationsProps } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardChartCard } from './DashboardChartCard';

export const RevenueAndRegistrations: React.FC<RevenueAndRegistrationsProps> = ({
  revenueChartOptions,
  revenueChartSeries,
  recentRegisteredUsers,
  cardVariants,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left: Monthly Revenue Chart (3 columns) */}
      <div className="lg:col-span-3">
        <DashboardChartCard title={t("revenue_trends")} category={t("desc_revenue_trends", "Track incoming payments and active subscriptions.")} badgeText={t("live")} badgeIcon={TrendingUp} badgeColorClass="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" chartType="area" chartOptions={revenueChartOptions} chartSeries={revenueChartSeries} height={340} />
      </div>

      {/* Right: Recent Registrations list view (1 column) */}
      <div className="lg:col-span-2">
        <motion.div variants={cardVariants} className="sm:p-6 p-4 rounded-radius border border-input-border-color bg-bg-card  space-y-6 overflow-hidden justify-between h-full">
          <div>
            <div className="flex items-center justify-between pb-4">
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-title tracking-tight">{t("new_registrations")}</h2>
                <span className="text-md font-medium text-subtitle-color mt-0.5">{t("desc_new_registrations", "Monitor recent sign-ups and newly onboarded accounts.")}</span>
              </div>
              <Link href={ROUTES.MEMBERS} className="text-md font-bold text-subtitle-color cursor-pointer rounded-lg hover:bg-primary/10 p-2 hover:text-primary">
                {t('see_all', 'See All')}
              </Link>
            </div>

            {/* Auto Call Horizontal List View */}
            <div className="space-y-3 max-h-[390px] overflow-y-auto pr-1 no-scrollbar">
              {(recentRegisteredUsers || []).slice(0, 5).map((usr, i) => {
                const avatarSrc = getImageUrl(usr.avatar);
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-input-border-color bg-subcard transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="w-10 h-10 rounded-lg flex-shrink-0 bg-primary/10">
                        {usr.avatar && <AvatarImage src={avatarSrc} alt={usr.name || t('user_image')} referrerPolicy="no-referrer" className="object-cover" />}
                        <AvatarFallback className="rounded-lg bg-transparent text-primary font-bold text-xs uppercase">
                          {usr.name?.slice(0, 2) || t('us')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-md font-bold text-title truncate">{usr.name}</span>
                        <span className="text-md text-subtitle-color font-medium truncate">{usr.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`inline-flex px-2 py-0.5 rounded-full uppercase text-xs font-medium tracking-wider ${usr.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>{usr.roleId?.name || t('user')}</span>
                    </div>
                  </div>
                );
              })}
              {(!recentRegisteredUsers || recentRegisteredUsers.length === 0) && <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">{t("no_new_registrations")}</div>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RevenueAndRegistrations;
