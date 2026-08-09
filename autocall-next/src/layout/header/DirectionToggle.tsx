'use client'

import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleDirection } from '@/redux/slices/layoutSlice'
import { PilcrowLeft, PilcrowRight } from 'lucide-react'

const DirectionToggle = () => {
  const dispatch = useAppDispatch()
  const direction = useAppSelector((state) => state.layout.direction)

  const handleToggle = () => {
    dispatch(toggleDirection())
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-10 w-10 rounded-full hover:bg-white/10 transition-all duration-300 group"
      title={direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
    >
      {direction === 'ltr' ? (
        <PilcrowRight className="w-6 h-6 text-white/80 " />
      ) : (
        <PilcrowLeft className="w-6 h-6 text-white/80" />
      )}
    </Button>
  )
}

export default DirectionToggle
