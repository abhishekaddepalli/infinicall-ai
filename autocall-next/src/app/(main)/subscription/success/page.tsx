'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function SubscriptionSuccessPage() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <Card className="w-full max-w-md rounded-lg border-primary/20">
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-lg bg-edit/10 flex items-center justify-center text-edit">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="sm:text-2xl text-lg text-title">{t('payment_successful', 'Payment Successful')}</CardTitle>
          <CardDescription className="sm:text-base text-md text-subtitle-color">
            {t('your_subscription_is_now_active', 'Your subscription is now active')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 pt-0!">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-title">
                {t('you_can_now_access_all_the_premium_features_of_your_plan', 'You can now access all the premium features of your plan.')}
              </p>

            </div>
            <div className="flex gap-2 flex-wrap w-full">
              <Button variant="outline" onClick={() => router.push(ROUTES.PLANS)} className="flex-1 border-none bg-primary/10 hover:bg-primary hover:text-white text-primary p-padding!">
                {t('view_plans', 'View Plans')}
              </Button>
              <Button onClick={() => router.push(ROUTES.DASHBOARD)} className="flex-1 p-padding! bg-primary text-white">
                {t('go_to_dashboard', 'Go to Dashboard')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
