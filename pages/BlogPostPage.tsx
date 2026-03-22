import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { applySeoToDocument } from '../lib/seo-dom';
import type { SeoPayload } from '../lib/seo';
import { AUTH_URLS } from '../lib/auth-links';
import { getDisplayCategory } from '../lib/blog-categories';

type BlogCategory = {
  slug: string;
  label: string;
};

type BlogLocalization = {
  locale: 'en' | 'tr';
  slug: string;
  path?: string;
  canonicalUrl?: string;
};

type BlogPostRecord = {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  contentHtml?: string;
  publishedAt?: string;
  locale?: 'en' | 'tr';
  coverImage?: string;
  sharedAcrossLocales?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  path?: string;
  canonicalUrl?: string;
  localizations?: BlogLocalization[];
  category?: BlogCategory | null;
};

type Props = {
  slug: string;
  initialPost?: BlogPostRecord | null;
};

type DemoFormData = {
  fullName: string;
  email: string;
  phone: string;
  note: string;
};

const initialDemoFormData: DemoFormData = {
  fullName: '',
  email: '',
  phone: '',
  note: '',
};

const buildBlogHref = (slug: string, locale: 'en' | 'tr') => (locale === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`);
const BLOG_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const BLOG_SITE_URL = 'https://www.askqualy.com';

const normalizeManifestPosts = (payload: unknown): BlogPostRecord[] => {
  if (Array.isArray(payload)) return payload as BlogPostRecord[];
  if (payload && typeof payload === 'object') {
    const manifest = payload as {
      posts?: BlogPostRecord[];
      items?: BlogPostRecord[];
    };
    if (Array.isArray(manifest.posts)) return manifest.posts;
    if (Array.isArray(manifest.items)) return manifest.items;
  }
  return [];
};

const stripHtml = (value: string | undefined) =>
  String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const estimateReadMinutes = (post: BlogPostRecord) => {
  const wordCount = stripHtml(post.contentHtml || post.excerpt || post.content).split(' ').filter(Boolean).length;
  return Math.max(4, Math.ceil(wordCount / 180) || 0);
};

const getReadTimeLabel = (post: BlogPostRecord, language: 'en' | 'tr') => {
  const minutes = estimateReadMinutes(post);
  return language === 'en' ? `${minutes} min read` : `${minutes} dk okuma`;
};

const formatBlogDate = (publishedAt: string | undefined, language: 'en' | 'tr') => {
  if (!publishedAt) return '';

  const parsedDate = new Date(publishedAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return publishedAt;
  }

  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
};

const resolveAbsoluteBlogUrl = (pathOrUrl: string | undefined) => {
  const value = String(pathOrUrl ?? '').trim();
  if (!value) return BLOG_SITE_URL;
  if (/^https?:\/\//i.test(value)) return value;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : BLOG_SITE_URL;
  const cleanPath = value.startsWith('/') ? value : `/${value}`;
  return `${baseUrl.replace(/\/+$/, '')}${cleanPath}`;
};

const toOgLocale = (locale: 'en' | 'tr') => (locale === 'en' ? 'en_US' : 'tr_TR');

const buildBlogPostSeo = (post: BlogPostRecord, language: 'en' | 'tr'): SeoPayload => {
  const postLocale = post.locale ?? language;
  const postPath = post.path || buildBlogHref(post.slug, postLocale);
  const canonicalUrl = resolveAbsoluteBlogUrl(post.canonicalUrl || postPath);
  const selfAlternate: BlogLocalization = {
    locale: postLocale,
    slug: post.slug,
    path: postPath,
    canonicalUrl,
  };
  const trAlternate = postLocale === 'tr' ? selfAlternate : post.localizations?.find((entry) => entry.locale === 'tr');
  const enAlternate = postLocale === 'en' ? selfAlternate : post.localizations?.find((entry) => entry.locale === 'en');
  const xDefaultAlternate = trAlternate ?? enAlternate;
  const ogImage = resolveAbsoluteBlogUrl(post.coverImage || (postLocale === 'en' ? '/og/qualy-og-en.png' : '/og/qualy-og-tr.png'));
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || post.title;

  return {
    routeKey: 'blogIndex',
    title,
    description,
    robots: BLOG_ROBOTS,
    canonicalUrl,
    alternates: [
      ...(trAlternate ? [{ hrefLang: 'tr', href: resolveAbsoluteBlogUrl(trAlternate.canonicalUrl || trAlternate.path || canonicalUrl) }] : []),
      ...(enAlternate ? [{ hrefLang: 'en', href: resolveAbsoluteBlogUrl(enAlternate.canonicalUrl || enAlternate.path || canonicalUrl) }] : []),
      ...(xDefaultAlternate
        ? [{ hrefLang: 'x-default', href: resolveAbsoluteBlogUrl(xDefaultAlternate.canonicalUrl || xDefaultAlternate.path || canonicalUrl) }]
        : []),
    ],
    og: {
      type: 'website',
      siteName: 'Qualy',
      title,
      description,
      url: canonicalUrl,
      image: ogImage,
      locale: toOgLocale(postLocale),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: ogImage,
    },
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        datePublished: post.publishedAt,
        inLanguage: postLocale,
        url: canonicalUrl,
      },
    ],
  };
};

const sortPostsByDate = (posts: BlogPostRecord[]) =>
  posts
    .slice()
    .sort((left, right) => String(right.publishedAt ?? '').localeCompare(String(left.publishedAt ?? '')));

const selectVisiblePosts = (posts: BlogPostRecord[], language: 'en' | 'tr') => {
  const uniquePosts = new Map<string, BlogPostRecord>();

  for (const post of sortPostsByDate(posts)) {
    if (!(post.sharedAcrossLocales || !post.locale || post.locale === language)) {
      continue;
    }

    const existingPost = uniquePosts.get(post.slug);
    if (!existingPost) {
      uniquePosts.set(post.slug, post);
      continue;
    }

    if (existingPost.locale !== language && post.locale === language) {
      uniquePosts.set(post.slug, post);
    }
  }

  return sortPostsByDate(Array.from(uniquePosts.values()));
};

const buildFallbackArtwork = (post: BlogPostRecord) => {
  const palette = [
    'from-slate-950 via-slate-900 to-slate-700',
    'from-sky-950 via-slate-900 to-sky-800',
    'from-emerald-950 via-slate-900 to-teal-800',
    'from-indigo-950 via-slate-900 to-slate-700',
  ];
  const index = Math.abs(post.slug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palette.length;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${palette[index]}`}>
      <div className="absolute inset-y-0 left-[20%] w-px bg-white/20" />
      <div className="absolute inset-y-0 left-[28%] w-px bg-sky-300/25" />
      <div className="absolute inset-y-0 right-[22%] w-px bg-white/20" />
      <div className="absolute inset-y-0 right-[30%] w-px bg-sky-300/25" />
      <div className="absolute inset-y-8 left-[34%] right-[34%] rounded-full border border-sky-200/20 bg-sky-300/10 blur-sm" />
    </div>
  );
};

const selectRelatedPosts = (posts: BlogPostRecord[], currentPost: BlogPostRecord, language: 'en' | 'tr') => {
  const currentCategory = getDisplayCategory(currentPost.category, language).slug;

  return selectVisiblePosts(posts, language)
    .filter((entry) => entry.slug !== currentPost.slug)
    .sort((left, right) => {
      const leftScore = getDisplayCategory(left.category, language).slug === currentCategory ? 1 : 0;
      const rightScore = getDisplayCategory(right.category, language).slug === currentCategory ? 1 : 0;
      return rightScore - leftScore || String(right.publishedAt ?? '').localeCompare(String(left.publishedAt ?? ''));
    })
    .slice(0, 3);
};

const BlogPostPage: React.FC<Props> = ({ slug, initialPost }) => {
  const { language, t } = useLanguage();
  const [post, setPost] = useState<BlogPostRecord | null>(initialPost ?? null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostRecord[]>([]);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoFormData, setDemoFormData] = useState<DemoFormData>(initialDemoFormData);
  const [demoFormError, setDemoFormError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const refreshKey = String(Date.now());

    const fetchLocalizedPost = async () => {
      const localeCandidates = language === 'en' ? ['en', 'tr'] : ['tr', 'en'];

      try {
        for (const locale of localeCandidates) {
          const postUrl = new URL(`/blog-posts/${locale}/${slug}.json`, window.location.origin);
          postUrl.searchParams.set('ts', refreshKey);

          const response = await fetch(postUrl.toString(), { cache: 'no-store' });
          if (!response.ok) continue;

          const data = (await response.json()) as BlogPostRecord;
          return data;
        }
      } catch {
        return initialPost ?? null;
      }

      return initialPost ?? null;
    };

    const fetchManifestPosts = async () => {
      try {
        const manifestUrl = new URL('/blog_manifest.json', window.location.origin);
        manifestUrl.searchParams.set('ts', refreshKey);

        const response = await fetch(manifestUrl.toString(), { cache: 'no-store' });
        if (!response.ok) return [];

        const data = await response.json();
        return normalizeManifestPosts(data);
      } catch {
        return [];
      }
    };

    const loadPageData = async () => {
      const [resolvedPost, manifestPosts] = await Promise.all([fetchLocalizedPost(), fetchManifestPosts()]);
      if (!isMounted) return;

      setPost(resolvedPost ?? null);
      setRelatedPosts(resolvedPost ? selectRelatedPosts(manifestPosts, resolvedPost, language) : []);
    };

    void loadPageData();

    return () => {
      isMounted = false;
    };
  }, [initialPost, language, slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    if (!isDemoModalOpen || typeof window === 'undefined') return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDemoModalOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDemoModalOpen]);

  useEffect(() => {
    if (!post || typeof document === 'undefined') return;

    applySeoToDocument(document, buildBlogPostSeo(post, language));
    document.documentElement.setAttribute('lang', post.locale ?? language);
  }, [language, post]);

  const openDemoModal = () => {
    setDemoFormData(initialDemoFormData);
    setDemoFormError(null);
    setIsDemoModalOpen(true);
  };

  const closeDemoModal = () => {
    setDemoFormError(null);
    setIsDemoModalOpen(false);
  };

  const updateDemoField = (field: keyof DemoFormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (demoFormError) {
      setDemoFormError(null);
    }
    setDemoFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleDemoFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFullName = demoFormData.fullName.trim();
    const trimmedEmail = demoFormData.email.trim();
    const trimmedPhone = demoFormData.phone.trim();
    const trimmedNote = demoFormData.note.trim();

    if (!trimmedFullName) {
      setDemoFormError(t.hero.demoModal.errors.fullNameRequired);
      return;
    }

    if (!trimmedEmail && !trimmedPhone) {
      setDemoFormError(t.hero.demoModal.errors.contactRequired);
      return;
    }

    const subject = `${t.hero.demoModal.mailSubject} - ${trimmedFullName}`;
    const body = [
      `${t.hero.demoModal.mailLabelName}: ${trimmedFullName}`,
      `${t.hero.demoModal.mailLabelEmail}: ${trimmedEmail || '-'}`,
      `${t.hero.demoModal.mailLabelPhone}: ${trimmedPhone || '-'}`,
      `${t.hero.demoModal.mailLabelNote}: ${trimmedNote || '-'}`,
    ].join('\n');
    const mailtoHref = `mailto:askqualy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (typeof window !== 'undefined') {
      window.location.href = mailtoHref;
    }

    setIsDemoModalOpen(false);
  };

  const backToBlogLabel = language === 'en' ? 'Back to blog' : 'Bloga dön';
  const backToBlogAriaLabel = language === 'en' ? 'back to blog' : 'bloga dön';
  const backToBlogHref = language === 'en' ? '/en/blog' : '/blog';
  const continueReadingLabel = language === 'en' ? 'Continue reading' : 'Okumaya devam et';
  const viewAllArticlesLabel = language === 'en' ? 'View all' : 'Tümünü görüntüle';
  const notFoundLabel = language === 'en' ? 'Post not found.' : 'Yazı bulunamadı.';
  const articleCtaTitle = language === 'en'
    ? 'Reply instantly. Prioritize serious leads.'
    : 'Herkese değil, doğru müşteriye odaklan.';
  const articleCtaDescription = language === 'en'
    ? 'Automate repetitive replies, collect missing context, and prioritize the conversations most likely to convert.'
    : 'Mesajları otomatik yanıtla, eksik bilgiyi doğru sorularla tamamla ve yüksek niyetli konuşmaları önceliklendir.';
  const postCategory = post ? getDisplayCategory(post.category, language) : null;
  const articleCtaSection = (
    <div className="mx-auto mt-16 w-full max-w-5xl">
      <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_42%),linear-gradient(135deg,_#020617_0%,_#0f172a_54%,_#172554_100%)] px-6 py-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:px-10 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.6rem]">
            {articleCtaTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-200 sm:text-lg">
            {articleCtaDescription}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={AUTH_URLS.register}
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100 sm:w-auto md:text-base"
            >
              {t.hero.ctaPrimary}
            </a>
            <button
              type="button"
              onClick={openDemoModal}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/16 sm:w-auto md:text-base"
            >
              {t.hero.ctaSecondary}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
  return (
    <section className="bg-[#f6f7f8]">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-10">
        {post ? (
          <>
            <article className="w-full">
              <div className="mb-8 flex w-full flex-wrap items-center gap-2 text-sm">
                <a
                  href={backToBlogHref}
                  className="inline-flex items-center gap-2 font-semibold text-[#1173d4] transition-colors hover:text-[#0f5fae]"
                  aria-label={backToBlogAriaLabel}
                >
                  <span aria-hidden="true">←</span>
                  {backToBlogLabel}
                </a>
                {postCategory ? (
                  <>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500">{postCategory.label}</span>
                  </>
                ) : null}
              </div>

              <header className="mx-auto w-full max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  {post.publishedAt ? (
                    <time
                      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400"
                      dateTime={post.publishedAt}
                    >
                      {formatBlogDate(post.publishedAt, language)}
                    </time>
                  ) : null}
                  {post.publishedAt ? <span className="h-1 w-1 rounded-full bg-slate-300" /> : null}
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {getReadTimeLabel(post, language)}
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-[4rem]">
                  {post.title}
                </h1>
                {post.excerpt ? (
                  <p className="mt-6 text-xl font-medium leading-9 text-slate-600 sm:text-[1.4rem]">
                    {post.excerpt}
                  </p>
                ) : null}
              </header>

              <div className="mt-12 w-full overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
                <div className="aspect-[16/9]">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    buildFallbackArtwork(post)
                  )}
                </div>
              </div>

              <div className="mx-auto mt-14 w-full max-w-3xl">
                <div
                  className="blog-article-content"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml ?? post.content ?? '' }}
                />
              </div>
            </article>

            {relatedPosts.length > 0 ? (
              <section className="mt-20 border-t border-slate-200/80 pt-10 sm:pt-12">
                <div className="mb-10 flex items-center justify-between gap-6">
                  <h2 className="text-2xl font-medium tracking-tight text-slate-950 sm:text-[2rem]">
                    {continueReadingLabel}
                  </h2>
                  <a
                    href={backToBlogHref}
                    className="text-sm font-medium text-slate-900 transition-colors hover:text-slate-600"
                  >
                    {viewAllArticlesLabel}
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
                  {relatedPosts.map((relatedPost) => {
                    const href = buildBlogHref(relatedPost.slug, relatedPost.locale ?? language);
                    const relatedCategory = getDisplayCategory(relatedPost.category, language);
                    const relatedDateLabel = formatBlogDate(relatedPost.publishedAt, language);
                    const cardLabel = [relatedPost.title, relatedCategory.label, relatedDateLabel].filter(Boolean).join(' - ');

                    return (
                      <article
                        key={`${relatedPost.locale ?? 'shared'}-${relatedPost.slug}`}
                      >
                        <div className="group relative">
                          <div className="absolute inset-x-0 top-0 aspect-square rounded-md bg-slate-100" />
                          <div className="relative mx-auto w-full overflow-hidden rounded-md transition-opacity duration-300">
                            <div className="relative aspect-square w-full overflow-hidden rounded-md">
                              {relatedPost.coverImage ? (
                                <img
                                  src={relatedPost.coverImage}
                                  alt={relatedPost.title}
                                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.025]"
                                  loading="lazy"
                                />
                              ) : (
                                buildFallbackArtwork(relatedPost)
                              )}
                            </div>
                          </div>

                          <a
                            href={href}
                            aria-label={cardLabel}
                            className="block w-full pt-4 transition-[opacity,background] duration-300 after:absolute after:inset-0 after:content-['']"
                          >
                            <div className="relative w-full text-slate-950">
                              <h3 className="pr-4 text-[1.35rem] font-medium leading-[1.14] tracking-tight transition-colors group-hover:text-slate-700">
                                {relatedPost.title}
                              </h3>
                              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                                <span className="font-medium text-slate-900">{relatedCategory.label}</span>
                                {relatedDateLabel ? (
                                  <time className="text-slate-400" dateTime={relatedPost.publishedAt}>
                                    {relatedDateLabel}
                                  </time>
                                ) : null}
                              </p>
                            </div>
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {articleCtaSection}
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
            {notFoundLabel}
          </div>
        )}
      </div>

      {isDemoModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 px-4 py-6" onClick={closeDemoModal}>
          <div
            className="relative w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.24)] sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-demo-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="blog-demo-modal-title" className="text-2xl font-semibold text-slate-900">
                  {t.hero.demoModal.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.hero.demoModal.subtitle}</p>
              </div>
              <button
                type="button"
                aria-label={t.hero.demoModal.closeLabel}
                onClick={closeDemoModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleDemoFormSubmit}>
              <div className="space-y-2">
                <label htmlFor="blog-demo-full-name" className="text-sm font-medium text-slate-800">
                  {t.hero.demoModal.fullNameLabel}
                </label>
                <input
                  id="blog-demo-full-name"
                  type="text"
                  value={demoFormData.fullName}
                  onChange={updateDemoField('fullName')}
                  placeholder={t.hero.demoModal.fullNamePlaceholder}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="blog-demo-email" className="text-sm font-medium text-slate-800">
                    {t.hero.demoModal.emailLabel}
                  </label>
                  <input
                    id="blog-demo-email"
                    type="email"
                    value={demoFormData.email}
                    onChange={updateDemoField('email')}
                    placeholder={t.hero.demoModal.emailPlaceholder}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="blog-demo-phone" className="text-sm font-medium text-slate-800">
                    {t.hero.demoModal.phoneLabel}
                  </label>
                  <input
                    id="blog-demo-phone"
                    type="tel"
                    value={demoFormData.phone}
                    onChange={updateDemoField('phone')}
                    placeholder={t.hero.demoModal.phonePlaceholder}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500">{t.hero.demoModal.contactHint}</p>

              <div className="space-y-2">
                <label htmlFor="blog-demo-note" className="text-sm font-medium text-slate-800">
                  {t.hero.demoModal.noteLabel}
                </label>
                <textarea
                  id="blog-demo-note"
                  value={demoFormData.note}
                  onChange={updateDemoField('note')}
                  placeholder={t.hero.demoModal.notePlaceholder}
                  className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              {demoFormError && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{demoFormError}</p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDemoModal}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {t.hero.demoModal.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  {t.hero.demoModal.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogPostPage;
