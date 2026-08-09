'use client'

import DataLoader from '@/components/reusable/DataLoader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import { useGetLanguagesQuery, useGetTranslationsQuery, useUpdateTranslationsMutation } from '@/redux/api/languageApi'
import { ApiError } from '@/types/api'
import { ArrowLeft, LayoutGrid, List as ListIcon, RotateCcw, Save, Search } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function ManageTranslations() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const {
    data: translationsData,
    isLoading: isTranslationsLoading,
    error: translationsError,
    refetch
  } = useGetTranslationsQuery(id)
  const { data: languagesData } = useGetLanguagesQuery({})
  const [updateTranslations, { isLoading: isUpdating }] = useUpdateTranslationsMutation()

  const language = useMemo(() =>
    languagesData?.data?.languages?.find((l: any) => l.id === id || l.locale === id),
    [languagesData, id]
  )

  const [editedTranslations, setEditedTranslations] = useState<Record<string, Record<string, string>>>({})

  const dynamicKey = useMemo(() => {
    if (translationsData?.data) {
      const keys = Object.keys(translationsData.data)
      if (keys.length > 0) return keys[0]
    }
    return 'front'
  }, [translationsData])

  const currentTranslations = useMemo(() => {
    const base = translationsData?.data?.[dynamicKey] || {}
    return { ...base, ...(editedTranslations[dynamicKey] || {}) }
  }, [translationsData, dynamicKey, editedTranslations])

  const filteredKeys = useMemo(() => {
    const keys = Object.keys(currentTranslations)
    if (searchQuery.trim() === '') return keys

    const lowerSearch = searchQuery.toLowerCase()
    return keys.filter(key =>
      key.toLowerCase().includes(lowerSearch) ||
      String(currentTranslations[key] || '').toLowerCase().includes(lowerSearch)
    )
  }, [currentTranslations, searchQuery])

  const handleValueChange = (key: string, value: string) => {
    setEditedTranslations((prev) => ({
      ...prev,
      [dynamicKey]: {
        ...(prev[dynamicKey] || {}),
        [key]: value
      }
    }))
  }

  const handleSave = async () => {
    try {
      await updateTranslations({
        locale: id,
        translations: editedTranslations
      }).unwrap()
      toast.success(t('translations_updated_successfully'))
      setEditedTranslations({})
      refetch()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleReset = () => {
    setEditedTranslations((prev) => {
      const next = { ...prev }
      delete next[dynamicKey]
      return next
    })
  }

  if (isTranslationsLoading) return <DataLoader fullPage />

  if (translationsError) {
    const apiError = translationsError as ApiError
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive font-medium">{apiError?.data?.message || t('failed_to_load_translations')}</p>
        <Button className="rounded-radius! bg-primary! p-padding! h-12 text-white! cursor-pointer" onClick={() => refetch()}>{t('retry')}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-radius glass-card">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('manage_translations')}</h1>
              <Badge variant="secondary" className="rounded-md h-5 px-2 text-[10px] font-bold bg-primary/10 text-primary border-primary/20 uppercase">
                {language?.name || id}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={!editedTranslations[dynamicKey] || isUpdating}
            className="rounded-radius! text-subtitle-color font-bold text-xs p-padding! border border-input-border-color gap-2  hover:bg-destructive hover:text-white bg-card-color"
          >
            <RotateCcw className="h-4 w-4" />
            {t('reset')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={Object.keys(editedTranslations).length === 0 || isUpdating}
            className="p-padding! font-medium text-sm bg-primary! text-white! rounded-radius! cursor-pointer gap-2"
          >
            {isUpdating ? (
              <div className="h-4 w-4 text-white! rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {t('save_changes')}
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4   rounded-border-radius glass-card">

        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search_keys_or_values')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-radius border-input-border-color transition-all bg-input-color text-sm"
          />
        </div>

        <div className="hidden md:flex items-center gap-1 bg-card-color p-1 rounded-radius border border-input-border-color">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('list')}
            className={cn("rounded-radius transition-all", viewMode === 'list' ? "bg-primary text-white hover:bg-primary hover:text-white shadow-sm" : "text-muted-foreground hover:bg-transparent")}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={cn("rounded-radius transition-all", viewMode === 'grid' ? "bg-primary text-white hover:bg-primary hover:text-white shadow-sm" : "text-muted-foreground hover:bg-transparent")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={cn(
        "grid gap-4 transition-all duration-300",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {filteredKeys.length > 0 ? (
          filteredKeys.map((key) => {
            const isEdited = editedTranslations[dynamicKey]?.[key] !== undefined
            return (
              <div
                key={key}
                className={cn(
                  "sm:p-5 p-4 rounded-radius border transition-all duration-200 group bg-bg-card",
                  isEdited ? "border-primary/30 bg-primary/[0.01]" : "border-input-border-color"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-muted/90 rounded-lg text-md font-medium text-title truncate max-w-[80%]">
                    <span className="transition-all duration-300 ">
                      {key}
                    </span>
                  </div>
                  {isEdited && (
                    <Badge variant="secondary" className="h-4 px-1.5 text-[8px] font-bold bg-primary text-white border-none uppercase">
                      {t('modified')}
                    </Badge>
                  )}
                </div>
                <Textarea
                  value={currentTranslations[key] || ''}
                  onChange={(e) => handleValueChange(key, e.target.value)}
                  rows={viewMode === 'grid' ? 3 : 2}
                  className="w-full bg-subcard border border-input-border-color rounded-border-radius p-3 text-sm font-medium resize-none focus:ring-2 focus:ring-primary/10 focus:border-primary/20 transition-all outline-none"
                  placeholder={t('enter_translation')}
                />
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-card-color  rounded-radius border-2 border-dashed border-input-border-color">
            <div className='relative w-12 h-12 bg-primary/20 text-primary rounded-lg flex items-center justify-center mb-3'>
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold">{t('no_keys_found')}</h3>
          </div>
        )}
      </div>
    </div>
  )
}
