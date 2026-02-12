import type { SeoPayload } from './seo';

const upsertMeta = (doc: Document, selector: string, attrs: Record<string, string>) => {
  let tag = doc.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = doc.createElement('meta');
    doc.head.appendChild(tag);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    tag!.setAttribute(key, value);
  });
};

const upsertCanonical = (doc: Document, href: string) => {
  let link = doc.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    doc.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const upsertAlternates = (
  doc: Document,
  alternates: SeoPayload['alternates'],
) => {
  doc
    .querySelectorAll('link[rel="alternate"][data-seo-alternate="true"]')
    .forEach((node) => node.remove());

  alternates.forEach((alternate) => {
    const link = doc.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', alternate.hrefLang);
    link.setAttribute('href', alternate.href);
    link.setAttribute('data-seo-alternate', 'true');
    doc.head.appendChild(link);
  });
};

const toJsonLdPayload = (jsonLd: Record<string, unknown>[]) => {
  if (jsonLd.length <= 1) {
    return jsonLd[0] ?? {};
  }

  return {
    '@context': 'https://schema.org',
    '@graph': jsonLd.map((item) => {
      if (!('@context' in item)) return item;
      const withoutContext = { ...item };
      delete withoutContext['@context'];
      return withoutContext;
    }),
  };
};

const upsertJsonLd = (doc: Document, jsonLd: Record<string, unknown>[]) => {
  let script = doc.head.querySelector('#seo-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = doc.createElement('script');
    script.setAttribute('id', 'seo-jsonld');
    script.setAttribute('type', 'application/ld+json');
    doc.head.appendChild(script);
  }

  script.textContent = JSON.stringify(toJsonLdPayload(jsonLd));
};

export const applySeoToDocument = (doc: Document, seo: SeoPayload) => {
  doc.title = seo.title;
  upsertCanonical(doc, seo.canonicalUrl);
  upsertAlternates(doc, seo.alternates);

  upsertMeta(doc, 'meta[name="description"]', {
    name: 'description',
    content: seo.description,
  });

  upsertMeta(doc, 'meta[name="robots"]', {
    name: 'robots',
    content: seo.robots,
  });

  upsertMeta(doc, 'meta[property="og:type"]', {
    property: 'og:type',
    content: seo.og.type,
  });
  upsertMeta(doc, 'meta[property="og:site_name"]', {
    property: 'og:site_name',
    content: seo.og.siteName,
  });
  upsertMeta(doc, 'meta[property="og:title"]', {
    property: 'og:title',
    content: seo.og.title,
  });
  upsertMeta(doc, 'meta[property="og:description"]', {
    property: 'og:description',
    content: seo.og.description,
  });
  upsertMeta(doc, 'meta[property="og:url"]', {
    property: 'og:url',
    content: seo.og.url,
  });
  upsertMeta(doc, 'meta[property="og:image"]', {
    property: 'og:image',
    content: seo.og.image,
  });
  upsertMeta(doc, 'meta[property="og:locale"]', {
    property: 'og:locale',
    content: seo.og.locale,
  });

  upsertMeta(doc, 'meta[name="twitter:card"]', {
    name: 'twitter:card',
    content: seo.twitter.card,
  });
  upsertMeta(doc, 'meta[name="twitter:title"]', {
    name: 'twitter:title',
    content: seo.twitter.title,
  });
  upsertMeta(doc, 'meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: seo.twitter.description,
  });
  upsertMeta(doc, 'meta[name="twitter:image"]', {
    name: 'twitter:image',
    content: seo.twitter.image,
  });

  upsertJsonLd(doc, seo.jsonLd);
};
