'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import {
  useDeletePlanMutation,
  useGetPlansQuery,
  useSyncPlansToGatewaysMutation,
} from '@/redux/api/planApi'
import { ApiError } from '@/types/api'
import { Plan } from '@/types/plans'
import { Plus, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Autoplay, Pagination, Grid } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/grid'
import AdminPlanCard from './AdminPlanCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const AdminPlansPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [page] = useState(1)
  const [limit] = useState(12)
  const [search] = useState('')
  const [sortColumn] = useState('createdAt')
  const [sortOrder] = useState<'asc' | 'desc'>('desc')

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [plansToDelete, setPlansToDelete] = useState<string[]>([])

  const { data: plansResponse } = useGetPlansQuery({
    page,
    limit,
    search,
    sort_by: sortColumn,
    sort_order: sortOrder.toUpperCase(),
  })

  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation()
  const [syncToGateways, { isLoading: isSyncing }] = useSyncPlansToGatewaysMutation()

  const plans = Array.isArray(plansResponse) ? plansResponse : (plansResponse?.data || [])

  const handleDeleteConfirm = async () => {
    if (plansToDelete.length === 0) return
    try {
      if (plansToDelete.length === 1) {
        await deletePlan(plansToDelete[0]).unwrap()
      } else {
        // Fallback if bulk delete is added later
      }
      toast.success(t('plan_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setPlansToDelete([])
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleSyncGateways = async () => {
    try {
      await syncToGateways().unwrap()
      toast.success(t('synced_to_gateways_successfully'))
    } catch (error) {
      console.error('Sync failed:', error)
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('sync_to_gateways_failed'))
    }
  }

  const handleEdit = (plan: Plan) => {
    router.push(`${ROUTES.PLANS}/edit/${plan._id || plan.id}`)
  }

  const handleDelete = (plan: Plan) => {
    setPlansToDelete([plan._id || plan.id])
    setIsDeleteModalOpen(true)
  }

  const subscriptionPlans = plans.filter((p: any) => p.plan_type !== 'top_up')
  const topUpPlans = plans.filter((p: any) => p.plan_type === 'top_up')

  const renderPlansSwiper = (plansToRender: any[], isTopUp: boolean = false) => {
    if (plansToRender.length === 0) {
      return (
        <div className="text-center py-20 bg-bg-card rounded-lg border border-input-border-color">
          <p className="text-base font-medium text-title">
            {t('no_plans_available')}
          </p>
        </div>
      )
    }

    return (
      <div className="w-full relative px-0 group/swiper">
        <Swiper
          modules={isTopUp ? [Autoplay, Pagination, Grid] : [Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          grid={isTopUp ? { rows: 1, fill: 'row' } : undefined}
          grabCursor={true}
          watchSlidesProgress={true}
          observer={true}
          observeParents={true}
          loop={!isTopUp && plansToRender.length > 3}
          loopAdditionalSlides={!isTopUp ? plansToRender.length : 0}
          breakpoints={{
            480: { slidesPerView: 1, spaceBetween: 16, ...(isTopUp && { grid: { rows: 1, fill: 'row' } }) },
            640: { slidesPerView: 2, spaceBetween: 20, ...(isTopUp && { grid: { rows: 2, fill: 'row' } }) },
            1024: { slidesPerView: 3, spaceBetween: 24, ...(isTopUp && { grid: { rows: 2, fill: 'row' } }) },
            1536: { slidesPerView: 3, spaceBetween: 24, ...(isTopUp && { grid: { rows: 2, fill: 'row' } }) }
          }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className={cn("!pt-4 !pb-10 !overflow-hidden", isTopUp ? "top-up-swiper !px-1" : "!px-1 sm:!px-2")}
          wrapperClass="swiper-wrapper"
        >
          {plansToRender.map((plan: any, index: number) => (
            <SwiperSlide key={plan._id || plan.id} className="!h-auto flex flex-col pt-2 sm:pt-4">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                <AdminPlanCard
                  plan={plan}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  index={index}
                  plans={plansToRender}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className=" backdrop-blur-md">
        <PageHeader
          title={t('plans_management')}
          showBackButton={false}
          primaryAction={{
            label: t('create_plan'),
            onClick: () => router.push(`${ROUTES.PLANS}/create`),
            icon: <Plus className="w-5 h-5 text-white" />,
          }}
          endContent={
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={handleSyncGateways}
                disabled={isSyncing}
                className="rounded-radius text-primary p-padding! text-sm bg-primary/15 hover:bg-primary hover:text-white border-input-border-color group transition-all font-bold gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-muted-foreground group-hover:text-white' : 'text-primary group-hover:text-white'}`} />
                {isSyncing ? t('syncing_gateways') : t('sync_to_gateways')}
              </Button>
            </div>
          }
        />
      </div>

      <div className="w-full px-2 sm:px-4 -mt-1 max-w-7xl mx-auto">
        <Tabs defaultValue="subscriptions" className="w-full">
          <div className="flex justify-center mb-6 sm:mb-10 w-full px-1 sm:px-4">
            <TabsList className="bg-input-color/50 dark:bg-bg-card/50 border border-input-border-color p-1 sm:p-1.5 rounded-lg w-full max-w-md flex flex-row backdrop-blur-sm">
              <TabsTrigger
                value="subscriptions"
                className="flex-1 rounded-md sm:rounded-lg py-2 px-1 sm:p-padding! text-xs sm:text-md font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md text-subtitle-color hover:text-title hover:bg-input-color/80 dark:hover:bg-white/5 whitespace-nowrap transition-all"
              >
                {t('recurring_plans', 'Recurring Plans')}
              </TabsTrigger>
              <TabsTrigger
                value="topups"
                className="flex-1 rounded-md sm:rounded-lg py-2 px-1 sm:p-padding! text-xs sm:text-md font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md text-subtitle-color hover:text-title hover:bg-input-color/80 dark:hover:bg-white/5 whitespace-nowrap transition-all"
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
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setPlansToDelete([])
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t('delete_plan_title')}
        description={t('delete_plan_description')}
      />
    </div>
  )
}

export default AdminPlansPage

