import dynamic from 'next/dynamic'

const CallLogsPage = dynamic(() => import('@/components/features/call-logs/CallLogsPage'), {
  loading: () => <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">Loading module...</div>
})

export default function CallLogs() {
  return <CallLogsPage />
}
