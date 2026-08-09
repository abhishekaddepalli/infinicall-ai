export interface BlogSectionFormProps {
  t: any
  blogOptions: Array<{ label: string; value: string }>
}

export interface ContactSectionFormProps {
  t: any
}

export interface FaqSectionFormProps {
  t: any
  faqOptions: Array<{ label: string; value: string }>
}

export interface FooterSectionFormProps {
  t: any
  values: any
}

export interface HeroSectionFormProps {
  t: any
}

export interface IntegrationsSectionFormProps {
  t: any
  values: any
}

export interface PricingSectionFormProps {
  t: any
  planOptions: Array<{ label: string; value: string }>
}

export interface PrimaryFeaturesSectionFormProps {
  t: any
  values: any
}

export interface StatsSectionFormProps {
  t: any
  values: any
}

export interface TestimonialsSectionFormProps {
  t: any
  testimonialOptions: Array<{ label: string; value: string }>
}

export interface ComparisonSectionFormProps {
  t: any
  values: any
}

export interface HowItWorksSectionFormProps {
  t: any
  values: any
}

export interface AutomateSectionFormProps {
  t: any
  values: any
}

export interface BlogsProps {
  blogSection: {
    badge: string;
    title: string;
    description: string;
  };

  blogsData: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    categories: {
      _id: string;
      name: string;
    }[];
    tags: {
      _id: string;
      name?: string;
      title?: string;
    }[];
    created_at: string;
    published_at?: string;
  }[];
}
export interface ContactProps {
  contactDetailsData: {
    badge: string;
    title: string;
    subtitle: string;
    content?: {
      phone?: string;
      email?: string;
      location?: string;
    };
  };
}

export interface FaqsProps {
  faqSection: {
    section_badge: string;
    section_heading: string;
    section_subheading: string;
  };
  faqsData: Array<{
    _id?: string;
    title: string;
    description: string;
  }>;
}

export interface FeaturesProps {
  primaryFeaturesData: {
    badge: string;
    title: string;
    subtitle: string;
    content?: {
      left_card?: {
        title: string;
        description: string;
        image?: string;
      };
      cards?: Array<{
        key: string;
        title: string;
        description: string;
        image?: string;
      }>;
    };
  };
}

export interface FooterProps {
  footerData: {
    title: string;
    subtitle: string;
    content?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
}

export interface HeaderProps {
  navigation: Array<{ name: string; href: string; active?: boolean }>;
}

export interface HeroProps {
  heroData: {
    badge: string;
    title: string;
    subtitle: string;
    image?: string;
    content?: {
      cta_text?: string;
      docs_text?: string;
      cta_secondary_link?: string;
      image?: string;
    };
  };
}

export interface IntegrationsProps {
  secondaryIntegrationsData: {
    badge: string;
    title: string;
    subtitle: string;
    content?: {
      cards?: Array<{
        title: string;
        description: string;
        tags?: string[];
      }>;
    };
  };
}

export interface PricingProps {
  pricingSection: {
    badge: string;
    title: string;
    description: string;
  };
  plansData: Array<{
    name: string;
    slug: string;
    description: string;
    amount: number;
    is_popular?: boolean;
    agent_limit?: number;
    campaign_limit_per_day?: number;
    flow_limit?: number;
    knowledgebase_limit?: number;
    storage_limit?: number;
    contact_limit?: number;
    features?: Record<string, string | number>;
    sms_agent_limit?: number;
    sms_campaign_limit_per_day?: number;
    campaign_sms_limit?: number;
  }>;
}

export interface TestimonialsProps {
  testimonialSection: {
    section_badge: string;
    section_heading: string;
    section_subheading: string;
  };
  testimonialsData: Array<{
    title: string;
    description: string;
    user_name: string;
    user_post: string;
  }>;
}

export interface AutomateProps {
  automateData?: {
    heading?: string;
    cards?: Array<{
      title?: string;
      description?: string;
      icon?: string;
    }>;
  };
}
export interface HowItWorksProps {
  howItWorksData?: {
    heading?: string;
    subtitle?: string;
    steps?: Array<{
      number?: number;
      title?: string;
      description?: string;
      icon?: string;
    }>;
  };
}

export interface UploadResponse {
  message: string
  imagePath: string
  filename: string
}

export interface AddonsCard {
  title: string;
  description: string;
  image?: string;
  badges?: string[];
}

export interface AddonsProps {
  addonsData: {
    badge: string;
    title: string;
    subtitle: string;
    cards?: Array<{
      title: string;
      description: string;
      image?: string;
      badges?: string[];
    }>;
  };
}

export interface HumanTransferProps {
  humanTransferData: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    image?: string;
    features?: Array<{
      title: string;
      description: string;
    }>;
    bottom_features?: Array<{
      title: string;
      description: string;
    }>;
  };
}