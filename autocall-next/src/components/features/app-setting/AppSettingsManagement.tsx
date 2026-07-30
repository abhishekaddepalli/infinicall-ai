'use client'

import { EmailTemplatesPage } from '@/components/features/email-templates/EmailTemplatesPage'
import { Loader2 } from '@/components/reusable/Loader2'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useAppDirection } from '@/hooks/useAppDirection'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { FileText, HardDrive, Info, Layers, Layout, Mail, MailOpen, ShieldAlert, Sliders, Sparkles, User } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AIConfigSettings from './AIConfigSettings'
import CreditSettings from './CreditSettings'
import GeneralSettings from './GeneralSettings'
import LimitSettings from './LimitSettings'
import LogoSettings from './LogoSettings'
import SignupCustomizationSettings from './SignupCustomizationSettings'
import StorageSettings from './StorageSettings'

export default function AppSettingsManagement() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(
    tab === 'ai_config' ? 'ai_config' : tab === 'logos' ? 'logos' : tab === 'limits' ? 'limits' : tab === 'storage' ? 'storage' : tab === 'credit_manage' ? 'credit_manage' : tab === 'signup_customization' ? 'signup_customization' : tab === 'reusable_email' ? 'reusable_email' : 'app_info'
  )
  const direction = useAppDirection()
  const { hasPermission, role, isAdmin } = usePermission()

  const [saveState, setSaveState] = useState({
    isUpdating: false,
    canSave: false,
    formId: '',
  })

  useEffect(() => {
    const defaultFormId = activeTab === 'logos'
      ? 'logo-settings-form'
      : activeTab === 'limits'
        ? 'limit-settings-form'
        : activeTab === 'storage'
          ? 'storage-settings-form'
          : activeTab === 'credit_manage'
            ? 'credit-settings-form'
              : activeTab === 'signup_customization'
                ? 'signup-customization-settings-form'
                : activeTab === 'reusable_email' || activeTab === 'ai_config'
                  ? ''
                  : 'general-settings-form'

    setSaveState({
      isUpdating: false,
      canSave: false,
      formId: defaultFormId,
    })
  }, [activeTab])

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeElement = container.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (activeElement) {
      if (window.innerWidth < 1024) {
        const containerWidth = container.offsetWidth;
        const elementOffset = activeElement.offsetLeft;
        const elementWidth = activeElement.offsetWidth;

        container.scrollTo({
          left: elementOffset - (containerWidth / 2) + (elementWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab]);

  const canViewSettings = hasPermission(PERMISSIONS.VIEW_SETTINGS) && role !== 'user'
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS) && role !== 'user'

  if (!canViewSettings) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">{t('access_denied')}</h2>
        <p className="text-zinc-500">{t('no_permission_settings')}</p>
        <Button onClick={() => router.push(ROUTES.DASHBOARD)}>{t('back_to_dashboard')}</Button>
      </div>
    )
  }

  const sections = [
    { id: 'app_info', title: t('app_information'), desc: t('app_info_desc'), icon: Info },
    { id: 'system_pages', title: t('system_pages'), desc: t('system_pages_desc'), icon: FileText },
    { id: 'maintenance', title: t('maintenance_mode'), desc: t('maintenance_desc'), icon: ShieldAlert },
    { id: 'general_resource', title: t('resource_limits'), desc: t('resource_limits_desc'), icon: Layers },
    { id: 'demo_user', title: t('demo_user'), desc: t('demo_user_desc'), icon: User },
    { id: 'system_email', title: t('system_email'), desc: t('system_email_desc'), icon: Mail },
    { id: 'logos', title: t('branding_logos'), desc: t('branding_logos_desc'), icon: Layout },
    { id: 'limits', title: t('system_limits'), desc: t('system_limits_desc'), icon: Sliders },
    { id: 'storage', title: t('storage_tab_title'), desc: t('storage_tab_desc'), icon: HardDrive },
    ...(isAdmin()
      ? [
      {
        id: 'credit_manage',
        title: t('credit_manage'),
        desc: t('credit_manage_desc'),
        icon: FileText,
      },
      {
        id: 'signup_customization',
        title: 'Signup Customization',
        desc: 'Signup agree line customization',
        icon: FileText,
      },
      {
        id: 'reusable_email',
        title: t('reusable_email', 'Reusable Email'),
        desc: t('manage_reusable_emails', 'Manage reusable email templates'),
        icon: MailOpen,
      }]
      : [])
  ]

  const isGeneralSetting = ['app_info', 'system_pages', 'maintenance', 'general_resource', 'demo_user', 'system_email'].includes(activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        title={t('settings_title')}
        showBackButton={false}
        onBack={() => router.back()}
        endContent={
          canUpdate && saveState.formId && (
            <Button
              type="submit"
              form={saveState.formId}
              disabled={saveState.isUpdating || !saveState.canSave}
              className="p-padding! rounded-radius font-medium text-md bg-primary text-white"
            >
              {saveState.isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4" />
                  {t('updating')}
                </>
              ) : (
                <>
                  {t('save_settings')}
                </>
              )}
            </Button>
          )
        }
      />

      <div className="flex flex-col min-[1400px]:flex-row gap-6 flex-1 min-w-0" dir={direction}>
        {/* Left Sidebar (Mobile Navigation Header Tabs) */}
        <div className="min-[1400px]:hidden mb-2 bg-bg-card rounded-lg border border-input-border-color shadow-xs">
          <div className="overflow-x-auto table-custom-scrollbar" ref={scrollContainerRef}>
            <div className="flex gap-1.5 p-2 min-w-max">
              {sections.map((section: any) => {
                const Icon = section.icon
                const isActive = activeTab === section.id
                return (
                  <Button
                    key={section.id}
                    data-tab-id={section.id}
                    type="button"
                    onClick={() => setActiveTab(section.id)}
                    className={`flex sm:h-12 h-10 items-center gap-2 p-padding! rounded-radius text-sm font-semibold transition-all duration-150 whitespace-nowrap shadow-none ${isActive ? "bg-primary text-white dark:text-zinc-100" : "text-slate-600 dark:text-zinc-400 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100"}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{section.title}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Left Sidebar (Desktop Navigation Sidebar List) */}
        <aside className="hidden min-[1400px]:block w-64 xl:w-80 shrink-0">
          <div className="sticky top-4 bg-bg-card border border-input-border-color rounded-modal-radius shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-3 py-4 space-y-1.5">
            {sections.map((section: any) => {
              const Icon = section.icon
              const isActive = activeTab === section.id
              return (
                <Button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-3 py-3 px-3 rounded-radius text-left transition-all duration-200 group shadow-none h-auto ${isActive ? "bg-primary text-white dark:text-zinc-50 font-semibold" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/30 hover:text-slate-900 dark:hover:text-zinc-100 font-medium bg-transparent"}`}
                >
                  <div className={`w-8 h-8 rounded-radius flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-white/20 text-white dark:text-zinc-100 " : "bg-subcard text-subtitle-color dark:text-zinc-400 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0  text-left rtl:text-right">
                    <p className="text-md font-bold leading-tight">{section.title}</p>
                    <p className={cn("text-xs lg:text-sm truncate hidden lg:block text-white/80 text-wrap", isActive ? "text-white/80" : "text-subtitle-color")}>
                      {section.desc}
                    </p>
                  </div>
                </Button>
              )
            })}
          </div>
        </aside>

        {/* Right Active Content Panel */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className={!isGeneralSetting ? "hidden" : "block"}>
            <GeneralSettings activeCard={activeTab} setSaveState={setSaveState} />
          </div>
          {activeTab === 'ai_config' && isAdmin() && <AIConfigSettings />}
          {activeTab === 'logos' && <LogoSettings setSaveState={setSaveState} />}
          {activeTab === 'limits' && <LimitSettings setSaveState={setSaveState} />}
          {activeTab === 'storage' && <StorageSettings setSaveState={setSaveState} />}
          {activeTab === 'credit_manage' && isAdmin() && <CreditSettings setSaveState={setSaveState} />}
          {activeTab === 'signup_customization' && isAdmin() && <SignupCustomizationSettings setSaveState={setSaveState} />}
          {activeTab === 'reusable_email' && isAdmin() && <EmailTemplatesPage />}
        </div>
      </div>
    </div>
  )
}
