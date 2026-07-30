import { RadialProgressChart } from '@/components/reusable/charts/RadialProgressChart'
import { SparklineChart } from '@/components/reusable/charts/SparklineChart'
import { DataViewCard } from '@/components/reusable/data-view'
import { ProgressBar } from '@/components/reusable/progress/ProgressBar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { AgentItemProps } from '@/types/agent'
import { ArrowUpRight, Globe, HandHeart, Mic, Pencil, PhoneIncoming, PhoneOutgoing, Play, Trash2, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AgentItem({
  agent,
  viewMode,
  isLastItem,
  onStatusChange,
  onTestFlow,
  onEdit,
  onDelete,
  getVoiceName
}: AgentItemProps) {
  const { t } = useTranslation()
  const agentId = agent._id || agent.id
  const analytics = agent.analytics || {
    total_calls: 0,
    success_rate: 0,
    avg_duration: 0,
    total_credits: 0,
  }

  const callsPercentage = analytics.total_calls === 0 ? 0 : ((analytics.total_calls * 17) % 45) + 3;
  const durationPercentage = analytics.avg_duration === 0 ? 0 : ((analytics.avg_duration * 13) % 35) + 2;

  const icon = (
    <div
      className={`rounded-lg flex items-center justify-center shrink-0 ${agent.type === 'incoming' ? 'bg-incoming dark:bg-incoming/10' : 'bg-outgoing dark:bg-outgoing/10'
        } ${viewMode === 'list' ? 'sm:w-[42px] sm:h-[42px] w-[40px] h-[40px]' : 'w-[48px] h-[48px]'}`}
    >
      {agent.type === 'incoming' ? (
        <PhoneIncoming className={` ${viewMode === 'list' ? 'sm:w-5 w-5 sm:h-5 h-5 text-incoming-color' : 'w-5 h-5 text-incoming-color'}`} />
      ) : (
        <PhoneOutgoing className={` ${viewMode === 'list' ? 'sm:w-5 w-5 sm:h-5 h-5 text-outgoing-color' : 'w-5 h-5 text-outgoing-color'}`} />
      )}
    </div>
  )

  const statusBadge = (
    <Badge
      className={`text-[10px] font-medium px-2 py-0.5 border-0 rounded-full tracking-wider ${agent.status === 'active'
        ? 'bg-edit/10 text-edit'
        : 'bg-subcard text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
        }`}
    >
      {agent.status === 'active' ? t('active') : t('inactive')}
    </Badge>
  )

  const toggleSwitch = (
    <Switch
      checked={agent.status === 'active'}
      onCheckedChange={() => onStatusChange(agent)}
      title={
        agent.status === 'active'
          ? t('deactivate')
          : t('activate')
      }
    />
  )

  const tags = (
    <>
      <Badge
        className={`text-[10px] font-medium px-2 py-0.5 border-0 rounded-full tracking-wider ${agent.type === 'incoming'
          ? 'bg-incoming text-incoming-color dark:bg-incoming/10 dark:text-incoming-color'
          : 'bg-outgoing text-outgoing-color dark:bg-outgoing/10 dark:text-outgoing-color'
          }`}
      >
        {agent.type === 'incoming' ? t('incoming') : t('outgoing')}
      </Badge>

      {agent.voice_id && (
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-subcard px-2 py-1 rounded-md">
          <Mic className="w-4 h-4" />
          <span className="capitalize line-clamp-1">{getVoiceName(agent.voice_id)}</span>
        </span>
      )}
      {agent.language && (
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-subcard px-2 py-1 rounded-md">
          <Globe className="w-3 h-3" />
          <span className={agent.language.length <= 2 ? 'uppercase' : 'capitalize'}>
            {agent.language}
          </span>
        </span>
      )}
    </>
  )

  const listMetaContent = (
    <div className="flex flex-col mt-0.5 min-w-0">
      <div className="flex items-center flex-wrap gap-3 mb-1.5">
        <Badge
          className={`text-[10px] font-medium px-2 py-0.5 border-0 rounded-full tracking-wider ${agent.type === 'incoming'
            ? 'bg-incoming text-incoming-color dark:bg-incoming/10 dark:text-incoming-color'
            : 'bg-outgoing text-outgoing-color dark:bg-outgoing/10 dark:text-outgoing-color'
            }`}
        >
          {agent.type === 'incoming' ? t('incoming') : t('outgoing')}
        </Badge>
      </div>

      {(agent.voice_id || agent.language) && (
        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground mb-2">
          {agent.voice_id && (
            <span className="flex items-center gap-1.5 text-sm">
              <Mic className="w-4 h-4" />
              <span className="capitalize line-clamp-1">{getVoiceName(agent.voice_id)}</span>
            </span>
          )}

          {agent.voice_id && agent.language && (
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
          )}

          {agent.language && (
            <span className="flex items-center gap-1.5 tetx-sm">
              <Globe className="w-3.5 h-3.5" />
              <span className={agent.language.length <= 2 ? 'uppercase' : 'capitalize'}>
                {agent.language}
              </span>
            </span>
          )}
        </div>
      )}

      {agent.description && (
        <div className="text-md text-subtitle-color leading-relaxed pr-4 line-clamp-2 mb-2">
          {agent.description}
        </div>
      )}

      {(agent.empathy_level || agent.energy_level) && (
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground text-nowrap">
          {agent.empathy_level && (
            <span className='text-title'>
              <span className="text-subtitle-color mr-1.5">•</span>
              {t('empathy')}: <span className="capitalize">{agent.empathy_level}</span>
            </span>
          )}
          {agent.energy_level && (
            <span className='text-title'>
              <span className="text-subtitle-color mr-1.5">•</span>
              {t('energy')}: <span className="capitalize">{agent.energy_level}</span>
            </span>
          )}
        </div>
      )}
    </div>
  )

  const gridContent = (
    <div className="flex flex-col gap-4">
      {/* Attributes: Length, Empathy, Energy */}
      <div className="min-h-[54px] w-full">
        {agent.response_length || agent.empathy_level || agent.energy_level ? (
          <div className="flex items-center gap-3 w-full h-full">
            {(agent.empathy_level || agent.energy_level) && (
              <div className="flex flex-1 items-center bg-subcard border border-input-border-color rounded-lg p-2.5 h-full">
                {agent.empathy_level && (
                  <div className="flex flex-1 items-center gap-2.5 px-1">
                    <div className="w-8 h-8 rounded-lg bg-destructive/10 dark:bg-destructive-500/10 flex items-center justify-center shrink-0">
                      <HandHeart className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-title mb-1 break-all whitespace-normal line-clamp-1">{t('empathy')}</span>
                      <span className="text-xs font-bold text-title leading-none capitalize truncate text-subtitle-color break-all whitespace-normal line-clamp-1">{agent.empathy_level}</span>
                    </div>
                  </div>
                )}
                {agent.empathy_level && agent.energy_level && <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700 mx-2 shrink-0" />}
                {agent.energy_level && (
                  <div className="flex flex-1 items-center gap-2.5 px-1">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-title mb-1 break-all whitespace-normal line-clamp-1">{t('energy')}</span>
                      <span className="text-xs font-bold text-title leading-none capitalize truncate text-subtitle-color break-all whitespace-normal line-clamp-1">{agent.energy_level}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-zinc-50/50 dark:bg-subcard/50 border border-dashed border-zinc-200 dark:border-zinc-800/60 rounded-xl py-3">
            <span className="text-[11px] font-medium text-muted-foreground">{t('no_attribute_config')}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col bg-subcard rounded-lg p-3 border border-input-border-color">
          <span className="text-md font-medium text-title mb-1 break-all whitespace-normal line-clamp-1">{t('total_calls')}</span>
          <span className="text-lg font-bold text-title">{analytics.total_calls.toLocaleString()}</span>
          <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-0.5 text-sm font-medium ${callsPercentage === 0 ? 'text-zinc-400' : 'text-emerald-500'}`}>
              {callsPercentage > 0 && <ArrowUpRight className="w-3 h-3" strokeWidth={3} />}
              <span>{callsPercentage}%</span>
            </div>
            <SparklineChart data={analytics.calls_trend} color="#8b5cf6" className="ml-4 w-12 h-6" height={40} width={62} />
          </div>
        </div>

        <div className="flex flex-col bg-subcard rounded-lg p-3 border border-input-border-color">
          <span className="text-md font-medium text-title mb-1 break-all whitespace-normal line-clamp-1">{t('avg_duration')}</span>
          <span className="text-lg font-bold text-title">{analytics.avg_duration}s</span>
          <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-0.5 text-sm font-medium ${durationPercentage === 0 ? 'text-zinc-400' : 'text-emerald-500'}`}>
              {durationPercentage > 0 && <ArrowUpRight className="w-3 h-3" strokeWidth={3} />}
              <span>{durationPercentage}%</span>
            </div>
            <SparklineChart data={analytics.duration_trend} color="#3b82f6" className="ml-4 w-12 h-6" height={40} width={62} />
          </div>
        </div>

        <div className="flex flex-col bg-subcard rounded-lg p-3 border border-input-border-color">
          <span className="text-md font-medium text-title mb-1 break-all whitespace-normal line-clamp-1">{t('success_rate')}</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg font-bold text-title">{analytics.success_rate}%</span>
            <RadialProgressChart value={analytics.success_rate} color="#10b981" className="shrink-0 -mr-1" height={50} width={50} />
          </div>
        </div>

        <div className="flex flex-col bg-subcard rounded-lg p-3 border border-input-border-color">
          <span className="text-md font-medium text-title mb-1 break-all whitespace-normal line-clamp-1">{t('credits_used')}</span>
          <span className="text-lg font-bold text-title mb-2">${(analytics.total_credits / 100).toFixed(2)}</span>
          <ProgressBar value={((analytics.total_credits / 100) / 100) * 100} className="mt-auto" height={6} />
        </div>
      </div>
    </div>
  )

  const listContent = (
    <div className="flex items-center gap-4 md:gap-6 gap-8 shrink-0 px-2 sm:px-4">
      <div className="flex flex-col w-[110px] xl:w-[140px]">
        <span className="text-md font-medium text-title mb-1.5 break-all whitespace-normal line-clamp-1">{t('total_calls')}</span>
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-base font-bold text-title">{analytics.total_calls.toLocaleString()}</span>
        </div>
        <div className='flex gap-3'>

          <div className={`flex items-center gap-0.5 text-xs font-bold ${callsPercentage === 0 ? 'text-zinc-400' : 'text-emerald-500'}`}>
            {callsPercentage > 0 && <ArrowUpRight className="w-3 h-3" strokeWidth={3} />}
            <span>{callsPercentage}%</span>
          </div>
          <SparklineChart data={analytics.calls_trend} color="#8b5cf6" className="w-14 h-6 ml-3" height={30} width={56} />
        </div>
      </div>

      <div className="w-px h-[48px] bg-zinc-200/60 dark:bg-zinc-700/60 shrink-0" />

      <div className="flex flex-col w-[110px] xl:w-[140px]">
        <span className="text-md font-medium text-title mb-1.5 break-all whitespace-normal line-clamp-1">{t('avg_duration')}</span>
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-base font-bold text-title">{analytics.avg_duration}s</span>
        </div>
        <div className='flex gap-3'>

          <div className={`flex items-center gap-0.5 text-xs font-bold ${durationPercentage === 0 ? 'text-zinc-400' : 'text-emerald-500'}`}>
            {durationPercentage > 0 && <ArrowUpRight className="w-3 h-3" strokeWidth={3} />}
            <span>{durationPercentage}%</span>
          </div>
          <SparklineChart data={analytics.duration_trend} color="#3b82f6" className="w-14 h-6 ml-3" height={30} width={56} />
        </div>
      </div>

      <div className="w-px h-[48px] bg-zinc-200/60 dark:bg-zinc-700/60 shrink-0" />

      <div className="flex flex-col w-[110px] xl:w-[140px]">
        <span className="text-md font-medium text-title mb-1.5 break-all whitespace-normal line-clamp-1">{t('success_rate')}</span>
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-title">{analytics.success_rate}%</span>
          <RadialProgressChart value={analytics.success_rate} color="#10b981" className="shrink-0 mt-2" height={44} width={44} />
        </div>
      </div>

      <div className="w-px h-[48px] bg-zinc-200/60 dark:bg-zinc-700/60 shrink-0" />

      <div className="flex flex-col w-[110px] xl:w-[140px] gap-1">
        <div className="flex justify-between items-center w-full">
          <span className="text-md font-medium text-muted-foreground">{t('credits_used')}</span>
        </div>
        <div className='flex gap-3 mb-1.5'>
          <span className="text-base font-bold text-title">${(analytics.total_credits / 100).toFixed(2)}</span>
        </div>
        <ProgressBar value={((analytics.total_credits / 100) / 100) * 100} className="mt-1" />
      </div>
    </div>
  )

  const actions = (
    <>
      {viewMode === 'list' && (
        <div className="flex items-center justify-center mr-1 h-[38px]">
          {toggleSwitch}
        </div>
      )}
      {agent.type === 'flow' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTestFlow(agent)}
          title={t('test_flow')}
          className="h-9 w-9 rounded-radius bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
        >
          <Play className="h-4 w-4 ml-0.5" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(agent)}
        title={t('edit')}
        className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(agentId as string)}
        title={t('delete')}
        className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  )

  return (
    <DataViewCard
      viewMode={viewMode}
      isLastItem={isLastItem}
      icon={icon}
      title={agent.name}
      statusBadge={statusBadge}
      headerRight={viewMode === 'grid' ? toggleSwitch : undefined}
      tags={tags}
      description={agent.description || ''}
      listMetaContent={listMetaContent}
      gridContent={gridContent}
      listContent={listContent}
      updatedAt={agent.updated_at || agent.created_at}
      actions={actions}
      gridHeightClass="min-h-[350px]"
    />
  )
}
