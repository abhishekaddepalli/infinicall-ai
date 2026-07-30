'use client'

import { PageHeader } from '@/components/reusable/PageHeader'
import Spinner from '@/components/reusable/Spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import { useGetActivePlansQuery } from '@/redux/api/planApi'
import { useGetUserSubscriptionQuery } from '@/redux/api/subscriptionApi'
import { Plan } from '@/types/plans'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Autoplay, Pagination, Grid } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/grid'
import { PlanCard } from './components/PlanCard'
import PaymentModal from './PaymentModal'

const UserPlans = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: plansResponse, isLoading } = useGetActivePlansQuery()
  const { data: subscriptionResp } = useGetUserSubscriptionQuery()

  const activeSubscription = subscriptionResp?.data
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [sessionIdToConfirm, setSessionIdToConfirm] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [confirmedBillingCycle, setConfirmedBillingCycle] = useState<'monthly' | 'yearly' | 'one-time'>('monthly')

  const searchParams = useSearchParams()

  useEffect(() => {
    const success = searchParams.get('success') === 'true'
    const showModal = searchParams.get('show_success_modal') === 'true'
    
    if (success || showModal) {
      const timer = setTimeout(() => {
        if (showModal) {
          setShowSuccessModal(true)
        } else {
          const sessionId = searchParams.get('session_id')
          if (sessionId) setSessionIdToConfirm(sessionId)
        }
        
        setSelectedPlan({ id: 'dummy', name: t('your_new_plan', { defaultValue: 'Your New Plan' }) } as unknown as Plan)
        setIsPaymentModalOpen(true)
      }, 0)
      // Clean up URL
      window.history.replaceState({}, '', '/plans')
      return () => clearTimeout(timer)
    }
  }, [searchParams, t])

  const plans = (plansResponse as unknown as { data?: Plan[] })?.data || []

  const displayedPlans = plans.flatMap((p: any) => {
    const planId = p.id || p._id
    const plan = { ...p, id: planId }

    if (plan.plan_type === 'subscription') {
      const results = []
      if (plan.billing_cycle === 'monthly' || plan.billing_cycle === 'both') {
        results.push({ ...plan, unique_id: `${planId}-monthly`, _display_billing: 'monthly' })
      }
      if (plan.billing_cycle === 'yearly' || plan.billing_cycle === 'both') {
        results.push({ ...plan, unique_id: `${planId}-yearly`, _display_billing: 'yearly' })
      }
      return results
    }
    if (plan.plan_type === 'prepaid') {
      return [{ ...plan, unique_id: `${planId}-prepaid`, _display_billing: 'one-time' }]
    }
    if (plan.plan_type === 'top_up') {
      return [{ ...plan, unique_id: `${planId}-topup`, _display_billing: 'one-time' }]
    }
    if (plan.plan_type === 'lifetime') {
      return [{ ...plan, unique_id: `${planId}-lifetime`, _display_billing: 'one-time' }]
    }
    return [{ ...plan, unique_id: planId, _display_billing: 'one-time' }]
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Spinner />
      </div>
    )
  }

  const handleSubscribeClick = (plan: Plan) => {
    if (plan.plan_type === 'top_up' && !hasAnyActiveSubscription()) {
      toast.error(t('subscription_required_for_topup'))
      return
    }

    setSelectedPlan(plan)
    const initialCycle = plan.plan_type === 'subscription' ? (plan as any)._display_billing : 'one-time'
    setConfirmedBillingCycle(initialCycle)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false)
    setSelectedPlan(null)
    router.push(ROUTES.SUBSCRIPTIONS)
  }

  const isPlanActive = (planId: string, billingCycle?: string) => {
    if (!activeSubscription) return false
    const isActiveStatus = activeSubscription.status === 'active' || activeSubscription.status === 'trialing'
    const subscriptionPlanId = (activeSubscription.plan?.id || activeSubscription.plan?._id ||
      (typeof activeSubscription.plan_id === 'string' ? activeSubscription.plan_id : (activeSubscription.plan_id as any)?.id || (activeSubscription.plan_id as any)?._id))
    const isMatchingPlan = subscriptionPlanId === planId
    const activeBillingCycle = activeSubscription.billing_cycle || activeSubscription.plan_id?.billing_cycle || activeSubscription.plan?.billing_cycle || '';
    const isMatchingCycle = billingCycle ? activeBillingCycle?.toLowerCase() === billingCycle?.toLowerCase() : true
    return isActiveStatus && isMatchingPlan && isMatchingCycle
  }

  const hasAnyActiveSubscription = () => {
    if (!activeSubscription) return false
    return activeSubscription.status === 'active' || activeSubscription.status === 'trialing'
  }

  const subscriptionPlanId = activeSubscription ? (activeSubscription.plan?.id || activeSubscription.plan?._id ||
    (typeof activeSubscription.plan_id === 'string' ? activeSubscription.plan_id : (activeSubscription.plan_id as any)?.id || (activeSubscription.plan_id as any)?._id)) : null;
  const activeBillingCycleForObj = activeSubscription ? (activeSubscription.billing_cycle || activeSubscription.plan_id?.billing_cycle || activeSubscription.plan?.billing_cycle || '') : '';
  const activePlanObj = displayedPlans.find((p: any) => (p.id || p._id) === subscriptionPlanId && p._display_billing?.toLowerCase() === activeBillingCycleForObj?.toLowerCase());
  const currentActivePrice = activePlanObj ? parseFloat(activePlanObj.amount) : (activeSubscription?.plan?.amount || activeSubscription?.amount || 0);

  const subscriptionPlans = displayedPlans.filter((p: any) => p.plan_type !== 'top_up')
  const topUpPlans = displayedPlans.filter((p: any) => p.plan_type === 'top_up')

  const renderPlansSwiper = (plansToRender: any[], isTopUp: boolean = false) => {
    if (plansToRender.length === 0) {
      return (
        <div className="text-center py-20 bg-background rounded-xl border border-border shadow-sm">
          <p className="text-xl font-medium text-muted-foreground">
            {t('no_plans_available')}
          </p>
        </div>
      )
    }

    return (
      <div className="w-full relative px-0 sm:px-1 group/swiper">
        {isTopUp && (
          <style>{`
            .top-up-swiper .swiper-wrapper {
              align-items: stretch;
            }
            .top-up-swiper .swiper-slide {
              height: auto !important;
              display: flex;
            }
          `}</style>
        )}
        <Swiper
          modules={isTopUp ? [Autoplay, Pagination, Grid] : [Autoplay, Pagination]}
          spaceBetween={isTopUp ? 16 : 20}
          slidesPerView={1}
          grid={isTopUp ? { rows: 1, fill: 'row' } : undefined}
          grabCursor={true}
          watchSlidesProgress={true}
          observer={true}
          observeParents={true}
          loop={!isTopUp && plansToRender.length > 3}
          loopAdditionalSlides={!isTopUp ? plansToRender.length : 0}
          breakpoints={{
            500: { slidesPerView: 1, ...(isTopUp && { grid: { rows: 1, fill: 'row' }, spaceBetween: 16 }) },
            768: { slidesPerView: 2, ...(isTopUp && { grid: { rows: 2, fill: 'row' }, spaceBetween: 20 }) },
            1024: { slidesPerView: 3, ...(isTopUp && { grid: { rows: 2, fill: 'row' }, spaceBetween: 24 }) },
            1280: { slidesPerView: 3, ...(isTopUp && { grid: { rows: 2, fill: 'row' }, spaceBetween: 24 }) },
            1536: { slidesPerView: 3, ...(isTopUp && { grid: { rows: 2, fill: 'row' }, spaceBetween: 24 }) }
          }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className={cn("!pt-4 !pb-10 !overflow-hidden", isTopUp ? "top-up-swiper !px-1" : "")}
          wrapperClass="swiper-wrapper"
        >
          {plansToRender.map((plan: any, index: number) => {
            const isPro = plan.is_popular
            const price = plan.amount

            let billingCycleLabel = 'mo'
            if (plan.plan_type === 'subscription' && plan._display_billing === 'yearly') billingCycleLabel = 'yr'
            if (plan.plan_type === 'lifetime') billingCycleLabel = t('lifetime')
            if (plan.plan_type === 'prepaid') billingCycleLabel = t('one_time')

            const isActive = isPlanActive(plan.id, plan._display_billing)

            const isPlanDisabled = plan.plan_type === 'top_up' 
              ? !hasAnyActiveSubscription() 
              : false; // Allow users to change plans

            const isUpgrade = hasAnyActiveSubscription() && !isActive && parseFloat(price) > currentActivePrice;
            const isDowngrade = hasAnyActiveSubscription() && !isActive && parseFloat(price) < currentActivePrice;

            return (
              <SwiperSlide key={plan.unique_id} className={cn("flex flex-col pt-2", isTopUp ? "!h-auto sm:pt-4" : "h-full")}>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                  <PlanCard
                    plan={plan}
                    price={price || 0}
                    billingCycleLabel={billingCycleLabel}
                    isPro={isPro}
                    isActive={isActive}
                    isDisabled={isPlanDisabled}
                    isUpgrade={isUpgrade}
                    isDowngrade={isDowngrade}
                    hasActiveSubscription={hasAnyActiveSubscription()}
                    onSubscribe={() => handleSubscribeClick(plan)}
                    t={t}
                    index={index}
                    plans={displayedPlans}
                  />
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="backdrop-blur-md">
        <PageHeader
          title={t('choose_your_plan')}
          showBackButton={false}
        />
      </div>

      {/* Plans Sections */}
      <div className="w-full px-2 sm:px-4 -mt-1 max-w-7xl mx-auto">
        <Tabs defaultValue="subscriptions" className="w-full">
          <div className="flex justify-center mb-10 w-full px-4">
            <TabsList className="bg-input-color/50 dark:bg-bg-card/50 border border-input-border-color p-1.5 rounded-full w-full max-w-md grid grid-cols-2 h-auto shadow-sm backdrop-blur-sm">
              <TabsTrigger 
                value="subscriptions" 
                className="rounded-full py-3 text-sm md:text-[15px] font-bold transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md text-subtitle-color hover:text-title hover:bg-input-color/80 dark:hover:bg-white/5"
              >
                {t('recurring_plans', 'Recurring Plans')}
              </TabsTrigger>
              <TabsTrigger 
                value="topups" 
                className="rounded-full py-3 text-sm md:text-[15px] font-bold transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md text-subtitle-color hover:text-title hover:bg-input-color/80 dark:hover:bg-white/5"
              >
                {t('top_ups', 'Top-ups')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="subscriptions" className="mt-0">
            {renderPlansSwiper(subscriptionPlans, false)}
          </TabsContent>
          <TabsContent value="topups" className="mt-0">
            {renderPlansSwiper(topUpPlans, true)}
          </TabsContent>
        </Tabs>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedPlan(null)
          setSessionIdToConfirm(null)
          setShowSuccessModal(false)
        }}
        plan={selectedPlan!}
        billingCycle={confirmedBillingCycle}
        onSuccess={handlePaymentSuccess}
        activeSubscription={activeSubscription}
        sessionIdToConfirm={sessionIdToConfirm}
        showSuccessModal={showSuccessModal}
      />
    </div>
  )
}

export default UserPlans
