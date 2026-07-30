import {
  useDisconnectGoogleAccountMutation,
  useGetGoogleAccountsQuery,
  useLazyConnectGoogleQuery,
} from '@/redux/api/googleWorkspaceApi'
import { useState } from 'react'
import { toast } from 'sonner'

export const useGoogleWorkspace = () => {
  const [isConnecting, setIsConnecting] = useState(false)

  const { data, isLoading, isFetching, refetch } = useGetGoogleAccountsQuery()
  const [connectGoogle] = useLazyConnectGoogleQuery()
  const [disconnectAccount, { isLoading: isDisconnecting }] = useDisconnectGoogleAccountMutation()

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      const res = await connectGoogle().unwrap()
      if (res.url) {
        window.location.href = res.url
      } else {
        toast.error('Failed to get connection URL')
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'An error occurred')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (id: string) => {
    try {
      await disconnectAccount(id).unwrap()
      toast.success('Account disconnected successfully')
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'An error occurred')
      throw error
    }
  }

  return {
    accounts: data?.accounts || [],
    isLoading,
    isFetching,
    isConnecting,
    isDisconnecting,
    handleConnect,
    handleDisconnect,
    refetch,
  }
}
