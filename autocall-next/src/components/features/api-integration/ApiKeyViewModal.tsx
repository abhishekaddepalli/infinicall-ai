import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetApiKeyByIdQuery } from '@/redux/api/apiKeyApi'
import { ApiKeyViewModalProps } from '@/types/api-key'
import { formatDate } from '@/utils/validation-schemas'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function ApiKeyViewModal({ viewId, onClose }: ApiKeyViewModalProps) {
  const { t } = useTranslation()
  const { data: viewData, isFetching: isFetchingView } = useGetApiKeyByIdQuery(viewId || '', {
    skip: !viewId,
  })

  const groupedPermissions = useMemo(() => {
    if (!viewData?.apiKeys?.[0]?.permissions) return []

    const groups: Record<string, string[]> = {}

    viewData.apiKeys[0].permissions.forEach((perm: any) => {
      const parts = perm.slug?.split('.') || []

      const action = parts[0] || ''
      const moduleRaw = parts[1] || perm.name || ''

      const module = moduleRaw.replace(/_/g, ' ')

      if (!groups[module]) {
        groups[module] = []
      }
      groups[module].push(action)
    })

    return Object.entries(groups).map(([module, actions]) => {
      // capitalize each word of module
      const moduleName = module.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

      const formattedActions = actions.map(a => a.charAt(0).toUpperCase() + a.slice(1))

      formattedActions.sort((a, b) => {
        if (a === 'View') return -1
        if (b === 'View') return 1
        return 0
      })

      return {
        module: moduleName,
        access: formattedActions.join(' , ')
      }
    })
  }, [viewData])

  return (
    <Dialog open={!!viewId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]! max-w-[calc(100%-2rem)]! gap-0! w-full bg-bg-card border-none rounded-modal-radius sm:p-6 p-4  max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="border-b border-input-border-color pb-5 mb-5">
          <DialogTitle className="text-xl font-bold flex items-center gap-3 text-title">
            <span>{t('api_key_details', 'API Key Details')}</span>
          </DialogTitle>
        </DialogHeader>

        {isFetchingView ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-subtitle-color">{t('loading')}</p>
          </div>
        ) : viewData?.apiKeys?.[0] ? (
          <div className="space-y-7">
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 sm:flex sm:flex-row sm:items-center sm:justify-between sm:divide-x sm:divide-input-border-color/60 border-b border-input-border-color sm:pb-6 pb-4">
              <div className="flex flex-col space-y-1 sm:pr-4 sm:w-1/4">
                <span className="text-sm sm:text-md font-semibold text-subtitle-color">{t('name')}</span>
                <p className="text-sm font-bold text-title truncate">{viewData.apiKeys[0].name}</p>
              </div>
              <div className="flex flex-col space-y-1 sm:px-4 sm:w-1/4">
                <span className="text-sm sm:text-md font-semibold text-subtitle-color">{t('status')}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${viewData.apiKeys[0].is_active ? 'bg-edit' : 'bg-destructive'}`}></div>
                  <span className={`text-sm font-bold ${viewData.apiKeys[0].is_active ? 'text-edit' : 'text-destructive'}`}>
                    {viewData.apiKeys[0].is_active ? t('active', 'Active') : t('inactive', 'Inactive')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-1 sm:px-4 sm:w-1/4">
                <span className="text-sm sm:text-md font-semibold text-subtitle-color">{t('created_at', 'Created At')}</span>
                <p className="text-sm font-bold text-title">{formatDate(viewData.apiKeys[0].created_at)}</p>
              </div>
              <div className="flex flex-col space-y-1 sm:pl-4 sm:w-1/4">
                <span className="text-sm sm:text-md font-semibold text-subtitle-color">{t('last_used_at', 'Last Used At')}</span>
                <p className="text-sm font-bold text-title">
                  {viewData.apiKeys[0].last_used_at ? formatDate(viewData.apiKeys[0].last_used_at) : t('never', 'Never')}
                </p>
              </div>
            </div>

            <div className="space-y-3 pb-4">
              <div>
                <h3 className="text-base font-bold text-title">{t('permissions', 'Permissions')}</h3>
                <p className="text-md font-medium text-subtitle-color mt-1">{t('api_key_permissions_desc', 'This API key has the following permissions:')}</p>
              </div>

              <div className="rounded-lg border border-input-border-color overflow-hidden mt-4">
                <div className="hidden sm:grid grid-cols-2 bg-slate-50 dark:bg-slate-800/30 p-3 px-4 border-b border-input-border-color">
                  <span className="text-md font-semibold text-subtitle-color">{t('module', 'Module')}</span>
                  <span className="text-md font-semibold text-subtitle-color">{t('access', 'Access')}</span>
                </div>

                <div className="divide-y divide-input-border-color max-h-60 overflow-y-auto no-scrollbar bg-bg-card">
                  {groupedPermissions.length > 0 ? (
                    groupedPermissions.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:grid sm:grid-cols-2 p-4 sm:p-3 sm:px-4 gap-3 sm:gap-0 sm:items-center">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-xs font-semibold text-subtitle-color sm:hidden">{t('module', 'Module')}</span>
                          <span className="text-md font-bold text-title">{item.module}</span>
                        </div>
                        <div className="flex flex-col sm:block gap-1">
                          <span className="text-xs font-semibold text-subtitle-color sm:hidden">{t('access', 'Access')}</span>
                          <div>
                            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-md inline-block whitespace-normal break-words text-left">
                              {item.access}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-subtitle-color italic">{t('no_permissions')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-subtitle-color">
            {t('failed_to_load_details')}
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 p-padding! rounded-lg border-none bg-primary hover:bg-primary/90 text-white text-md font-bold transition-all shadow-sm w-full h-11"
          >
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
