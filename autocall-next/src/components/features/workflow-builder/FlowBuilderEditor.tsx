'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { useCreateFlowMutation, useGetFlowByIdQuery, useUpdateFlowMutation } from '@/redux/api/flowApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setSidebarCollapsed } from '@/redux/slices/layoutSlice'
import { FlowBuilderEditorProps, NodeType } from '@/types/flow'
import {
  Connection,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  Edge,
  MiniMap,
  Node,
  OnConnect,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ArrowLeft, MoreVertical, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AddNodesSidebar } from './AddNodesSidebar'
import { FlowBuilderEdge } from './FlowBuilderEdge'
import { FlowBuilderNode } from './FlowBuilderNode'

const nodeTypes = { flowNode: FlowBuilderNode } as any
const edgeTypes = { customEdge: FlowBuilderEdge } as any

function FlowBuilderEditorContent({ id }: FlowBuilderEditorProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const isNew = id === 'new'

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setSidebarCollapsed(true))
    return () => {
      dispatch(setSidebarCollapsed(false))
    }
  }, [dispatch])

  const skipQuery = isNew || !id || id === 'undefined'
  const { data: flowResponse, isLoading: isFetching } = useGetFlowByIdQuery(id, { skip: skipQuery })
  const [createFlow, { isLoading: isCreating }] = useCreateFlowMutation()
  const [updateFlow, { isLoading: isUpdating }] = useUpdateFlowMutation()

  const user = useAppSelector((state: any) => state.auth?.user)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const isViewOnly = !isAdmin && flowResponse?.data?.system_flow === true;

  const [name, setName] = useState(t('untitled_flow') || t('untitled_flow'))
  const [description, setDescription] = useState('')
  const [showNodesSidebar, setShowNodesSidebar] = useState(true)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { screenToFlowPosition } = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (flowResponse?.data) {
      const flow = flowResponse.data
      setTimeout(() => {
        setName(flow.name)
        setDescription(flow.description || '')
        setNodes(flow.nodes.map(n => ({
          id: n.id,
          type: 'flowNode',
          position: n.position,
          data: { ...n.data, type: n.type }
        })))

        setEdges(flow.edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle,
          targetHandle: e.targetHandle,
          type: 'customEdge',
          animated: false,
          style: { stroke: '#015482', strokeWidth: 2 }
        })))
      }, 0)
    }
  }, [flowResponse, setNodes, setEdges])

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'customEdge',
      animated: false,
      style: { stroke: '#015482', strokeWidth: 2 }
    }, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow') as NodeType
      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'flowNode',
        position,
        data: {
          type,
          label: type.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          description: ''
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, setNodes]
  )

  const onNodeClick = useCallback(
    (type: string) => {
      let position = { x: 150, y: 150 }
      if (reactFlowWrapper.current) {
        const bounds = reactFlowWrapper.current.getBoundingClientRect()
        position = screenToFlowPosition({
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
        })
      }

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'flowNode',
        position,
        data: {
          type: type as NodeType,
          label: type.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          description: ''
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, setNodes]
  )

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(t('please_enter_flow_name') || t('please_enter_a_flow_name'))
      return
    }

    const payload = {
      name,
      description,
      nodes: nodes.map(n => {
        const type = n.data?.type || n.type
        const restData = { ...n.data }
        delete restData.type
        return {
          id: n.id,
          type: type as NodeType,
          position: n.position,
          data: { ...restData, type: type as NodeType }
        }
      }),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle || null,
        targetHandle: e.targetHandle || null
      })),
      status: flowResponse?.data?.status || 'active',
      data: {
        voice_id: flowResponse?.data?.data?.voice_id || null
      }
    }

    try {
      if (isNew) {
        const res = await createFlow(payload).unwrap()
        toast.success(res.message || t('flow_created_successfully'))
        router.push(ROUTES.WORKFLOW_BUILDER)
      } else {
        const res = await updateFlow({ id, ...payload }).unwrap()
        toast.success(res.message || t('flow_updated_successfully'))
        router.push(ROUTES.WORKFLOW_BUILDER)
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('failed_to_save_flow'))
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="h-[calc(100dvh-99px)] min-h-[400px] md:min-h-[600px] flex flex-col rounded-lg overflow-hidden border border-gray-100 dark:border-white/5 bg-bg-card shadow">
      {/* Top Bar */}
      <header className="py-4 md:h-20 bg-bg-input-button-color backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 z-50">
        <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 " />
          </Button>

          <div className="flex items-center gap-4 flex-1">
            <div className="flex flex-col gap-1 w-full">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isViewOnly}
                className="bg-transparent border-none p-0 h-auto text-[16px]! font-black text-title focus-visible:ring-0 w-full md:w-64 placeholder:text-muted-foreground/30 disabled:opacity-100 disabled:cursor-default"
                placeholder={t('untitled_flow')}
              />
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isViewOnly}
                className="bg-transparent border-none p-0 h-auto text-xs font-medium text-subtilte-color! focus-visible:ring-0 w-full md:w-64 placeholder:text-muted-foreground/30 disabled:opacity-100 disabled:cursor-default"
                placeholder={t('flow_description_placeholder')}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto justify-end">
          <div className="flex items-center gap-3">
            {!isViewOnly && (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isUpdating || isCreating}
                  className="p-padding! rounded-radius bg-primary cursor-pointer text-white font-medium text-md gap-2 transition-all"
                >
                  {(isUpdating || isCreating) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t('save_flow')}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNodesSidebar(!showNodesSidebar)}
                  className={cn(
                    "w-9 h-9 rounded-radius border transition-all duration-300",
                    showNodesSidebar
                      ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                      : "bg-primary/10 dark:bg-white/5 border-gray-200 dark:border-white/10 text-primary dark:hover:bg-white/10"
                  )}
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-row h-full relative z-40 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative bg-bg-card" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Loose}
            connectionLineType={ConnectionLineType.SmoothStep}
            nodesDraggable={!isViewOnly}
            nodesConnectable={!isViewOnly}
            elementsSelectable={!isViewOnly}
            fitView
            className="bg-dot-pattern"
            style={{ maskImage: 'none', WebkitMaskImage: 'none' }}
            proOptions={{ hideAttribution: true }}
          >
            {/* <Background color="#cbd5e1" gap={24} size={1} /> */}
            <Controls className="!bg-bg-card !border-input-border-color !shadow-xl !rounded-lg overflow-hidden" />
            <MiniMap
              className="!bg-bg-card !border-input-border-color !shadow-xl !rounded-lg overflow-hidden"
              maskColor="rgba(240, 240, 240, 0.4)"
              pannable
              zoomable
            />
          </ReactFlow>
        </div>

        {/* Right Vertical Sidebar with Animation */}
        {!isViewOnly && (
          <div className={cn(
            "absolute md:relative right-0 top-0 h-full z-50 md:z-auto bg-bg-card md:bg-transparent shadow-2xl md:shadow-none w-full sm:w-auto",
            "grid transition-all duration-500 ease-in-out origin-right",
            showNodesSidebar ? "grid-cols-[1fr] opacity-100 translate-x-0" : "grid-cols-[0fr] opacity-0 translate-x-8 pointer-events-none"
          )}>
            <div className="overflow-hidden h-full w-full sm:w-[280px] md:w-auto">
              <AddNodesSidebar onNodeClick={onNodeClick} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function FlowBuilderEditor({ id }: FlowBuilderEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowBuilderEditorContent id={id} />
    </ReactFlowProvider>
  )
}
