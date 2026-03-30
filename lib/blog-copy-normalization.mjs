const LINK_LABEL_RULES = {
  tr: [
    {
      pattern: /^(?:our\s+product|qualy(?:'|&#39;s)?\s+product)$/i,
      replacement: 'ürün',
    },
    {
      pattern: /^(?:our\s+product\s+page|product\s+page)$/i,
      replacement: 'ürün sayfamız',
    },
    {
      pattern: /^(?:our\s+official\s+website|official\s+website|qualy(?:'|&#39;s)?\s+official\s+website)$/i,
      replacement: 'resmi web sitemizi',
    },
  ],
  en: [
    {
      pattern: /^(?:ürün|urun|ürünümüz|urunumuz)$/iu,
      replacement: 'Our Product',
    },
    {
      pattern: /^(?:ürün sayfamız|urun sayfamiz|ürün sayfamızı|urun sayfamizi)$/iu,
      replacement: 'product page',
    },
    {
      pattern: /^(?:resmi web sitemiz|resmi web sitemizi|qualy(?:'|’)?nin resmi web sitesi|qualynin resmi web sitesi)$/iu,
      replacement: "Qualy's official website",
    },
  ],
};

function normalizeLabel(label, locale) {
  const rules = LINK_LABEL_RULES[locale] ?? [];
  const trimmed = String(label ?? '').trim();

  for (const rule of rules) {
    if (rule.pattern.test(trimmed)) {
      return rule.replacement;
    }
  }

  return trimmed;
}

function replaceHtmlAnchorLabels(content, locale) {
  return String(content ?? '').replace(/(<a\b[^>]*>)([^<]*?)(<\/a>)/giu, (match, openTag, label, closeTag) => {
    const normalizedLabel = normalizeLabel(label, locale);
    if (normalizedLabel === String(label ?? '').trim()) {
      return match;
    }

    return `${openTag}${normalizedLabel}${closeTag}`;
  });
}

function replaceMarkdownLinkLabels(content, locale) {
  return String(content ?? '').replace(/(^|[^!])\[([^\]]+)\]\(([^)]+)\)/gmu, (match, prefix, label, href) => {
    const normalizedLabel = normalizeLabel(label, locale);
    if (normalizedLabel === String(label ?? '').trim()) {
      return match;
    }

    return `${prefix}[${normalizedLabel}](${href})`;
  });
}

export function normalizeLocalizedBlogCopy(content, locale) {
  const normalizedLocale = locale === 'tr' ? 'tr' : locale === 'en' ? 'en' : null;
  if (!normalizedLocale) {
    return String(content ?? '');
  }

  return replaceMarkdownLinkLabels(replaceHtmlAnchorLabels(content, normalizedLocale), normalizedLocale);
}
