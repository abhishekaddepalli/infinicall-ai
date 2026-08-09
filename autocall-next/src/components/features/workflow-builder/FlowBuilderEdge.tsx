'use client'

import { Button } from '@/components/ui/button'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from '@xyflow/react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function FlowBuilderEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const { t } = useTranslation()
  const { setEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation()
    setEdges((edges) => edges.filter((e) => e.id !== id))
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="group p-4 flex items-center justify-center cursor-pointer z-50"
        >
          <Button
            onClick={onEdgeClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 bg-white text-rose-500 rounded-xl shadow-xl border border-rose-100 dark:border-rose-500/20 text-[10px] font-black tracking-widest uppercase transition-all ${selected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t('delete')}
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
