'use client'

import { Switch } from '@/components/ui/switch'
import { SharedStatusSwitchProps } from '@/types/shared'
import { useState } from 'react'

export const StatusSwitch = ({ isActive, onToggle, canManage, disabled = false }: SharedStatusSwitchProps) => {
  const [localActive, setLocalActive] = useState(isActive)
  const [isPending, setIsPending] = useState(false)

  // Keep in sync when the parent refreshes its data
  const [prevIsActive, setPrevIsActive] = useState(isActive)
  if (isActive !== prevIsActive) {
    setPrevIsActive(isActive)
    setLocalActive(isActive)
  }

  const handleToggle = async () => {
    if (isPending || !canManage || disabled) return
    const previous = localActive

    setLocalActive(!previous)
    setIsPending(true)

    try {
      await onToggle()
    } catch {
      setLocalActive(previous) // revert on failure
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch className='data-[state=checked]:bg-primary' checked={localActive} onCheckedChange={handleToggle} disabled={!canManage || disabled || isPending} />
    </div>
  )
}
