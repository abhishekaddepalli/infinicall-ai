'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetPlansQuery } from '@/redux/api/planApi'
import { useAssignPlanToUserMutation } from '@/redux/api/subscriptionApi'
import { useGetUsersQuery } from '@/redux/api/userApi'
import { User } from '@/types'
import { AssignPlanModalProps, Plan } from '@/types/plans'
import { Check, Clock, CreditCard, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const AssignPlanModal = ({ isOpen, onClose, editingSubscription }: AssignPlanModalProps) => {
  const { t } = useTranslation()
  const [userSearch, setUserSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')

  useEffect(() => {
    if (editingSubscription && isOpen) {
      setUserSearch(editingSubscription.user?.email || '')
      setSelectedUserId(editingSubscription.user?.id || editingSubscription.user?.id || '')
      setSelectedPlanId(editingSubscription.plan?._id || editingSubscription.plan?.id || '')
    }
  }, [editingSubscription, isOpen])
  const [duration, setDuration] = useState('1')
  const [amount, setAmount] = useState('')

  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery(
    { search: userSearch, limit: 5 },
    { skip: !userSearch },
  )
  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery({ is_active: true })
  const [assignPlan, { isLoading: isAssigning }] = useAssignPlanToUserMutation()

  const plans = plansData?.data || []
  const users = usersData?.users || []

  const selectedPlan = plans.find((p: Plan) => (p._id || p.id) === selectedPlanId)
  const isLifetime = selectedPlan?.billing_cycle === 'lifetime'

  useEffect(() => {
    if (selectedPlan) {
      setAmount(String((selectedPlan.amount || 0) * (parseInt(duration) || 1)))
    }
  }, [selectedPlan, duration])

  const handleAssign = async () => {
    if (!selectedUserId || !selectedPlanId) return

    try {
      await assignPlan({
        user_id: selectedUserId,
        plan_id: selectedPlanId,
        duration: parseInt(duration) || 1,
        amount: parseFloat(amount) || 0,
      }).unwrap()

      toast.success(t('plan_assigned_successfully'))
      handleClose()
    } catch (err: any) {
      toast.error(err?.data?.message || t('something_went_wrong'))
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedUserId('')
    setSelectedPlanId('')
    setUserSearch('')
    setDuration('1')
    setAmount('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! max-h-[90vh] gap-0 overflow-y-auto bg-bg-card border border-input-border-color shadow-lg rounded-modal-radius sm:p-6 p-4 no-scrollbar">
        <DialogHeader className="p-0">
          <DialogTitle className="text-xl font-bold text-title flex items-center gap-3">{editingSubscription ? t("update_subscription") : t("assign_plan_to_user")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label className="text-md font-semibold flex">{t("select_user")}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color" />
              <Input placeholder={t("search_user_by_name_or_email")} value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="pl-10 h-10 rounded-radius bg-input-color border-input-border-color" />
            </div>
            {usersLoading ? (
              <div className="flex justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {users.map((u: User) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setUserSearch(u.email);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-radius border cursor-pointer transition-all ${selectedUserId === u.id ? "border-primary bg-primary/10 shadow-sm" : "border-input-border-color hover:bg-primary/10"}`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-base break-all whitespace-normal line-clamp-1">{u.name}</span>
                      <span className="text-md text-subtitle-color break-all whitespace-normal line-clamp-1">{u.email}</span>
                    </div>
                    {selectedUserId === u.id && <Check className="w-4 h-4 text-primary ml-auto rtl:ml-0 rtl:mr-auto" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Plan Selection */}
          <div className="space-y-3">
            <Label className="text-md font-semibold flex">{t("select_plan")}</Label>
            {plansLoading ? (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-70  overflow-y-auto no-scrollbar pr-2">
                {plans.map((plan: Plan) => (
                  <div key={plan._id || plan.id} onClick={() => setSelectedPlanId(plan._id || plan.id || "")} className={`p-4 rounded-radius border cursor-pointer transition-all ${selectedPlanId === (plan._id || plan.id) ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20" : "border-input-border-color hover:border-primary/50 hover:bg-primary/5"}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-title text-base break-all whitespace-normal line-clamp-1">{plan.name}</h4>
                        <span className="text-sm text-subtitle-color break-all whitespace-normal line-clamp-1">{plan.billing_cycle}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary">
                          {plan.currency || "USD"} {plan.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Duration & Amount */}
          {selectedPlanId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              {!isLifetime && (
                <div className="space-y-2">
                  <Label className="text-md text-title font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {t("duration")} ({t("cycles")})
                  </Label>
                  <Input type="number" min={1} max={24} value={duration} onChange={(e) => setDuration(e.target.value)} className="h-10 rounded-radius bg-input-color border-input-border-color " />
                </div>
              )}
              <div className="space-y-2 col-span-1">
                <Label className="text-md text-title font-medium flex items-center gap-1">
                  <CreditCard className="w-4 h-4" /> {t("total_amount_override")}
                </Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-10 rounded-radius bg-input-color border-input-border-color " />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className=" gap-3 sm:gap-4 mt-4!">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
            {t("cancel")}
          </Button>
          <Button type="button" disabled={isAssigning || !selectedUserId || !selectedPlanId} onClick={handleAssign} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm gap-2">
            {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {editingSubscription ? t("update_plan") : t("assign_plan")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignPlanModal
