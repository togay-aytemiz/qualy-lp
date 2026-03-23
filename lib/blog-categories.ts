export type BlogCategoryLanguage = 'en' | 'tr';

export type BlogCategorySummary = {
  slug: string;
  label: string;
};

type BlogCategoryKey =
  | 'ultimate-guide'
  | 'how-to-article'
  | 'practical-guide'
  | 'concepts'
  | 'measurement-analytics'
  | 'sales-automation'
  | 'use-cases'
  | 'case-study'
  | 'comparisons'
  | 'integrations'
  | 'platform-release'
  | 'instant-messaging';

type BlogCategoryLike =
  | BlogCategorySummary
  | {
      slug?: string | null;
      label?: string | null;
    }
  | null
  | undefined;

const DEFAULT_BLOG_CATEGORY_KEY: BlogCategoryKey = 'practical-guide';

const BLOG_CATEGORY_ORDER: BlogCategoryKey[] = [
  'ultimate-guide',
  'how-to-article',
  'practical-guide',
  'concepts',
  'use-cases',
  'case-study',
  'comparisons',
  'integrations',
  'measurement-analytics',
  'sales-automation',
  'platform-release',
  'instant-messaging',
];

const BLOG_CATEGORY_LABELS: Record<BlogCategoryKey, Record<BlogCategoryLanguage, string>> = {
  'ultimate-guide': {
    en: 'Ultimate Guide',
    tr: 'Kapsamlı Rehber',
  },
  'how-to-article': {
    en: 'How To Article',
    tr: 'Nasıl Yapılır',
  },
  'practical-guide': {
    en: 'Practical Guide',
    tr: 'Pratik Rehber',
  },
  concepts: {
    en: 'Concepts',
    tr: 'Kavramlar',
  },
  'measurement-analytics': {
    en: 'Measurement and Analytics',
    tr: 'Ölçüm ve Analiz',
  },
  'sales-automation': {
    en: 'Sales Automation',
    tr: 'Satış Otomasyonu',
  },
  'use-cases': {
    en: 'Use Cases',
    tr: 'Kullanım Senaryoları',
  },
  'case-study': {
    en: 'Case Study',
    tr: 'Vaka Analizi',
  },
  comparisons: {
    en: 'Comparisons',
    tr: 'Karşılaştırmalar',
  },
  integrations: {
    en: 'Integrations',
    tr: 'Entegrasyonlar',
  },
  'platform-release': {
    en: 'Platform Release',
    tr: 'Platform Duyuruları',
  },
  'instant-messaging': {
    en: 'Instant Messaging',
    tr: 'Mesajlaşma',
  },
};

const BLOG_CATEGORY_ALIAS_MAP: Record<string, BlogCategoryKey> = {
  'ultimate-guide': 'ultimate-guide',
  'booking-conversion': 'ultimate-guide',
  'how-to-article': 'how-to-article',
  'how-to': 'how-to-article',
  'customer-stories': 'how-to-article',
  'practical-guide': 'practical-guide',
  'ai-automation': 'practical-guide',
  concepts: 'concepts',
  'lead-qualification': 'concepts',
  'measurement-analytics': 'measurement-analytics',
  'sales-automation': 'sales-automation',
  'use-cases': 'use-cases',
  'case-study': 'case-study',
  comparisons: 'comparisons',
  integrations: 'integrations',
  'platform-release': 'platform-release',
  'product-updates': 'platform-release',
  'instant-messaging': 'instant-messaging',
  'messaging-workflows': 'instant-messaging',
};

const normalizeCategoryValue = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const inferCategoryKeyFromValue = (value: string): BlogCategoryKey | null => {
  if (!value) return null;
  if (value.includes('ultimate') || value.includes('kapsamli')) return 'ultimate-guide';
  if (value.includes('how-to') || value.includes('howto') || value.includes('nasil')) return 'how-to-article';
  if (value.includes('practical') || value.includes('guide') || value.includes('rehber')) {
    return 'practical-guide';
  }
  if (value.includes('measurement') || value.includes('analytics') || value.includes('olcum') || value.includes('analiz')) {
    return 'measurement-analytics';
  }
  if (value.includes('sales-automation') || value.includes('satis-otomasyon')) {
    return 'sales-automation';
  }
  if (value.includes('use-case') || value.includes('kullanim-senaryo')) {
    return 'use-cases';
  }
  if (value.includes('case-study') || value.includes('vaka')) {
    return 'case-study';
  }
  if (value.includes('comparison') || value.includes('karsilastirma')) {
    return 'comparisons';
  }
  if (value.includes('integration') || value.includes('entegrasyon')) {
    return 'integrations';
  }
  if (value.includes('concept') || value.includes('kavram') || value.includes('qualification') || value.includes('nitelendirme')) {
    return 'concepts';
  }
  if (value.includes('release') || value.includes('update') || value.includes('guncelleme') || value.includes('duyuru')) {
    return 'platform-release';
  }
  if (
    value.includes('message') ||
    value.includes('messaging') ||
    value.includes('mesaj') ||
    value.includes('whatsapp') ||
    value.includes('instagram') ||
    value.includes('telegram')
  ) {
    return 'instant-messaging';
  }
  return null;
};

const resolveCategoryKey = (category: BlogCategoryLike): BlogCategoryKey => {
  const slugCandidate = normalizeCategoryValue(category?.slug);
  const labelCandidate = normalizeCategoryValue(category?.label);

  return (
    BLOG_CATEGORY_ALIAS_MAP[slugCandidate] ||
    BLOG_CATEGORY_ALIAS_MAP[labelCandidate] ||
    inferCategoryKeyFromValue(slugCandidate) ||
    inferCategoryKeyFromValue(labelCandidate) ||
    DEFAULT_BLOG_CATEGORY_KEY
  );
};

export const getDisplayCategory = (
  category: BlogCategoryLike,
  language: BlogCategoryLanguage
): BlogCategorySummary => {
  const key = resolveCategoryKey(category);

  return {
    slug: key,
    label: BLOG_CATEGORY_LABELS[key][language],
  };
};

export const sortDisplayCategories = (
  categories: BlogCategoryLike[],
  language: BlogCategoryLanguage
): BlogCategorySummary[] => {
  const uniqueCategories = new Map<string, BlogCategorySummary>();

  for (const category of categories) {
    const displayCategory = getDisplayCategory(category, language);
    if (!uniqueCategories.has(displayCategory.slug)) {
      uniqueCategories.set(displayCategory.slug, displayCategory);
    }
  }

  return Array.from(uniqueCategories.values()).sort(
    (left, right) => BLOG_CATEGORY_ORDER.indexOf(left.slug as BlogCategoryKey) - BLOG_CATEGORY_ORDER.indexOf(right.slug as BlogCategoryKey)
  );
};
