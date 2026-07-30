'use client'

import { useGetAdminSettingsQuery } from '@/redux/api/adminSettingApi'
import { useGetUserDashboardStatsQuery } from '@/redux/api/dashboardApi'
import { usePermission } from './usePermission'

export const useLimits = () => {
  const { role } = usePermission()
  const isUser = role === 'user'

  const { data: settingsData, isLoading: settingsLoading } = useGetAdminSettingsQuery(undefined, {
    skip: !isUser,
  })

  const { data: statsData, isLoading: statsLoading } = useGetUserDashboardStatsQuery(undefined, {
    skip: !isUser,
  })

  const isLoading = settingsLoading || statsLoading

  const settings = settingsData?.settings || settingsData?.data || {}
  const stats = statsData?.data?.statistics || {}

  // 1. Agents
  const agentLimit = Number(settings.default_agent_limit ?? 2)
  const agentUsed = Number(stats.totalAiAgent ?? 0)
  const agentRemaining = Math.max(0, agentLimit - agentUsed)

  // 2. Campaigns
  const campaignLimit = Number(settings.default_campaign_limit_per_day ?? 1)
  const campaignUsed = Number(stats.campaignsUsedToday ?? stats.totalActiveCampaigns ?? 0)
  const campaignRemaining = Math.max(0, campaignLimit - campaignUsed)

  // 3. Flows (Workflow Builder)
  const flowLimit = Number(settings.default_flow_limit ?? 2)
  const flowUsed = Number(stats.totalFlowsCreated ?? 0)
  const flowRemaining = Math.max(0, flowLimit - flowUsed)

  // 4. Knowledge Base
  const kbLimit = Number(settings.default_knowledgebase_limit ?? 5)
  const kbUsed = Number(stats.totalKnowledgebase ?? 0)
  const kbRemaining = Math.max(0, kbLimit - kbUsed)

  // 5. Contacts (Contact Hub)
  const contactLimit = Number(settings.default_contact_limit ?? 100)
  const contactUsed = Number(stats.totalContacts ?? 0)
  const contactRemaining = Math.max(0, contactLimit - contactUsed)

  // 6. SMS Agents
  const smsAgentLimit = Number(settings.default_sms_agent_limit ?? 2)
  const smsAgentUsed = Number(stats.totalSmsAgents ?? 0)
  const smsAgentRemaining = Math.max(0, smsAgentLimit - smsAgentUsed)

  // 7. SMS Campaigns
  const smsCampaignLimit = Number(settings.default_sms_campaign_limit_per_day ?? 1)
  const smsCampaignUsed = Number(stats.totalActiveSmsCampaigns ?? 0)
  const smsCampaignRemaining = Math.max(0, smsCampaignLimit - smsCampaignUsed)

  return {
    isUser,
    isLoading,
    limits: {
      agents: { limit: agentLimit, used: agentUsed, remaining: agentRemaining },
      campaigns: { limit: campaignLimit, used: campaignUsed, remaining: campaignRemaining },
      flows: { limit: flowLimit, used: flowUsed, remaining: flowRemaining },
      kb: { limit: kbLimit, used: kbUsed, remaining: kbRemaining },
      contacts: { limit: contactLimit, used: contactUsed, remaining: contactRemaining },
      sms_agents: { limit: smsAgentLimit, used: smsAgentUsed, remaining: smsAgentRemaining },
      sms_campaigns: { limit: smsCampaignLimit, used: smsCampaignUsed, remaining: smsCampaignRemaining },
    }
  }
}
