import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { applySeoToDocument } from '../lib/seo-dom';
import type { SeoPayload } from '../lib/seo';

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

const buildBlogHref = (slug: string, locale: 'en' | 'tr') => (locale === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`);
const BLOG_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const BLOG_SITE_URL = 'https://askqualy.com';

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

const titleCase = (value: string) =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((entry) => entry.charAt(0).toUpperCase() + entry.slice(1))
    .join(' ');

const getCategory = (post: BlogPostRecord, language: 'en' | 'tr') => {
  if (post.category?.slug || post.category?.label) {
    return {
      slug: post.category.slug,
      label: post.category.label || titleCase(post.category.slug),
    };
  }

  return {
    slug: 'updates',
    label: language === 'en' ? 'Updates' : 'Güncellemeler',
  };
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
  const currentCategory = getCategory(currentPost, language).slug;

  return selectVisiblePosts(posts, language)
    .filter((entry) => entry.slug !== currentPost.slug)
    .sort((left, right) => {
      const leftScore = getCategory(left, language).slug === currentCategory ? 1 : 0;
      const rightScore = getCategory(right, language).slug === currentCategory ? 1 : 0;
      return rightScore - leftScore || String(right.publishedAt ?? '').localeCompare(String(left.publishedAt ?? ''));
    })
    .slice(0, 3);
};

const BlogPostPage: React.FC<Props> = ({ slug, initialPost }) => {
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPostRecord | null>(initialPost ?? null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostRecord[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchLocalizedPost = async () => {
      if (initialPost !== undefined) return initialPost;

      const localeCandidates = language === 'en' ? ['en', 'tr'] : ['tr', 'en'];

      try {
        for (const locale of localeCandidates) {
          const response = await fetch(`/blog-posts/${locale}/${slug}.json`);
          if (!response.ok) continue;

          const data = (await response.json()) as BlogPostRecord;
          return data;
        }
      } catch {
        return null;
      }

      return null;
    };

    const fetchManifestPosts = async () => {
      try {
        const response = await fetch('/blog_manifest.json');
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
    if (!post || typeof document === 'undefined') return;

    applySeoToDocument(document, buildBlogPostSeo(post, language));
    document.documentElement.setAttribute('lang', post.locale ?? language);
  }, [language, post]);

  const backToBlogLabel = language === 'en' ? 'Back to blog' : 'Bloga dön';
  const backToBlogAriaLabel = language === 'en' ? 'back to blog' : 'bloga dön';
  const backToBlogHref = language === 'en' ? '/en/blog' : '/blog';
  const relatedArticlesLabel = language === 'en' ? 'Related articles' : 'İlgili yazılar';
  const viewAllArticlesLabel = language === 'en' ? 'View all articles' : 'Tüm yazıları gör';
  const notFoundLabel = language === 'en' ? 'Post not found.' : 'Yazı bulunamadı.';
  const postCategory = post ? getCategory(post, language) : null;
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
                    <span className="text-slate-500">{titleCase(postCategory.label)}</span>
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
              <section className="mt-20 border-t border-slate-200/80 pt-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                      {titleCase(postCategory?.label ?? '')}
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                      {relatedArticlesLabel}
                    </h2>
                  </div>
                  <a
                    href={backToBlogHref}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                  >
                    {viewAllArticlesLabel}
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {relatedPosts.map((relatedPost) => {
                    const href = buildBlogHref(relatedPost.slug, relatedPost.locale ?? language);
                    const relatedCategory = getCategory(relatedPost, language);

                    return (
                      <a
                        key={`${relatedPost.locale ?? 'shared'}-${relatedPost.slug}`}
                        href={href}
                        className="group flex h-full flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]"
                      >
                        <div className="overflow-hidden rounded-[1.15rem] bg-slate-100">
                          <div className="aspect-[16/10]">
                            {relatedPost.coverImage ? (
                              <img
                                src={relatedPost.coverImage}
                                alt={relatedPost.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              buildFallbackArtwork(relatedPost)
                            )}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {titleCase(relatedCategory.label)} • {getReadTimeLabel(relatedPost, language)}
                          </p>
                          <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-[#1173d4]">
                            {relatedPost.title}
                          </h3>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
            {notFoundLabel}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPostPage;
