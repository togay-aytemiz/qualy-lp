import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { applySeoToDocument } from '../lib/seo-dom';
import { getSeoByRoute } from '../lib/seo';

type BlogCategory = {
  slug: string;
  label: string;
};

type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  locale?: 'en' | 'tr';
  coverImage?: string | null;
  contentHtml?: string;
  sharedAcrossLocales?: boolean;
  category?: BlogCategory | null;
};

type BlogSection = {
  category: BlogCategory;
  posts: BlogPostSummary[];
};

type Props = {
  initialPosts?: BlogPostSummary[];
};

const buildBlogHref = (slug: string, locale: 'en' | 'tr') => (locale === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`);

const normalizeManifestPosts = (payload: unknown): BlogPostSummary[] => {
  if (Array.isArray(payload)) return payload as BlogPostSummary[];
  if (payload && typeof payload === 'object') {
    const manifest = payload as {
      posts?: BlogPostSummary[];
      items?: BlogPostSummary[];
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

const estimateReadMinutes = (post: BlogPostSummary) => {
  const wordCount = stripHtml(post.contentHtml || post.excerpt).split(' ').filter(Boolean).length;
  return Math.max(4, Math.ceil(wordCount / 180) || 0);
};

const getReadTimeLabel = (post: BlogPostSummary, language: 'en' | 'tr') => {
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

const getCategory = (post: BlogPostSummary, language: 'en' | 'tr') => {
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

const sortPostsByDate = (posts: BlogPostSummary[]) =>
  posts
    .slice()
    .sort((left, right) => String(right.publishedAt ?? '').localeCompare(String(left.publishedAt ?? '')));

const selectVisiblePosts = (posts: BlogPostSummary[], language: 'en' | 'tr') => {
  const uniquePosts = new Map<string, BlogPostSummary>();

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

const buildSectionId = (slug: string) => (slug === 'latest' ? 'blog-latest' : `blog-section-${slug}`);

const buildCategorySections = (posts: BlogPostSummary[], language: 'en' | 'tr') => {
  const sections = new Map<string, BlogSection>();

  for (const post of posts) {
    const category = getCategory(post, language);
    const existingSection = sections.get(category.slug);

    if (existingSection) {
      existingSection.posts.push(post);
      continue;
    }

    sections.set(category.slug, {
      category,
      posts: [post],
    });
  }

  return Array.from(sections.values());
};

const buildFallbackArtwork = (post: BlogPostSummary) => {
  const palette = [
    'from-[#e0f2fe] via-white to-[#c7d2fe]',
    'from-[#fde68a] via-[#fff7ed] to-[#fecdd3]',
    'from-[#d1fae5] via-white to-[#bae6fd]',
    'from-[#ede9fe] via-[#f8fafc] to-[#bfdbfe]',
  ];
  const glow = [
    'bg-[#1173d4]/18',
    'bg-[#fb7185]/18',
    'bg-[#14b8a6]/18',
    'bg-[#6366f1]/18',
  ];
  const haze = [
    'bg-[#0f172a]/10',
    'bg-[#7c2d12]/10',
    'bg-[#0f766e]/10',
    'bg-[#312e81]/10',
  ];
  const index = Math.abs(post.slug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palette.length;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${palette[index]}`}>
      <div className={`absolute -right-8 top-[-10%] h-40 w-40 rounded-full blur-3xl ${glow[index]}`} />
      <div className={`absolute left-8 top-10 h-24 w-24 rounded-[2rem] blur-3xl ${haze[index]}`} />
      <div className="absolute inset-x-6 top-6 h-px bg-white/80" />
      <div className="absolute bottom-6 left-6 right-6 space-y-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500/90">
          {titleCase(getCategory(post, 'en').label)}
        </div>
        <div className="max-w-[10ch] text-3xl font-semibold leading-[0.92] tracking-tight text-slate-900/85">
          {stripHtml(post.title).split(/\s+/).slice(0, 2).join(' ')}
        </div>
      </div>
    </div>
  );
};

const BlogIndexPage: React.FC<Props> = ({ initialPosts }) => {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPostSummary[]>(initialPosts ?? []);

  useEffect(() => {
    if (initialPosts !== undefined) return;

    let isMounted = true;

    const loadManifest = async () => {
      try {
        const response = await fetch('/blog_manifest.json');
        if (!response.ok) {
          if (isMounted) setPosts([]);
          return;
        }

        const data = await response.json();
        if (isMounted) {
          setPosts(normalizeManifestPosts(data));
        }
      } catch {
        if (isMounted) setPosts([]);
      }
    };

    void loadManifest();

    return () => {
      isMounted = false;
    };
  }, [initialPosts]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    applySeoToDocument(document, getSeoByRoute('blogIndex', language));
  }, [language]);

  const visiblePosts = selectVisiblePosts(posts, language);
  const latestPosts = visiblePosts.slice(0, 4);
  const heroPost = latestPosts[0];
  const latestArticles = visiblePosts.slice(1, 3);
  const latestArticleCards = latestArticles.length > 0 ? latestArticles : [heroPost];
  const recommendedPosts = visiblePosts.slice(3, 8);
  const categorySections = buildCategorySections(visiblePosts, language);
  const emptyStateLabel = language === 'en' ? 'No blog posts yet.' : 'Henüz blog yazısı yok.'; // empty state
  const readArticleLabel = language === 'en' ? 'Read article' : 'Yazıyı oku';
  const latestLabel = language === 'en' ? 'Latest' : 'En son';
  const latestArticlesHeading = language === 'en' ? 'Latest articles' : 'Son yazılar';
  const recommendedHeading = language === 'en' ? 'Recommended' : 'Önerilenler';
  const categoryArchiveLabel = language === 'en' ? 'All posts in this category' : 'Kategorideki tüm yazılar';
  const categoryCountLabel = (count: number) => (language === 'en' ? `${count} article${count === 1 ? '' : 's'}` : `${count} yazı`);

  if (!heroPost) {
    return (
      <section className="bg-[#f6f7f8]">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-10">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
            {emptyStateLabel}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f6f7f8]">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-10">
        <div className="space-y-12">
          <section id="blog-latest" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <a
                href={buildBlogHref(heroPost.slug, heroPost.locale ?? language)}
                aria-label={`${latestLabel}: ${heroPost.title}`}
                className="block overflow-hidden rounded-[2rem] bg-slate-100"
              >
                <div className="aspect-[16/12] overflow-hidden">
                  {heroPost.coverImage ? (
                    <img
                      src={heroPost.coverImage}
                      alt={heroPost.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    buildFallbackArtwork(heroPost)
                  )}
                </div>
              </a>

              <div className="space-y-5">
                <a
                  href={buildBlogHref(heroPost.slug, heroPost.locale ?? language)}
                  aria-label={`${readArticleLabel}: ${heroPost.title}`}
                  className="block"
                >
                  <span className="text-sm font-bold text-slate-500">{titleCase(getCategory(heroPost, language).label)}</span>
                  <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl">
                    {heroPost.title}
                  </h1>
                  {heroPost.excerpt ? <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{heroPost.excerpt}</p> : null}
                </a>

                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  {heroPost.publishedAt ? <span>{formatBlogDate(heroPost.publishedAt, language)}</span> : null}
                  {heroPost.publishedAt ? <span className="h-1 w-1 rounded-full bg-slate-300" /> : null}
                  <span>{getReadTimeLabel(heroPost, language)}</span>
                </div>

                <a
                  href={buildBlogHref(heroPost.slug, heroPost.locale ?? language)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition-colors hover:text-[#1173d4]"
                >
                  {readArticleLabel}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="border-t border-slate-200" />
          </section>

          {latestArticleCards.length > 0 || recommendedPosts.length > 0 ? (
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">{latestArticlesHeading}</h2>

              <div
                className={
                  recommendedPosts.length > 0
                    ? 'grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(280px,0.9fr)]'
                    : 'grid gap-6 md:grid-cols-2'
                }
              >
                {latestArticleCards.map((post) => {
                  const href = buildBlogHref(post.slug, post.locale ?? language);

                  return (
                    <article
                      key={`${post.locale ?? 'shared'}-${post.slug}`}
                      className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white"
                    >
                      <a href={href} className="block">
                        <div className="aspect-[16/11] overflow-hidden bg-slate-100">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            buildFallbackArtwork(post)
                          )}
                        </div>

                        <div className="space-y-4 p-5">
                          <h3 className="text-2xl font-bold leading-tight tracking-tight text-slate-950">{post.title}</h3>
                          {post.excerpt ? <p className="text-sm leading-7 text-slate-500">{post.excerpt}</p> : null}
                        </div>
                      </a>
                    </article>
                  );
                })}

                {recommendedPosts.length > 0 ? (
                  <aside className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight text-slate-950">{recommendedHeading}</h3>

                    <div className="border-t border-slate-200">
                      {recommendedPosts.map((post, index) => (
                        <a
                          key={`${post.locale ?? 'shared'}-${post.slug}-${index}`}
                          href={buildBlogHref(post.slug, post.locale ?? language)}
                          className="flex items-start gap-3 border-b border-slate-200 py-4 text-sm leading-6 text-slate-700 transition-colors hover:text-slate-950"
                        >
                          <span aria-hidden="true" className="mt-0.5 text-[#1173d4]">→</span>
                          <span>{post.title}</span>
                        </a>
                      ))}
                    </div>
                  </aside>
                ) : null}
              </div>
            </section>
          ) : null}

          <div className="space-y-10">
            {categorySections.map((section) => {
              const cardPosts = section.posts.slice(0, 2);
              const listPosts = section.posts.slice(2, 8);
              const hasListColumn = listPosts.length > 0;

              return (
                <section key={section.category.slug} id={buildSectionId(section.category.slug)} className="space-y-6 border-t border-slate-200 pt-10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <h2 className="text-3xl font-black tracking-tight text-slate-950">{titleCase(section.category.label)}</h2>
                    <span className="text-sm font-medium text-slate-500">{categoryCountLabel(section.posts.length)}</span>
                  </div>

                  <div
                    className={
                      hasListColumn
                        ? 'grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(280px,0.9fr)]'
                        : 'grid gap-6 md:grid-cols-2'
                    }
                  >
                    {cardPosts.map((post, index) => {
                      const href = buildBlogHref(post.slug, post.locale ?? language);

                      return (
                        <article
                          key={`${section.category.slug}-${post.locale ?? 'shared'}-${post.slug}-${index}`}
                          className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white"
                        >
                          <a href={href} className="block">
                            <div className="aspect-[16/11] overflow-hidden bg-slate-100">
                              {post.coverImage ? (
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                buildFallbackArtwork(post)
                              )}
                            </div>

                            <div className="space-y-4 p-5">
                              <h3 className="text-2xl font-bold leading-tight tracking-tight text-slate-950">{post.title}</h3>
                              {post.excerpt ? <p className="text-sm leading-7 text-slate-500">{post.excerpt}</p> : null}
                              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                  {categoryArchiveLabel}
                                </span>
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1173d4]">
                                  {readArticleLabel}
                                  <span aria-hidden="true">→</span>
                                </span>
                              </div>
                            </div>
                          </a>
                        </article>
                      );
                    })}

                    {hasListColumn ? (
                      <aside className="space-y-4">
                        <h3 className="text-lg font-bold tracking-tight text-slate-950">{categoryArchiveLabel}</h3>

                        <div className="border-t border-slate-200">
                          {listPosts.map((post, index) => (
                            <a
                              key={`${section.category.slug}-${post.locale ?? 'shared'}-${post.slug}-list-${index}`}
                              href={buildBlogHref(post.slug, post.locale ?? language)}
                              className="flex items-start gap-3 border-b border-slate-200 py-4 text-sm leading-6 text-slate-700 transition-colors hover:text-slate-950"
                            >
                              <span aria-hidden="true" className="mt-0.5 text-[#1173d4]">→</span>
                              <span>{post.title}</span>
                            </a>
                          ))}
                        </div>
                      </aside>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogIndexPage;
