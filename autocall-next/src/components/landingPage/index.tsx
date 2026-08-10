"use client";

import { useGetLandingPageQuery } from "@/redux/api/landingPageApi";
import {
  defaultAddonsData,
  defaultAutomateData,
  defaultBlogsData,
  defaultBlogSection,
  defaultComparisonData,
  defaultContactData,
  defaultFaqsData,
  defaultFaqSection,
  defaultFooterData,
  defaultHeroData,
  defaultHowItWorksData,
  defaultHumanTransferData,
  defaultPlansData,
  defaultPricingSection,
  defaultPrimaryFeaturesData,
  defaultTestimonialsData,
  defaultTestimonialSection
} from "../../data/landingPage";
import { Addons } from "./sections/Addons";
import { Automate } from "./sections/Automate";
import { Blogs } from "./sections/Blogs";
import { Comparison } from "./sections/Comparison";
import { Contact } from "./sections/Contact";
import { Faqs } from "./sections/Faqs";
import { Features } from "./sections/Features";
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { HumanTransfer } from "./sections/HumanTransfer";
import { Pricing } from "./sections/Pricing";
import { TapTop } from "./sections/TapTop";
import { Testimonials } from "./sections/Testimonials";

export default function LandingPage() {
  const { data: lpData } = useGetLandingPageQuery(undefined);
  const lp = lpData?.landing_page || null;
  const heroData = lp?.hero
    ? {
      badge: lp.hero.badge,
      title: lp.hero.heading,
      subtitle: lp.hero.subheading,
      content: {
        cta_text: lp.hero.cta_primary_text,
        docs_text: lp.hero.cta_secondary_text,
        image: lp.hero.image || defaultHeroData.content.image,
        cta_secondary_link: lp.hero.cta_secondary_link,
      },
    }
    : defaultHeroData;

  const primaryFeaturesData = lp?.primary_features
    ? {
      badge: lp.primary_features.badge,
      title: lp.primary_features.title,
      subtitle: lp.primary_features.subtitle,
      content: {
        left_card: {
          ...lp.primary_features.left_card,
          image: lp.primary_features.left_card?.image || defaultPrimaryFeaturesData.content.left_card.image,
        },
        cards: lp.primary_features.cards.map((card: any, idx: number) => ({
          ...card,
          image: card.image || defaultPrimaryFeaturesData.content.cards[idx]?.image,
        })),
      },
    }
    : defaultPrimaryFeaturesData;


  const contactDetailsData = lp?.contact
    ? {
      badge: lp.contact.section_badge,
      title: lp.contact.heading,
      subtitle: lp.contact.subheading,
      content: {
        email: lp.contact.email,
        location: lp.contact.address || "123 AI Street, Tech City, TC 12345",
      },
    }
    : defaultContactData;

  const getSocialHref = (name: string, fallback: string) => {
    if (!lp?.footer?.social_links) return fallback;
    const link = lp.footer.social_links.find(
      (s: any) => s.name?.toLowerCase() === name.toLowerCase(),
    );
    return link ? link.href : fallback;
  };

  const footerData = lp?.footer
    ? {
      title: "InfiniCall AI",
      subtitle: lp.footer.tagline,
      content: {
        instagram: getSocialHref("instagram", "#"),
        facebook: getSocialHref("facebook", "#"),
        twitter: getSocialHref("twitter", "#"),
        linkedin: getSocialHref("linkedin", "#"),
      },
    }
    : defaultFooterData;

  // Determine if we should use static fallbacks when lp is null or array sections are empty
  const comparisonData = lp?.comparison ? {
    ...lp.comparison,
    robotImage: lp.comparison.robotImage || defaultComparisonData.robotImage
  } : defaultComparisonData;
  const howItWorksData = lp?.how_it_works || defaultHowItWorksData;
  const automateData = lp?.automate || defaultAutomateData;
  const addonsData = lp?.addons ? {
    ...lp.addons,
    cards: lp.addons.cards?.map((card: any, idx: number) => ({
      ...card,
      image: card.image || defaultAddonsData.cards[idx]?.image
    })) || []
  } : defaultAddonsData;
  const humanTransferData = lp?.human_transfer ? {
    ...lp.human_transfer,
    image: lp.human_transfer.image || defaultHumanTransferData.image
  } : defaultHumanTransferData;

  // ── Plans ──
  const plansData: any[] = (!lp?.pricing?.plan_ids || !lp.pricing.plan_ids.length)
    ? defaultPlansData
    : lp.pricing.plan_ids;

  // ── Testimonials ──
  const testimonialsData: any[] = (!lp?.testimonials?.testimonial_ids || !lp.testimonials.testimonial_ids.length)
    ? defaultTestimonialsData
    : lp.testimonials.testimonial_ids;

  // ── FAQs ──
  const faqsData: any[] = (!lp?.faq?.faq_ids || !lp.faq.faq_ids.length)
    ? defaultFaqsData
    : lp.faq.faq_ids;

  // ── Blogs ──
  const blogsData: any[] = (!lp?.blog?.blog_ids || !lp.blog.blog_ids.length)
    ? defaultBlogsData
    : lp.blog.blog_ids;

  // ── Section labels ──
  const pricingSection = lp?.pricing || defaultPricingSection;
  const blogSection = lp?.blog || defaultBlogSection;
  const testimonialSection = lp?.testimonials || defaultTestimonialSection;
  const faqSection = lp?.faq || defaultFaqSection;

  const navigation: Array<{ name: string; href: string }> = [
    { name: "Home", href: "#" },
  ];

  if (useStaticFallbacks || lp?.primary_features) {
    navigation.push({ name: "Features", href: "#features" });
  }


  if (useStaticFallbacks || (lp?.pricing && plansData.length > 0)) {
    navigation.push({ name: "Pricing", href: "#pricing" });
  }

  if (useStaticFallbacks || (lp?.testimonials && testimonialsData.length > 0)) {
    navigation.push({ name: "Testimonials", href: "#testimonials" });
  }

  if (useStaticFallbacks || (lp?.blog && blogsData.length > 0)) {
    navigation.push({ name: "Blog", href: "#blogs" });
  }

  if (useStaticFallbacks || (lp?.faq && faqsData.length > 0)) {
    navigation.push({ name: "FAQ", href: "#faqs" });
  }

  if (useStaticFallbacks || lp?.contact) {
    navigation.push({ name: "Contact", href: "#contact" });
  }

  return (
    <div id="main-scroll-container" className="h-screen overflow-y-auto custom-scrollbar bg-gradient-to-b from-primary/[0.08] via-primary/[0.02] to-primary/[0.06] text-[#020617] font-sans antialiased overflow-x-clip relative selection:bg-primary/10 selection:text-primary">
      <div className="absolute top-[50px] left-[-150px] w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[80px] right-[-150px] w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[500px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/[0.04] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Features Area */}
      <div className="absolute top-[1100px] left-[-100px] w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none z-0" />


      {/* Pricing Area */}
      <div className="absolute top-[2200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/[0.03] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header Component */}
      <Header navigation={navigation} />

      {/* Hero Component */}
      <Hero heroData={heroData} />

      {/* Comparison Component */}
      <Comparison comparisonData={comparisonData} />

      {/* How It Works Component */}
      <HowItWorks howItWorksData={howItWorksData} />

      {/* Features Component */}
      <Features primaryFeaturesData={primaryFeaturesData} />

      {/* Automate Component */}
      <Automate automateData={automateData} />

      {/* Addons Component */}
      <Addons addonsData={addonsData} />

      {/* Human Transfer Component */}
      <HumanTransfer humanTransferData={humanTransferData} />


      {/* Pricing Component */}
      <Pricing pricingSection={pricingSection} plansData={plansData} />

      {/* Testimonials Component */}
      <Testimonials
        testimonialSection={testimonialSection}
        testimonialsData={testimonialsData}
      />

      {/* Blogs Component */}
      <Blogs blogSection={blogSection} blogsData={blogsData} />

      {/* Faqs Component */}
      <Faqs faqSection={faqSection} faqsData={faqsData} />

      {/* Contact Component */}
      <Contact contactDetailsData={contactDetailsData} />

      {/* Footer Component */}
      <Footer footerData={footerData} />

      {/* Tap to Top */}
      <TapTop />
    </div>
  );
}
