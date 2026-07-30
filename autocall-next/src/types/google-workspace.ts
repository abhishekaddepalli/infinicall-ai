export interface ApiResponse {
  success: boolean
  message?: string
}

export interface GoogleAccount {
  _id: string
  user_id: string
  email: string
  status: 'active' | 'inactive' | 'expired'
  created_at: string
}

export interface GoogleConnectResponse extends ApiResponse {
  url: string
}

export interface GoogleAccountsResponse extends ApiResponse {
  accounts: GoogleAccount[]
}

export interface GoogleSheet {
  _id: string
  id?: string
  google_account_id: string | GoogleAccount
  name: string
  spreadsheet_id: string
  sheet_name: string
  range: string
  headers: string[]
  is_active: boolean
  is_linked: boolean
  description: string
  last_synced_at: string | null
  created_at: string
}

export interface GoogleSheetsResponse extends ApiResponse {
  data: GoogleSheet[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface GoogleSheetResponse extends ApiResponse {
  data: GoogleSheet
}

export interface GoogleCalendar {
  _id: string
  id?: string
  google_account_id: string | GoogleAccount
  name: string
  calendar_id: string

  is_active: boolean
  is_linked: boolean
  description: string
  timezone: string

  last_synced_at: string | null
  created_at: string
}

export interface GoogleCalendarsResponse extends ApiResponse {
  data: GoogleCalendar[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface GoogleCalendarResponse extends ApiResponse {
  data: GoogleCalendar
}

export interface FetchCalendarsResponse extends ApiResponse {
  calendars: GoogleCalendar[]
}


export interface DeleteSourceModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (deleteFrom: 'system' | 'google') => void
  isDeleting?: boolean
  title?: string
  description?: string
  itemCount?: number
}

export interface DisconnectAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export interface CalendarEventsModalProps {
  isOpen: boolean
  onClose: () => void
  calendar: GoogleCalendar | null
}

export interface CreateEditCalendarModalProps {
  isOpen: boolean
  onClose: () => void
  calendarToEdit?: GoogleCalendar | null
}

export interface DeleteEventModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  eventTitle?: string
}

export interface GoogleCalendarsTableProps {
  onViewEvents: (calendar: GoogleCalendar) => void
}

export interface LinkCalendarModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface GoogleSheetsTableProps {
  onEdit: (sheet: GoogleSheet) => void
  onView: (sheet: GoogleSheet) => void
}

export interface SheetDataModalProps {
  isOpen: boolean
  onClose: () => void
  sheet: GoogleSheet | null
  mode: 'view' | 'edit'
}

export interface SyncSheetsModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface CalendarEvent {
  id?: string
  summary: string
  description?: string
  location?: string
  start: { dateTime?: string; date?: string; timeZone?: string }
  end: { dateTime?: string; date?: string; timeZone?: string }
  status?: string
  attendees?: { email: string; responseStatus?: string }[]
  htmlLink?: string
}