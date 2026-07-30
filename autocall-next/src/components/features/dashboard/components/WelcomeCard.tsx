'use client'

import { WelcomeCardProps } from '@/types/dashboard'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function WelcomeCard({ badge, title, subtitle, className = 'p-6' }: WelcomeCardProps) {
  const [greeting, setGreeting] = useState('GOOD AFTERNOON')
  const [currentDate, setCurrentDate] = useState('Monday, May 18')

  useEffect(() => {
    const hours = new Date().getHours()
    if (hours < 12) {
      setGreeting('GOOD MORNING')
    } else if (hours < 17) {
      setGreeting('GOOD AFTERNOON')
    } else {
      setGreeting('GOOD EVENING')
    }

    const dateStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
    setCurrentDate(dateStr)
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const displayTitle = title.includes('👋') ? title : `${title} 👋`

  return (
    <motion.div
      variants={cardVariants}
      className={`relative overflow-hidden rounded-lg ${className} shadow-lg`}
      style={{
        backgroundImage: `
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, #001a2e 0%, #012d46 50%, #013d5e 100%)
  `,
        backgroundSize: '35px 35px, 35px 35px, auto'
      }}
    >
      {/* Glowing Circle */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Content container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between space-y-6">
        <div className='flex flex-col gap-3'>

          {/* Top Header */}
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-semibold text-white/90 uppercase tracking-widest">
              {badge}
            </span>
            <div className="p-2 rounded-full bg-white/10 dark:bg-white/5 text-white border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Middle Greeting */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white tracking-tight leading-tight break-words line-clamp-2 w-[70%] sm:w-[65%]">
              {displayTitle}
            </h1>
            {subtitle && (
              <p className="text-white/80 text-sm sm:text-md font-normal w-[65%] sm:w-[65%] leading-relaxed line-clamp-3">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Current Date & Status */}
        <div className="pt-3 w-full flex flex-col items-start gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/15 dark:bg-white/10 text-white border border-white/25 uppercase leading-none">
            {greeting}
          </span>
          <p className="text-white/80 text-md font-semibold pl-1">
            {currentDate}
          </p>
        </div>

        <Image src="assets/images/robot2.png" alt="Welcome card" width={200} height={200} className="absolute w-[45%] sm:w-[50%] max-w-[180px] sm:max-w-[220px] lg:max-w-[250px] -right-3 rtl:right-[unset] rtl:-left-3 bottom-0" unoptimized />

      </div>
    </motion.div>
  )
}
