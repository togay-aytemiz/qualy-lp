import React, { createContext, useState, useContext, ReactNode } from 'react';
import { resolveLanguageByRegion } from './lib/region-language';

type Language = 'en' | 'tr';

interface Translations {
  navbar: {
    features: string;
    howItWorks: string;
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
      priorityInbox: string;
      readyToSign: string;
      hours: string;
      unknown: string;
      activeNow: string;
      leadScore: string;
      takeOver: string;
      today: string;
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
    roles: {
      founders: string;
      customerSuccess: string;
      sales: string;
      marketing: string;
    };
    cards: {
      founders: {
        headline: string;
        desc: string;
      };
      customerSuccess: {
        headline: string;
        desc: string;
      };
      sales: {
        headline: string;
        desc: string;
      };
      marketing: {
        headline: string;
        desc: string;
      };
    };
  };
  integrations: {
    trustedBy: string;
  };
  features: {
    heading: string;
    subheading: string;
    feat1_title: string;
    feat1_desc1: string;
    feat1_desc2: string;
    feat1_mockup_source: string;
    feat1_mockup_synced: string;
    feat1_mockup_processed: string;
    feat1_mockup_quote: string;
    feat2_title: string;
    feat2_desc: string;
    feat2_li1: string;
    feat2_li2: string;
    feat2_mockup_potential: string;
    feat2_mockup_analysis: string;
    feat2_mockup_check1: string;
    feat2_mockup_check2: string;
    feat2_mockup_check3: string;
    feat2_mockup_btn: string;
    feat3_title: string;
    feat3_desc1: string;
    feat3_desc2: string;
    feat3_mockup_focus: string;
    feat3_mockup_voice: string;
    feat3_mockup_image: string;
    feat3_mockup_hidden: string;
    feat4_title: string;
    feat4_desc: string;
    feat4_badges: string[];
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
        priorityInbox: "Priority Inbox",
        readyToSign: "Ready to book, needs invoice details",
        hours: "Do you have availability this week?",
        unknown: "Unknown",
        activeNow: "via WhatsApp • Active now",
        leadScore: "Lead Score",
        takeOver: "Take Over",
        today: "Today",
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
      title_part1: "Manual messaging creates",
      title_part2: "costly bottlenecks",
      subtitle: "The same issue appears in every small team: too many repetitive chats, not enough time for high-intent leads.",
      roles: {
        founders: "Owner / Founder",
        customerSuccess: "Front Desk / Support",
        sales: "Sales / Booking",
        marketing: "Growth / Ads"
      },
      cards: {
        founders: {
          headline: "Growth stalls when the owner is in the inbox.",
          desc: "If every first reply needs you, scaling means longer days. Qualy handles repetitive intake so you can focus on delivery and hiring."
        },
        customerSuccess: {
          headline: "Repetitive questions consume the whole shift.",
          desc: "Pricing, availability, policy, cancellation: the same thread repeats all day. Automating first-line replies reduces queue pressure."
        },
        sales: {
          headline: "High-intent leads get buried in noise.",
          desc: "Not every chat is ready to buy. Lead scoring surfaces urgency, service fit, and intent so your team calls the right people first."
        },
        marketing: {
          headline: "Ad spend is wasted on slow responses.",
          desc: "Campaigns bring traffic, but conversion drops if responses lag. Qualy replies instantly and keeps conversations warm until handover."
        }
      }
    },
    integrations: {
      trustedBy: "Built for modern service teams"
    },
    features: {
      heading: "Built for WhatsApp-first teams,<br/>not bloated helpdesks.",
      subheading: "Qualy keeps the MVP focused: text-first channels, grounded answers, lead scoring, and a clean inbox your team can act on fast.",
      feat1_title: "Train once with Skills + Knowledge Base",
      feat1_desc1: "Add service FAQs, pricing docs, and response playbooks. Qualy uses your own content to answer consistently.",
      feat1_desc2: "When no skill matches, Qualy falls back to your Knowledge Base and asks one clarifying question instead of guessing.",
      feat1_mockup_source: "Knowledge Source",
      feat1_mockup_synced: "Last synced: Just now",
      feat1_mockup_processed: "Indexed",
      feat1_mockup_quote: "\"Grounded answers from your own business context.\"",
      feat2_title: "Score lead intent before you jump in",
      feat2_desc: "Every new customer message triggers lead extraction and scoring (0-10). See urgency, service fit, and follow-up priority at a glance.",
      feat2_li1: "<span><strong class=\"text-slate-900\">Low intent:</strong> Early research or vague requests stay in AI flow.</span>",
      feat2_li2: "<span><strong class=\"text-slate-900\">High intent:</strong> Clear service + timeline signals are escalated for immediate follow-up.</span>",
      feat2_mockup_potential: "Lead Potential",
      feat2_mockup_analysis: "Extraction complete",
      feat2_mockup_check1: "Service need captured",
      feat2_mockup_check2: "Timeline or urgency detected",
      feat2_mockup_check3: "Decision readiness signaled",
      feat2_mockup_btn: "Open thread",
      feat3_title: "Text-first inbox across channels",
      feat3_desc1: "MVP supports WhatsApp, Instagram, and Telegram as independent channels with reactive text replies.",
      feat3_desc2: "Your team can pause AI with Human Takeover, keep visibility in one inbox, and resume automation when ready.",
      feat3_mockup_focus: "Focus Mode",
      feat3_mockup_voice: "Voice message received (kept out of MVP auto-reply flow)",
      feat3_mockup_image: "Image received (kept out of MVP auto-reply flow)",
      feat3_mockup_hidden: "Text-first routing keeps replies predictable.",
      feat4_title: "Built-in MVP guardrails",
      feat4_desc: "Use Active/Shadow/Off modes, skill-triggered handover, and lead-threshold escalation to control when AI replies and when humans step in.",
      feat4_badges: [
        "Human Takeover",
        "Active / Shadow / Off",
        "Skill-based handover",
        "Hot lead alerts",
        "TR/EN localized replies",
        "Versioned legal center"
      ]
    },
    howItWorks: {
      title: "How Qualy runs your inbox",
      subtitle: "Setup is fast and scoped to MVP essentials.",
      step1_title: "Connect channels",
      step1_desc: "Connect WhatsApp and Instagram via Meta OAuth pop-up, then add Telegram. Channels stay independent but visible in one inbox.",
      step2_title: "Define responses",
      step2_desc: "Create skills, upload Knowledge Base content, and set required fields so Qualy can answer grounded questions and collect key details.",
      step3_title: "Monitor & take over",
      step3_desc: "Qualy replies reactively, updates lead scores, and flags high-intent chats. Your team can claim conversations anytime with Human Takeover."
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
      title: "Ready to run a cleaner inbox?",
      desc: "Automate repetitive messaging, qualify leads earlier, and let your team focus on conversations that convert.",
      primary: "Start Free Trial",
      secondary: "Talk to Sales",
      note: "14-day free trial • Cancel anytime"
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
      pricing: "Fiyatlandırma",
      login: "Giriş Yap",
      getStarted: "Ücretsiz Başla"
    },
    hero: {
      status: "Servis ekipleri için WhatsApp odaklı AI gelen kutusu",
      headline: "Anında yanıt verin. <br /> Ciddi adaylara odaklanın.",
      subheadline: "Qualy, WhatsApp, Instagram ve Telegram konuşmalarındaki tekrar eden soruları Skills + Bilgi Bankası ile otomatik yanıtlar, niyeti 1-10 puanlar ve doğru anda ekibinize devreder.",
      ctaPrimary: "Ücretsiz Denemeyi Başlat",
      ctaSecondary: "Panele Git",
      connects: "Dakikalar içinde bağlanır",
      noCard: "Kredi kartı gerekmez",
      mockup: {
        dashboard: "Qualy Paneli",
        online: "Durum: Çevrimiçi",
        priorityInbox: "Öncelikli Kutu",
        readyToSign: "Randevuya hazır, fatura detayı bekliyor",
        hours: "Bu hafta uygunluğunuz var mı?",
        unknown: "Bilinmiyor",
        activeNow: "WhatsApp ile • Aktif",
        leadScore: "Müşteri Skoru",
        takeOver: "Devral",
        today: "Bugün",
        customerMsg: "Merhaba, Ekim ortası için yenidoğan çekimi istiyorum. Hangi paket uygun olur ve taksit seçeneğiniz var mı?",
        aiDetected: "Qualy tespiti:",
        intent: "Yüksek niyet (randevu)",
        aiResponse: "Harika bir tarih. Ekim ortası yenidoğan çekimi için Standart ve Premium paketlerimiz uygun. Uygun olduğunuz günü paylaşırsanız müsaitliği ayırıp taksit seçeneklerini iletebilirim."
      }
    },
    successStories: {
      pill: "Başarı Hikayeleri",
      title: "Büyüyen işletmeler <br/> Qualy ile kazanıyor",
      subtitle: "Qualy kullanarak müşteri elemeyi ve desteği otomatize eden yüzlerce hızlı büyüyen profesyonele katılın.",
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
          detail: "Skills ve Bilgi Bankası, rutin soruları manuel efor olmadan karşılar."
        },
        {
          value: "+29%",
          label: "Daha yüksek randevuya dönüşüm",
          detail: "Sıcak takip akışı, yüksek niyetli adayları daha hızlı şekilde randevuya taşır."
        }
      ]
    },
    challenges: {
      title_part1: "Manuel mesajlaşma",
      title_part2: "kritik darboğaz yaratıyor",
      subtitle: "Küçük ekiplerde aynı sorun tekrar ediyor: çok fazla tekrarlayan sohbet, yüksek niyetli adaylara az zaman.",
      roles: {
        founders: "İşletme Sahibi",
        customerSuccess: "Ön Büro / Destek",
        sales: "Satış / Randevu",
        marketing: "Pazarlama / Büyüme"
      },
      cards: {
        founders: {
          headline: "Sahip gelen kutusuna sıkışınca büyüme durur.",
          desc: "Her ilk yanıt size bağlıysa ölçeklenmek daha uzun mesai demektir. Qualy tekrarlayan ön görüşmeyi devralır, siz teslimat ve büyümeye odaklanırsınız."
        },
        customerSuccess: {
          headline: "Tekrarlayan sorular tüm vardiyayı tüketiyor.",
          desc: "Fiyat, müsaitlik, iptal, politika: aynı konuşma gün boyu dönüyor. İlk seviye yanıtların otomasyonu kuyruk baskısını azaltır."
        },
        sales: {
          headline: "Yüksek niyetli adaylar gürültüde kayboluyor.",
          desc: "Her sohbet satışa hazır değildir. Lead scoring; aciliyet, hizmet uyumu ve niyeti öne çıkarır, ekip doğru kişileri önce arar."
        },
        marketing: {
          headline: "Yavaş yanıtlar reklam bütçesini yakıyor.",
          desc: "Kampanyalar trafik getirir ama yanıt gecikirse dönüşüm düşer. Qualy anında cevap verip konuşmayı devre kadar sıcak tutar."
        }
      }
    },
    integrations: {
      trustedBy: "Modern servis ekipleri için geliştirildi"
    },
    features: {
      heading: "Şişkin helpdeskler için değil,<br/>WhatsApp odaklı ekipler için.",
      subheading: "Qualy, MVP'yi net tutar: metin odaklı kanallar, kaynaklı yanıtlar, lead scoring ve ekibinizin hızlı aksiyon alabileceği temiz bir gelen kutusu.",
      feat1_title: "Skills + Bilgi Bankası ile tek seferde öğretin",
      feat1_desc1: "Hizmet SSS'lerini, fiyat dokümanlarını ve yanıt playbook'larını ekleyin. Qualy kendi içeriğinizle tutarlı yanıt verir.",
      feat1_desc2: "Uygun skill bulunmazsa Qualy Bilgi Bankası'na düşer ve tahmin etmek yerine tek bir netleştirici soru sorar.",
      feat1_mockup_source: "Bilgi Kaynağı",
      feat1_mockup_synced: "Senkronize: Az önce",
      feat1_mockup_processed: "İndekslendi",
      feat1_mockup_quote: "\"Kendi iş bağlamınızdan beslenen kaynaklı yanıtlar.\"",
      feat2_title: "Müdahale etmeden önce niyeti puanlayın",
      feat2_desc: "Her yeni müşteri mesajı lead extraction ve 0-10 skorlama tetikler. Aciliyeti, hizmet uyumunu ve takip önceliğini tek bakışta görün.",
      feat2_li1: "<span><strong class=\"text-slate-900\">Düşük niyet:</strong> Erken araştırma veya belirsiz talepler AI akışında kalır.</span>",
      feat2_li2: "<span><strong class=\"text-slate-900\">Yüksek niyet:</strong> Net hizmet + zaman sinyalleri anında insan takibine çıkar.</span>",
      feat2_mockup_potential: "Müşteri Potansiyeli",
      feat2_mockup_analysis: "Çıkarım tamamlandı",
      feat2_mockup_check1: "Hizmet ihtiyacı yakalandı",
      feat2_mockup_check2: "Zamanlama veya aciliyet algılandı",
      feat2_mockup_check3: "Karar sinyali tespit edildi",
      feat2_mockup_btn: "Konuşmayı aç",
      feat3_title: "Kanallar arası metin odaklı gelen kutusu",
      feat3_desc1: "MVP'de WhatsApp, Instagram ve Telegram bağımsız kanallar olarak metin tabanlı reactive yanıtlarla çalışır.",
      feat3_desc2: "Ekibiniz Human Takeover ile AI'yi durdurabilir, tek gelen kutusunda görünürlüğü korur ve hazır olduğunda otomasyona geri döner.",
      feat3_mockup_focus: "Odak Modu",
      feat3_mockup_voice: "Ses mesajı alındı (MVP oto-yanıt akışı dışında)",
      feat3_mockup_image: "Görsel alındı (MVP oto-yanıt akışı dışında)",
      feat3_mockup_hidden: "Metin odaklı akış yanıt kalitesini öngörülebilir tutar.",
      feat4_title: "MVP için yerleşik kontrol katmanı",
      feat4_desc: "Active/Shadow/Off modları, skill tetikli devir ve hot lead eşiği ile AI'nin ne zaman konuşacağını siz belirlersiniz.",
      feat4_badges: [
        "Human Takeover",
        "Active / Shadow / Off",
        "Skill tetikli devir",
        "Sıcak lead uyarıları",
        "TR/EN yerelleştirme",
        "Versiyonlu yasal merkez"
      ]
    },
    howItWorks: {
      title: "Qualy gelen kutunuzu nasıl yönetir",
      subtitle: "Kurulum hızlıdır ve MVP ihtiyaçlarına odaklanır.",
      step1_title: "Kanalları bağla",
      step1_desc: "WhatsApp ve Instagram'ı Meta OAuth pop-up ile bağlayın, ardından Telegram ekleyin. Kanallar bağımsız kalır ama tek gelen kutusunda görünür.",
      step2_title: "Yanıtları tanımla",
      step2_desc: "Skill'leri oluşturun, Bilgi Bankası içeriğini yükleyin ve gerekli alanları belirleyin. Qualy kaynaklı yanıt verir ve kritik bilgileri toplar.",
      step3_title: "İzle ve devral",
      step3_desc: "Qualy reactive şekilde yanıtlar, lead skorlarını günceller ve yüksek niyetli konuşmaları işaretler. Ekibiniz istediği an Human Takeover ile konuşmayı devralabilir."
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
            "Skill + Bilgi Bankası otomatik yanıtları",
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
      title: "Daha temiz bir gelen kutusuna hazır mısın?",
      desc: "Tekrarlayan mesajları otomatikleştirin, adayları daha erken nitelendirin ve ekibinizin dönüşecek konuşmalara odaklanmasını sağlayın.",
      primary: "Ücretsiz Denemeyi Başlat",
      secondary: "Satışla Konuş",
      note: "14 gün ücretsiz deneme • İstediğiniz zaman iptal edin"
    },
    footer: {
      desc: "Servis işletmeleri için AI öncelikli gelen kutusu. Yanıtları otomatikleştirin, adayları nitelendirin ve doğru anda devralın.",
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
      centerDescription: "Gizlilik Politikası ve Hizmet Şartları dahil tüm yasal dokümanlara tek sayfadan erişebilirsiniz.",
      backToHome: "Ana Sayfaya Dön",
      lastUpdated: "Son güncelleme",
      version: "Versiyon",
      notFoundTitle: "Doküman bulunamadı",
      notFoundDescription: "Talep ettiğiniz yasal doküman şu anda mevcut değil."
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
