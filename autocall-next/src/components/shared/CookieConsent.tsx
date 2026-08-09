'use client';

import { useSaveCookieConsentMutation } from '@/redux/api/cookieConsentApi';
import { RootState } from '@/redux/store';
import { CookiePreferences } from '@/types/layout';
import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { Settings, ShieldAlert } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { CookiePreferencesModal } from './CookiePreferencesModal';

export const CookieConsent = () => {
  const { t } = useTranslation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [saveCookieConsent] = useSaveCookieConsentMutation();
  const [showConsent, setShowConsent] = useState(false);
  const [showManageSettings, setShowManageSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    call_history: true,
    ai_personalization: false,
    analytics: false,
  });

  const handleConsent = useCallback(async (type: 'accept' | 'decline' | 'preferences', finalPreferences?: CookiePreferences) => {
    let prefToSave = finalPreferences;

    if (type === 'accept') {
      prefToSave = { essential: true, call_history: true, ai_personalization: true, analytics: true };
    } else if (type === 'decline') {
      prefToSave = { essential: true, call_history: true, ai_personalization: false, analytics: false };
    }

    Cookies.set('cookie_consent', type, { expires: 365 });
    if (prefToSave) {
      Cookies.set('cookie_preferences', JSON.stringify(prefToSave), { expires: 365 });
    }

    setShowConsent(false);
    setShowManageSettings(false);

    try {
      const consentId = Cookies.get('consent_id') || Math.random().toString(36).substring(2, 15);
      Cookies.set('consent_id', consentId, { expires: 365 });

      await saveCookieConsent({
        consent_id: consentId,
        consent_type: type,
        preferences: prefToSave,
      }).unwrap();
    } catch (error) {
      console.error('Failed to save cookie consent to backend:', error);
    }
  }, [saveCookieConsent]);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      if (isAuthenticated) {
        const timer = setTimeout(() => {
          handleConsent('accept');
        }, 0);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setShowConsent(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => {
        setShowConsent(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, handleConsent]);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'essential' || key === 'call_history') return; 
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <AnimatePresence>
        {showConsent && !showManageSettings && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-3 sm:bottom-4 left-3 sm:left-4 z-50 w-[calc(100%-1.5rem)] sm:w-[500px] lg:w-[540px] xl:w-[600px] p-4 bg-white dark:bg-bg-card rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3.5">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-base leading-tight pt-0.5">
                      {t('cookie_privacy_autocall')}
                    </h3>
                    <Button 
                      onClick={() => setShowManageSettings(true)}
                      className="shrink-0 p-1.5! -mr-1.5 -mt-1  text-gray-400 hover:text-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-gray-200 rounded-full transition-colors focus:outline-none h-auto"
                      title={t('manage_preferences')}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-[12px] leading-relaxed pr-1">
                    {t('cookie_privacy_desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2.5 w-full">
                <Button
                  variant="outline"
                  onClick={() => handleConsent('decline')}
                  className="p-padding! text-xs font-medium h-10 bg-primary/10 hover:bg-primary hover:text-white text-primary border-none" 
                >
                  {t('reject')}
                </Button>
                <Button
                  onClick={() => handleConsent('accept')}
                  className="p-padding! bg-primary text-xs font-semibold shadow-sm shadow-primary/20 text-white h-10"
                >
                  {t('accept_all')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <CookiePreferencesModal
          open={showManageSettings}
          onOpenChange={setShowManageSettings}
          preferences={preferences}
          onToggle={handleToggle}
          onSave={(prefs) => handleConsent('preferences', prefs)}
          onCancel={() => setShowManageSettings(false)}
        />
      </AnimatePresence>
    </>
  );
};
