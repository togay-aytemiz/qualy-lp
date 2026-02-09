import React, { createContext, useState, useContext, ReactNode } from 'react';

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
    story1: {
      text: string;
      author: string;
      role: string;
    };
    story2: {
      text: string;
      author: string;
      role: string;
    };
    story3: {
      text: string;
      author: string;
      role: string;
    };
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
    privacy: string;
    terms: string;
    rights: string;
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
      status: "Accepting new accounts",
      headline: "Stop wasting time on <br /> unqualified leads.",
      subheadline: "The AI-first inbox for WhatsApp and Telegram. Qualy learns your business, qualifies your leads, and scores them 1-10—all before you even pick up your phone.",
      ctaPrimary: "Get Started",
      ctaSecondary: "Live Demo",
      connects: "Connects in 2 minutes",
      noCard: "No credit card required",
      mockup: {
        dashboard: "Qualy Dashboard",
        online: "Status: Online",
        priorityInbox: "Priority Inbox",
        readyToSign: "Ready to sign, just need the...",
        hours: "What are your hours?",
        unknown: "Unknown",
        activeNow: "via WhatsApp • Active now",
        leadScore: "Lead Score",
        takeOver: "Take Over",
        today: "Today",
        customerMsg: "Hello, I saw your consulting packages. We are a team of 10 looking for the 'Scale' package. Can we pay via invoice?",
        aiDetected: "Qualy detected:",
        intent: "High Intent (Buying)",
        aiResponse: "Hi Murat! Yes, for the Scale package, we absolutely accept invoice payments. Since you have a team of 10, you might also qualify for our volume discount. Would you like me to send over a proforma invoice?"
      }
    },
    successStories: {
      pill: "Success Stories",
      title: "Scaling businesses are <br/> already succeeding with Qualy",
      subtitle: "Join hundreds of fast-growing service professionals using Qualy to automate their lead qualification and support.",
      story1: {
        text: "Qualy has been essential to our growth. It manages hundreds of initial inquiries every month, qualifying leads and scheduling appointments without us lifting a finger.",
        author: "Jacob Banks",
        role: "CEO & Co-Founder at Sophiiie AI"
      },
      story2: {
        text: "Qualy helped us move our client intake from manual to AI-led. Customers get instant answers about our packages, freeing our team to focus on high-value strategy.",
        author: "Mark Deacon",
        role: "Chief Commercial Officer at Canibuild"
      },
      story3: {
        text: "Our consulting services are complex, but Qualy explains them perfectly. It makes our expertise accessible 24/7, and for the first time, we're closing deals while we sleep.",
        author: "Jonny Mousdell",
        role: "Co-Founder at H2X"
      }
    },
    challenges: {
      title_part1: "Creating challenges",
      title_part2: "all across the organization",
      subtitle: "Every team feels the pain in a different way, but it's all caused by the same bottleneck: manual messaging.",
      roles: {
        founders: "Founders",
        customerSuccess: "Customer Success",
        sales: "Sales Leaders",
        marketing: "Marketing"
      },
      cards: {
        founders: {
          headline: "Growth demands more headcount.",
          desc: "You can't scale if every new lead requires a human to answer. Founders get trapped in the inbox instead of building the business."
        },
        customerSuccess: {
          headline: "Endless hand-holding drains bandwidth.",
          desc: "Answering 'how much does this cost?' 50 times a day isn't support. It's distraction. Your team burns out on repetitive queries."
        },
        sales: {
          headline: "High-intent leads slip through the cracks.",
          desc: "Speed to lead is everything. If you don't reply in 5 minutes, you lose the deal. Humans sleep; Qualy doesn't."
        },
        marketing: {
          headline: "More traffic, less retention.",
          desc: "You pay for ads, but users bounce when they don't get instant answers. Nurture campaigns try to fix gaps, but conversation is king."
        }
      }
    },
    integrations: {
      trustedBy: "Trusted by next-gen support teams"
    },
    features: {
      heading: "Built for service professionals,<br/>not support centers.",
      subheading: "Qualy strips away the complexity of enterprise tools. No tickets, no team management, no clutter. Just you, your expertise, and your best clients.",
      feat1_title: "Create your own expert",
      feat1_desc1: "You don't need to write complex scripts. Just upload your service list, pricing PDF, or past conversations.",
      feat1_desc2: "Qualy digests this information to become your clone—answering questions accurately, handling objections, and citing your own documents.",
      feat1_mockup_source: "Knowledge Source",
      feat1_mockup_synced: "Last synced: Just now",
      feat1_mockup_processed: "Processed",
      feat1_mockup_quote: "\"Qualy now knows your business as well as you do.\"",
      feat2_title: "Turn time into money",
      feat2_desc: "Not all messages are equal. Qualy analyzes every incoming chat for intent (buying, browsing, support) and assigns a score from 1-10.",
      feat2_li1: "<span><strong class=\"text-slate-900\">Low Score:</strong> \"How much?\" (Browsing) → Qualy nurtures automatically.</span>",
      feat2_li2: "<span><strong class=\"text-slate-900\">High Score:</strong> \"I want to start today.\" (Buying) → You get an instant alert.</span>",
      feat2_mockup_potential: "Lead Potential",
      feat2_mockup_analysis: "Analysis complete",
      feat2_mockup_check1: "Explicit budget mentioned",
      feat2_mockup_check2: "Urgency detected (\"Start ASAP\")",
      feat2_mockup_check3: "Decision maker confirmed",
      feat2_mockup_btn: "Open Conversation",
      feat3_title: "Just text. Just business.",
      feat3_desc1: "We made a bold choice: Qualy's unified inbox is text-first. No stickers, no GIFs, no distracted team chats.",
      feat3_desc2: "We abstract away the noise so you can scan 50 conversations in 5 minutes and focus only on the ones that pay.",
      feat3_mockup_focus: "Focus Mode",
      feat3_mockup_voice: "Sent a voice note (Transcribed: \"I need this by Friday\")",
      feat3_mockup_image: "Sent an image (Analyzed: Screenshot of error 404)",
      feat3_mockup_hidden: "Media hidden to keep you focused."
    },
    howItWorks: {
      title: "How Qualy Works",
      subtitle: "Setup takes less than 5 minutes. No coding required.",
      step1_title: "Connect",
      step1_desc: "Link your WhatsApp Business and Telegram accounts with one click via QR code. Your existing chats sync instantly.",
      step2_title: "Teach",
      step2_desc: "Upload your pricing PDF, service catalog, or website URL. Qualy reads it in seconds and builds a custom knowledge base.",
      step3_title: "Qualify",
      step3_desc: "Sit back. Qualy engages every lead, scores them, and notifies you only when a high-value prospect is ready to buy."
    },
    pricing: {
      title: "One simple plan.",
      subtitle: "No complex tiers. Get the full power of Qualy.",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save 20%",
      professional: {
        title: "Professional",
        desc: "Everything you need to grow.",
        priceMonthly: "$79/mo",
        priceYearly: "$69/mo",
        cta: "Start 14-day free trial",
        features: [
            "Unlimited WhatsApp & Telegram chats",
            "Smart Knowledge Base (PDFs/URLs)",
            "AI Lead Scoring (1-10)",
            "Priority Inbox & Notifications",
            "Human Takeover Mode"
        ]
      },
      enterprise: {
        title: "Enterprise",
        desc: "For high-volume teams.",
        price: "Custom",
        cta: "Contact Sales",
        features: [
            "Everything in Professional",
            "Custom Integration Support",
            "SLA & Priority Support",
            "Dedicated Account Manager",
            "Custom AI Model Training"
        ]
      }
    },
    cta: {
      title: "Ready to automate the boring stuff?",
      desc: "Join 500+ companies using Relay to qualify leads and resolve support tickets faster than ever.",
      primary: "Get Started for Free",
      secondary: "Talk to Sales",
      note: "14-day free trial • No credit card required"
    },
    footer: {
      desc: "The AI-first inbox for service professionals. Qualify leads, automate answers, close more deals.",
      product: "Product",
      resources: "Resources",
      company: "Company",
      features: "Features",
      leadScoring: "Lead Scoring",
      updates: "Updates",
      docs: "Documentation",
      api: "API Reference",
      community: "Community",
      help: "Help Center",
      about: "About",
      blog: "Blog",
      careers: "Careers",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "All rights reserved."
    }
  },
  tr: {
    navbar: {
      features: "Özellikler",
      howItWorks: "Nasıl Çalışır",
      pricing: "Fiyatlandırma",
      login: "Giriş Yap",
      getStarted: "Hemen Başla"
    },
    hero: {
      status: "Yeni hesap alımı açık",
      headline: "Niteliksiz müşteri adaylarıyla <br /> zaman kaybetmeyin.",
      subheadline: "WhatsApp ve Telegram için yapay zeka öncelikli gelen kutusu. Qualy işinizi öğrenir, müşterileri eler ve 1-10 arası puanlar; siz telefonu elinize almadan önce.",
      ctaPrimary: "Hemen Başla",
      ctaSecondary: "Canlı Demo",
      connects: "2 dakikada bağlanır",
      noCard: "Kredi kartı gerekmez",
      mockup: {
        dashboard: "Qualy Paneli",
        online: "Durum: Çevrimiçi",
        priorityInbox: "Öncelikli Kutu",
        readyToSign: "İmzaya hazırım, sadece...",
        hours: "Çalışma saatleriniz nedir?",
        unknown: "Bilinmiyor",
        activeNow: "WhatsApp ile • Aktif",
        leadScore: "Müşteri Skoru",
        takeOver: "Devral",
        today: "Bugün",
        customerMsg: "Merhaba, danışmanlık paketlerinizi gördüm. 10 kişilik bir ekibiz ve 'Scale' paketiyle ilgileniyoruz. Fatura ile ödeme yapabilir miyiz?",
        aiDetected: "Qualy tespiti:",
        intent: "Yüksek Niyet (Satın Alma)",
        aiResponse: "Merhaba Murat! Evet, Scale paketi için faturalı ödeme kabul ediyoruz. 10 kişilik ekibiniz olduğu için hacim indiriminden de yararlanabilirsiniz. Proforma faturayı göndermemi ister misiniz?"
      }
    },
    successStories: {
      pill: "Başarı Hikayeleri",
      title: "Büyüyen işletmeler <br/> Qualy ile kazanıyor",
      subtitle: "Qualy kullanarak müşteri elemeyi ve desteği otomatize eden yüzlerce hızlı büyüyen profesyonele katılın.",
      story1: {
        text: "Qualy büyümemiz için vazgeçilmez oldu. Her ay yüzlerce ilk görüşmeyi yönetiyor, müşteri adaylarını eliyor ve biz parmağımızı bile kıpırdatmadan randevuları ayarlıyor.",
        author: "Jacob Banks",
        role: "CEO & Kurucu Ortak, Sophiiie AI"
      },
      story2: {
        text: "Qualy, müşteri kabul sürecimizi manuelden yapay zekaya taşımamıza yardımcı oldu. Müşterilerimiz paketlerimiz hakkında anında yanıt alıyor, ekibimiz ise stratejiye odaklanıyor.",
        author: "Mark Deacon",
        role: "Ticari Direktör, Canibuild"
      },
      story3: {
        text: "Danışmanlık hizmetlerimiz karmaşık, ama Qualy bunları mükemmel bir şekilde açıklıyor. Uzmanlığımızı 7/24 erişilebilir kılıyor ve ilk kez uyurken bile satış kapatıyoruz.",
        author: "Jonny Mousdell",
        role: "Kurucu Ortak, H2X"
      }
    },
    challenges: {
      title_part1: "Organizasyon genelinde",
      title_part2: "zorluklar yaratıyor",
      subtitle: "Her ekip bu acıyı farklı hissediyor, ancak hepsine aynı darboğaz neden oluyor: manuel mesajlaşma.",
      roles: {
        founders: "Kurucular",
        customerSuccess: "Müşteri Başarısı",
        sales: "Satış Liderleri",
        marketing: "Pazarlama"
      },
      cards: {
        founders: {
          headline: "Büyüme daha fazla personel gerektiriyor.",
          desc: "Her yeni potansiyel müşteri için bir insanın yanıt vermesi gerekiyorsa ölçeklenemezsiniz. Kurucular işi büyütmek yerine gelen kutusuna hapsoluyor."
        },
        customerSuccess: {
          headline: "Sonsuz el tutma bant genişliğini tüketiyor.",
          desc: "Günde 50 kez 'Bunun fiyatı ne kadar?' sorusuna cevap vermek destek değildir. Bu bir dikkat dağınıklığıdır. Ekibiniz tekrarlayan sorulardan tükeniyor."
        },
        sales: {
          headline: "Yüksek niyetli müşteriler çatlaklardan sızıyor.",
          desc: "Müşteriye dönüş hızı her şeydir. 5 dakika içinde cevap vermezseniz anlaşmayı kaybedersiniz. İnsanlar uyur; Qualy uyumaz."
        },
        marketing: {
          headline: "Daha fazla trafik, daha az elde tutma.",
          desc: "Reklamlar için para ödüyorsunuz, ancak kullanıcılar anında cevap alamayınca çıkıyor. Nurture kampanyaları boşlukları doldurmaya çalışır, ancak sohbet kraldır."
        }
      }
    },
    integrations: {
      trustedBy: "Yeni nesil destek ekiplerinin güvendiği markalar"
    },
    features: {
      heading: "Destek merkezleri için değil,<br/>hizmet profesyonelleri için.",
      subheading: "Qualy, kurumsal araçların karmaşıklığını ortadan kaldırır. Bilet yok, ekip yönetimi yok, kalabalık yok. Sadece siz, uzmanlığınız ve en iyi müşterileriniz.",
      feat1_title: "Kendi uzmanınızı yaratın",
      feat1_desc1: "Karmaşık senaryolar yazmanıza gerek yok. Sadece hizmet listenizi, fiyat PDF'inizi veya geçmiş konuşmalarınızı yükleyin.",
      feat1_desc2: "Qualy bu bilgileri sindirerek sizin bir kopyanız haline gelir; soruları yanıtlar, itirazları karşılar ve kendi dokümanlarınızdan alıntı yapar.",
      feat1_mockup_source: "Bilgi Kaynağı",
      feat1_mockup_synced: "Senkronize: Az önce",
      feat1_mockup_processed: "İşlendi",
      feat1_mockup_quote: "\"Qualy artık işinizi en az sizin kadar iyi biliyor.\"",
      feat2_title: "Zamanı paraya dönüştürün",
      feat2_desc: "Her mesaj eşit değildir. Qualy gelen her sohbeti niyete göre analiz eder (satın alma, gezinme, destek) ve 1-10 arası puanlar.",
      feat2_li1: "<span><strong class=\"text-slate-900\">Düşük Skor:</strong> \"Ne kadar?\" (Geziniyor) → Qualy otomatik olarak ilgilenir.</span>",
      feat2_li2: "<span><strong class=\"text-slate-900\">Yüksek Skor:</strong> \"Bugün başlamak istiyorum.\" (Satın Alma) → Anında bildirim alırsınız.</span>",
      feat2_mockup_potential: "Müşteri Potansiyeli",
      feat2_mockup_analysis: "Analiz tamamlandı",
      feat2_mockup_check1: "Bütçe belirtildi",
      feat2_mockup_check2: "Aciliyet tespit edildi (\"Hemen başla\")",
      feat2_mockup_check3: "Karar verici doğrulandı",
      feat2_mockup_btn: "Konuşmayı Aç",
      feat3_title: "Sadece metin. Sadece iş.",
      feat3_desc1: "Cesur bir seçim yaptık: Qualy'nin birleşik gelen kutusu metin önceliklidir. Sticker yok, GIF yok, dikkat dağıtan ekip sohbetleri yok.",
      feat3_desc2: "Gürültüyü ortadan kaldırıyoruz, böylece 50 konuşmayı 5 dakikada tarayıp sadece kazandıranlara odaklanabilirsiniz.",
      feat3_mockup_focus: "Odak Modu",
      feat3_mockup_voice: "Sesli mesaj gönderdi (Metin: \"Buna Cumaya kadar ihtiyacım var\")",
      feat3_mockup_image: "Görsel gönderdi (Analiz: 404 hatası ekran görüntüsü)",
      feat3_mockup_hidden: "Odaklanmanız için medya gizlendi."
    },
    howItWorks: {
      title: "Qualy Nasıl Çalışır",
      subtitle: "Kurulum 5 dakikadan az sürer. Kodlama gerekmez.",
      step1_title: "Bağla",
      step1_desc: "WhatsApp Business ve Telegram hesaplarınızı QR kod ile tek tıkla bağlayın. Mevcut sohbetleriniz anında senkronize olur.",
      step2_title: "Öğret",
      step2_desc: "Fiyat listenizi, hizmet kataloğunuzu veya web sitenizi yükleyin. Qualy saniyeler içinde okur ve özel bir bilgi bankası oluşturur.",
      step3_title: "Ele",
      step3_desc: "Arkanıza yaslanın. Qualy her müşteri adayıyla etkileşime girer, puanlar ve sadece yüksek değerli bir potansiyel müşteri satın almaya hazır olduğunda size haber verir."
    },
    pricing: {
      title: "Tek ve basit paket.",
      subtitle: "Karmaşık seviyeler yok. Qualy'nin tüm gücüne sahip olun.",
      monthly: "Aylık",
      yearly: "Yıllık",
      save: "%20 İndirim",
      professional: {
        title: "Profesyonel",
        desc: "Büyümek için ihtiyacınız olan her şey.",
        priceMonthly: "$79/ay",
        priceYearly: "$69/ay",
        cta: "14 gün ücretsiz dene",
        features: [
            "Sınırsız WhatsApp & Telegram sohbeti",
            "Akıllı Bilgi Bankası (PDF/URL)",
            "Yapay Zeka Müşteri Puanlama (1-10)",
            "Öncelikli Gelen Kutusu ve Bildirimler",
            "İnsan Devralma Modu"
        ]
      },
      enterprise: {
        title: "Kurumsal",
        desc: "Yüksek hacimli ekipler için.",
        price: "Özel",
        cta: "Satışla İletişime Geç",
        features: [
            "Profesyonel paketteki her şey",
            "Özel Entegrasyon Desteği",
            "SLA ve Öncelikli Destek",
            "Özel Müşteri Temsilcisi",
            "Özel AI Model Eğitimi"
        ]
      }
    },
    cta: {
      title: "Sıkıcı işleri otomatize etmeye hazır mısın?",
      desc: "Qualy kullanarak müşteri adaylarını eleyen ve destek taleplerini her zamankinden hızlı çözen 500+ şirkete katılın.",
      primary: "Ücretsiz Başla",
      secondary: "Satışla Konuş",
      note: "14 gün ücretsiz deneme • Kredi kartı gerekmez"
    },
    footer: {
      desc: "Hizmet profesyonelleri için yapay zeka öncelikli gelen kutusu. Müşterileri ele, yanıtları otomatize et, daha çok satış kapat.",
      product: "Ürün",
      resources: "Kaynaklar",
      company: "Şirket",
      features: "Özellikler",
      leadScoring: "Müşteri Puanlama",
      updates: "Güncellemeler",
      docs: "Dokümantasyon",
      api: "API Referansı",
      community: "Topluluk",
      help: "Yardım Merkezi",
      about: "Hakkında",
      blog: "Blog",
      careers: "Kariyer",
      legal: "Yasal",
      privacy: "Gizlilik Politikası",
      terms: "Hizmet Şartları",
      rights: "Tüm hakları saklıdır."
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

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