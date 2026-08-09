'use client'

import { PageHeader } from '@/components/reusable/PageHeader'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useGetBlogsQuery } from '@/redux/api/blogApi'
import { useGetFaqsQuery } from '@/redux/api/faqApi'
import { useGetLandingPageQuery, useUpdateLandingPageMutation } from '@/redux/api/landingPageApi'
import { useGetActivePlansQuery } from '@/redux/api/planApi'
import { useGetActiveTestimonialsQuery } from '@/redux/api/testimonialApi'
import { Form, Formik } from 'formik'
import { BookOpen, DollarSign, Footprints, GitCompare, HelpCircle, Layers, Layout, MessageSquare, Phone, Rocket, Save, Wand2 } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AutomateSectionForm } from './sections/AutomateSectionForm'
import { BlogSectionForm } from './sections/BlogSectionForm'
import { ComparisonSectionForm } from './sections/ComparisonSectionForm'
import { ContactSectionForm } from './sections/ContactSectionForm'
import { FaqSectionForm } from './sections/FaqSectionForm'
import { FooterSectionForm } from './sections/FooterSectionForm'
import { HeroSectionForm } from './sections/HeroSectionForm'
import { HowItWorksSectionForm } from './sections/HowItWorksSectionForm'
import { PricingSectionForm } from './sections/PricingSectionForm'
import { PrimaryFeaturesSectionForm } from './sections/PrimaryFeaturesSectionForm'
import { TestimonialsSectionForm } from './sections/TestimonialsSectionForm'
import { AddonsSectionForm } from './sections/AddonsSectionForm'
import { HumanTransferSectionForm } from './sections/HumanTransferSectionForm'
import { PlusSquare, UserCheck } from 'lucide-react'

export default function LandingPageSetup() {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()

  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)
  const [activeTab, setActiveTab] = useState('hero')

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

  // Queries
  const { data: lpData, isLoading: isLpLoading } = useGetLandingPageQuery(undefined)
  const { data: plansData, isLoading: isPlansLoading } = useGetActivePlansQuery(undefined)
  const { data: blogsData, isLoading: isBlogsLoading } = useGetBlogsQuery({ limit: 100 })
  const { data: testimonialsData, isLoading: isTestimonialsLoading } = useGetActiveTestimonialsQuery(undefined)
  const { data: faqsData, isLoading: isFaqsLoading } = useGetFaqsQuery({ limit: 100 })

  const [updateLandingPage, { isLoading: isUpdating }] = useUpdateLandingPageMutation()

  const isLoading = isLpLoading || isPlansLoading || isBlogsLoading || isTestimonialsLoading || isFaqsLoading

  // Map option arrays for selects
  const planOptions = useMemo(() => {
    if (!plansData?.data) return []
    return plansData.data.map((p: any) => ({ label: p.name, value: p.id }))
  }, [plansData])

  const blogOptions = useMemo(() => {
    if (!blogsData?.blogs) return []
    return blogsData.blogs.map((b: any) => ({ label: b.title, value: b.id || b._id }))
  }, [blogsData])

  const testimonialOptions = useMemo(() => {
    if (!testimonialsData?.testimonials) return []
    return testimonialsData.testimonials.map((t: any) => ({
      label: `${t.user_name} (${t.user_post})`,
      value: t.id || t._id || ''
    })).filter((o: any) => o.value)
  }, [testimonialsData])

  const faqOptions = useMemo(() => {
    if (!faqsData?.faqs) return []
    return faqsData.faqs.map((f: any) => ({ label: f.title, value: f.id || f._id }))
  }, [faqsData])

  const sections = [
    { id: 'hero', title: t('Hero Section'), desc: t("main_landing_header"), icon: Rocket },
    { id: 'comparison', title: t('Comparison'), desc: t("ai_vs_traditional"), icon: GitCompare },
    { id: 'how_it_works', title: t('How It Works'), desc: t("steps_overview"), icon: Footprints },
    { id: 'primary_features', title: t('Primary Features'), desc: t("key_capabilities"), icon: Layers },
    { id: 'automate', title: t('Automate'), desc: t("marquee_cards"), icon: Wand2 },
    { id: 'addons', title: t('Addons'), desc: t("additional_tools"), icon: PlusSquare },
    { id: 'human_transfer', title: t('Human Transfer'), desc: t("handoff_settings"), icon: UserCheck },
    { id: 'pricing', title: t('Pricing & Plans'), desc: t("choose_active_plans"), icon: DollarSign },
    { id: 'blog', title: t('Blog Settings'), desc: t("insights_and_articles"), icon: BookOpen },
    { id: 'testimonials', title: t('Customer Stories'), desc: t("user_feedback"), icon: MessageSquare },
    { id: 'faq', title: t('FAQ Settings'), desc: t("common_q_a"), icon: HelpCircle },
    { id: 'contact', title: t('Contact Info'), desc: t("get_in_touch_details"), icon: Phone },
    { id: 'footer', title: t('Footer Section'), desc: t("social_links_legal"), icon: Layout },
  ]

  const initialValues = {
    hero: {
      badge: '',
      heading: '',
      subheading: '',
      cta_primary_text: '',
      cta_secondary_text: '',
      image: '',
    },
    primary_features: {
      badge: '',
      title: '',
      subtitle: '',
      left_card: {
        title: '',
        description: '',
        image: '',
      },
      cards: [] as { key: string; title: string; description: string; image: string }[]
    },
    comparison: {
      heading: '',
      features: [] as string[],
      traditional: [] as string[],
      aiAgents: [] as string[]
    },
    how_it_works: {
      heading: '',
      subtitle: '',
      steps: [] as { number: number; title: string; description: string; icon: string; color: string; borderColor: string; glowColor: string }[]
    },
    automate: {
      heading: '',
      cards: [] as { title: string; description: string; icon: string; color: string; borderColor: string; glowColor: string }[]
    },
    addons: {
      badge: '',
      title: '',
      subtitle: '',
      cards: [] as { title: string; description: string; image: string; badges: string }[]
    },
    human_transfer: {
      badge: '',
      title: '',
      subtitle: '',
      description: '',
      image: '',
      bottom_features: [] as { title: string; description: string }[]
    },
    pricing: {
      badge: '',
      title: '',
      description: '',
      plan_ids: [] as string[]
    },
    blog: {
      badge: '',
      title: '',
      description: '',
      blog_ids: [] as string[]
    },
    testimonials: {
      section_badge: '',
      section_heading: '',
      section_subheading: '',
      testimonial_ids: [] as string[]
    },
    faq: {
      section_badge: '',
      section_heading: '',
      section_subheading: '',
      faq_ids: [] as string[]
    },
    contact: {
      section_badge: '',
      heading: '',
      subheading: '',
      email: '',
      phone: '',
      address: '',
      live_chat_label: ''
    },
    footer: {
      tagline: '',
      copyright: '',
      address: '',
      phone: '',
      email: '',
      social_links: [] as { name: string; href: string; icon: string }[]
    }
  }

  const mapId = (x: any) => {
    if (!x) return ''
    if (typeof x === 'string') return x
    return x._id || x.id || ''
  }

  const currentValues = useMemo(() => {
    const lp = lpData?.landing_page || {}

    return {
      hero: {
        badge: lp.hero?.badge || '',
        heading: lp.hero?.heading || '',
        subheading: lp.hero?.subheading || '',
        cta_primary_text: lp.hero?.cta_primary_text || '',
        cta_secondary_text: lp.hero?.cta_secondary_text || '',
        image: lp.hero?.image || '',
      },
      primary_features: {
        badge: lp.primary_features?.badge || '',
        title: lp.primary_features?.title || '',
        subtitle: lp.primary_features?.subtitle || '',
        left_card: {
          title: lp.primary_features?.left_card?.title || '',
          description: lp.primary_features?.left_card?.description || '',
          image: lp.primary_features?.left_card?.image || '',
        },
        cards: (lp.primary_features?.cards || []).map((c: any) => ({
          key: c.key || '',
          title: c.title || '',
          description: c.description || '',
          image: c.image || ''
        }))
      },
      comparison: {
        heading: lp.comparison?.heading || '',
        robotImage: lp.comparison?.robotImage || '',
        features: lp.comparison?.features || [],
        traditional: lp.comparison?.traditional || [],
        aiAgents: lp.comparison?.aiAgents || []
      },
      how_it_works: {
        heading: lp.how_it_works?.heading || '',
        subtitle: lp.how_it_works?.subtitle || '',
        steps: lp.how_it_works?.steps || []
      },
      automate: {
        heading: lp.automate?.heading || '',
        cards: lp.automate?.cards || []
      },
      addons: {
        badge: lp.addons?.badge || '',
        title: lp.addons?.title || '',
        subtitle: lp.addons?.subtitle || '',
        cards: (lp.addons?.cards || []).map((c: any) => ({
          title: c.title || '',
          description: c.description || '',
          image: c.image || '',
          badges: Array.isArray(c.badges) ? c.badges.join(', ') : ''
        }))
      },
      human_transfer: {
        badge: lp.human_transfer?.badge || '',
        title: lp.human_transfer?.title || '',
        subtitle: lp.human_transfer?.subtitle || '',
        description: lp.human_transfer?.description || '',
        image: lp.human_transfer?.image || '',
        bottom_features: lp.human_transfer?.bottom_features || []
      },
      pricing: {
        badge: lp.pricing?.badge || '',
        title: lp.pricing?.title || '',
        description: lp.pricing?.description || '',
        plan_ids: (lp.pricing?.plan_ids || []).map(mapId)
      },
      blog: {
        badge: lp.blog?.badge || '',
        title: lp.blog?.title || '',
        description: lp.blog?.description || '',
        blog_ids: (lp.blog?.blog_ids || []).map(mapId)
      },
      testimonials: {
        section_badge: lp.testimonials?.section_badge || '',
        section_heading: lp.testimonials?.section_heading || '',
        section_subheading: lp.testimonials?.section_subheading || '',
        testimonial_ids: (lp.testimonials?.testimonial_ids || []).map(mapId)
      },
      faq: {
        section_badge: lp.faq?.section_badge || '',
        section_heading: lp.faq?.section_heading || '',
        section_subheading: lp.faq?.section_subheading || '',
        faq_ids: (lp.faq?.faq_ids || []).map(mapId)
      },
      contact: {
        section_badge: lp.contact?.section_badge || '',
        heading: lp.contact?.heading || '',
        subheading: lp.contact?.subheading || '',
        email: lp.contact?.email || '',
        phone: lp.contact?.phone || '',
        address: lp.contact?.address || '',
        live_chat_label: lp.contact?.live_chat_label || ''
      },
      footer: {
        tagline: lp.footer?.tagline || '',
        copyright: lp.footer?.copyright || '',
        address: lp.footer?.address || '',
        phone: lp.footer?.phone || '',
        email: lp.footer?.email || '',
        social_links: lp.footer?.social_links || []
      }
    }
  }, [lpData])

  const onSubmit = async (values: typeof initialValues) => {
    try {
      await updateLandingPage(values).unwrap()
      toast.success(t("landing_page_updated_successfully"))
    } catch (err: any) {
      toast.error(err?.data?.message || t('Failed to update landing page settings'))
    }
  }

  if (isLoading) {
    return <Spinner className="h-auto py-20" size="md" />
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Formik
        initialValues={currentValues}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ dirty, values }) => (
          <Form className="space-y-8">
            {/* Header */}
            <PageHeader
              title={t('landing_page')}
              showBackButton={false}
              onBack={() => router.back()}
              endContent={
                canUpdate ? (
                  <Button
                    type="submit"
                    disabled={isUpdating || !dirty}
                    className="h-10 sm:h-12 p-padding! rounded-radius font-bold text-sm bg-primary text-white shadow hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('Saving')}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {t("save_changes")}
                      </>
                    )}
                  </Button>
                ) : null
              }
            />

            <div className="flex flex-col lg:flex-row gap-8 items-start relative">

              {/* Left Side Section Tabs */}
              <div className="w-full lg:w-70 space-y-2 static lg:sticky lg:top-4 shrink-0 z-10">
                <Card className="bg-bg-card border border-input-border-color rounded-modal-radius overflow-hidden">
                  <div
                    ref={scrollContainerRef}
                    className="p-2 flex flex-row lg:flex-col gap-2 overflow-x-auto table-custom-scrollbar scroll-smooth"
                  >
                    {sections.map((section: any) => {
                      const Icon = section.icon
                      const isActive = activeTab === section.id
                      return (
                        <Button
                          key={section.id}
                          data-tab-id={section.id}
                          type="button"
                          onClick={() => setActiveTab(section.id)}
                          className={cn(
                            "w-[240px] lg:w-full shrink-0 lg:shrink lg:min-w-0 flex items-center gap-3 lg:gap-4 p-3 lg:p-3.5 rounded-radius h-16 text-left justify-start transition-all duration-300 group cursor-pointer",
                            isActive
                              ? "bg-primary text-white"
                              : "hover:bg-primary/10 bg-unset dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-radius transition-all duration-300 shrink-0",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 group-hover:text-primary group-hover:bg-primary/10"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 text-left rtl:text-right">
                            <p className={cn("text-base font-bold tracking-tight", isActive ? "text-white" : "text-title group-hover:text-primary dark:text-white")}>
                              {section.title}
                            </p>
                            <p className={cn("text-sm truncate", isActive ? "text-white/80" : "text-subtitle-color")}>
                              {section.desc}
                            </p>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </Card>
              </div>

              {/* Right Side Tab Form Content */}
              <div className="flex-1 w-full min-w-0 space-y-4">
                <Card className="bg-bg-card border border-input-border-color rounded-modal-radius">

                  {activeTab === 'hero' && <HeroSectionForm t={t} />}
                  {activeTab === 'comparison' && <ComparisonSectionForm t={t} values={values} />}
                  {activeTab === 'how_it_works' && <HowItWorksSectionForm t={t} values={values} />}
                  {activeTab === 'primary_features' && <PrimaryFeaturesSectionForm t={t} values={values} />}
                  {activeTab === 'automate' && <AutomateSectionForm t={t} values={values} />}
                  {activeTab === 'addons' && <AddonsSectionForm t={t} values={values} />}
                  {activeTab === 'human_transfer' && <HumanTransferSectionForm t={t} values={values} />}
                  {activeTab === 'pricing' && <PricingSectionForm t={t} planOptions={planOptions} />}
                  {activeTab === 'blog' && <BlogSectionForm t={t} blogOptions={blogOptions} />}
                  {activeTab === 'testimonials' && <TestimonialsSectionForm t={t} testimonialOptions={testimonialOptions} />}
                  {activeTab === 'faq' && <FaqSectionForm t={t} faqOptions={faqOptions} />}
                  {activeTab === 'contact' && <ContactSectionForm t={t} />}
                  {activeTab === 'footer' && <FooterSectionForm t={t} values={values} />}
                </Card>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
