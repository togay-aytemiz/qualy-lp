export const categoryDefinitions = [
  {
    id: 'category.booking-conversion',
    slug: 'ultimate-guide',
    titleTr: 'Kapsamlı Rehber',
    titleEn: 'Ultimate Guide',
    descriptionTr: 'Konuya bastan sona giren, karar vermeyi kolaylastiran uzun form rehberler.',
    descriptionEn: 'Long-form guides that cover a topic end to end and help teams make decisions faster.',
  },
  {
    id: 'category.customer-stories',
    slug: 'how-to-article',
    titleTr: 'Nasıl Yapılır',
    titleEn: 'How To Article',
    descriptionTr: 'Belirli bir akisi adim adim anlatan uygulamali yazilar.',
    descriptionEn: 'Applied articles that explain a specific workflow step by step.',
  },
  {
    id: 'category.ai-automation',
    slug: 'practical-guide',
    titleTr: 'Pratik Rehber',
    titleEn: 'Practical Guide',
    descriptionTr: 'Takimlarin hemen uygulayabilecegi pratik taktikler ve operasyon ornekleri.',
    descriptionEn: 'Practical tactics and operational examples teams can apply immediately.',
  },
  {
    id: 'category.lead-qualification',
    slug: 'concepts',
    titleTr: 'Kavramlar',
    titleEn: 'Concepts',
    descriptionTr: 'Temel mantiklari, terimleri ve stratejik cerceveyi anlatan yazilar.',
    descriptionEn: 'Articles that explain the core logic, terminology, and strategic frame.',
  },
  {
    id: 'category.product-updates',
    slug: 'platform-release',
    titleTr: 'Platform Duyuruları',
    titleEn: 'Platform Release',
    descriptionTr: 'Yeni yayinlar, urun notlari ve platform tarafindaki degisiklikler.',
    descriptionEn: 'New launches, product notes, and platform-side changes.',
  },
  {
    id: 'category.messaging-workflows',
    slug: 'instant-messaging',
    titleTr: 'Mesajlaşma',
    titleEn: 'Instant Messaging',
    descriptionTr: 'WhatsApp, Instagram, Messenger ve Telegram operasyonlarina odaklanan yazilar.',
    descriptionEn: 'Articles focused on WhatsApp, Instagram, Messenger, and Telegram operations.',
  },
]

export function buildCategoryDocuments() {
  return categoryDefinitions.map((category) => ({
    _id: category.id,
    _type: 'category',
    title: category.titleEn,
    titleTr: category.titleTr,
    titleEn: category.titleEn,
    slug: {_type: 'slug', current: category.slug},
    description: category.descriptionEn,
    descriptionTr: category.descriptionTr,
    descriptionEn: category.descriptionEn,
  }))
}
