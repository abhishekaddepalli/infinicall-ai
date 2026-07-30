'use client'

import { DataCardGrid } from "@/components/reusable/DataCardGrid"
import { PageHeader } from "@/components/reusable/PageHeader"
import { Button } from "@/components/ui/button"
import { PERMISSIONS } from "@/constants/permissions"
import { useDebounce } from "@/hooks/useDebounce"
import { usePermission } from "@/hooks/usePermission"
import { useGetVoicesQuery, useSyncVoicesMutation } from "@/redux/api/voiceApi"
import { Mic, RotateCw } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { VoiceCard } from "./VoiceCard"

export const VoiceAgentPage = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)
  const { hasPermission } = usePermission()

  const { data: response, isLoading } = useGetVoicesQuery()
  const [syncVoices, { isLoading: isSyncing }] = useSyncVoicesMutation()

  const allVoices = response?.data || []
  const canSync = hasPermission(PERMISSIONS.SYNC_VOICES)

  const handleSync = async () => {
    try {
      const res = await syncVoices().unwrap()
      if (res?.success) {
        toast.success(res.message || t("voices_synced_success"))
      } else {
        toast.error(res?.message || t("voices_synced_failed"))
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || t("voices_synced_error"))
    }
  }

  // Client-side filtering as the API doesn't seem to support search params currently based on backend controller
  const filteredVoices = allVoices.filter(voice => {
    const searchLower = debouncedSearch.toLowerCase()
    return (
      voice.name.toLowerCase().includes(searchLower) ||
      voice.labels.accent?.toLowerCase().includes(searchLower) ||
      voice.labels.gender?.toLowerCase().includes(searchLower) ||
      voice.labels.description?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        title={t("voice_agent")}
        showBackButton={false}
        icon={<Mic className="w-8 h-8 text-primary" />}
        endContent={
          canSync && (
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              className="rounded-lg! p-padding! h-12 font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-primary text-white shadow hover:bg-primary/90"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("syncing")}</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-4 h-4" />
                  <span>{t('sync_voice')}</span>
                </>
              )}
            </Button>
          )
        }
      />

      <div className="space-y-6">
        <DataCardGrid
          data={filteredVoices}
          isLoading={isLoading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("search_voices")}
          emptyStateTitle={t("no_voices_title", "No Voices Found")}
          emptyMessage={t("no_voices_desc", "Sync available voices from your provider for automated calls.")}
          emptyStateActionLabel={t('sync_voice')}
          onEmptyStateAction={canSync ? handleSync : undefined}
          renderCard={(voice) => (
            <VoiceCard voice={voice} />
          )}
        />
      </div>
    </div>
  )
}
