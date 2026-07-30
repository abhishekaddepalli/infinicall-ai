'use client'

import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { useEffect } from 'react'
import { initializeAuth } from '@/redux/slices/authSlice'
import { initializeLayout } from '@/redux/slices/layoutSlice'

export default function DirectionWrapper({ children }: { children: React.ReactNode }) {
  const direction = useAppSelector((state) => state.layout.direction)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
    dispatch(initializeLayout())
  }, [dispatch])

  useEffect(() => {
    document.documentElement.dir = direction
  }, [direction])

  return <>{children}</>
}
