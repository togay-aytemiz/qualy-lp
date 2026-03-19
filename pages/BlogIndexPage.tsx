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

const buildSectionId = (slug: string) => {
  if (slug === 'latest') return 'blog-latest';
  if (slug === 'all') return 'blog-categories';
  return `blog-section-${slug}`;
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
  const [activeCategory, setActiveCategory] = useState('latest');

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

  const visiblePosts = selectVisiblePosts(posts, language);
  const latestPosts = visiblePosts.slice(0, 4);
  const emptyStateLabel = language === 'en' ? 'No blog posts yet.' : 'Henüz blog yazısı yok.'; // empty state
  const readArticleLabel = language === 'en' ? 'Read article' : 'Yazıyı oku';
  const readArticleVisualLabel = readArticleLabel;
  const latestLabel = language === 'en' ? 'Latest' : 'En son';
  const allCategoriesLabel = language === 'en' ? 'All categories' : 'Tüm kategoriler';
  const sectionHeadingLabel = language === 'en' ? 'Blog sections' : 'Blog bolumleri';
  const sectionBodyLabel = language === 'en' ? 'All posts in this category' : 'Kategorideki tüm yazılar';
  const categoryMetaLabel = language === 'en' ? 'Category' : 'Kategori';
  const newerLabel = language === 'en' ? 'Newer' : 'Daha yeni';

  const categoryMap = new Map<string, BlogCategory>();
  for (const post of visiblePosts) {
    const category = getCategory(post, language);
    categoryMap.set(category.slug, category);
  }

  const categorySections = Array.from(categoryMap.values()).map((category) => ({
    category,
    posts: visiblePosts.filter((post) => getCategory(post, language).slug === category.slug),
  }));

  useEffect(() => {
    if (typeof document === 'undefined') return;
    applySeoToDocument(document, getSeoByRoute('blogIndex', language));
  }, [language]);

  const navigationItems = [
    {
      slug: 'latest',
      label: latestLabel,
    },
    {
      slug: 'all',
      label: allCategoriesLabel,
    },
    ...Array.from(categoryMap.values()).map((category) => ({
      slug: category.slug,
      label: titleCase(category.label),
    })),
  ];

  useEffect(() => {
    if (!navigationItems.some((entry) => entry.slug === activeCategory)) {
      setActiveCategory('latest');
    }
  }, [activeCategory, navigationItems]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const target = document.getElementById(buildSectionId(activeCategory));
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeCategory]);

  if (visiblePosts.length === 0) {
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
        <div className="space-y-14">
          <section id="blog-latest" className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1173d4]">{latestLabel}</p>
                <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  {language === 'en' ? 'Fresh notes from the Qualy team' : 'Qualy ekibinden en yeni notlar'}
                </h1>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-500">
                {language === 'en'
                  ? 'Browse the newest product, workflow, and customer story updates first.'
                  : 'En yeni urun, is akis ve musteri hikayesi guncellemelerini once gorun.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
              {latestPosts[0] ? (
                <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
                  <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(300px,0.78fr)]">
                    <div className="flex flex-col justify-between p-7 sm:p-10">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1173d4]">{newerLabel}</p>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {titleCase(getCategory(latestPosts[0], language).label)}
                        </p>
                        <h2 className="mt-5 text-4xl font-black leading-[1.02] tracking-tight text-slate-950">
                          {latestPosts[0].title}
                        </h2>
                        {latestPosts[0].excerpt ? (
                          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            {latestPosts[0].excerpt}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-8 flex flex-col gap-5 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {latestPosts[0].publishedAt ? <span>{formatBlogDate(latestPosts[0].publishedAt, language)}</span> : null}
                          {latestPosts[0].publishedAt ? <span className="h-1 w-1 rounded-full bg-slate-300" /> : null}
                          <span>{getReadTimeLabel(latestPosts[0], language)}</span>
                        </div>
                        <a
                          href={buildBlogHref(latestPosts[0].slug, latestPosts[0].locale ?? language)}
                          className="inline-flex items-center gap-2 text-sm font-bold text-slate-950 transition-colors hover:text-[#1173d4]"
                          aria-label={`${readArticleLabel}: ${latestPosts[0].title}`}
                        >
                          {readArticleLabel}
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>

                    <div className="min-h-[280px] bg-slate-100">
                      {latestPosts[0].coverImage ? (
                        <img
                          src={latestPosts[0].coverImage}
                          alt={latestPosts[0].title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        buildFallbackArtwork(latestPosts[0])
                      )}
                    </div>
                  </div>
                </article>
              ) : null}

              <div className="grid grid-cols-1 gap-4">
                {latestPosts.slice(1).map((post) => {
                  const category = getCategory(post, language);
                  const href = buildBlogHref(post.slug, post.locale ?? language);

                  return (
                    <article
                      key={`${post.locale ?? 'shared'}-${post.slug}`}
                      className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        {titleCase(category.label)}
                      </p>
                      <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-950">
                        {post.title}
                      </h3>
                      {post.excerpt ? (
                        <p className="mt-3 text-sm leading-7 text-slate-500">{post.excerpt}</p>
                      ) : null}
                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {getReadTimeLabel(post, language)}
                        </div>
                        <a href={href} className="inline-flex items-center gap-2 text-sm font-bold text-[#1173d4] transition-colors hover:text-[#0f5fae]">
                          {readArticleLabel}
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="blog-categories" className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{allCategoriesLabel}</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{sectionHeadingLabel}</h2>
              </div>
              <p className="text-sm leading-7 text-slate-500">{sectionBodyLabel}</p>
            </div>

            <div className="-mx-1 overflow-x-auto pb-2">
              <div className="flex min-w-max items-center gap-6 border-b border-slate-200 px-1">
                {navigationItems.map((filter) => (
                  <button
                    key={filter.slug}
                    type="button"
                    onClick={() => setActiveCategory(filter.slug)}
                    aria-pressed={activeCategory === filter.slug}
                    className={
                      activeCategory === filter.slug
                        ? 'shrink-0 border-b-2 border-slate-950 pb-3 text-sm font-semibold text-slate-950'
                        : 'shrink-0 border-b-2 border-transparent pb-3 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950'
                    }
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="space-y-10">
            {categorySections.map((section) => {
              const sectionId = buildSectionId(section.category.slug);

              return (
                <section key={section.category.slug} id={sectionId} className="space-y-5 scroll-mt-32">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{categoryMetaLabel}</p>
                      <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        {titleCase(section.category.label)}
                      </h3>
                    </div>
                    <span className="text-sm font-medium text-slate-500">
                      {section.posts.length} {language === 'en' ? 'articles' : 'yazı'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {section.posts.map((post) => {
                      const href = buildBlogHref(post.slug, post.locale ?? language);

                      return (
                        <article
                          key={`${section.category.slug}-${post.locale ?? 'shared'}-${post.slug}`}
                          className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
                        >
                          <a href={href} className="block aspect-[16/10] overflow-hidden bg-slate-100">
                            {post.coverImage ? (
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              buildFallbackArtwork(post)
                            )}
                          </a>

                          <div className="flex flex-1 flex-col p-5">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                              {post.publishedAt ? formatBlogDate(post.publishedAt, language) : getReadTimeLabel(post, language)}
                            </p>
                            <h4 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-950">
                              {post.title}
                            </h4>
                            {post.excerpt ? (
                              <p className="mt-3 text-sm leading-7 text-slate-500">{post.excerpt}</p>
                            ) : null}
                            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
                              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                {sectionBodyLabel}
                              </span>
                              <a href={href} className="inline-flex items-center gap-2 text-sm font-bold text-[#1173d4] transition-colors hover:text-[#0f5fae]">
                                {readArticleLabel}
                                <span aria-hidden="true">→</span>
                              </a>
                            </div>
                          </div>
                        </article>
                      );
                    })}
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
