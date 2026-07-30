import { BookOpen, HardDrive, Layers, PhoneCall, Sliders, Sparkles, Users, MessageSquare, Send, MessageCircle } from 'lucide-react'

export const creditFields = [
  {
    name: 'free_credits',
    label: 'Welcome Free Credits',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-amber-500',
    isCredit: true,
  },
]

export const generalResourceLimit = [
  { name: 'document_file_limit', label: 'document_limit_mb', icon: '📄' },
  { name: 'audio_file_limit', label: 'audio_limit_mb', icon: '🎵' },
  { name: 'video_file_limit', label: 'video_limit_mb', icon: '🎬' },
  { name: 'image_file_limit', label: 'image_limit_mb', icon: '🖼️' },
  { name: 'multiple_file_share_limit', label: 'share_limit', icon: '🔗' },
  { name: 'session_expiration_days', label: 'session_expiration_days', icon: '⏳' },
  { name: 'session_limit', label: 'session_limit', icon: '💻' },
  { name: 'trial_days_limit', label: 'trial_days_limit', icon: '🎁' },
]

export const emailInstruction = [
  "Choose 'sendmail' for the Mail Driver if you run into problems with SMTP.",
  "Use the Mail Host settings provided by your email service's manual.",
  'Set the Mail port to 587.',
  'If there are issues with TLS, set the Mail Encryption to SSL.',
]

export const emailInstructionSSL = [
  "Again, choose 'sendmail' if there are issues with SMTP.",
  "Use the Mail Host settings provided by your email service's manual.",
  'Set the Mail port to 465.',
  'Set the Mail Encryption to SSL.',
]

export const getLimitCards = (t: any) => [
  {
    name: 'default_agent_limit',
    label: t('default_agent_limit_label'),
    placeholder: '2',
    description: t('default_agent_limit_desc'),
    icon: <Users className="w-5 h-5 text-indigo-500" />,
  },
  {
    name: 'default_campaign_limit_per_day',
    label: t('default_campaign_limit_per_day_label'),
    placeholder: '1',
    description: t('default_campaign_limit_per_day_desc'),
    icon: <PhoneCall className="w-5 h-5 text-emerald-500" />,
  },
  {
    name: 'default_flow_limit',
    label: t('default_flow_limit_label'),
    placeholder: '2',
    description: t('default_flow_limit_desc'),
    icon: <Layers className="w-5 h-5 text-amber-500" />,
  },
  {
    name: 'default_knowledgebase_limit',
    label: t('default_knowledgebase_limit_label'),
    placeholder: '5',
    description: t('default_knowledgebase_limit_desc'),
    icon: <BookOpen className="w-5 h-5 text-blue-500" />,
  },
  {
    name: 'default_storage_limit',
    label: t('default_storage_limit_label'),
    placeholder: '20',
    description: t('default_storage_limit_desc'),
    icon: <HardDrive className="w-5 h-5 text-rose-500" />,
  },
  {
    name: 'default_contact_limit',
    label: t('default_contact_limit_label'),
    placeholder: '100',
    description: t('default_contact_limit_desc'),
    icon: <Sliders className="w-5 h-5 text-purple-500" />,
  },
  {
    name: 'default_sms_agent_limit',
    label: t('default_sms_agent_limit_label'),
    placeholder: '2',
    description: t('default_sms_agent_limit_desc'),
    icon: <MessageSquare className="w-5 h-5 text-indigo-400" />,
  },
  {
    name: 'default_sms_campaign_limit_per_day',
    label: t('default_sms_campaign_limit_per_day_label'),
    placeholder: '1',
    description: t('default_sms_campaign_limit_per_day_desc'),
    icon: <Send className="w-5 h-5 text-emerald-400" />,
  },
  {
    name: 'default_campaign_sms_limit',
    label: t('default_campaign_sms_limit_label'),
    placeholder: '100',
    description: t('default_campaign_sms_limit_desc'),
    icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
  },
]

export const limitFields = (t: any) => [
  {
    key: 'agent_limit',
    label: t('agent_limit'),
  },
  {
    key: 'campaign_limit_per_day',
    label: t('campaign_limit_per_day'),
  },
  {
    key: 'flow_limit',
    label: t('flow_limit'),
  },
  {
    key: 'knowledgebase_limit',
    label: t('knowledgebase_limit'),
  },
  {
    key: 'storage_limit',
    label: t('storage_limit'),
  },
  {
    key: 'contact_limit',
    label: t('contact_limit'),
  },
  {
    key: 'sms_agent_limit',
    label: t('sms_agent_limit'),
  },
  {
    key: 'sms_campaign_limit_per_day',
    label: t('sms_campaign_limit_per_day', {
      defaultValue: 'SMS Campaign Limit Per Day',
    }),
  },
  {
    key: 'campaign_sms_limit',
    label: t('campaign_sms_limit'),
  },
]

export const currencies = (t: any) => [
  { value: 'USD', label: t('usd') },
  { value: 'INR', label: t('inr') },
  { value: 'EUR', label: t('eur') },
  { value: 'GBP', label: t('gbp') },
]

export const switchFields = (t: any) => [
  {
    key: 'is_popular',
    title: t('popular_plan'),
    description: t('popular_plan_desc'),
  },

  {
    key: 'is_active',
    title: t('active_status'),
    description: t('plan_status_desc'),
  },
]
