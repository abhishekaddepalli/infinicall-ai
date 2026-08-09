'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scrollArea'
import { Switch } from '@/components/ui/switch'
import { cn, getImageUrl } from '@/lib/utils'
import { FormValues, LanguageFormProps } from '@/types/language'
import { ErrorMessage, Form, Formik } from 'formik'
import { ArrowLeft, Check, CheckCircle2, ChevronLeft, Globe, Image as ImageIcon, Info, LayoutGrid, Monitor, Plus, Search, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { TranslationDropzone } from './TranslationDropzone'

const languageOptions = [
  { name: 'English', locale: 'en' },
  { name: 'French', locale: 'fr' },
  { name: 'Spanish', locale: 'es' },
  { name: 'German', locale: 'de' },
  { name: 'Arabic', locale: 'ar' },
  { name: 'Portuguese', locale: 'pt' },
  { name: 'Chinese', locale: 'zh' },
  { name: 'Japanese', locale: 'ja' },
  { name: 'Russian', locale: 'ru' },
  { name: 'Hindi', locale: 'hi' },
  { name: 'Bengali', locale: 'bn' },
  { name: 'Urdu', locale: 'ur' },
  { name: 'Indonesian', locale: 'id' },
  { name: 'Turkish', locale: 'tr' },
  { name: 'Italian', locale: 'it' },
  { name: 'Vietnamese', locale: 'vi' },
  { name: 'Korean', locale: 'ko' },
  { name: 'Thai', locale: 'th' },
  { name: 'Dutch', locale: 'nl' },
  { name: 'Custom', locale: 'custom' },
]

export const LanguageForm = ({ initialValues, onSubmit, isLoading, isEdit }: LanguageFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [flagPreview, setFlagPreview] = useState<string | null>(() => {
    if (typeof initialValues?.flag === 'string' && initialValues.flag) {
      if (initialValues.flag.startsWith('http') || initialValues.flag.startsWith('data:')) {
        return initialValues.flag
      }
      return getImageUrl(initialValues.flag)
    }
    return null
  })

  const [langSearch, setLangSearch] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isCustomLocale, setIsCustomLocale] = useState(false)

  const flagInputRef = useRef<HTMLInputElement>(null)

  const formikInitialValues: FormValues = {
    name: initialValues?.name || '',
    locale: initialValues?.locale || '',
    is_rtl: initialValues?.is_rtl || false,
    is_active: initialValues?.is_active ?? true,
    is_default: initialValues?.is_default || false,
    flag: initialValues?.flag || null,
    front_translation_file: initialValues?.front_translation_file || null,
  }

  const validationSchema = Yup.object({
    name: Yup.string().required(t('language_name_required') || t('language_name_is_required')),
    locale: Yup.string().required(t('locale_required') || t('locale_is_required')),
  })

  const handleFormSubmit = async (values: FormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })
    await onSubmit(formData)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormValues, setFieldValue: (field: string, value: any) => void) => {
    const file = e.target.files?.[0]
    if (file) {
      setFieldValue(field, file)
      if (field === 'flag') {
        const reader = new FileReader()
        reader.onloadend = () => setFlagPreview(reader.result as string)
        reader.readAsDataURL(file)
      }
    }
  }

  return (
    <Formik initialValues={formikInitialValues} validationSchema={validationSchema} onSubmit={handleFormSubmit} enableReinitialize>
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isValid }) => (
        <Form className="space-y-4 animate-in fade-in duration-300">
          {/* Sleek Toolbar Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.back()} type="button" className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="space-y-0.5">
                <h1 className="sm:text-3xl text-2xl font-bold text-title">{isEdit ? t("edit_language") : t("create_language")}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.back()} type="button" className=" p-padding! rounded-radius font-medium text-md text-subtitle-color bg-subcard border border-input-border-color dark:hover:bg-white/5">
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading} className="p-padding! rounded-radius font-medium text-md bg-primary text-white transition-all gap-2">
                {isEdit ? t("save_changes") : t("create")}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left: Configuration Sections */}
            <div className="xl:col-span-8 space-y-6">
              {/* Identity Section */}
              <div className="bg-bg-card border border-input-border-color rounded-lg overflow-hidden">
                <div className="sm:px-6 px-4 py-4 border-b border-input-border-color flex items-center justify-between bg-bg-card">
                  <h2 className="text-lg font-bold text-title">{t("identity_locale", "Identity Locale")}</h2>
                  <Badge className="rounded-full px-3 py-0.5 font-bold text-[10px] text-subtitle-color bg-subcard border-none uppercase shadow-none tracking-wider">
                    {t('custom', 'CUSTOM')}
                  </Badge>
                </div>

                <div className="sm:p-6 p-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {/* Select Language */}
                    <div className="space-y-2 flex flex-col">
                      <Label className="text-sm font-semibold text-subtitle-color">{t("choose_language", "Choose Language")}</Label>
                      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between rounded-lg h-10 border-input-border-color border px-3 font-normal transition-all text-sm bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-title">
                            <div className="flex items-center gap-2">
                              {values.locale === "custom" || (values.locale && !languageOptions.find((l) => l.locale === values.locale)) ? <Plus className="h-4 w-4 text-subtitle-color" /> : <Globe className="h-4 w-4 text-subtitle-color" />}
                              {values.locale === "custom" || (values.locale && !languageOptions.find((l) => l.locale === values.locale)) ? t("custom_language", "Custom Language") : languageOptions.find((l) => l.locale === values.locale)?.name || t("select_language")}
                            </div>
                            <ChevronLeft className="h-4 w-4 opacity-50 rotate-[-90deg]" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0 border-zinc-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden bg-bg-card z-[100] flex flex-col"
                          align="start"
                          sideOffset={4}
                          style={{ maxHeight: 'var(--radix-popover-content-available-height)' }}
                        >
                          <div className="relative w-full p-2 border-b border-input-border-color shrink-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input placeholder={t("search_languages")} value={langSearch} onChange={(e) => setLangSearch(e.target.value)} className="pl-9 h-10 text-sm rounded-radius border-input-border-color dark:border-white/5 bg-input-color dark:bg-white/5 focus-visible:ring-1 text-title focus-visible:ring-primary/20" />
                          </div>
                          <div className="flex-1 overflow-y-auto no-scrollbar max-h-60 p-1">
                            {(() => {
                              const filteredOptions = languageOptions.filter((l) => l.name.toLowerCase().includes(langSearch.toLowerCase()) || l.locale.toLowerCase().includes(langSearch.toLowerCase()));
                              if (filteredOptions.length === 0) {
                                return (
                                  <div className="flex flex-col items-center justify-center p-3 gap-2 text-center">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-1">
                                      <Globe className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                      <h3 className="text-base font-bold text-title">
                                        {t('no_result_found') || 'No Result Found'}
                                      </h3>
                                      <p className="text-md font-medium text-subtitle-color mx-auto leading-relaxed">
                                        {t('no_language_found_add_custom') || "We couldn't find any language matching your search. You can add a custom language instead."}
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setIsCustomLocale(true);
                                        setFieldValue("locale", "custom");
                                        setIsPopoverOpen(false);
                                        setLangSearch("");
                                      }}
                                      className="h-10 p-padding! rounded-lg gap-2 mt-2 bg-primary text-white transition-all"
                                    >
                                      <Plus className="w-3.5 h-3.5 text-white" />
                                      {t('custom_language') || 'Custom Language'}
                                    </Button>
                                  </div>
                                );
                              }
                              return filteredOptions.map((lang) => (
                                <div
                                  key={lang.locale}
                                  onClick={() => {
                                    if (lang.locale === "custom") {
                                      setIsCustomLocale(true);
                                      setFieldValue("locale", "custom");
                                    } else {
                                      setIsCustomLocale(false);
                                      setFieldValue("locale", lang.locale);
                                      setFieldValue("name", lang.name);
                                    }
                                    setIsPopoverOpen(false);
                                    setLangSearch("");
                                  }}
                                  className={cn("flex items-center px-3 py-2 rounded-radius text-md font-medium cursor-pointer transition-all mb-0.5", values.locale === lang.locale ? "bg-primary text-white shadow-sm" : "hover:bg-primary/10 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400")}
                                >
                                  <div className="flex-1 flex items-center gap-2.5">
                                    {lang.locale === "custom" ? <Plus className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                                    <span>{lang.name}</span>
                                    {lang.locale !== "custom" && <span className={cn("text-sm", values.locale === lang.locale ? "text-white" : "text-zinc-500")}>{lang.locale}</span>}
                                  </div>
                                  {values.locale === lang.locale && <Check className="h-3.5 w-3.5" />}
                                </div>
                              ));
                            })()}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2 flex flex-col">
                      <Label className="text-sm font-semibold text-subtitle-color">{t("display_name", "Display Name")}</Label>
                      <Input name="name" placeholder={t("eg_custom_lang_name", "e.g. Custom Language Name")} value={values.name} onChange={handleChange} onBlur={handleBlur} className={cn("rounded-lg h-10 border-input-border-color px-4 text-sm bg-slate-50 dark:bg-white/5 focus:ring-1 focus:ring-primary/20 transition-all shadow-none", touched.name && errors.name && "border-destructive")} />
                      <ErrorMessage name="name" component="div" className="text-[10px] text-destructive font-medium ml-1" />
                    </div>

                    {/* Dedicated Flag Asset */}
                    <div className="space-y-2 flex flex-col">
                      <Label className="text-sm font-semibold text-subtitle-color">{t("flag_icon", "Flag Icon")}</Label>
                      <div onClick={() => flagInputRef.current?.click()} className="h-10 flex items-center justify-between px-3 rounded-lg border border-input-border-color dark:border-white/10 bg-slate-50 dark:bg-white/5 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full flex items-center justify-center overflow-hidden shrink-0 text-subtitle-color">{flagPreview ? <Image src={flagPreview} alt="Flag" className="object-cover h-full w-full" width={100} height={100} unoptimized /> : <Globe className="h-4 w-4 text-subtitle-color" />}</div>
                          <div className="flex-1 text-sm font-medium text-subtitle-color truncate">{flagPreview ? t("change_flag_image", "Change Flag Image") : t("upload_flag_image", "Change Flag Image")}</div>
                        </div>
                        <Upload className="h-4 w-4 text-subtitle-color" />
                        <Input type="file" ref={flagInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "flag", setFieldValue)} />
                      </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                      <Label className="text-sm font-semibold text-subtitle-color">{t("custom_locale_code", "Custom Locale Code")}</Label>
                      <Input name="locale" placeholder={t("eg_pt_br", "e.g. pt-BR")} value={values.locale === "custom" ? "" : values.locale} onChange={(e) => setFieldValue("locale", e.target.value)} onBlur={handleBlur} disabled={!isCustomLocale && values.locale !== "custom"} className={cn("rounded-lg h-10 border-input-border-color px-4 text-sm bg-slate-50 dark:bg-white/5 focus:ring-1 focus:ring-primary/20 transition-all shadow-none", touched.locale && errors.locale && "border-destructive", (!isCustomLocale && values.locale !== "custom") && "opacity-50")} />
                      <ErrorMessage name="locale" component="div" className="text-[10px] text-destructive font-medium ml-1 mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Translation Files Section */}
              <div className="bg-bg-card border border-input-border-color rounded-lg overflow-hidden sm:p-6 p-4 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-title text-base">{t("front_end_json", "Front-end JSON")}</h3>
                    <p className="text-md text-subtitle-color">{t("select_translation_source", "Select Translation Source")}</p>
                  </div>
                </div>

                {/* Dropzone */}
                <TranslationDropzone
                  translationFile={values.front_translation_file instanceof File ? values.front_translation_file : typeof values.front_translation_file === 'string' ? new File([], values.front_translation_file.split("/").pop() || "translation.json", { type: "application/json" }) : null}
                  setTranslationFile={(file) => setFieldValue("front_translation_file", file)}
                />

                {/* Expected format */}
                <div className="bg-subcard rounded-lg p-4 font-mono text-sm text-subtitle-color">
                  <p className="font-bold text-title font-sans text-base mb-2">{t('expected_format', 'Expected format')}</p>
                  <pre>
                    {`{
  "welcome": "welcome",
  "nav.home": "Home"
}`}
                  </pre>
                </div>

                {/* Info row */}
                <div className="border-t border-input-border-color pt-4 flex items-center gap-2 text-xs text-subtitle-color">
                  <Info className="w-4 h-4 shrink-0 text-subtitle-color" />
                  <span className='text-sm font-medium text-subtitle-color'>{t('json_keys_must_be_flat', 'JSON keys must be flat strings. Nested objects are not supported.')}</span>
                </div>
              </div>
            </div>

            {/* Right: Settings & Meta */}
            <div className="xl:col-span-4 space-y-6">
              <div className="bg-bg-card border border-input-border-color rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-input-border-color bg-bg-card">
                  <h2 className="text-md font-bold text-title">{t("visibility_access", "Visibility & Access")}</h2>
                </div>
                <div className="flex flex-col divide-y divide-input-border-color">
                  {[
                    { id: "is_active", label: t("active", "Active"), desc: t("enable_for_users", "Enable For Users"), checked: values.is_active },
                    {
                      id: "is_default",
                      label: t("default", "Default"),
                      desc: t("primary_system_language", "Primary System Language"),
                      checked: values.is_default,
                    },
                    { id: "is_rtl", label: t("rtl", "RTL"), desc: t("right_to_left_layout", "Right to left layout"), checked: values.is_rtl },
                  ].map((opt) => (
                    <div key={opt.id} className="flex items-center justify-between px-5 py-4 bg-bg-card">
                      <div className="space-y-0.5">
                        <Label className="text-sm text-title font-bold cursor-pointer" htmlFor={opt.id}>
                          {opt.label}
                        </Label>
                        <p className="text-xs text-subtitle-color font-medium">{opt.desc}</p>
                      </div>
                      <Switch id={opt.id} checked={opt.checked} onCheckedChange={(val) => setFieldValue(opt.id, val)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-bg-card rounded-lg border border-input-border-color overflow-hidden">
                <div className="px-5 py-4 border-b border-input-border-color flex items-center gap-2 text-title">
                  <Info className="h-4 w-4 text-subtitle-color" />
                  <h3 className="text-md font-bold">{t("configuration_tips", "Configuration Tips")}</h3>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { text: t("ensure_json_keys_match_defaults", "Ensure JSON keys match defaults") },
                    { text: t("use_high_res_flag_svg_best", "Use high res flag SVG for best quality") },
                    { text: t("rtl_automatically_flips_layout", "RTL automatically flips layout direction") },
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[13px] font-medium text-subtitle-color">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {tip.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

