import { PromptTemplate } from "./prompt-template"

export enum TelephonyProvider {
  SARVAM_PLIVO = 'sarvam_plivo',
  SARVAM_TWILIO = 'sarvam_twilio',
  ELEVENLABS_PLIVO = 'elevenlabs_plivo',
  ELEVENLABS_TWILIO = 'elevenlabs_twilio',
  OPENAI_TWILIO = 'openai_twilio',
  ELEVENLABS_SIP = 'elevenlabs_sip',
  META_WHATSAPP = 'meta_whatsapp',
}

export interface Agent {
  _id: string
  id: string
  name: string
  type: 'incoming' | 'flow'
  flow_id?: string | null
  voice_tone?: string | null
  personality?: string | null
  telephony_provider: TelephonyProvider
  voice_id?: string | null
  language: string
  llm_model: LLMModel
  temperature: number
  response_delay: number
  expression_mode: boolean
  system_prompt?: string | null
  first_message?: string | null
  knowledge_base: string[]
  custom_knowledge_base?: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string

  description?: string | null
  speech_speed?: number
  pitch?: number
  empathy_level?: 'low' | 'medium' | 'high'
  energy_level?: 'calm' | 'balanced' | 'energetic'
  idle_timeout?: number
  accuracy_priority?: 'balanced' | 'high_accuracy' | 'low_latency'
  intelligence_level?: number
  response_length?: 'concise' | 'balanced' | 'verbose'
  enable_call_transcription?: boolean
  goodbye_message?: string | null
  transfer_to_human?: {
    enabled: boolean
    transfer_keywords?: string[]
    team_id?: string | null
    member_id?: string | null
  }
  max_call_duration?: number
  enable_call_recording?: boolean

  analytics?: {
    total_calls: number
    success_rate: number
    avg_duration: number
    total_credits: number
    calls_trend?: number[]
    duration_trend?: number[]
  }
}
export interface LLMModel {
  id?: string
  name: string
  display_name?: string
  provider?: string
  model_id?: number
  status?: string
}


export interface AgentListResponse {
  success: boolean
  data: Agent[]
  total: number
  page: number
  limit: number
}

export interface AgentDetailResponse {
  success: boolean
  data: Agent
}

export interface AgentMutationResponse {
  success: boolean
  message: string
  data: Agent
}

export interface AgentDeleteResponse {
  success: boolean
  message: string
}

export interface CreateAgentPayload {
  name: string
  type: 'incoming' | 'flow'
  flow_id?: string | null
  voice_tone?: string | null
  personality?: string | null
  telephony_provider?: TelephonyProvider
  voice_id?: string | null
  language?: string
  llm_model?: string
  temperature?: number
  response_delay?: number
  expression_mode?: boolean
  system_prompt?: string | null
  first_message?: string | null
  knowledge_base?: string[]
  custom_knowledge_base?: string | null
  status?: 'active' | 'inactive'
  description?: string | null
  speech_speed?: number
  pitch?: number
  empathy_level?: 'low' | 'medium' | 'high'
  energy_level?: 'calm' | 'balanced' | 'energetic'
  idle_timeout?: number
  accuracy_priority?: 'balanced' | 'high_accuracy' | 'low_latency'
  intelligence_level?: number
  response_length?: 'concise' | 'balanced' | 'verbose'
  enable_call_transcription?: boolean
  goodbye_message?: string | null
  transfer_to_human?: {
    enabled: boolean
    transfer_keywords?: string[]
    team_id?: string | null
    member_id?: string | null
  }
  max_call_duration?: number
  enable_call_recording?: boolean
}

export interface UpdateAgentPayload extends Partial<CreateAgentPayload> {
  id: string
}

export interface GetAgentsParams {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface AgentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: CreateAgentPayload) => void
  initialData?: Agent | null
  isLoading?: boolean
}

export interface AgentHeaderProps {
  agentId: string | null
  children?: React.ReactNode
  centerContent?: React.ReactNode
}

export interface AgentTypeTabsProps {
  type: 'incoming' | 'flow'
  setType: (type: 'incoming' | 'flow') => void
}

export interface CoreIntelligenceCardProps {
  name: string
  setName: (name: string) => void
  description: string
  setDescription: (desc: string) => void
  language: string
  setLanguage: (lang: string) => void
  llmModel: string
  setLlmModel: (model: string) => void
  type: 'incoming' | 'flow'
  voiceTone: string
  setVoiceTone: (tone: string) => void
  personality: string
  setPersonality: (personality: string) => void
  flowId: string
  setFlowId: (id: string) => void
  flowsData?: import('./flow').FlowListResponse | null
}

export interface FloatingActionBarProps {
  isCreating: boolean
  isUpdating: boolean
  isFormValid: boolean
  agentId: string | null
  onSubmit: () => void
}

export interface KnowledgeBaseCardProps {
  knowledgeBase: string[]
  toggleKb: (id: string) => void
  kbData?: any | null
  customKnowledgeBase: string
  setCustomKnowledgeBase: (kb: string) => void
}

export interface PromptingArchitectureCardProps {
  systemPrompt: string
  setSystemPrompt: (prompt: string) => void
  firstMessage: string
  setFirstMessage: (msg: string) => void
  goodbyeMessage: string
  setGoodbyeMessage: (msg: string) => void
}

export interface PromptTemplateCardProps {
  template: PromptTemplate
  onApplyTemplate: (systemPrompt: string, welcomeMessage: string, goodbyeMessage: string) => void
}

export interface PromptTemplatesSectionProps {
  onApplyTemplate: (systemPrompt: string, welcomeMessage: string, goodbyeMessage: string) => void
}

export interface TelephonyVoiceCardProps {
  telephonyProvider: TelephonyProvider
  setTelephonyProvider: (provider: TelephonyProvider) => void
  voiceId: string
  setVoiceId: (id: string) => void
  voicesData?: import('./voice').VoiceResponse | null
  idleTimeout: number
  setIdleTimeout: (timeout: number) => void
  maxCallDuration: number
  setMaxCallDuration: (duration: number) => void
  enableCallTranscription: boolean
  setEnableCallTranscription: (enable: boolean) => void
  enableCallRecording: boolean
  setEnableCallRecording: (enable: boolean) => void
  transferEnabled: boolean
  setTransferEnabled: (enable: boolean) => void
  transferKeywords: string[]
  setTransferKeywords: (keywords: string[]) => void
  teamId: string | null
  setTeamId: (id: string | null) => void
  memberId: string | null
  setMemberId: (id: string | null) => void
}

export interface TuningParametersCardProps {
  temperature: number
  setTemperature: (temp: number) => void
  intelligenceLevel: number
  setIntelligenceLevel: (level: number) => void
}

export interface BehavioralConfigCardProps {
  empathyLevel: 'low' | 'medium' | 'high'
  setEmpathyLevel: (level: 'low' | 'medium' | 'high') => void
  energyLevel: 'calm' | 'balanced' | 'energetic'
  setEnergyLevel: (level: 'calm' | 'balanced' | 'energetic') => void
  accuracyPriority: 'balanced' | 'high_accuracy' | 'low_latency'
  setAccuracyPriority: (priority: 'balanced' | 'high_accuracy' | 'low_latency') => void
  responseLength: 'concise' | 'balanced' | 'verbose'
  setResponseLength: (len: 'concise' | 'balanced' | 'verbose') => void
}

export interface VoiceAudioSettingsCardProps {
  responseDelay: number
  setResponseDelay: (delay: number) => void
  speechSpeed: number
  setSpeechSpeed: (speed: number) => void
  pitch: number
  setPitch: (pitch: number) => void
}


export interface AgentItemProps {
  agent: Agent
  viewMode: 'grid' | 'list'
  isLastItem?: boolean
  onStatusChange: (agent: Agent) => void
  onTestFlow: (agent: Agent) => void
  onEdit: (agent: Agent) => void
  onDelete: (id: string) => void
  getVoiceName: (voiceId: string) => string
}