'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BookOpen, Crown, FileText, Gem, Gift, Pencil, Sparkles, Star, Trash2, Users, Bot, MessageSquare, Megaphone, Network, Brain, HardDrive, Check, Send, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DiamondIcon = () => (
  <svg viewBox="0 0 100 100" className="w-2.5 h-2.5 fill-primary text-primary">
    <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" />
  </svg>
)

const AdminPlanCard = ({
  plan,
  onEdit,
  onDelete,
  index = 0,
  plans = []
}: any) => {
  const { t } = useTranslation()

  const currencySymbol = plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : '₹'
  const billingCycle = plan.billing_cycle || 'monthly'
  const formattedCycle = billingCycle === 'yearly' ? 'Year' : billingCycle === 'monthly' ? 'Month' : billingCycle

  const isActive = plan.status === 'active' || plan.is_active

  // Determine icon based on plan name/index
  const getPlanIcon = () => {
    const nameLower = plan.name?.toLowerCase() || ''
    if (nameLower.includes('basic') || nameLower.includes('free') || index === 0) {
      return <Gift className="w-5 h-5 text-primary" />
    }
    if (nameLower.includes('premium') || nameLower.includes('pro') || index === 1) {
      return <Crown className="w-5 h-5 text-primary" />
    }
    if (nameLower.includes('enterprise') || nameLower.includes('ultimate') || index === 2) {
      return <Gem className="w-5 h-5 text-primary" />
    }
    return <Sparkles className="w-5 h-5 text-primary" />
  }

  // Choose icon dynamically based on the feature name
  const getFeatureIcon = (featureName: string, idx: number) => {
    const nameLower = featureName.toLowerCase()

    // Agents & Assistants
    if (nameLower.includes('assistant') || nameLower.includes('agent')) {
      return <Bot className="w-4 h-4 text-foreground/70" />
    }
    // SMS Campaigns specifically
    if (nameLower.includes('sms campaign') || nameLower.includes('sms_campaign')) {
      return <Send className="w-4 h-4 text-foreground/70" />
    }

    // SMS / Messages
    if (nameLower.includes('sms') || nameLower.includes('message')) {
      return <MessageSquare className="w-4 h-4 text-foreground/70" />
    }
    // Campaigns
    if (nameLower.includes('campaign')) {
      return <Megaphone className="w-4 h-4 text-foreground/70" />
    }
    // Workflows / Automations
    if (nameLower.includes('flow') || nameLower.includes('automation')) {
      return <Network className="w-4 h-4 text-foreground/70" />
    }
    // Knowledgebase
    if (nameLower.includes('knowledge') || nameLower.includes('learn')) {
      return <Brain className="w-4 h-4 text-foreground/70" />
    }
    // Storage / Data
    if (nameLower.includes('storage') || nameLower.includes('space') || nameLower.includes('mb') || nameLower.includes('gb')) {
      return <HardDrive className="w-4 h-4 text-foreground/70" />
    }
    // Contacts / Users
    if (nameLower.includes('contact') || nameLower.includes('user') || nameLower.includes('member')) {
      return <Users className="w-4 h-4 text-foreground/70" />
    }
    // Documents / Files
    if (nameLower.includes('upload') || nameLower.includes('publish') || nameLower.includes('document') || nameLower.includes('file')) {
      return <FileText className="w-4 h-4 text-foreground/70" />
    }

    // Fallback based on index
    if (idx === 0) return <Bot className="w-4 h-4 text-foreground/70" />
    if (idx === 1) return <Megaphone className="w-4 h-4 text-foreground/70" />
    if (idx === 2) return <Network className="w-4 h-4 text-foreground/70" />
    return <Check className="w-4 h-4 text-foreground/70" />
  }

  const renderFeatures = () => {
    // If dynamic features are present, render them
    if (plan.plan_type === 'top_up') {
      const topUpFeatures = [
        { key: 'validity_days', val: plan.validity_days, label: t('validity_days', 'Validity Days'), icon: <Calendar className="w-4 h-4 text-foreground/70" /> },
      ].filter(item => item.val !== undefined && item.val !== null && item.val !== '')

      return topUpFeatures.map((item) => {
        const displayVal = item.val === -1 ? t('unlimited', 'Unlimited') : `${item.val} ${t('days', 'Days')}`
        return (
          <li key={item.key} className="flex items-center gap-3 mb-3 text-sm text-foreground/80">
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex justify-between w-full">
              <span className="text-title/90 text-md font-medium">{item.label}</span>{' '}
              <span className="font-bold text-foreground">{String(displayVal)}</span>
            </span>
          </li>
        )
      })
    }

    if (plan.features && Object.keys(plan.features).length > 0) {
      return Object.entries(plan.features).map(([key, value], idx) => {
        const icon = getFeatureIcon(key, idx)
        return (
          <li key={key} className="flex items-center gap-3 mb-3 text-sm text-foreground/80">
            <span className="flex-shrink-0">{icon}</span>
            <span className="flex justify-between w-full">
              <span className="text-title/90 text-md font-medium">{key}</span> <span className="font-bold text-foreground">{String(value)}</span>
            </span>
          </li>
        );
      })
    }

    // Otherwise render standard limits
    const limits = [
      { key: 'agent_limit', val: plan.agent_limit, label: t('agent_limit'), icon: <Users className="w-4 h-4 text-foreground/70" /> },
      { key: 'campaign_limit_per_day', val: plan.campaign_limit_per_day, label: t('campaign_limit_per_day'), icon: <BookOpen className="w-4 h-4 text-foreground/70" /> },
      { key: 'flow_limit', val: plan.flow_limit, label: t('flow_limit'), icon: <FileText className="w-4 h-4 text-foreground/70" /> },
      { key: 'knowledgebase_limit', val: plan.knowledgebase_limit, label: t('knowledgebase_limit'), icon: <Star className="w-4 h-4 text-foreground/70" /> },
      { key: 'storage_limit', val: plan.storage_limit, label: t('storage_limit'), icon: <Star className="w-4 h-4 text-foreground/70" /> },
      { key: 'contact_limit', val: plan.contact_limit, label: t('contact_limit'), icon: <Users className="w-4 h-4 text-foreground/70" /> },
      { key: 'sms_agent_limit', val: plan.sms_agent_limit, label: t('sms_agent_limit'), icon: <Users className="w-4 h-4 text-foreground/70" /> },
      { key: 'sms_campaign_limit_per_day', val: plan.sms_campaign_limit_per_day, label: t('sms_campaign_limit_per_day'), icon: <BookOpen className="w-4 h-4 text-foreground/70" /> },
      { key: 'campaign_sms_limit', val: plan.campaign_sms_limit, label: t('campaign_sms_limit'), icon: <BookOpen className="w-4 h-4 text-foreground/70" /> },
    ].filter(item => item.val !== undefined && item.val !== null)

    return limits.map((item, idx) => {
      const displayVal = item.val === -1 ? t('unlimited') : item.val
      return (
        <li key={item.key} className="flex items-center gap-3 mb-3 text-sm text-foreground/80">
          <span className="flex-shrink-0">{getFeatureIcon(item.label, idx)}</span>
          <span className="flex justify-between w-full">
            <span className="text-title/90 text-md font-medium">{item.label}</span>{' '}
            <span className="font-bold text-foreground">{String(displayVal)}</span>
          </span>
        </li>
      )
    })
  }

  // Specialized sleek layout for Top-ups
  if (plan.plan_type === 'top_up') {
    const isTopUpPopular = plan.is_popular;

    return (
      <div className={cn("relative h-full flex flex-col rounded-lg transition-all duration-300 w-full text-left rtl:text-right sm:p-6 p-4 overflow-visible border border-input-border-color bg-bg-card hover:border-primary/40", isTopUpPopular && "border-primary/50 shadow-lg shadow-primary/5 md:scale-[1.02] z-10")}>
        {isTopUpPopular && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <span className="flex items-center gap-1.5 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap shadow-sm shadow-primary/30">
              <Crown className="w-3 h-3" />
              {t('popular', 'Popular')}
            </span>
          </div>
        )}
        {/* Top Header: Name and Status */}
        <div className="flex justify-between items-start mb-6 mt-1">
          <div className="pr-4">
            <h3 className="text-xl font-bold text-title tracking-tight break-all line-clamp-1">{plan.name}</h3>
            {plan.description ? (
              <p className="text-md text-subtitle-color mt-1.5 line-clamp-2 break-all whitespace-normal">{plan.description}</p>
            ) : (
              <p className="text-md text-subtitle-color mt-1.5 line-clamp-2 break-all whitespace-normal">{t("plan_description_fallback")}</p>
            )}
          </div>
          <div className="flex-shrink-0">
            {isActive ? (
              <span className="text-[10px] font-bold border border-edit/30 text-edit bg-edit/10 rounded-full px-2.5 py-1 uppercase tracking-wider">
                {t("active")}
              </span>
            ) : (
              <span className="text-[10px] font-bold border border-destructive/30 text-destructive bg-destructive/10 rounded-full px-2.5 py-1 uppercase tracking-wider">
                {t("inactive")}
              </span>
            )}
          </div>
        </div>

        {/* Highlight Stats: Credits & Validity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-subcard rounded-lg p-4 sm:mb-6 mb-4 border border-input-border-color">
          <div className="flex flex-col">
            <span className="text-md text-subtitle-color font-semibold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {t('credits')}
            </span>
            <span className="text-xl font-bold text-title">
              {plan.total_credits ? plan.total_credits.toLocaleString() : 0}
            </span>
          </div>

          <div className="flex flex-col border-l border-input-border-color/50 pl-4">
            <span className="text-md text-subtitle-color font-semibold mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {t('validity', 'Validity')}
            </span>
            <span className="text-lg font-bold text-title mt-0.5">
              {plan.validity_days === -1 ? t('unlimited', 'Unlimited') : `${plan.validity_days} ${t('days', 'Days')}`}
            </span>
          </div>
        </div>

        {/* Footer: Price and Actions */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <p className="text-md text-subtitle-color font-semibold mb-1">{t('price', 'Price')}</p>
            {parseFloat(String(plan.amount || plan.price)) === 0 ? (
              <span className="text-3xl font-extrabold text-title tracking-tight">{t('free')}</span>
            ) : (
              <span className="text-3xl font-extrabold text-title tracking-tight">
                {currencySymbol}{plan.amount || plan.price}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit(plan)} className="h-9 w-9 p-0! rounded-lg border-input-border-color text-edit hover:bg-edit hover:text-white bg-edit/10 transition-all">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => onDelete(plan)} className="h-9 w-9 p-0! rounded-lg border border-destructive/10 text-destructive bg-destructive/10 hover:bg-destructive hover:text-white transition-all">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isPremiumOrPro = plan.is_popular
  if (isPremiumOrPro) {
    return (
      <div className="relative h-full w-full p-[2px] bg-gradient-to-b from-primary to-primary/20 rounded-[24px] shadow-xl shadow-primary/15 flex flex-col transform md:scale-[1.02] z-10 hover:-translate-y-1 transition-all duration-300">
        {/* Centered Top Badge */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <span className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest whitespace-nowrap shadow-md shadow-primary/40">
            <Crown className="w-3.5 h-3.5" />
            {t('popular', 'Popular Plan')}
          </span>
        </div>

        <div
          className="w-full h-full flex flex-col bg-bg-card rounded-[22px] sm:p-5 sm:py-4 p-4 text-left flex-grow"
          style={{
            backgroundImage: `linear-gradient(rgba(var(--primary-rgb), 0.04), rgba(var(--primary-rgb), 0.04))`
          }}
        >
          {/* Top Icon Circle + Status Badges */}
          <div className="mb-4 flex items-start justify-between">
            <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center">
              {getPlanIcon()}
            </div>

            <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
              {/* Total Credits Badge */}
              {plan.total_credits > 0 && (
                <span className="text-xs font-bold border border-input-border-color text-slate-600 bg-slate-100 dark:bg-white/5 rounded-lg px-2.5 py-1 uppercase tracking-wider w-full text-center">
                  {plan.total_credits.toLocaleString()} {t('credits')}
                </span>
              )}

              {/* Dynamic Status Badge */}
              {isActive ? (
                <span className="text-[10px] font-bold border border-green-500/30 text-green-600 bg-green-500/10 rounded-md px-2.5 py-1 uppercase tracking-wider w-full text-center">
                  {t('active')}
                </span>
              ) : (
                <span className="text-[10px] font-bold border border-red-500/30 text-red-600 bg-red-500/10 rounded-md px-2.5 py-1 uppercase tracking-wider w-full text-center">
                  {t('inactive')}
                </span>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-title tracking-tight break-all whitespace-normal line-clamp-2">
              {plan.name}
            </h3>
            <p className="text-md text-subtitle-color mt-1 line-clamp-2">
              {plan.description || t('plan_description_fallback')}
            </p>
          </div>

          {/* Price */}
          <div className="mb-4 flex items-baseline">
            {parseFloat(String(plan.amount || plan.price)) === 0 ? (
              <span className="text-4xl font-bold text-title tracking-tight">{t('free')}</span>
            ) : (
              <>
                <span className="text-4xl font-bold text-title tracking-tight">
                  {currencySymbol}{plan.amount || plan.price}
                </span>
                {plan.plan_type !== 'top_up' && (
                  <span className="text-sm font-medium text-subtitle-color ml-1.5">
                    /{formattedCycle}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Admin Action Buttons */}
          <div className="mb-5 flex gap-3">
            <Button
              variant="outline"
              onClick={() => onEdit(plan)}
              className="flex-1 h-12 rounded-radius p-padding  text-white dark:text-gray-300 bg-primary transition-all font-semibold text-sm dark:border-transparent gap-2"
            >
              <Pencil className="w-4 h-4" />
              {t('edit_plan')}
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(plan)}
              className="w-12 h-12 rounded-radius border border-destructive/10 text-destructive bg-destructive/20 hover:bg-destructive hover:text-white transition-all flex items-center justify-center p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Features Header with Diamonds */}
          <div className="mb-4">
            <div className="relative flex items-center justify-between mt-3">
              <DiamondIcon />
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-2" />
              <DiamondIcon />
            </div>
          </div>

          {/* Features List */}
          <ul className="space-y-2 mb-2 flex-grow">
            {renderFeatures()}
          </ul>

        </div>
      </div>
    )
  }

  // Standard/Non-active Card styling
  return (
    <div className={cn("relative h-full flex flex-col rounded-modal-radius transition-all duration-300 w-full text-left sm:p-5 sm:py-4 p-4 overflow-visible border border-input-border-color bg-bg-card hover:border-primary/30 shadow-sm hover:shadow-md")}>
      {/* Top Icon Circle + Status Badges */}
      <div className="mb-4 flex items-start justify-between">
        <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center">
          {getPlanIcon()}
        </div>

        <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
          {/* Total Credits Badge */}
          {plan.total_credits > 0 && (
            <span className="text-xs font-bold border border-input-border-color text-slate-600 bg-slate-100 dark:bg-white/5 rounded-md px-2.5 py-1 uppercase tracking-wider w-full text-center">
              {plan.total_credits.toLocaleString()} {t('credits')}
            </span>
          )}

          {/* Dynamic Status Badge */}
          {isActive ? (
            <span className="text-[10px] font-bold border border-green-500/30 text-green-600 bg-green-500/10 rounded-md px-2.5 py-1 uppercase tracking-wider w-full text-center">
              {t("active")}
            </span>
          ) : (
            <span className="text-[10px] font-bold border border-red-500/30 text-red-600 bg-red-500/10 rounded-md px-2.5 py-1 uppercase tracking-wider w-full text-center">
              {t("inactive")}
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-title tracking-tight break-all whitespace-normal line-clamp-2">{plan.name}</h3>
        <p className="text-md text-subtitle-color mt-1 line-clamp-2">{plan.description || t("plan_description_fallback")}</p>
      </div>

      {/* Price */}
      <div className="mb-4 flex items-baseline">
        {parseFloat(String(plan.amount || plan.price)) === 0 ? (
          <span className="text-4xl font-bold text-title tracking-tight">{t('free')}</span>
        ) : (
          <>
            <span className="text-4xl font-bold text-title tracking-tight">
              {currencySymbol}
              {plan.amount || plan.price}
            </span>
            {plan.plan_type !== 'top_up' && (
              <span className="text-sm font-medium text-subtitle-color ml-1.5">/{formattedCycle}</span>
            )}
          </>
        )}
      </div>

      {/* Admin Action Buttons */}
      <div className="mb-5 flex gap-3">
        <Button variant="outline" onClick={() => onEdit(plan)} className="flex-1 h-12 rounded-radius p-padding border border-input-border-color text-primary hover:bg-primary hover:text-white bg-primary/15 transition-all font-semibold text-sm gap-2">
          <Pencil className="w-4 h-4" />
          {t("edit_plan")}
        </Button>
        <Button variant="outline" onClick={() => onDelete(plan)} className="w-12 h-12 rounded-radius border border-destructive/10 text-destructive bg-destructive/20 hover:bg-destructive hover:text-white transition-all flex items-center justify-center p-0">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Features Header with Diamonds */}
      <div className="mb-4">
        <div className="relative flex items-center justify-between mt-3">
          <DiamondIcon />
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-2" />
          <DiamondIcon />
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-2 mb-2 flex-grow">{renderFeatures()}</ul>

    </div>
  );
}

export default AdminPlanCard
