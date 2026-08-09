'use client'

import { WelcomeCard } from './WelcomeCard'

export function TeamMemberHeaderSection({
  t,
}: {
  t: any
}) {
  return (
    <WelcomeCard
      badge={t('team_member_portal')}
      title={t('welcome_team_member')}
      subtitle={t('team_member_subtitle')}
      gradientClass=""
      className="sm:p-6 p-4 flex flex-col justify-between w-full h-full border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
    />
  )
}
