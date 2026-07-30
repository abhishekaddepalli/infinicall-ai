'use client'


import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/store'
import AdminPlansPage from './AdminPlansPage'
import UserPlans from './UserPlans'

const PlansRouter = () => {
  const user = useAppSelector((state: RootState) => state.auth.user)
  const isUser = user?.role === 'user'
  return isUser ? <UserPlans /> : <AdminPlansPage />
}

export default PlansRouter
