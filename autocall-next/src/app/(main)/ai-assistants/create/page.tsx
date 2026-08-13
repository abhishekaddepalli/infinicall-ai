'use client'

import { AgentHeader } from '@/components/features/agents/AgentHeader'
import { AgentTypeTabs } from '@/components/features/agents/AgentTypeTabs'
import { BehavioralConfigCard } from '@/components/features/agents/BehavioralConfigCard'
import { CoreIntelligenceCard } from '@/components/features/agents/CoreIntelligenceCard'
import { FloatingActionBar } from '@/components/features/agents/FloatingActionBar'
import { KnowledgeBaseCard } from '@/components/features/agents/KnowledgeBaseCard'
import { PromptingArchitectureCard } from '@/components/features/agents/PromptingArchitectureCard'
import { PromptTemplatesSection } from '@/components/features/agents/PromptTemplatesSection'
import { TelephonyVoiceCard } from '@/components/features/agents/TelephonyVoiceCard'
import { TuningParametersCard } from '@/components/features/agents/TuningParametersCard'
import { VoiceAudioSettingsCard } from '@/components/features/agents/VoiceAudioSettingsCard'
import DataLoader from '@/components/reusable/DataLoader'
import { ROUTES } from '@/constants/routes'
import {
  useCreateAgentMutation,
  useGetAgentByIdQuery,
  useUpdateAgentMutation
} from '@/redux/api/agentApi'
import { useGetFlowsQuery } from '@/redux/api/flowApi'
import { useGetKnowledgeBaseQuery } from '@/redux/api/knowledgeBaseApi'
import { useGetVoicesQuery } from '@/redux/api/voiceApi'
import { TelephonyProvider, VoiceProvider } from '@/types/agent'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function CreateAgentPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const agentId = searchParams.get('id')

  // Tab/Type selection state
  const [type, setType] = useState<'incoming' | 'flow'>('incoming')

  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [voiceTone, setVoiceTone] = useState('Professional')
  const [personality, setPersonality] = useState('Helpful')
  const [telephonyProvider, setTelephonyProvider] = useState<TelephonyProvider>(TelephonyProvider.VOBIZ)
  const [sipTrunkId, setSipTrunkId] = useState('')
  const [voiceProvider, setVoiceProvider] = useState<VoiceProvider>(VoiceProvider.ELEVENLABS)
  const [flowId, setFlowId] = useState('')
  const [voiceId, setVoiceId] = useState('')
  const [language, setLanguage] = useState('en')
  const [llmModel, setLlmModel] = useState('')
  const [temperature, setTemperature] = useState(0.5)
  const [responseDelay, setResponseDelay] = useState(0)
  const [expressionMode, setExpressionMode] = useState(false)

  // New tuning parameters
  const [speechSpeed, setSpeechSpeed] = useState(1.0)
  const [pitch, setPitch] = useState(0)
  const [empathyLevel, setEmpathyLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [energyLevel, setEnergyLevel] = useState<'calm' | 'balanced' | 'energetic'>('balanced')
  const [accuracyPriority, setAccuracyPriority] = useState<'balanced' | 'high_accuracy' | 'low_latency'>('balanced')
  const [intelligenceLevel, setIntelligenceLevel] = useState(7)
  const [responseLength, setResponseLength] = useState<'concise' | 'balanced' | 'verbose'>('balanced')

  const [systemPrompt, setSystemPrompt] = useState('')
  const [firstMessage, setFirstMessage] = useState('')
  const [goodbyeMessage, setGoodbyeMessage] = useState('')
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>([])
  const [customKnowledgeBase, setCustomKnowledgeBase] = useState('')

  // Telephony & Call settings
  const [idleTimeout, setIdleTimeout] = useState(60)
  const [maxCallDuration, setMaxCallDuration] = useState(3600)
  const [enableCallTranscription, setEnableCallTranscription] = useState(true)
  const [enableCallRecording, setEnableCallRecording] = useState(false)

  // Transfer to Human
  const [transferEnabled, setTransferEnabled] = useState(false)
  const [transferKeywords, setTransferKeywords] = useState<string[]>([])
  const [teamId, setTeamId] = useState<string | null>(null)
  const [memberId, setMemberId] = useState<string | null>(null)

  // API Queries & Mutations
  const { data: flowsData } = useGetFlowsQuery({ limit: 100 })
  const { data: kbData } = useGetKnowledgeBaseQuery({ limit: 100 })
  const { data: voicesData } = useGetVoicesQuery()

  const { data: agentDetails, isLoading: isLoadingAgent } = useGetAgentByIdQuery(agentId || '', { skip: !agentId })
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation()
  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation()

  // Load existing agent data if editing
  useEffect(() => {
    if (agentDetails?.data) {
      const agent = agentDetails.data
      setName(agent.name || '')
      setDescription(agent.description || '')
      setType(agent.type || 'incoming')
      setVoiceTone(agent.voice_tone || 'Professional')
      setPersonality(agent.personality || 'Helpful')
      setTelephonyProvider(agent.telephony_provider || TelephonyProvider.VOBIZ)
      setSipTrunkId(agent.sip_trunk_id || '')
      setVoiceProvider(agent.voice_provider || VoiceProvider.ELEVENLABS)
      setFlowId(agent.flow_id || '')
      setVoiceId(agent.voice_id || '')
      setLanguage(agent.language || 'en')
      setLlmModel(agent.llm_model?._id || agent.llm_model?.id || agent.llm_model || '')
      setTemperature(agent.temperature ?? 0.5)
      setResponseDelay(agent.response_delay ?? 0)
      setExpressionMode(agent.expression_mode ?? false)

      setSpeechSpeed(agent.speech_speed ?? 1.0)
      setPitch(agent.pitch ?? 0)
      setEmpathyLevel(agent.empathy_level || 'medium')
      setEnergyLevel(agent.energy_level || 'balanced')
      setAccuracyPriority(agent.accuracy_priority || 'balanced')
      setIntelligenceLevel(agent.intelligence_level ?? 7)
      setResponseLength(agent.response_length || 'balanced')

      setSystemPrompt(agent.system_prompt || '')
      setFirstMessage(agent.first_message || '')
      setGoodbyeMessage(agent.goodbye_message || '')
      setKnowledgeBase((agent.knowledge_base || []).map((kb: any) => typeof kb === 'string' ? kb : (kb._id || kb.id)))
      setCustomKnowledgeBase(agent.custom_knowledge_base || '')

      setIdleTimeout(agent.idle_timeout ?? 60)
      setMaxCallDuration(agent.max_call_duration ?? 3600)
      setEnableCallTranscription(agent.enable_call_transcription ?? true)
      setEnableCallRecording(agent.enable_call_recording ?? false)

      if (agent.transfer_to_human) {
        setTransferEnabled(agent.transfer_to_human.enabled || false)
        setTransferKeywords(agent.transfer_to_human.transfer_keywords || [])
        setTeamId(agent.transfer_to_human.team_id || null)
        setMemberId(agent.transfer_to_human.member_id || null)
      }
    }
  }, [agentDetails])

  const isFormValid = name.trim().length > 0 && (type === 'incoming' || (type === 'flow' && !!flowId))

  const toggleKb = (id: string) => {
    setKnowledgeBase(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid) return
    try {
      const payload = {
        name,
        description,
        type,
        flow_id: type === 'flow' ? (flowId || null) : null,
        voice_tone: type === 'incoming' ? voiceTone : null,
        personality: type === 'incoming' ? personality : null,
        telephony_provider: telephonyProvider,
        sip_trunk_id: (telephonyProvider === TelephonyProvider.SIP || (telephonyProvider as string) === 'sip') ? (sipTrunkId || null) : null,
        voice_provider: voiceProvider,
        voice_id: voiceId || null,
        language,
        llm_model: llmModel || null,
        temperature,
        response_delay: responseDelay,
        expression_mode: expressionMode,

        speech_speed: speechSpeed,
        pitch,
        empathy_level: empathyLevel,
        energy_level: energyLevel,
        accuracy_priority: accuracyPriority,
        intelligence_level: intelligenceLevel,
        response_length: responseLength,

        system_prompt: systemPrompt,
        first_message: firstMessage,
        goodbye_message: goodbyeMessage,
        knowledge_base: knowledgeBase,
        custom_knowledge_base: customKnowledgeBase || null,

        idle_timeout: idleTimeout,
        max_call_duration: maxCallDuration,
        enable_call_transcription: enableCallTranscription,
        enable_call_recording: enableCallRecording,

        transfer_to_human: {
          enabled: transferEnabled,
          transfer_keywords: transferKeywords,
          team_id: teamId,
          member_id: memberId
        },

        status: agentDetails?.data?.status || 'active'
      }

      if (agentId) {
        const res = await updateAgent({ id: agentId, ...payload }).unwrap()
        toast.success(res.message || t('agent_updated_successfully'))
      } else {
        const res = await createAgent(payload).unwrap()
        toast.success(res.message || t('agent_created_successfully'))
      }
      router.push(ROUTES.AI_ASSISTANTS)
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_save_agent'))
    }
  }

  if (agentId && isLoadingAgent) {
    return <DataLoader fullPage />
  }

  return (
    <div id="ai-assistants-create-page" className="min-h-screen text-slate-900 dark:text-white transition-colors duration-300">

      {/* Top Header & Breadcrumbs & Tabs */}
      <div className="sticky top-[-1px] z-40 bg-bg-body pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-8 p-4">
        <div className="w-full">
          <AgentHeader
            agentId={agentId}
            centerContent={<AgentTypeTabs type={type} setType={setType} />}
          >
            <FloatingActionBar
              isCreating={isCreating}
              isUpdating={isUpdating}
              isFormValid={isFormValid}
              agentId={agentId}
              onSubmit={handleSubmit}
            />
          </AgentHeader>
        </div>
      </div>

      <div className="w-full space-y-8 pb-8">
        {/* Split View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Left Section: Identity & Intelligence Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <CoreIntelligenceCard
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              language={language}
              setLanguage={setLanguage}
              llmModel={llmModel}
              setLlmModel={setLlmModel}
              type={type}
              voiceTone={voiceTone}
              setVoiceTone={setVoiceTone}
              personality={personality}
              setPersonality={setPersonality}
              flowId={flowId}
              setFlowId={setFlowId}
              flowsData={flowsData}
            />

            <TuningParametersCard
              temperature={temperature}
              setTemperature={setTemperature}
              intelligenceLevel={intelligenceLevel}
              setIntelligenceLevel={setIntelligenceLevel}
            />

            <VoiceAudioSettingsCard
              responseDelay={responseDelay}
              setResponseDelay={setResponseDelay}
              speechSpeed={speechSpeed}
              setSpeechSpeed={setSpeechSpeed}
              pitch={pitch}
              setPitch={setPitch}
            />

            <BehavioralConfigCard
              empathyLevel={empathyLevel}
              setEmpathyLevel={setEmpathyLevel}
              energyLevel={energyLevel}
              setEnergyLevel={setEnergyLevel}
              accuracyPriority={accuracyPriority}
              setAccuracyPriority={setAccuracyPriority}
              responseLength={responseLength}
              setResponseLength={setResponseLength}
            />
          </div>

          {/* Right Section: Channels, Voice & Knowledge (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <TelephonyVoiceCard
              telephonyProvider={telephonyProvider}
              setTelephonyProvider={setTelephonyProvider}
              sipTrunkId={sipTrunkId}
              setSipTrunkId={setSipTrunkId}
              voiceProvider={voiceProvider}
              setVoiceProvider={setVoiceProvider}
              voiceId={voiceId}
              setVoiceId={setVoiceId}
              voicesData={voicesData}
              idleTimeout={idleTimeout}
              setIdleTimeout={setIdleTimeout}
              maxCallDuration={maxCallDuration}
              setMaxCallDuration={setMaxCallDuration}
              enableCallTranscription={enableCallTranscription}
              setEnableCallTranscription={setEnableCallTranscription}
              enableCallRecording={enableCallRecording}
              setEnableCallRecording={setEnableCallRecording}
              transferEnabled={transferEnabled}
              setTransferEnabled={setTransferEnabled}
              transferKeywords={transferKeywords}
              setTransferKeywords={setTransferKeywords}
              teamId={teamId}
              setTeamId={setTeamId}
              memberId={memberId}
              setMemberId={setMemberId}
            />

            <KnowledgeBaseCard
              knowledgeBase={knowledgeBase}
              toggleKb={toggleKb}
              kbData={kbData}
              customKnowledgeBase={customKnowledgeBase}
              setCustomKnowledgeBase={setCustomKnowledgeBase}
            />
          </div>
        </div>

        {/* Dynamic Prompt Templates Section for Incoming tab only */}
        {type === 'incoming' && (
          <PromptTemplatesSection
            onApplyTemplate={(systemP, firstM, goodbyeM) => {
              setSystemPrompt(systemP)
              setFirstMessage(firstM)
              setGoodbyeMessage(goodbyeM)
              toast.success(t('template_applied_successfully'))
            }}
          />
        )}

        {/* Row: System Prompt and First Message Prompting Architecture (Full Width 12 cols) */}
        <PromptingArchitectureCard
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          firstMessage={firstMessage}
          setFirstMessage={setFirstMessage}
          goodbyeMessage={goodbyeMessage}
          setGoodbyeMessage={setGoodbyeMessage}
        />

      </div>
    </div>
  )
}
