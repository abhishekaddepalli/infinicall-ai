'use client'

import { NODES } from '@/data/flow'
import { cn } from '@/lib/utils'
import { AddNodesSidebarProps } from '@/types/flow'
import { useTranslation } from 'react-i18next'

export function AddNodesSidebar({ onNodeClick }: AddNodesSidebarProps) {
  const { t } = useTranslation()

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="h-full w-full md:w-[180px] bg-bg-card border-l border-input-border-color flex flex-col z-40 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] shrink-0">
      <div className="p-4 border-b border-input-border-color font-bold text-sm text-foreground">
        {t('nodes') || t('nodes')}
      </div>
      {/* Nodes Vertical list */}
      <div
        className="flex-1 grid grid-cols-1 content-start gap-3 overflow-y-auto p-4 custom-scrollbar"
      >
        {NODES.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            onClick={() => onNodeClick?.(node.type)}
            className={cn(
              "group flex flex-col items-center gap-3 px-3 py-3 rounded-radius bg-input-color border border-input-border-color hover:bg-primary/5 cursor-pointer hover:shadow-sm active:scale-95 transition-all duration-300 shrink-0",
            )}
          >
            <div className={cn("p-1.5 rounded-lg text-white shadow-sm transition-transform group-hover:scale-110 shrink-0", node.color)}>
              <node.icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-foreground/80 dark:text-white/80 leading-tight">
              {t(node.labelKey, { defaultValue: node.labelKey })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
