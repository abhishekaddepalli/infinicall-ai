export interface Appointment {
  id: string;
  _id: string;
  user_id: string;
  call_id: string | null;
  flow_id: string | null;
  name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'rescheduled' | 'cancelled';
  google_event_id: string | null;
  meet_link: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface SlotInterval {
  from: string;
  to: string;
}

export interface AppointmentSlot {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  intervals: SlotInterval[];
  is_enabled: boolean;
}

export interface AppointmentSetting {
  id?: string;
  _id?: string;
  user_id?: string;
  allow_overlapping: boolean;
  buffer_time: number;
  max_appointments_per_day: number | null;
  confirmation_channel: 'none' | 'sms' | 'whatsapp';
  confirmation_message_template: string;
  slots: AppointmentSlot[];
}

export interface AppointmentCalendarViewProps {
  events: {
    id: string
    title: string
    start: string
    backgroundColor: string
    borderColor: string
    extendedProps: any
  }[]
  onEventClick: (arg: any) => void
}

export interface AppointmentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: Appointment | null
  onStatusChange: (status: string, date?: string, time?: string) => Promise<void>
  isUpdating: boolean
}

export interface AppointmentFilterToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  onRefresh: () => void
  isFetching: boolean
}

export interface AppointmentListResponse {
  success: boolean
  data: Appointment[]
}

export interface AppointmentMutationResponse {
  success: boolean
  message: string
  data: Appointment
}

export interface AppointmentSettingResponse {
  success: boolean
  data: AppointmentSetting
}

export interface AppointmentSettingMutationResponse {
  success: boolean
  message: string
  data: AppointmentSetting
}