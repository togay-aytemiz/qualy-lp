import React, { createContext, useState, useContext, ReactNode } from 'react';
import { resolveLanguageByRegion } from './lib/region-language';

type Language = 'en' | 'tr';

interface Translations {
  navbar: {
    features: string;
    howItWorks: string;
    faq: string;
    pricing: string;
    login: string;
    getStarted: string;
  };
  hero: {
    status: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    connects: string;
    noCard: string;
    mockup: {
      dashboard: string;
      online: string;
      onlineShort: string;
      priorityInbox: string;
      readyToSign: string;
      hours: string;
      unknown: string;
      newLead: string;
      thirdLeadName: string;
      thirdLeadPreview: string;
      intentHot: string;
      intentWarm: string;
      intentCold: string;
      toneHot: string;
      toneWarm: string;
      toneCold: string;
      summaryTitle: string;
      summaryPlaceholder: string;
      animatedScenarios: Array<{
        initials: string;
        name: string;
        platform: 'whatsapp' | 'instagram' | 'telegram';
        preview: string;
        lastMessageAt: string;
        messages: string[];
        scores: number[];
      }>;
      activeNow: string;
      leadScore: string;
      leadScoreShort: string;
      takeOver: string;
      today: string;
      typing: string;
      thinking: string;
      composerPlaceholder: string;
      customerMsg: string;
      aiDetected: string;
      intent: string;
      aiResponse: string;
    };
  };
  successStories: {
    pill: string;
    title: string;
    subtitle: string;
    stories: Array<{
      text: string;
      author: string;
      role: string;
    }>;
  };
  impactMetrics: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaPrimary: string;
    items: Array<{
      value: string;
      label: string;
      detail: string;
    }>;
  };
  challenges: {
    title_part1: string;
    title_part2: string;
    subtitle: string;
    ctaHint: string;
    ctaPrimary: string;
    roles: {
      founders: string;
      customerSuccess: string;
      sales: string;
      marketing: string;
    };
    cards: {
      founders: {
        headline: string;
        compact: string;
        desc: string;
      };
      customerSuccess: {
        headline: string;
        compact: string;
        desc: string;
      };
      sales: {
        headline: string;
        compact: string;
        desc: string;
      };
      marketing: {
        headline: string;
        compact: string;
        desc: string;
      };
    };
  };
  integrations: {
    trustedBy: string;
  };
  features: {
    heading: string;
    heading_mobile: string;
    subheading: string;
    feat1_title: string;
    feat1_title_highlight: string;
    feat1_desc1: string;
    feat1_desc2: string;
    feat1_mockup_source: string;
    feat1_mockup_synced: string;
    feat1_mockup_processed: string;
    feat1_mockup_quote: string;
    feat1_mockup_no_code: string;
    feat1_mockup_step1: string;
    feat1_mockup_step2: string;
    feat1_mockup_step3: string;
    feat1_mockup_skill_title: string;
    feat1_mockup_skill_detail: string;
    feat1_mockup_kb_title: string;
    feat1_mockup_kb_detail: string;
    feat1_mockup_kb_items: string[];
    feat1_mockup_skill_items: string[];
    feat1_mockup_preview_label: string;
    feat1_mockup_preview_question: string;
    feat1_mockup_preview_answer: string;
    feat2_title: string;
    feat2_title_highlight: string;
    feat2_desc: string;
    feat2_li1: string;
    feat2_li2: string;
    feat2_mockup_potential: string;
    feat2_mockup_processing: string;
    feat2_mockup_done: string;
    feat2_mockup_analysis: string;
    feat2_mockup_check1: string;
    feat2_mockup_check2: string;
    feat2_mockup_check3: string;
    feat2_mockup_btn: string;
    feat3_title: string;
    feat3_title_highlight: string;
    feat3_desc1: string;
    feat3_desc2: string;
    feat3_mockup_focus: string;
    feat3_mockup_easy: string;
    feat3_mockup_connected: string;
    feat3_mockup_connect: string;
    feat3_mockup_voice: string;
    feat3_mockup_image: string;
    feat3_mockup_hidden: string;
    feat4_title: string;
    feat4_title_highlight: string;
    feat4_desc: string;
    feat4_badges: string[];
    feat5_title: string;
    feat5_title_highlight: string;
    feat5_desc: string;
    feat5_mockup_title: string;
    feat5_mockup_title_tag: string;
    feat5_mockup_badge: string;
    feat5_mockup_service_label: string;
    feat5_mockup_service_value: string;
    feat5_mockup_date_label: string;
    feat5_mockup_date_value: string;
    feat5_mockup_budget_label: string;
    feat5_mockup_budget_value: string;
    feat5_mockup_location_label: string;
    feat5_mockup_location_value: string;
    feat5_mockup_missing_label: string;
    feat5_mockup_missing_value: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    step1_title: string;
    step1_desc: string;
    step2_title: string;
    step2_desc: string;
    step3_title: string;
    step3_desc: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    save: string;
    professional: {
        title: string;
        desc: string;
        priceMonthly: string;
        priceYearly: string;
        cta: string;
        features: string[];
    };
    enterprise: {
        title: string;
        desc: string;
        price: string;
        cta: string;
        features: string[];
    };
  };
  cta: {
    title: string;
    desc: string;
    primary: string;
    secondary: string;
    note: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  footer: {
    desc: string;
    product: string;
    resources: string;
    company: string;
    features: string;
    leadScoring: string;
    updates: string;
    docs: string;
    api: string;
    community: string;
    help: string;
    about: string;
    blog: string;
    careers: string;
    legal: string;
    legalCenter: string;
    privacy: string;
    terms: string;
    rights: string;
  };
  legal: {
    center: string;
    centerTitle: string;
    centerDescription: string;
    backToHome: string;
    lastUpdated: string;
    version: string;
    notFoundTitle: string;
    notFoundDescription: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    navbar: {
      features: "Features",
      howItWorks: "How it works",
      faq: "FAQ",
      pricing: "Pricing",
      login: "Log in",
      getStarted: "Get Started"
    },
    hero: {
      status: "WhatsApp-first AI inbox for service teams",
      headline: "Reply instantly. <br /> Prioritize serious leads.",
      subheadline: "Qualy automates repetitive WhatsApp, Instagram, and Telegram conversations with Skills + Knowledge Base, scores intent 1-10, and hands chats to your team at the right moment.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Open Dashboard",
      connects: "Connect in minutes",
      noCard: "No credit card required",
      mockup: {
        dashboard: "Qualy Dashboard",
        online: "Status: Online",
        onlineShort: "Online",
        priorityInbox: "Priority Inbox",
        readyToSign: "Ready to book, needs invoice details",
        hours: "Do you have availability this week?",
        unknown: "Unknown",
        newLead: "New lead",
        thirdLeadName: "Berk O.",
        thirdLeadPreview: "Could you share package details for a Saturday session?",
        intentHot: "High intent (booking)",
        intentWarm: "Qualified interest (follow-up)",
        intentCold: "Support-only conversation",
        toneHot: "Hot",
        toneWarm: "Warm",
        toneCold: "Cold",
        summaryTitle: "Conversation Summary",
        summaryPlaceholder: "View",
        animatedScenarios: [
          {
            initials: "EM",
            name: "Emma C.",
            platform: "whatsapp",
            preview: "Can I book a skincare appointment this week?",
            lastMessageAt: "2 min",
            messages: [
              "Can I book a skincare appointment this week?",
              "Yes, we have available slots this week. Which day works for you?",
              "Wednesday evening works, can you reserve my spot?",
              "Absolutely. I am forwarding the appointment details to the team now."
            ],
            scores: [4.2, 8.1]
          },
          {
            initials: "NP",
            name: "Noah P.",
            platform: "instagram",
            preview: "Can you resend the receipt from my previous appointment?",
            lastMessageAt: "9 min",
            messages: [
              "Can you resend the receipt from my previous appointment?",
              "Sure, I can forward this as a support request right away.",
              "I do not need a new booking, only the document.",
              "Understood. Your request has been forwarded to the support team."
            ],
            scores: [2.8, 1.9]
          },
          {
            initials: "MT",
            name: "Maya T.",
            platform: "telegram",
            preview: "We need an office team photo shoot for our company.",
            lastMessageAt: "21 min",
            messages: [
              "We need an office team photo shoot for our company.",
              "Great fit. We provide on-site corporate shooting and planning.",
              "Can we schedule a planning call this week?",
              "Yes, we can schedule it this week. Share your company email and I will send the details today."
            ],
            scores: [5.1, 9.0]
          }
        ],
        activeNow: "via WhatsApp • Active now",
        leadScore: "Lead Score",
        leadScoreShort: "Score",
        takeOver: "Take Over",
        today: "Today",
        typing: "typing...",
        thinking: "thinking...",
        composerPlaceholder: "Write a message...",
        customerMsg: "Hi, I need a newborn shoot around mid-October. Which package fits best, and do you offer installment payments?",
        aiDetected: "Qualy identified:",
        intent: "High intent (booking)",
        aiResponse: "Great timing. For a mid-October newborn shoot, our Standard and Premium packages both fit. Share your preferred day and I can hold availability and send installment options."
      }
    },
    successStories: {
      pill: "Success Stories",
      title: "Scaling businesses are <br/> already succeeding with Qualy",
      subtitle: "Join hundreds of fast-growing service professionals using Qualy to automate their lead qualification and support.",
      stories: [
        {
          text: "Before Qualy, I was replying to the same booking questions all day. Now it handles first replies and I only step in for serious clients.",
          author: "Emma Collins",
          role: "Owner, Northside Skin Studio"
        },
        {
          text: "Most chats used to be price shoppers. With scoring, I can instantly see who needs emergency HVAC work and call them first.",
          author: "Liam Carter",
          role: "HVAC Technician, Carter Home Services"
        },
        {
          text: "Patients ask about pricing, insurance, and appointment slots at all hours. Qualy answers accurately and our front desk is no longer overloaded.",
          author: "Olivia Reed",
          role: "Clinic Coordinator, Maple Dental Care"
        },
        {
          text: "I get dozens of WhatsApp messages after every listing post. Qualy filters intent so I spend my time on buyers who are ready to visit this week.",
          author: "Noah Bennett",
          role: "Real Estate Agent, Harbor Homes"
        },
        {
          text: "Trial class requests used to get buried when I was coaching back-to-back sessions. Now leads are sorted and follow-ups are on time.",
          author: "Sophia Turner",
          role: "Personal Trainer, LiftLab Studio"
        },
        {
          text: "For plumbing calls, speed matters. Qualy handles intake in seconds and pushes urgent jobs to the top, which directly increased booked jobs.",
          author: "Mason Brooks",
          role: "Plumbing Contractor, Brooks Plumbing Co."
        },
        {
          text: "Couples message late at night with the same package questions. Qualy gives clear answers and collects event details before I wake up.",
          author: "Ava Mitchell",
          role: "Wedding Photographer, Ava Mitchell Photo"
        },
        {
          text: "Parents ask for schedules, levels, and pricing every evening. Qualy now handles those routine questions and I focus on actual student planning.",
          author: "Ethan Price",
          role: "Tutor, BrightPath Math"
        },
        {
          text: "Our salon gets flooded with 'Do you have a slot today?' messages. Qualy checks availability and confirms service details without confusion.",
          author: "Chloe Foster",
          role: "Salon Manager, Bloom Hair Room"
        },
        {
          text: "We answer repair estimates on both Telegram and WhatsApp. Qualy keeps replies consistent and flags customers who are ready to approve service.",
          author: "Lucas Hayes",
          role: "Auto Repair Owner, Hayes Garage"
        },
        {
          text: "Pet owners send urgent questions at random hours. Qualy gives safe first guidance and helps us prioritize cases before opening time.",
          author: "Mia Griffin",
          role: "Vet Assistant, Greenfield Vet"
        },
        {
          text: "As a solo IT consultant, I could not keep up with repetitive onboarding questions. Qualy now handles that layer and I stay focused on delivery.",
          author: "Jack Palmer",
          role: "IT Consultant, Palmer Tech Support"
        },
        {
          text: "Prospective students ask the same level-test and fee questions daily. Qualy answers instantly and our no-show rate dropped after faster responses.",
          author: "Lily Ward",
          role: "Coordinator, Westbridge English"
        },
        {
          text: "In pool service, seasonal demand spikes hard. Qualy keeps up with quote requests and sends me only the leads that match our service radius.",
          author: "Henry Shaw",
          role: "Operator, ClearBlue Pools"
        },
        {
          text: "Move-day requests are chaotic and time-sensitive. Qualy collects volume, location, and date details upfront so dispatching is much faster.",
          author: "Grace Murphy",
          role: "Dispatcher, SwiftMove Local"
        }
      ]
    },
    impactMetrics: {
      title: "Metrics teams improve with Qualy",
      subtitle: "From first-response speed to lead quality, Qualy moves the numbers that directly affect revenue and workload.",
      ctaText: "Ready to grow your results with Qualy?",
      ctaPrimary: "Start Free Trial",
      items: [
        {
          value: "-78%",
          label: "Faster first-response time",
          detail: "Automated first-line replies reduce waiting time before a human joins."
        },
        {
          value: "+42%",
          label: "More qualified leads",
          detail: "Intent scoring surfaces high-fit conversations for priority follow-up."
        },
        {
          value: "-61%",
          label: "Less repetitive inbox workload",
          detail: "Skills and Knowledge Base resolve routine questions without manual effort."
        },
        {
          value: "+29%",
          label: "Higher booked-conversation rate",
          detail: "Warm follow-ups keep high-intent leads moving toward booking."
        }
      ]
    },
    challenges: {
      title_part1: "Choose your role,",
      title_part2: "see Qualy in action",
      subtitle: "Open the flow closest to your daily work and see how Qualy turns message load into booked outcomes. If it fits, start free in minutes.",
      ctaHint: "Pick a role, preview the flow, then start free.",
      ctaPrimary: "Try for free",
      roles: {
        founders: "Owner / Founder",
        customerSuccess: "Support",
        sales: "Sales / Booking",
        marketing: "Marketing"
      },
      cards: {
        founders: {
          headline: "See how owners cut inbox noise and focus on customers ready to buy.",
          compact: "Less noise, more decisions.",
          desc: "Qualy handles first replies, scores intent, and surfaces decision-ready conversations first. You get time back and more booked outcomes from the same inbox."
        },
        customerSuccess: {
          headline: "Watch support queues shrink while warm conversations keep moving.",
          compact: "Shorter queues, faster replies.",
          desc: "Qualy resolves routine pricing, availability, and policy questions instantly. Your team jumps in only when needed, so high-value conversations do not stall."
        },
        sales: {
          headline: "Prioritize hot conversations first and fill your calendar faster.",
          compact: "Hot conversations first.",
          desc: "Qualy extracts urgency and buying signals from every chat, so reps contact the right person at the right moment and close more bookings."
        },
        marketing: {
          headline: "Turn campaign clicks into qualified conversations before intent cools.",
          compact: "Clicks into qualified chats.",
          desc: "Qualy replies in seconds after ad clicks and collects key qualification details automatically, so more of your budget turns into sales-ready pipeline."
        }
      }
    },
    integrations: {
      trustedBy: "Built for modern service teams"
    },
    features: {
      heading: "Turn heavy message traffic into an organized customer flow.",
      heading_mobile: "Turn heavy message traffic into an organized flow.",
      subheading: "Qualy brings all your conversations into one place; replies with AI, scores intent, and helps you focus only on the right conversations.",
      feat1_title: "Teach Qualy your business without touching code. Ready in 5 min",
      feat1_title_highlight: "Ready in 5 min",
      feat1_desc1: "Add your business documents and ready responses. Qualy uses them as references for consistent replies.",
      feat1_desc2: "No technical setup required.",
      feat1_mockup_source: "Setup flow",
      feat1_mockup_synced: "Quick setup",
      feat1_mockup_processed: "Live",
      feat1_mockup_quote: "\"No code needed. Teach in settings, let Qualy apply it automatically.\"",
      feat1_mockup_no_code: "No code",
      feat1_mockup_step1: "Add skill",
      feat1_mockup_step2: "Add knowledge",
      feat1_mockup_step3: "Go live",
      feat1_mockup_skill_title: "Ready responses (Skills)",
      feat1_mockup_skill_detail: "Reusable responses for common topics",
      feat1_mockup_kb_title: "Knowledge Base documents",
      feat1_mockup_kb_detail: "Your business references",
      feat1_mockup_kb_items: [
        "Service scope",
        "Pricing and packages",
        "Cancellation policy",
        "Returns and refunds"
      ],
      feat1_mockup_skill_items: [
        "Availability and booking response",
        "Pricing and package response",
        "Support and document request response"
      ],
      feat1_mockup_preview_label: "Live preview",
      feat1_mockup_preview_question: "Do you have availability tomorrow and what are the prices?",
      feat1_mockup_preview_answer: "I can share availability and pricing in this flow. If you want, I can list the available slots now.",
      feat2_title: "Qualy replies to messages with AI and generates scores automatically",
      feat2_title_highlight: "with AI",
      feat2_desc: "Every new customer message triggers profile extraction and 0-10 intent scoring. See urgency, service fit, and follow-up priority at a glance.",
      feat2_li1: "<span><strong class=\"text-slate-900\">Low intent:</strong> Early research or vague requests stay in AI flow.</span>",
      feat2_li2: "<span><strong class=\"text-slate-900\">High intent:</strong> Clear service + timeline signals are escalated for immediate follow-up.</span>",
      feat2_mockup_potential: "Lead Potential",
      feat2_mockup_processing: "Extraction running",
      feat2_mockup_done: "Extraction completed",
      feat2_mockup_analysis: "Extraction status",
      feat2_mockup_check1: "Service need captured",
      feat2_mockup_check2: "Timeline or urgency detected",
      feat2_mockup_check3: "Decision readiness signaled",
      feat2_mockup_btn: "Open thread",
      feat3_title: "All conversations on one screen",
      feat3_title_highlight: "one screen",
      feat3_desc1: "Manage WhatsApp, Instagram, Telegram, and Messenger messages from one screen. Connect channels in minutes and reply without switching apps.",
      feat3_desc2: "Connection is simple, inbox stays unified.",
      feat3_mockup_focus: "Unified inbox",
      feat3_mockup_easy: "Connect in minutes",
      feat3_mockup_connected: "Connected",
      feat3_mockup_connect: "Connect",
      feat3_mockup_voice: "Voice message received (outside auto-reply flow)",
      feat3_mockup_image: "Image received (outside auto-reply flow)",
      feat3_mockup_hidden: "All messages are collected in one inbox.",
      feat4_title: "Human handover when needed",
      feat4_title_highlight: "Human handover",
      feat4_desc: "Qualy handles routine replies; when needed, the conversation is handed to a human. Take over instantly, then return to AI when ready.",
      feat4_badges: [
        "Human handover triggers",
        "One-click take over",
        "Return to AI flow",
        "Conversation history stays intact",
        "High-intent alerts",
        "TR/EN localized replies"
      ],
      feat5_title: "Qualy extracts the service profile and automatically clarifies missing details with customers",
      feat5_title_highlight: "automatically clarifies missing details",
      feat5_desc: "Qualy scans your uploaded Knowledge Base documents to build your business and service profile, then identifies critical fields to collect. During the conversation, AI asks natural follow-up questions to complete missing details.",
      feat5_mockup_title: "Profile Snapshot",
      feat5_mockup_title_tag: "(AI extraction)",
      feat5_mockup_badge: "Updating automatically",
      feat5_mockup_service_label: "Service",
      feat5_mockup_service_value: "Newborn photoshoot",
      feat5_mockup_date_label: "Date",
      feat5_mockup_date_value: "Mid-October",
      feat5_mockup_budget_label: "Budget",
      feat5_mockup_budget_value: "Budget-sensitive",
      feat5_mockup_location_label: "Location",
      feat5_mockup_location_value: "Kadikoy, Istanbul",
      feat5_mockup_missing_label: "AI follow-up",
      feat5_mockup_missing_value: "Asking for preferred day"
    },
    howItWorks: {
      title: "Start in minutes, let Qualy handle the first response flow",
      subtitle: "Connect your channels, train Qualy in a few clicks, then let Qualy AI reply automatically.",
      step1_title: "Connect channels quickly",
      step1_desc: "Connect WhatsApp, Instagram, Telegram, and Messenger in a few clicks. Keep channels separate, manage all conversations in one inbox.",
      step2_title: "Train Qualy in a few clicks",
      step2_desc: "Upload service details, pricing, and policy documents, then define ready responses. Qualy uses this context to reply consistently.",
      step3_title: "Let Qualy AI reply",
      step3_desc: "Qualy answers routine messages instantly, updates scores, and flags important conversations. Your team steps in only where human attention matters."
    },
    pricing: {
      title: "One practical MVP plan.",
      subtitle: "Everything needed for automated first-line messaging and lead qualification.",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save 20%",
      professional: {
        title: "Professional",
        desc: "For service teams running WhatsApp-first sales and support.",
        priceMonthly: "$79/mo",
        priceYearly: "$69/mo",
        cta: "Start 14-day free trial",
        features: [
            "WhatsApp, Instagram, and Telegram inbox",
            "Skill + Knowledge Base auto-replies",
            "AI lead extraction and 0-10 scoring",
            "Human Takeover with escalation controls",
            "Legal center with versioned policy pages"
        ]
      },
      enterprise: {
        title: "Advanced",
        desc: "For custom rollout requirements.",
        price: "Custom",
        cta: "Contact Sales",
        features: [
            "Everything in Professional",
            "Implementation planning support",
            "Custom workflow alignment",
            "Priority roadmap input",
            "Dedicated onboarding"
        ]
      }
    },
    cta: {
      title: "Ready to turn message traffic into a cleaner flow?",
      desc: "Automate repetitive messaging, qualify leads earlier, and take over high-intent conversations at the right moment.",
      primary: "Start Free Trial",
      secondary: "Talk to Sales",
      note: "14-day free trial • Cancel anytime"
    },
    faq: {
      eyebrow: "FAQs",
      title: "Frequently Asked Questions",
      subtitle: "Find quick answers about what Qualy does, how setup works, and how your team stays in control.",
      primary: "Start Free Trial",
      secondary: "Contact Us",
      items: [
        {
          question: "What exactly does this platform do?",
          answer: "Qualy automates repetitive customer messages across WhatsApp, Instagram, and Telegram, then extracts lead details and scores intent from 0 to 10 so your team can focus on high-priority conversations."
        },
        {
          question: "How do I get started?",
          answer: "Connect your channels, upload service and policy documents to the Knowledge Base, add a few ready-response Skills, and let Qualy start replying in minutes."
        },
        {
          question: "Which channels are supported right now?",
          answer: "The MVP supports WhatsApp, Instagram, and Telegram inbox workflows in one panel. Messenger is listed as a coming-soon channel on the roadmap."
        },
        {
          question: "How does lead scoring work?",
          answer: "Qualy analyzes signals like service clarity, timeline, budget fit, urgency, and decision readiness, then updates a 0-10 intent score after new customer messages."
        },
        {
          question: "Is my customer data secure?",
          answer: "Organizations are isolated with a multi-tenant model, legal terms are publicly versioned, and human handover controls let your team pause AI replies when needed."
        },
        {
          question: "Can my team take over conversations at any time?",
          answer: "Yes. You can switch a chat to human takeover in one click, keep full conversation history, and return the thread to AI flow when you are ready."
        }
      ]
    },
    footer: {
      desc: "AI-first inbox for service businesses. Automate replies, qualify leads, and hand over at the right time.",
      product: "Product",
      resources: "Resources",
      company: "Company",
      features: "Features",
      leadScoring: "Testimonials",
      updates: "How it works",
      docs: "Documentation",
      api: "API Reference",
      community: "Community",
      help: "Help Center",
      about: "About",
      blog: "Blog",
      careers: "Careers",
      legal: "Legal",
      legalCenter: "Legal Center",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "All rights reserved."
    },
    legal: {
      center: "Legal",
      centerTitle: "Privacy & Terms Center",
      centerDescription: "Access all legal documents, including Privacy Policy and Terms of Service, from one page.",
      backToHome: "Back to Home",
      lastUpdated: "Last updated",
      version: "Version",
      notFoundTitle: "Document not found",
      notFoundDescription: "The legal document you requested is currently unavailable."
    }
  },
  tr: {
    navbar: {
      features: "Özellikler",
      howItWorks: "Nasıl Çalışır",
      faq: "SSS",
      pricing: "Fiyatlandırma",
      login: "Giriş Yap",
      getStarted: "Ücretsiz Başla"
    },
    hero: {
      status: "Servis ekipleri için WhatsApp odaklı AI gelen kutusu",
      headline: "Herkese değil, doğru müşteriye odaklan.",
      subheadline: "Qualy, <span class=\"font-semibold text-slate-700 underline decoration-slate-400/80 underline-offset-4\">mesajları otomatik yanıtlar</span>; hizmet profili çıkarır, gerekli alanları toplar, eksik bilgiyi doğru sorularla tamamlar ve konuşmaları 1-10 niyet skoruna göre <span class=\"font-semibold text-slate-700 underline decoration-slate-400/80 underline-offset-4\">önceliklendirir</span>.",
      ctaPrimary: "Ücretsiz Denemeyi Başlat",
      ctaSecondary: "Panele Git",
      connects: "Dakikalar içinde bağlanır",
      noCard: "Kredi kartı gerekmez",
      mockup: {
        dashboard: "Qualy Paneli",
        online: "Durum: Çevrimiçi",
        onlineShort: "Çevrimiçi",
        priorityInbox: "Öncelikli Kutu",
        readyToSign: "Randevuya hazır, fatura detayı bekliyor",
        hours: "Bu hafta uygunluğun var mı?",
        unknown: "Bilinmiyor",
        newLead: "Yeni müşteri",
        thirdLeadName: "Berk O.",
        thirdLeadPreview: "Cumartesi çekimi için paket detaylarını paylaşır mısın?",
        intentHot: "Yüksek niyet (randevu)",
        intentWarm: "Nitelikli ilgi (takip gerekir)",
        intentCold: "Yalnızca destek konuşması",
        toneHot: "Sıcak",
        toneWarm: "Ilık",
        toneCold: "Soğuk",
        summaryTitle: "Konuşma Özeti",
        summaryPlaceholder: "Özeti aç",
        animatedScenarios: [
          {
            initials: "EK",
            name: "Elif K.",
            platform: "whatsapp",
            preview: "Bu hafta cilt bakımı için randevu alabilir miyim?",
            lastMessageAt: "2 dk",
            messages: [
              "Bu hafta cilt bakımı için randevu alabilir miyim?",
              "Evet, bu hafta uygun saatimiz var. Hangi gün senin için uygun?",
              "Çarşamba akşamı olur, benim için ayırabilir misin?",
              "Tabii, Çarşamba akşamı uygun görünüyor. Randevu detaylarını ekibe iletiyorum."
            ],
            scores: [4.2, 8.1]
          },
          {
            initials: "CP",
            name: "Can P.",
            platform: "instagram",
            preview: "Geçen randevumun fişini tekrar gönderebilir misin?",
            lastMessageAt: "9 dk",
            messages: [
              "Geçen randevumun fişini tekrar gönderebilir misin?",
              "Elbette, bunu hemen destek talebi olarak iletebilirim.",
              "Yeni randevu istemiyorum, sadece belge gerekiyor.",
              "Anlaşıldı. Talebin destek ekibine iletildi."
            ],
            scores: [2.8, 1.9]
          },
          {
            initials: "MA",
            name: "Mete A.",
            platform: "telegram",
            preview: "Ekibimiz için ofiste kurumsal fotoğraf çekimi istiyoruz.",
            lastMessageAt: "21 dk",
            messages: [
              "Ekibimiz için ofiste kurumsal fotoğraf çekimi istiyoruz.",
              "Harika, yerinde kurumsal çekim planlaması yapabiliyoruz.",
              "Bu hafta kısa bir planlama görüşmesi yapabilir miyiz?",
              "Evet, bu hafta görüşebiliriz. Şirket e-postanı paylaşırsan detayları ileteyim."
            ],
            scores: [5.1, 9.0]
          }
        ],
        activeNow: "WhatsApp ile • Aktif",
        leadScore: "Müşteri Skoru",
        leadScoreShort: "Skor",
        takeOver: "Devral",
        today: "Bugün",
        typing: "yazıyor...",
        thinking: "düşünüyor...",
        composerPlaceholder: "Mesaj yaz...",
        customerMsg: "Merhaba, Ekim ortası için yenidoğan çekimi istiyorum. Hangi paket uygun olur ve taksit seçeneğin var mı?",
        aiDetected: "Qualy tespiti:",
        intent: "Yüksek niyet (randevu)",
        aiResponse: "Harika bir tarih. Ekim ortası yenidoğan çekimi için Standart ve Premium paketlerimiz uygun. Uygun olduğun günü paylaşırsan müsaitliği ayırıp taksit seçeneklerini iletebilirim."
      }
    },
    successStories: {
      pill: "Başarı Hikayeleri",
      title: "Büyüyen işletmeler <br/> Qualy ile kazanıyor",
      subtitle: "Qualy kullanarak müşteri elemeyi ve desteği otomatize eden yüzlerce hızlı büyüyen profesyonelden biri ol.",
      stories: [
        {
          text: "Eskiden gün boyu aynı fiyat ve randevu sorularına dönüyordum. Qualy ilk konuşmayı toparlıyor, ben sadece gerçekten dönüşecek müşterilere odaklanıyorum.",
          author: "Ahmet Yılmaz",
          role: "Kombi Servis Ustası, Ankara"
        },
        {
          text: "Instagram kampanyasından sonra WhatsApp patlıyordu. Qualy gelen talepleri niyete göre ayırınca boş mesajlarla uğraşmayı bıraktık.",
          author: "Zeynep Kara",
          role: "Güzellik Salonu Sahibi, İzmir"
        },
        {
          text: "Hastalar gece saatlerinde fiyat ve uygunluk soruyor. Qualy standart soruları doğru yanıtlıyor, ekibimiz sabah sadece kritik talepleri görüyor.",
          author: "Emre Demir",
          role: "Diş Kliniği Koordinatörü, Bursa"
        },
        {
          text: "Ders aralarında telefona bakamadığım için deneme dersi taleplerini kaçırıyordum. Şimdi Qualy soruları cevaplıyor, ben hazır adaylarla görüşüyorum.",
          author: "Merve Aydın",
          role: "Pilates Stüdyo İşletmecisi, İstanbul"
        },
        {
          text: "İlan sonrası yüzlerce mesaj geliyor ama hepsi alıcı değil. Qualy ciddi alıcıyı öne çıkarıyor, günüm çok daha verimli geçiyor.",
          author: "Burak Çetin",
          role: "Emlak Danışmanı, Antalya"
        },
        {
          text: "Yeni danışanlar terapi süreci ve ücret konusunda benzer sorular soruyor. Qualy bu kısmı sakin ve net şekilde yönetiyor.",
          author: "Elif Şahin",
          role: "Psikolog, Kadıköy"
        },
        {
          text: "Veliler akşam saatlerinde sürekli seviye, program ve ücret soruyor. Qualy ön görüşmeyi tamamlıyor, biz eğitim planına odaklanıyoruz.",
          author: "Okan Arslan",
          role: "Özel Ders Merkezi Sahibi, Eskişehir"
        },
        {
          text: "Ekspertiz öncesi araç bilgisi toplamak zaman alıyordu. Qualy marka, model ve randevu bilgisini baştan aldığı için süreç hızlandı.",
          author: "Seda Koç",
          role: "Oto Ekspertiz İşletmecisi, Konya"
        },
        {
          text: "Yaz aylarında klima talepleri bir anda artıyor. Qualy acil işleri öne alıyor, ekibimiz gün içinde daha fazla işi tamamlıyor.",
          author: "Halil Tunç",
          role: "Klima Servis Ekibi Lideri, Adana"
        },
        {
          text: "Çiftler gece geç saatlerde paket ve teslim tarihi soruyor. Qualy detayları topluyor, sabah net taleplerle güne başlıyorum.",
          author: "Nazlı Güneş",
          role: "Düğün Fotoğrafçısı, Muğla"
        },
        {
          text: "Tek başıma danışmanlık verdiğim için ilk mesajları kaçırıyordum. Qualy ön eleme yapınca satış görüşmelerine daha hazırlıklı giriyorum.",
          author: "Kaan Yıldız",
          role: "Yazılım Danışmanı, İzmit"
        },
        {
          text: "Hayvan sahiplerinden gün içinde çok farklı konularda mesaj geliyor. Qualy temel soruları karşıladığı için acil vakalara daha hızlı dönüyoruz.",
          author: "Derya Aksoy",
          role: "Veteriner Kliniği Sorumlusu, Denizli"
        },
        {
          text: "Tesisat işinde hız her şey. Qualy adres, arıza tipi ve uygun saat bilgisini topluyor; biz de doğrudan işe çıkıyoruz.",
          author: "Sinan Eren",
          role: "Su Tesisatı Ustası, Mersin"
        },
        {
          text: "Kurs kayıt döneminde mesaj trafiği iki katına çıkıyor. Qualy seviye tespiti ve ücret sorularını yanıtlayınca kayıt ekibi rahatladı.",
          author: "İrem Özcan",
          role: "Dil Kursu Müdürü, Gaziantep"
        },
        {
          text: "Taşınma taleplerinde tarih ve eşya detayını eksik almak bizi yavaşlatıyordu. Qualy tüm bilgiyi başta topladığı için planlama çok daha temiz ilerliyor.",
          author: "Tolga Ünver",
          role: "Taşımacılık Operasyon Sorumlusu, İstanbul"
        }
      ]
    },
    impactMetrics: {
      title: "Qualy ile iyileşen metrikler",
      subtitle: "İlk yanıt hızından lead kalitesine kadar, dönüşümü ve ekip verimini etkileyen rakamları birlikte yukarı taşırız.",
      ctaText: "Qualy ile sonuçlarını büyütmeye hazır mısın?",
      ctaPrimary: "Ücretsiz denemeni başlat",
      items: [
        {
          value: "-78%",
          label: "Daha hızlı ilk yanıt süresi",
          detail: "İlk seviye otomatik yanıtlar, ekip devralmadan önce bekleme süresini ciddi şekilde düşürür."
        },
        {
          value: "+42%",
          label: "Daha fazla nitelikli lead",
          detail: "Niyet skoru, satışa en yakın konuşmaları hızlı takip için öne çıkarır."
        },
        {
          value: "-61%",
          label: "Daha az tekrarlı mesaj yükü",
          detail: "Yetenekler ve Bilgi Bankası, rutin soruları manuel efor olmadan karşılar."
        },
        {
          value: "+29%",
          label: "Daha yüksek randevuya dönüşüm",
          detail: "Sıcak takip akışı, yüksek niyetli adayları daha hızlı şekilde randevuya taşır."
        }
      ]
    },
    challenges: {
      title_part1: "Rolünü seç,",
      title_part2: "Qualy farkını canlı gör",
      subtitle: "Kendi iş akışına en yakın rolü aç ve Qualy'nin mesaj yükünü nasıl azaltıp daha çok sonuç ürettiğini gör.",
      ctaHint: "Rolünü seç, Qualy'nin daha çok randevu getiren akışını gör ve ücretsiz denemeyi başlat.",
      ctaPrimary: "Ücretsiz dene",
      roles: {
        founders: "İşletme Sahibi",
        customerSuccess: "Destek",
        sales: "Satış / Randevu",
        marketing: "Pazarlama"
      },
      cards: {
        founders: {
          headline: "İşletme sahibiysen, ilk haftada mesaj yükünün nasıl azaldığını gör.",
          compact: "Daha az mesaj, daha net fırsat.",
          desc: "Qualy ilk mesajları otomatik yönetir, yüksek niyetli konuşmaları öne çıkarır. Sen sadece karar aşamasındaki müşterilere odaklanır, daha hızlı sonuç alırsın."
        },
        customerSuccess: {
          headline: "Destek tarafında bekleyen mesajları azalt, sıcak konuşmaları kaçırma.",
          compact: "Kuyruk kısalsın, hız artsın.",
          desc: "Qualy fiyat, müsaitlik ve politika sorularını anında yanıtlar. Ekip yalnızca kritik konuşmaları devralır; satışa yakın müşteriler beklemeden ilerler."
        },
        sales: {
          headline: "Sıcak konuşmaları ilk sıraya al, takvimini daha hızlı doldur.",
          compact: "Sıcak konuşmaları öncele.",
          desc: "Qualy her konuşmadan niyet ve aciliyet sinyallerini otomatik skorlar. Ekip doğru kişiye doğru anda döner; takip hızı ve randevu oranı yükselir."
        },
        marketing: {
          headline: "Pazarlama trafiğini boşa harcama, tıklamayı fırsata çevir.",
          compact: "Tıklamayı fırsata çevir.",
          desc: "Qualy kampanyadan gelen mesajlara saniyeler içinde yanıt verir, kritik bilgileri toplar. Trafik soğumadan nitelikli konuşmalar satışa akar."
        }
      }
    },
    integrations: {
      trustedBy: "Modern servis ekipleri için geliştirildi"
    },
    features: {
      heading: "Yoğun mesaj trafiğini düzenli bir müşteri akışına çevir.",
      heading_mobile: "Yoğun mesaj trafiğini düzenli akışa çevir.",
      subheading: "Qualy, tüm konuşmalarını tek yerde toplar; yapay zeka ile yanıt verir, niyeti puanlar ve yalnızca doğru konuşmalara odaklanmanı sağlar.",
      feat1_title: "Koda dokunmadan işletmeni Qualy'ye öğret. 5 dk'da hazır",
      feat1_title_highlight: "5 dk'da hazır",
      feat1_desc1: "İşletmenle ilgili dokümanlarını ve hazır yanıtlarını ekle. Qualy bunları referans alarak tutarlı yanıt verir.",
      feat1_desc2: "Teknik kurulum gerekmez.",
      feat1_mockup_source: "Kurulum akışı",
      feat1_mockup_synced: "Hızlı kurulum",
      feat1_mockup_processed: "Canlı",
      feat1_mockup_quote: "\"Kod yok. Ayar paneliyle öğret, Qualy otomatik uygulasın.\"",
      feat1_mockup_no_code: "Kod yok",
      feat1_mockup_step1: "Yetenek ekle",
      feat1_mockup_step2: "Bilgi yükle",
      feat1_mockup_step3: "Yayına al",
      feat1_mockup_skill_title: "Hazır yanıtlar (Yetenekler)",
      feat1_mockup_skill_detail: "Sık konular için tekrar kullanılabilir yanıtlar",
      feat1_mockup_kb_title: "Bilgi Bankası dokümanları",
      feat1_mockup_kb_detail: "İşletme referans içerikleri",
      feat1_mockup_kb_items: [
        "Hizmet kapsamı",
        "Fiyatlar ve paketler",
        "İptal politikası",
        "İade ve geri ödeme"
      ],
      feat1_mockup_skill_items: [
        "Müsaitlik ve randevu yanıtı",
        "Fiyat ve paket yanıtı",
        "Destek ve evrak talebi yanıtı"
      ],
      feat1_mockup_preview_label: "Canlı önizleme",
      feat1_mockup_preview_question: "Yarın için randevu var mı ve fiyatlar nasıl?",
      feat1_mockup_preview_answer: "Müsaitlik ve fiyatı bu akışta paylaşabilirim. İstersen uygun saatleri hemen listeleyeyim.",
      feat2_title: "Qualy yapay zeka ile mesajları cevaplar ve otomatik skor üretir",
      feat2_title_highlight: "yapay zeka ile",
      feat2_desc: "Her yeni müşteri mesajı kişi çıkarımı ve 0-10 niyet skoru üretir. Aciliyeti, hizmet uyumunu ve takip önceliğini tek bakışta gör.",
      feat2_li1: "<span><strong class=\"text-slate-900\">Düşük niyet:</strong> Erken araştırma veya belirsiz talepler AI akışında kalır.</span>",
      feat2_li2: "<span><strong class=\"text-slate-900\">Yüksek niyet:</strong> Net hizmet + zaman sinyalleri anında insan takibine çıkar.</span>",
      feat2_mockup_potential: "Müşteri Potansiyeli",
      feat2_mockup_processing: "Çıkarım yapılıyor",
      feat2_mockup_done: "Çıkarım tamamlandı",
      feat2_mockup_analysis: "Çıkarım durumu",
      feat2_mockup_check1: "Hizmet ihtiyacı yakalandı",
      feat2_mockup_check2: "Aciliyet algılandı",
      feat2_mockup_check3: "Karar sinyali tespit edildi",
      feat2_mockup_btn: "Konuşmayı aç",
      feat3_title: "Tüm konuşmalar tek ekranda",
      feat3_title_highlight: "tek ekranda",
      feat3_desc1: "WhatsApp, Instagram, Telegram ve Messenger mesajlarını tek ekrandan yönet. Kanalları dakikalar içinde bağla, uygulama değiştirmeden yanıtla.",
      feat3_desc2: "Bağlantı çok kolay, gelen kutusu tek merkezde kalır.",
      feat3_mockup_focus: "Birleşik gelen kutusu",
      feat3_mockup_easy: "Dakikalar içinde bağlantı",
      feat3_mockup_connected: "Bağlı",
      feat3_mockup_connect: "Bağla",
      feat3_mockup_voice: "Ses mesajı alındı (oto-yanıt akışı dışında)",
      feat3_mockup_image: "Görsel alındı (oto-yanıt akışı dışında)",
      feat3_mockup_hidden: "Tüm mesajlar tek gelen kutusunda toplanır.",
      feat4_title: "Gerekli durumlarda insan devri",
      feat4_title_highlight: "insan devri",
      feat4_desc: "Qualy rutin mesajları yönetir; gerektiğinde konuşma insana devredilir. Tek tıkla devral, uygun olduğunda AI akışına geri ver.",
      feat4_badges: [
        "İnsan devri tetikleyicileri",
        "Tek tıkla devral",
        "AI akışına geri ver",
        "Konuşma geçmişi korunur",
        "Yüksek niyet uyarıları",
        "TR/EN yerelleştirme"
      ],
      feat5_title: "Qualy hizmet profilini çıkarır ve eksik bilgileri müşteriyle otomatik netleştirir",
      feat5_title_highlight: "otomatik netleştirir",
      feat5_desc: "Qualy, yüklediğin Bilgi Bankası dokümanlarını tarayarak işletme ve hizmet profilini oluşturur, toplanması gereken kritik bilgileri belirler. Ardından konuşma içinde yapay zeka doğal takip soruları sorarak eksik bilgileri tamamlar.",
      feat5_mockup_title: "Kişi Profili Özeti",
      feat5_mockup_title_tag: "(AI çıkarımı)",
      feat5_mockup_badge: "Otomatik güncelleniyor",
      feat5_mockup_service_label: "Hizmet",
      feat5_mockup_service_value: "Yenidoğan çekimi",
      feat5_mockup_date_label: "Tarih",
      feat5_mockup_date_value: "Ekim ortası",
      feat5_mockup_budget_label: "Bütçe",
      feat5_mockup_budget_value: "Bütçe hassas",
      feat5_mockup_location_label: "Konum",
      feat5_mockup_location_value: "Kadıköy, İstanbul",
      feat5_mockup_missing_label: "AI takip sorusu",
      feat5_mockup_missing_value: "Tercih edilen günü netleştiriyor"
    },
    howItWorks: {
      title: "Dakikalar içinde başla, gelen mesajları Qualy yönetsin",
      subtitle: "Kanalları bağla, Qualy'i birkaç tıkla eğit, ardından Qualy yapay zeka mesajları otomatik yanıtlasın.",
      step1_title: "Kanalları kolayca bağla",
      step1_desc: "WhatsApp, Instagram, Telegram ve Messenger kanallarını birkaç adımda bağla. Kanallar bağımsız kalır, tüm konuşmalar tek gelen kutusunda görünür.",
      step2_title: "Qualy'i birkaç tıkla eğit",
      step2_desc: "Hizmet, fiyat ve politika içeriklerini yükle; hazır yanıtlarını tanımla. Qualy bu içeriği referans alarak tutarlı yanıtlar üretir.",
      step3_title: "Qualy AI yanıtlasın",
      step3_desc: "Qualy rutin mesajları anında yanıtlar, skorları günceller ve önemli konuşmaları işaretler. Yalnızca gerçekten müdahale gereken anlarda devreye girersin."
    },
    pricing: {
      title: "Pratik bir MVP paketi.",
      subtitle: "Otomatik ilk temas mesajlaşması ve lead qualification için gereken her şey.",
      monthly: "Aylık",
      yearly: "Yıllık",
      save: "%20 İndirim",
      professional: {
        title: "Profesyonel",
        desc: "WhatsApp odaklı satış ve destek yürüten servis ekipleri için.",
        priceMonthly: "$79/ay",
        priceYearly: "$69/ay",
        cta: "14 gün ücretsiz dene",
        features: [
            "WhatsApp, Instagram ve Telegram gelen kutusu",
            "Yetenekler + Bilgi Bankası otomatik yanıtları",
            "Yapay zeka lead extraction ve 0-10 skorlama",
            "İnsan Devralma ve eskalasyon kontrolleri",
            "Versiyonlu politika sayfalarıyla yasal merkez"
        ]
      },
      enterprise: {
        title: "Gelişmiş",
        desc: "Özel kurulum ihtiyaçları için.",
        price: "Özel",
        cta: "Satışla İletişime Geç",
        features: [
            "Profesyonel paketteki her şey",
            "Kurulum planlama desteği",
            "Özel iş akışı uyarlaması",
            "Öncelikli yol haritası geri bildirimi",
            "Özel onboarding desteği"
        ]
      }
    },
    cta: {
      title: "Mesaj trafiğini temiz bir akışa çevirmeye hazır mısın?",
      desc: "Tekrarlayan mesajları otomatik yanıtla, adayları erken nitelendir ve yüksek niyetli konuşmaları doğru anda devral.",
      primary: "Ücretsiz Denemeyi Başlat",
      secondary: "Satışla Konuş",
      note: "14 gün ücretsiz deneme • İstediğin zaman iptal et"
    },
    faq: {
      eyebrow: "SSS",
      title: "Sıkça Sorulan Sorular",
      subtitle: "Qualy'nin ne yaptığı, nasıl başladığın ve güvenlik yaklaşımıyla ilgili en sık soruları burada bulabilirsin.",
      primary: "Ücretsiz dene",
      secondary: "Bize Ulaş",
      items: [
        {
          question: "Bu platform tam olarak ne yapar?",
          answer: "Qualy, WhatsApp, Instagram ve Telegram'daki tekrar eden müşteri mesajlarını otomatik yanıtlar; aday bilgilerini çıkarır ve 0-10 niyet puanıyla hangi konuşmaya önce bakman gerektiğini gösterir."
        },
        {
          question: "Nasıl başlarım?",
          answer: "Kanallarını bağla, hizmet ve politika dokümanlarını Bilgi Bankası'na yükle, birkaç hazır yanıt kuralı ekle. Sonra Qualy dakikalar içinde yanıt akışını çalıştırır."
        },
        {
          question: "Şu anda hangi kanallar destekleniyor?",
          answer: "Şu anda WhatsApp, Instagram ve Telegram tek panelde yönetilir. Messenger kanal kartı yol haritasında 'Çok Yakında' olarak yer alır."
        },
        {
          question: "Aday puanlaması nasıl çalışır?",
          answer: "Qualy, hizmet netliği, tarih, bütçe uyumu, aciliyet ve karar sinyallerini birlikte değerlendirir; her yeni müşteri mesajında 0-10 puanı günceller."
        },
        {
          question: "Müşteri verileri güvenli mi?",
          answer: "Kuruluş verileri birbirinden izole edilir, yasal metinler sürüm takibiyle yayınlanır ve insan devralma kontrolleriyle yapay zeka yanıtını istediğin an durdurabilirsin."
        },
        {
          question: "Ekibim konuşmayı istediği an devralabilir mi?",
          answer: "Evet. Konuşmayı tek tıkla insana devredebilir, geçmişi aynı ekranda koruyabilir ve hazır olduğunda AI akışına geri dönebilirsin."
        }
      ]
    },
    footer: {
      desc: "Servis işletmen için AI öncelikli gelen kutu. Yanıtları otomatikleştir, adayları nitelendir ve doğru anda devral.",
      product: "Ürün",
      resources: "Kaynaklar",
      company: "Şirket",
      features: "Özellikler",
      leadScoring: "Müşteri Yorumları",
      updates: "Nasıl çalışır",
      docs: "Dokümantasyon",
      api: "API Referansı",
      community: "Topluluk",
      help: "Yardım Merkezi",
      about: "Hakkında",
      blog: "Blog",
      careers: "Kariyer",
      legal: "Yasal",
      legalCenter: "Yasal Merkez",
      privacy: "Gizlilik Politikası",
      terms: "Hizmet Şartları",
      rights: "Tüm hakları saklıdır."
    },
    legal: {
      center: "Yasal",
      centerTitle: "Gizlilik ve Şartlar Merkezi",
      centerDescription: "Gizlilik Politikası ve Hizmet Şartları dahil tüm yasal dokümanlara tek sayfadan erişebilirsin.",
      backToHome: "Ana Sayfaya Dön",
      lastUpdated: "Son güncelleme",
      version: "Versiyon",
      notFoundTitle: "Doküman bulunamadı",
      notFoundDescription: "Talep ettiğin yasal doküman şu anda mevcut değil."
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const locales =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return resolveLanguageByRegion(locales, timeZone);
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
