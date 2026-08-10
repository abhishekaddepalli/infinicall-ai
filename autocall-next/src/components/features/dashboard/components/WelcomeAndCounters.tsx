import { ROUTES } from '@/constants/routes';
import { useAppSelector } from '@/redux/hooks';
import { WelcomeAndCountersProps } from '@/types/dashboard';
import { Contact2, DollarSign, GitBranch, PhoneCall, UserPlus, Users } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatsCard } from './StatsCard';
import { WelcomeCard } from './WelcomeCard';

export const WelcomeAndCounters: React.FC<WelcomeAndCountersProps> = ({ statistics }) => {
  const { t } = useTranslation();
  const user = useAppSelector((state: any) => state.auth?.user);
  const userName = user?.name || t('admin');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      {/* Left Side: Welcome Card */}
      <div className="lg:col-span-2 flex">
        <WelcomeCard
          badge={t('autocall_workspace')}
          title={`${t('hello')}, ${userName}`}
          subtitle={t('admin_subtitle')}
          gradientClass=""
          className="sm:p-6 p-4 flex flex-col justify-between w-full h-full"
        />
      </div>

      {/* Right Side: 6 Counters Grid */}
      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Revenue */}
        <StatsCard
          title={t('total_revenue')}
          value={statistics.totalRevenue || 0}
          description={t('all_time_earnings')}
          icon={DollarSign}
          colorClass="from-primary/10 to-primary/10 text-primary border-primary/20"
          glowClass="shadow-primary/5 hover:border-primary/30"
          prefix="₹"
          href={ROUTES.TRANSACTIONS}
        />

        {/* Card 2: Active Subscribers */}
        <StatsCard
          title={t('active_subscribers')}
          value={statistics.activeSubscribers || 0}
          description={t('paying_accounts')}
          icon={Users}
          colorClass="from-incoming-color/10 to-incoming-color/10 text-incoming-color border-incoming-color/20"
          glowClass="shadow-incoming-color/5 hover:border-incoming-color/30"
          href={ROUTES.SUBSCRIPTIONS}
        />

        {/* Card 3: New Users This Week */}
        <StatsCard
          title={t('new_users_week')}
          value={statistics.newUsersThisWeek || 0}
          description={t('weekly_onboarding')}
          icon={UserPlus}
          colorClass="from-build-color/10 to-build-color/10 text-build-color border-build-color/20"
          glowClass="shadow-build-color/5 hover:border-build-color/30"
          href={ROUTES.MEMBERS}
        />

        {/* Card 4: Total Flows */}
        <StatsCard
          title={t('total_flows')}
          value={statistics.totalFlowsOfCurrentUser || 0}
          description={t('total_flows_desc')}
          icon={GitBranch}
          colorClass="from-campaign-color/10 to-campaign-color/10 text-campaign-color border-campaign-color/20"
          glowClass="shadow-campaign-color/5 hover:border-campaign-color/30"
          href={ROUTES.WORKFLOW_BUILDER}
        />

        {/* Card 5: Total Templates */}
        <StatsCard
          title={t('total_templates')}
          value={statistics.totalTemplatesOfCurrentUser || 0}
          description={t('total_templates_desc')}
          icon={PhoneCall}
          colorClass="from-outgoing-color/10 to-outgoing-color/10 text-outgoing-color border-outgoing-color/20"
          glowClass="shadow-outgoing-color/5 hover:border-outgoing-color/30"
          href={ROUTES.PROMPT_TEMPLATES}
        />

        {/* Card 6: Saved Contacts */}
        <StatsCard
          title={t('saved_contacts')}
          value={statistics.totalContactOfCurrentUser || 0}
          description={t('contacts_network')}
          icon={Contact2}
          colorClass="from-primary/10 to-primary/10 text-primary border-primary/20"
          glowClass="shadow-primary/5 hover:border-primary/30"
          href={ROUTES.CONTACT_HUB}
        />
      </div>
    </div>
  );
};

export default WelcomeAndCounters;
