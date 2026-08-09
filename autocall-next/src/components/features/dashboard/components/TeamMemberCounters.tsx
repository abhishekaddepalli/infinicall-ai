'use client'

import { StatsCard } from './StatsCard'

export function TeamMemberCounters({ counterCards }: { counterCards: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
      {counterCards.map((card, idx) => (
        <StatsCard
          key={idx}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          colorClass={card.colorClass}
          glowClass={card.glowClass}
        />
      ))}
    </div>
  )
}
