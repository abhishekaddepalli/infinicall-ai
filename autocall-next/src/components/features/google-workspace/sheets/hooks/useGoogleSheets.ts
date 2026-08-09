import {
  useBulkDeleteGoogleSheetsMutation,
  useCreateGoogleSheetMutation,
  useDeleteGoogleSheetMutation,
  useGetGoogleSheetsQuery,
  useLinkGoogleSheetMutation,
  useSyncGoogleSheetsMutation,
  useUpdateGoogleSheetMutation,
} from '@/redux/api/googleSheetsApi'
import { useGetGoogleAccountsQuery } from '@/redux/api/googleWorkspaceApi'
import { GoogleSheet } from '@/types/google-workspace'
import { toast } from 'sonner'

export const useGoogleSheets = () => {
  const { data: sheetsData, isLoading, refetch } = useGetGoogleSheetsQuery()
  const { data: accountsData } = useGetGoogleAccountsQuery()

  const [createSheet, { isLoading: isCreating }] = useCreateGoogleSheetMutation()
  const [updateSheet, { isLoading: isUpdating }] = useUpdateGoogleSheetMutation()
  const [deleteSheet, { isLoading: isDeleting }] = useDeleteGoogleSheetMutation()
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteGoogleSheetsMutation()
  const [syncSheets, { isLoading: isSyncing }] = useSyncGoogleSheetsMutation()
  const [linkSheet, { isLoading: isLinking }] = useLinkGoogleSheetMutation()

  const handleCreate = async (data: Partial<GoogleSheet> & { create_in_google?: boolean }) => {
    try {
      const res = await createSheet(data).unwrap()
      toast.success('Sheet created successfully')
      return res
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to create sheet')
      throw err
    }
  }

  const handleUpdate = async (id: string, data: Partial<GoogleSheet>) => {
    try {
      const res = await updateSheet({ id, data }).unwrap()
      toast.success('Sheet updated successfully')
      return res
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to update sheet')
      throw err
    }
  }

  const handleDelete = async (id: string, delete_from: 'system' | 'google' = 'system') => {
    try {
      await deleteSheet({ id, delete_from }).unwrap()
      toast.success(
        delete_from === 'google'
          ? 'Sheet deleted from System and Google Drive'
          : 'Sheet removed from System'
      )
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to delete sheet')
      throw err
    }
  }

  const handleBulkDelete = async (ids: string[], delete_from: 'system' | 'google' = 'system') => {
    try {
      await bulkDelete({ ids, delete_from }).unwrap()
      toast.success(
        delete_from === 'google'
          ? `${ids.length} sheets deleted from System and Google Drive`
          : `${ids.length} sheets removed from System`
      )
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to delete sheets')
      throw err
    }
  }

  const handleFetchSheets = async (google_account_id: string) => {
    try {
      const res = await syncSheets({ google_account_id }).unwrap()
      return res.sheets || []
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to fetch sheets')
      throw err
    }
  }

  const handleSync = async (google_account_id: string, selectedSheets: { id: string; name: string }[]) => {
    try {
      await syncSheets({ google_account_id, sheets: selectedSheets }).unwrap()
      toast.success('Sheets synced successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to sync sheets')
      throw err
    }
  }

  const handleLinkSheet = async (id: string) => {
    try {
      await linkSheet(id).unwrap()
      toast.success('Sheet linked successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to link sheet')
      throw err
    }
  }

  return {
    sheets: sheetsData?.data || [],
    accounts: accountsData?.accounts || [],
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
    isSyncing,
    isLinking,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkDelete,
    handleFetchSheets,
    handleSync,
    handleLinkSheet,
    refetch,
  }
}
