export interface WidgetBranding {
  icon_url: string | null
  brand_name: string
  button_label: string
  primary_color: string
  require_terms: boolean
  terms_content: string
}

export interface WidgetBusinessHours {
  enabled: boolean
  timezone: string
  start_time: string
  end_time: string
  days: string[]
}

export interface WidgetSettings {
  allowed_domains: string[]
  business_hours: WidgetBusinessHours
  max_duration: number
  cooldown: number
  max_sessions: number
}

export interface Widget {
  id?: string
  _id?: string
  user_id?: string
  name: string
  agent_id: string | null
  status: 'active' | 'inactive'
  branding: WidgetBranding
  settings: WidgetSettings
  widget_key?: string
  created_at?: string
  updated_at?: string
}

export interface WidgetListResponse {
  success: boolean
  data: Widget[]
}

export interface WidgetDetailResponse {
  success: boolean
  data: Widget
}

export interface WidgetMutationResponse {
  success: boolean
  data: Widget
  message?: string
}

export interface WidgetEmbedResponse {
  success: boolean
  embed_code: string
}

export interface WidgetTokenResponse {
  success: boolean
  token: string
  identity: string
  message?: string
}

export interface WidgetAnalyticsReport {
  _id: string
  name: string
  status: string
  created_at: string
  totalCalls: number
  totalMinutes: number
  totalSeconds: number
}

export interface WidgetAnalyticsData {
  totalWidgets: number
  activeWidgets: number
  totalWidgetCalls: number
  totalWidgetMinutes: number
  totalWidgetSeconds: number
  individualReports: WidgetAnalyticsReport[]
}

export interface WidgetAnalyticsResponse {
  success: boolean
  data: WidgetAnalyticsData
}
