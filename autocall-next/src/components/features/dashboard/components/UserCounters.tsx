'use client'

import { UserCountersProps } from '@/types/dashboard'
import { StatsCard } from './StatsCard'

export function UserCounters({ counterCards }: UserCountersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 pb-2 sm:pb-0">
      {counterCards.map((card, idx) => (
        <div key={idx} className="min-w-0">
          <StatsCard
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            colorClass={card.colorClass}
            glowClass={card.glowClass}
          />
        </div>
      ))}
    </div>
  )
}
