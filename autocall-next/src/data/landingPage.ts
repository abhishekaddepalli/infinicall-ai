export const defaultHeroData = {
  badge: "New: Voice Calling AI v2.0",
  title: "AI Voice Agents That Call, Qualify, Book & Follow Up",
  subtitle:
    "Handle incoming calls, run outbound campaigns, collect customer information, and automate follow-ups from a single platform",
  content: { cta_text: "Let's Talk", docs_text: "View Documentation", image: "/assets/images/hero-2.png" },
};

// ── Primary Features ──────────────────────────────────────────────────────────
export const defaultPrimaryFeaturesData = {
  badge: "Platform Core",
  title: "Turn Conversations Into Customers",
  subtitle:
    "Transform customer communication with intelligent voice agents, automated workflows, and seamless business integrations.",
  content: {
    left_card: {
      title: "Human-Like Voice Conversations",
      description:
        "Engage callers instantly with AI voice agents that answer questions, collect details, and move customers through your workflow.",
      image: "/assets/images/subsecond-voice.png",
    },
    cards: [
      {
        key: "builder",
        title: "Visual Workflow Automation",
        description:
          "Create powerful automation flows with drag-and-drop actions, conditions, webhooks, and AI-driven decision making.",
        image: "/assets/images/workflow.png",
      },
      {
        key: "campaigns",
        title: "Outbound Call Campaigns",
        description:
          "Upload contacts, schedule campaigns, and let AI agents call hundreds of prospects automatically while handling conversations in real time.",
        image: "/assets/images/campaign.png",
      },
      {
        key: "sync",
        title: "Knowledge & Prompt Library",
        description:
          "Train ai assistents using documents, FAQs, websites, and reusable prompts to deliver accurate and consistent responses across every call.",
        image: "/assets/images/train-ai.png",
      },
      {
        key: "toolbox",
        title: "Developer Toolbox",
        description:
          "Flexible REST APIs, real-time WebSockets, and custom Webhook subscriptions for seamless integration.",
        image: "/assets/images/contact.png",
      },
    ],
  },
};

// ── Contact ───────────────────────────────────────────────────────────────────
export const defaultContactData = {
  badge: "We're Online",
  title: "Let's build something incredible together",
  subtitle:
    "Have specific volume requirements or custom integration plans? Reach out and our engineering support team will respond in a few hours.",
  content: {
    email: "support@AutoCall.ai",
    location: "123 AI Street, Tech City, TC 12345",
  },
};

// ── Footer ────────────────────────────────────────────────────────────────────
export const defaultFooterData = {
  title: "AutoCall",
  subtitle:
    "AutoCall is a unified business platform that combines CRM marketing, telephone carrier services, structured FAQs, and voice call automation into one connected conversational ecosystem.",
  content: { instagram: "#", facebook: "#", twitter: "#", linkedin: "#" },
};

// ── Plans ─────────────────────────────────────────────────────────────────────
export const defaultPlansData: any[] = [
  {
    name: "Starter Plan",
    slug: "starter-plan",
    description:
      "Ideal for young startups and developers exploring Conversational AI calling options.",
    amount: 49,
    is_popular: false,
  },
  {
    name: "Pro Scale Plan",
    slug: "pro-scale-plan",
    description:
      "Perfect for expanding teams requiring high-performance concurrent calling limits.",
    amount: 99,
    is_popular: true,
  },
  {
    name: "Enterprise Plan",
    slug: "enterprise-plan",
    description:
      "Tailored options for global corporations requiring dedicated trunk lines and SLAs.",
    amount: 499,
    is_popular: false,
  },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
export const defaultTestimonialsData: any[] = [
  {
    title: "Brilliant Integration Support",
    description:
      "Honestly one of the most thoughtful, efficient, and reliable developer platforms I've ever integrated with.",
    user_name: "Jordan Blake",
    user_post: "TechSphere",
  },
  {
    title: "Mind-Blowing Voice Engine",
    description:
      "If you're building with AI voice and haven't discovered this platform yet, prepare to have your mind absolutely blown.",
    user_name: "Sandi Dez",
    user_post: "Creative Zeune",
  },
  {
    title: "Robust Webhooks & Automations",
    description:
      "Super clean platform. Everything from voice agent training to custom webhook automation is well engineered.",
    user_name: "Taylor Smith",
    user_post: "DataStream Inc.",
  },
  {
    title: "Seamless SDK Workflow",
    description:
      "An essential tool for any modern developer. The workflow integration process was completely seamless and quick.",
    user_name: "Alicia Moore",
    user_post: "Data Dynamics",
  },
  {
    title: "Highly Scalable Calls",
    description:
      "This platform completely revolutionized our dynamic customer outreach. It's incredibly intuitive and robust.",
    user_name: "Alex Turner",
    user_post: "DataCraft Solutions",
  },
  {
    title: "High Conversion Campaigns",
    description:
      "The ease of calendar scheduling and smart campaign triggers has boosted our pipeline engagement by 40%.",
    user_name: "Sara Johnson",
    user_post: "CodeCraft",
  },
];

// ── FAQs ──────────────────────────────────────────────────────────────────────
export const defaultFaqsData: any[] = [
  {
    title: "What is AutoCall exactly?",
    description:
      "AutoCall is a unified business and calling automation suite that combines high-fidelity AI voice agents, smart CRM scheduling pipelines, unified conversation inboxes, and Google/WhatsApp marketing channels into one connected platform.",
  },
  {
    title: "Who is the platform built for?",
    description:
      "It is engineered for modern sales development cohorts, customer success departments, SaaS organizations, and developers who need to launch high-performance, compliant voice and message campaigns at scale.",
  },
  {
    title: "Can we migrate from our current carriers?",
    description:
      "Absolutely. AutoCall supports simple number porting, outbound calling via external SIP channels, and verified custom number procurement directly within our workspace.",
  },
  {
    title: "Does the platform integrate with other software?",
    description:
      "Yes. We sync out of the box with CRM leaders, Google Sheets, Google Calendars, and provide fully customizable Webhook endpoints and Developer API keys.",
  },
  {
    title: "Is AutoCall secure?",
    description:
      "Yes. All voice packets, conversation transcript data, FAQs, customer phone numbers, and call logs are heavily encrypted at rest and in transit utilizing banking-grade protocols.",
  },
  {
    title: "How do dynamic WhatsApp templates work?",
    description:
      "You design your templates directly in our flow builder, submit them to Meta for quick automated validation, and immediately broadcast them with interactive buttons to custom phone lists.",
  },
];

// ── Blogs ─────────────────────────────────────────────────────────────────────
export const defaultBlogsData: any[] = [
  {
    title: "How intelligent automation removes repetitive decisions",
    categories: [{ name: "Automation" }],
    created_at: "2026-02-15T00:00:00.000Z",
  },
  {
    title: "Discover how to align campaign performance with real pipeline",
    categories: [{ name: "Marketing" }],
    created_at: "2026-02-15T00:00:00.000Z",
  },
  {
    title: "Why scaling without infrastructure creates bottlenecks",
    categories: [{ name: "Analytics" }],
    created_at: "2026-02-15T00:00:00.000Z",
  },
];

// ── Pricing Section Labels ────────────────────────────────────────────────────
export const defaultPricingSection = {
  badge: "Pricing Plans",
  title: "Choose the Right Plan",
  description: "Choose the plan that fits your business. No hidden fees.",
};

// ── Blog Section Labels ───────────────────────────────────────────────────────
export const defaultBlogSection = {
  badge: "News & Insights",
  title: "Insights for Smarter Customer Engagement",
  description: "",
};

// ── Testimonial Section Labels ────────────────────────────────────────────────
export const defaultTestimonialSection = {
  section_badge: "Customer Stories",
  section_heading: "What Our Clients Say",
  section_subheading: "",
};

// ── FAQ Section Labels ────────────────────────────────────────────────────────
export const defaultFaqSection = {
  section_badge: "Questions and Answers",
  section_heading: "Frequently asked questions",
  section_subheading: "",
};

// ── Comparison ────────────────────────────────────────────────────────────────
export const defaultComparisonData = {
  heading: "Turn Every Call Into an Opportunity with AI",
  robotImage: "/assets/images/robot1.png",
  features: [
    "Available 24/7 without breaks",
    "Handle inbound and outbound calls with AI agents",
    "Collect customer information using AI-powered forms",
    "Reduce costs and increase productivity",
    "Scale your outreach globally",
    "Build powerful automations without coding"
  ],
  traditional: [
    "High operational costs",
    "Limited agent availability",
    "Limited working hours",
    "Longer response times",
    "Disconnected business workflows",
    "Inconsistent quality",
    "Difficult to scale efficiently",
  ],
  aiAgents: [
    "Lower cost per interaction",
    "Always-on AI voice agents",
    "24/7 customer engagement",
    "Instant response and follow-ups",
    "Unified automation workflows",
    "Consistent customer experiences",
    "Scale conversations on demand",
  ]
};

// ── How It Works ──────────────────────────────────────────────────────────────
export const defaultHowItWorksData = {
  heading: "How AutoCall Works",
  subtitle: "A seamless journey from setup to results, designed for your growth.",
  steps: [
    {
      number: 1,
      title: "Create Your AI Agent",
      description: "Configure agent's personality, goals, and conversation flow in minutes.",
      icon: "UserPlus",
      color: "from-[#3b82f6] to-[#2563eb]",
      borderColor: "border-[#3b82f6]/30",
      glowColor: "shadow-[0_0_20px_rgba(59,130,246,0.25)]",
    },
    {
      number: 2,
      title: "Upload & Train",
      description: "Upload documents, FAQs, websites or knowledge base to train your agent.",
      icon: "FileText",
      color: "from-[#06b6d4] to-[#0891b2]",
      borderColor: "border-[#06b6d4]/30",
      glowColor: "shadow-[0_0_20px_rgba(6,182,212,0.25)]",
    },
    {
      number: 3,
      title: "Launch Campaign",
      description: "Upload your leads and start AI-powered outbound calling campaigns.",
      icon: "Megaphone",
      color: "from-[#ec4899] to-[#db2777]",
      borderColor: "border-[#ec4899]/30",
      glowColor: "shadow-[0_0_20px_rgba(236,72,153,0.25)]",
    }
  ]
};

// ── Automate ──────────────────────────────────────────────────────────────────
export const defaultAutomateData = {
  heading: "Automate Customer Engagement at Scale",
  cards: [
    {
      title: "Automated Outgoing Calls",
      description: "Schedule and launch AI-powered outgoing call campaigns to hundreds of contacts automatically.",
      icon: "Phone",
      color: "from-[#3b82f6] to-[#2563eb]",
      borderColor: "border-[#3b82f6]/30",
      glowColor: "shadow-[0_0_20px_rgba(59,130,246,0.25)]",
    },
    {
      title: "24/7 AI Voice Support",
      description: "Offer round-the-clock voice assistance through an embedded AI call widget that responds instantly to customer inquiries.",
      icon: "UserCheck",
      color: "from-[#06b6d4] to-[#0891b2]",
      borderColor: "border-[#06b6d4]/30",
      glowColor: "shadow-[0_0_20px_rgba(6,182,212,0.25)]",
    },
    {
      title: "Appointment Automation",
      description: "Let AI agents qualify prospects and schedule appointments in real time during outbound calls.",
      icon: "Calendar",
      color: "from-[#ec4899] to-[#db2777]",
      borderColor: "border-[#ec4899]/30",
      glowColor: "shadow-[0_0_20px_rgba(236,72,153,0.25)]",
    },
    {
      title: "WhatsApp Embedded Signup",
      description: "Seamlessly connect your WhatsApp Business account, manage templates, and automate customer follow-ups after calls.",
      icon: "Headset",
      color: "from-[#f43f5e] to-[#e11d48]",
      borderColor: "border-[#f43f5e]/30",
      glowColor: "shadow-[0_0_20px_rgba(244,63,94,0.25)]",
    },
    {
      title: "Smart Data Collection",
      description: "Create custom forms and let AI agents automatically collect responses during voice conversations, eliminating manual data entry.",
      icon: "RefreshCw",
      color: "from-[#8b5cf6] to-[#7c3aed]",
      borderColor: "border-[#8b5cf6]/30",
      glowColor: "shadow-[0_0_20px_rgba(139,92,246,0.25)]",
    },
    {
      title: "AI Prompt Templates",
      description: "Choose from pre-built prompt templates or create your own to customize how AI agents handle calls and conversations.",
      icon: "Star",
      color: "from-[#f59e0b] to-[#d97706]",
      borderColor: "border-[#f59e0b]/30",
      glowColor: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    }
  ]
};

// ── Addons ────────────────────────────────────────────────────────────────────
export const defaultAddonsData = {
  badge: "Add-ons",
  title: "Powerful Add-ons for Your Business",
  subtitle: "Extend your platform capabilities with seamless integrations, advanced communication channels, and scalable management tools.",
  cards: [
    {
      key: "sms",
      title: "SMS Management",
      description: "Send automated SMS notifications, appointment reminders, and follow-ups. Build unified conversational flows across voice and text.",
      image: "/assets/images/sms-campaign.png"
    },
    {
      key: "api",
      title: "API Integration",
      description: "Connect your existing CRM, marketing tools, and databases with our powerful REST API and Webhooks.",
      image: "/assets/images/rest-api.png"
    },
    {
      key: "teams",
      title: "Teams Management",
      description: "Manage multiple teams, assign roles, and control access permissions across your entire organization with ease.",
      image: "/assets/images/team.png"
    }
  ]
};

// ── Human Transfer ─────────────────────────────────────────────────────────────
export const defaultHumanTransferData = {
  badge: "Human Transfer",
  title: "Smart conversations.",
  subtitle: "Seamless human connection.",
  description: "Enable human transfer in your AI agents and let important conversations flow to the right team member—instantly.",
  image: "/assets/images/human_transfer.png",
  features: [
    {
      key: "settings",
      title: "Enable in Agent Settings",
      description: "Turn on human transfer while creating incoming or outgoing agents."
    },
    {
      key: "assign",
      title: "Assign Team Members",
      description: "Choose specific members or roles to handle transferred chats."
    },
    {
      key: "handoff",
      title: "Real-time Handoff",
      description: "Seamless transfer with full conversation history."
    },
    {
      key: "track",
      title: "Track & Optimize",
      description: "Monitor transfer performance and improve customer outcomes."
    }
  ]
};
