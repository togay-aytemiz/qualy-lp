export const categoryDefinitions = [
  {
    id: 'category.product-updates',
    slug: 'product-updates',
    titleTr: 'Urun Guncellemeleri',
    titleEn: 'Product Updates',
    descriptionTr: 'Yeni surumler, yayin notlari ve urun gelisimleri.',
    descriptionEn: 'New releases, launch notes, and product changes.',
  },
  {
    id: 'category.ai-automation',
    slug: 'ai-automation',
    titleTr: 'Yapay Zeka Otomasyonu',
    titleEn: 'AI Automation',
    descriptionTr: 'Ilk yanitlar, takip ve rutin mesajlar icin otomasyon ornekleri.',
    descriptionEn: 'Automation patterns for first replies, follow-up, and routine messaging.',
  },
  {
    id: 'category.lead-qualification',
    slug: 'lead-qualification',
    titleTr: 'Potansiyel Musteri Nitelendirme',
    titleEn: 'Lead Qualification',
    descriptionTr: 'Niyet skorlama, filtreleme ve onceliklendirme akislari.',
    descriptionEn: 'Intent scoring, filtering, and prioritization workflows.',
  },
  {
    id: 'category.messaging-workflows',
    slug: 'messaging-workflows',
    titleTr: 'Mesaj Akislari',
    titleEn: 'Messaging Workflows',
    descriptionTr: 'WhatsApp, Instagram, Messenger ve Telegram operasyon akislari.',
    descriptionEn: 'Operational workflows across WhatsApp, Instagram, Messenger, and Telegram.',
  },
  {
    id: 'category.booking-conversion',
    slug: 'booking-conversion',
    titleTr: 'Randevu ve Donusum',
    titleEn: 'Booking and Conversion',
    descriptionTr: 'Daha hizli takip, daha cok randevu ve daha guclu donusum odagi.',
    descriptionEn: 'Faster follow-up, more booked conversations, and stronger conversion focus.',
  },
  {
    id: 'category.customer-stories',
    slug: 'customer-stories',
    titleTr: 'Musteri Hikayeleri',
    titleEn: 'Customer Stories',
    descriptionTr: 'Gercek kullanim senaryolari, sonuc hikayeleri ve saha ogrenimleri.',
    descriptionEn: 'Real use cases, outcome stories, and lessons from the field.',
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
