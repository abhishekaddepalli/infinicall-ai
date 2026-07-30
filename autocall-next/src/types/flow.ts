export interface FlowNodeData {
  type: NodeType
  label?: string
  description?: string
  condition?: string
  true_branch?: string
  false_branch?: string
  [key: string]: unknown
}

export interface FlowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: FlowNodeData
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
}

export interface Flow {
  _id: string
  id: string
  name: string
  description?: string
  status: 'active' | 'inactive'
  nodes: FlowNode[]
  edges: FlowEdge[]
  data?: Record<string, unknown>
  user_id: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
  system_flow?: boolean
}

export interface FlowListResponse {
  success: boolean
  data: Flow[]
  total: number
  page: number
  limit: number
}

export interface FlowDetailResponse {
  success: boolean
  data: Flow
}

export interface FlowMutationResponse {
  success: boolean
  message: string
  data: Flow
}

export interface FlowDeleteResponse {
  success: boolean
  message: string
}

export interface FlowTestResponse {
  success: boolean
  message: string
  data: {
    steps: Array<{ nodeId: string; type: string; output: string }>
    final_output?: string
  }
}

export interface GetFlowsParams {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface CreateFlowPayload {
  name: string
  description?: string
  status?: 'active' | 'inactive'
  nodes?: FlowNode[]
  edges?: FlowEdge[]
}

export interface UpdateFlowPayload {
  id: string
  name?: string
  description?: string
  status?: 'active' | 'inactive'
  nodes?: FlowNode[]
  edges?: FlowEdge[]
}

export interface TestFlowPayload {
  id: string
  input?: Record<string, unknown>
}

export type NodeType =
  | 'message_output'
  | 'input_capture'
  | 'decision_split'
  | 'book_slot'
  | 'data_capture'
  | 'wait_delay'
  | 'audio_playback'
  | 'whatsapp_notice'
  | 'terminate_call'
  | 'variable_map'
  | 'redirect_call'
  | 'email_notice'

import type { ElementType } from 'react'

export interface NodeItem {
  type: NodeType
  labelKey: string
  icon: ElementType
  color: string
}

export interface FlowBuilderEditorProps {
  id: string
}

export interface FlowCardProps {
  flow: Flow
  onEdit: (id: string) => void
  onTest: (flow: Flow) => void
  onDelete: (id: string) => void
  onToggleStatus: (flow: Flow) => void
}

export interface NodePropertiesProps {
  node: FlowNode | null
  nodes: FlowNode[]
  onClose: () => void
  onUpdate: (patch: Partial<FlowNode>) => void
  onDelete: (id: string) => void
}

export interface TestFlowModalProps {
  flow: Flow | null
  isOpen: boolean
  onClose: () => void
}

export interface PlaceCallPayload {
  flowId: string
  phoneNumber: string
  fromNumber: string
  agentId?: string
}

export interface CallResponse {
  success: boolean
  message: string
  data?: unknown
}

export interface AddNodesSidebarProps {
  onNodeClick?: (nodeType: string) => void
}

export interface FlowItemProps {
  flow: Flow
  viewMode: 'grid' | 'list'
  isLastItem?: boolean
  onStatusChange: (flow: Flow) => void
  onEdit: (flow: Flow) => void
  onDelete: (id: string) => void
  onTest?: (flow: Flow) => void
  selectable?: boolean
  isSelected?: boolean
  onSelectChange?: (checked: boolean) => void
}

export interface CallTranscript {
  role: string;
  text: string;
  _id?: string;
  timestamp?: string;
}

export interface CallLog {
  _id: string;
  id?: string;
  user_id: string;
  flow_id: { _id: string; name: string; id?: string } | null;
  agent_id: { id: string; name: string } | string | null;
  campaign_id: { id: string; name: string } | string | null;
  contact_id?: { _id: string; first_name: string; last_name: string; phone_number: string; email: string; is_blocked?: boolean } | null;
  lead_name?: string;
  twilio_call_sid: string;
  from_number: string;
  to_number: string;
  status: string;
  direction: string;
  duration: number;
  recording_url: string | null;
  transcript?: CallTranscript[];
  detected_words?: string[];
  transcript_snippet?: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CallLogsResponse {
  success: boolean;
  data: CallLog[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}