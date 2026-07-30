import {
  useBulkDeleteGoogleCalendarsMutation,
  useCreateGoogleCalendarMutation,
  useDeleteGoogleCalendarMutation,
  useGetGoogleCalendarsQuery,
  useLazyFetchCalendarsQuery,
  useLinkCalendarMutation,
  useListUserGoogleCalendarsQuery,
  useUpdateGoogleCalendarMutation,
} from '@/redux/api/googleCalendarsApi'
import { useGetGoogleAccountsQuery } from '@/redux/api/googleWorkspaceApi'
import { GoogleCalendar } from '@/types/google-workspace'
import { toast } from 'sonner'

export const useGoogleCalendars = () => {
  const { data: calendarsData, isLoading, refetch } = useGetGoogleCalendarsQuery()
  const { data: userCalendarsData } = useListUserGoogleCalendarsQuery()
  const { data: accountsData } = useGetGoogleAccountsQuery()

  const [createCalendar, { isLoading: isCreating }] = useCreateGoogleCalendarMutation()
  const [updateCalendar, { isLoading: isUpdating }] = useUpdateGoogleCalendarMutation()
  const [deleteCalendar, { isLoading: isDeleting }] = useDeleteGoogleCalendarMutation()
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteGoogleCalendarsMutation()
  const [fetchCalendars] = useLazyFetchCalendarsQuery()
  const [linkCalendar, { isLoading: isLinking }] = useLinkCalendarMutation()

  const handleCreate = async (data: Partial<GoogleCalendar> & { create_in_google?: boolean }) => {
    try {
      const res = await createCalendar(data).unwrap()
      toast.success('Calendar created successfully')
      return res
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to create calendar')
      throw err
    }
  }

  const handleUpdate = async (id: string, data: Partial<GoogleCalendar>) => {
    try {
      const res = await updateCalendar({ id, data }).unwrap()
      toast.success('Calendar updated successfully')
      return res
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to update calendar')
      throw err
    }
  }

  const handleDelete = async (id: string, delete_from: 'system' | 'google' = 'system') => {
    try {
      await deleteCalendar({ id, delete_from }).unwrap()
      toast.success(
        delete_from === 'google'
          ? 'Calendar deleted from System and Google'
          : 'Calendar removed from System'
      )
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to delete calendar')
      throw err
    }
  }

  const handleBulkDelete = async (ids: string[], delete_from: 'system' | 'google' = 'system') => {
    try {
      await bulkDelete({ ids, delete_from }).unwrap()
      toast.success(
        delete_from === 'google'
          ? `${ids.length} calendars deleted from System and Google`
          : `${ids.length} calendars removed from System`
      )
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to delete calendars')
      throw err
    }
  }

  const handleFetchCalendars = async (google_account_id: string) => {
    try {
      const res = await fetchCalendars(google_account_id).unwrap()
      return res.calendars || []
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to fetch calendars')
      throw err
    }
  }

  const handleLinkCalendar = async (id: string) => {
    try {
      await linkCalendar(id).unwrap()
      toast.success('Calendar linked successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to link calendar')
      throw err
    }
  }

  return {
    calendars: calendarsData?.data || [],
    userCalendars: userCalendarsData?.data || [],
    accounts: accountsData?.accounts || [],
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
    isLinking,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkDelete,
    handleFetchCalendars,
    handleLinkCalendar,
    refetch,
  }
}
