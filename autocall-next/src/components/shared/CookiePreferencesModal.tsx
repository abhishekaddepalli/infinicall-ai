import { CookiePreferencesModalProps } from '@/types/layout';
import { Check, Info, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';

export const CookiePreferencesModal = ({
  open,
  onOpenChange,
  preferences,
  onToggle,
  onSave,
  onCancel
}: CookiePreferencesModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! p-0 gap-0! max-h-[90vh]  overflow-auto flex flex-col no-scrollbar border-none">
        <div className="sm:px-6 px-4 py-5 border-b border-input-border-color flex items-center gap-3 bg-bg-card">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Settings2 className="w-5 h-5" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white m-0">
            {t('cookie_privacy_preferences')}
          </DialogTitle>
        </div>

        <div className="sm:p-6 p-4 overflow-y-auto no-scrollbar flex-1 space-y-5">
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-md text-primary leading-relaxed">
              {t('cookie_functional_desc')}
            </p>
          </div>

          <div className="space-y-4">
            {/* Essential Cookies */}
            <div className="flex items-start justify-between gap-4 sm:gap-6 sm:p-5 p-4 rounded-lg border border-input-border-color bg-subcard">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="text-base font-semibold text-title">{t('strictly_necessary_data')}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-bg-card text-title text-[10px] font-bold tracking-wide uppercase shrink-0">{t('required')}</span>
                </div>
                <p className="text-md text-subtitle-color leading-relaxed">
                  {t('strictly_necessary_desc')}
                </p>
              </div>
              <div className="shrink-0 mt-0.5">
                <Switch checked={true} disabled={true} />
              </div>
            </div>

            {/* Call History Cookies */}
            <div className="flex items-start justify-between gap-4 sm:gap-6 sm:p-5 p-4 rounded-lg border border-input-border-color bg-subcard">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="text-base font-semibold text-title">{t('call_sms_history')}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-bg-card text-title text-[10px] font-bold tracking-wide uppercase shrink-0">{t('required')}</span>
                </div>
                <p className="text-md text-subtitle-color leading-relaxed">
                  {t('call_sms_history_desc')}
                </p>
              </div>
              <div className="shrink-0 mt-0.5">
                <Switch checked={true} disabled={true} />
              </div>
            </div>

            {/* AI Personalization Cookies */}
            <div
              className="flex items-start justify-between gap-4 sm:gap-6 sm:p-5 p-4 rounded-lg border border-input-border-color bg-subcard transition-colors group cursor-pointer"
              onClick={() => onToggle('ai_personalization')}
            >
              <div className="flex-1">
                <h4 className="text-base font-semibold text-title transition-colors mb-1">{t('ai_personalization')}</h4>
                <p className="text-md text-subtitle-color leading-relaxed">
                  {t('ai_personalization_desc')}
                </p>
              </div>
              <div onClick={(e) => e.stopPropagation()} className="shrink-0 mt-0.5">
                <Switch
                  checked={preferences.ai_personalization}
                  onCheckedChange={() => onToggle('ai_personalization')}
                />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div
              className="flex items-start justify-between gap-4 sm:gap-6 sm:p-5 p-4 rounded-lg border border-input-border-color bg-subcard transition-colors group cursor-pointer"
              onClick={() => onToggle('analytics')}
            >
              <div className="flex-1">
                <h4 className="text-base font-semibold text-title transition-colors mb-1">{t('usage_analytics')}</h4>
                <p className="text-md text-subtitle-color leading-relaxed">
                  {t('usage_analytics_desc')}
                </p>
              </div>
              <div onClick={(e) => e.stopPropagation()} className="shrink-0 mt-0.5">
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={() => onToggle('analytics')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sm:px-6 px-4 py-5 bg-bg-card border-t border-input-border-color flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mt-auto">
          <span className="text-md font-medium text-subtitle-color flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-primary" />
            {t('preferences_saved_securely')}
          </span>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 sm:flex-none bg-subcard text-subtitle-color border border-input-border-color p-padding!"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={() => onSave(preferences)}
              className="flex-1 bg-primary! text-white p-padding! sm:flex-none text-white"
            >
              {t('save_my_preferences')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
