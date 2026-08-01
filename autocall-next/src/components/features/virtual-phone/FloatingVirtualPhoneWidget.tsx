'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { motion } from 'framer-motion'
import { PhoneCall } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export function FloatingVirtualPhoneWidget() {
  const router = useRouter()
  const pathname = usePathname()

  // Do not display launcher widget if user is already on the Virtual Phone page
  if (pathname === ROUTES.VIRTUAL_PHONE) {
    return null
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={() => router.push(ROUTES.VIRTUAL_PHONE)}
        className="rounded-full px-5 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-2xl shadow-primary/30 flex items-center gap-2.5 hover:scale-105 transition-all"
      >
        <div className="relative">
          <PhoneCall className="w-5 h-5 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-primary" />
        </div>
        <span className="text-sm font-semibold">Virtual Phone</span>
      </Button>
    </motion.div>
  )
}
