import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';

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

const buildFallbackArtwork = (post: BlogPostSummary) => {
  const palette = [
    'from-sky-100 via-white to-slate-200',
    'from-amber-50 via-stone-50 to-rose-100',
    'from-emerald-50 via-white to-teal-100',
    'from-slate-100 via-white to-indigo-100',
  ];
  const accent = [
    'bg-sky-400/80',
    'bg-amber-300/80',
    'bg-emerald-300/80',
    'bg-indigo-300/80',
  ];
  const index = Math.abs(post.slug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palette.length;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${palette[index]}`}>
      <div className="absolute inset-y-0 left-[18%] w-px bg-white/80" />
      <div className="absolute inset-y-0 left-[33%] w-px bg-slate-200/80" />
      <div className={`absolute inset-y-0 left-[34%] w-[34%] ${accent[index]}`} />
      <div className="absolute inset-y-0 right-[10%] w-px bg-slate-200/80" />
      <div className="absolute bottom-4 left-4 right-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {titleCase(getCategory(post, 'en').label)}
      </div>
    </div>
  );
};

const BlogIndexPage: React.FC<Props> = ({ initialPosts }) => {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPostSummary[]>(initialPosts ?? []);
  const [activeCategory, setActiveCategory] = useState('all');

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

  const uniqueCategories = new Map<string, BlogCategory>();
  for (const post of visiblePosts) {
    const category = getCategory(post, language);
    uniqueCategories.set(category.slug, category);
  }

  const categoryFilters = [
    {
      slug: 'all',
      label: language === 'en' ? 'All' : 'Tümü',
    },
    ...Array.from(uniqueCategories.values()),
  ];

  useEffect(() => {
    if (!categoryFilters.some((entry) => entry.slug === activeCategory)) {
      setActiveCategory('all');
    }
  }, [activeCategory, categoryFilters]);

  const filteredPosts = visiblePosts.filter((post) => activeCategory === 'all' || getCategory(post, language).slug === activeCategory);
  const [featuredPost, ...remainingPosts] = filteredPosts;
  const emptyStateLabel = language === 'en' ? 'No blog posts yet.' : 'Henüz blog yazısı yok.'; // empty state
  const readArticleLabel = language === 'en' ? 'Read article' : 'Yazıyı oku';
  const featuredLabel = language === 'en' ? 'Featured post' : 'Öne çıkan yazı';
  const categoryEmptyLabel =
    language === 'en'
      ? 'There are no posts in this category yet.'
      : 'Bu kategoride henüz yazı yok.';
  const featuredHref = featuredPost ? buildBlogHref(featuredPost.slug, featuredPost.locale ?? language) : null;

  return (
    <section className="bg-[#f6f7f8]">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-10">
        {!featuredPost ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
            {activeCategory === 'all' ? emptyStateLabel : categoryEmptyLabel}
          </div>
        ) : (
          <div className="space-y-8">
            <a
              href={featuredHref ?? undefined}
              aria-label={`${readArticleLabel}: ${featuredPost.title}`}
              className="group block rounded-[1.35rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1173d4]/20 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f7f8]"
            >
              <article className="relative overflow-hidden rounded-[1.35rem] bg-slate-900 shadow-[0_18px_70px_rgba(15,23,42,0.14)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
                <div className="absolute inset-0">
                  {featuredPost.coverImage ? (
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    buildFallbackArtwork(featuredPost)
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/82 to-slate-950/44" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/28 to-transparent" />
                </div>

                <div className="relative z-10 flex min-h-[320px] items-end p-6 sm:min-h-[420px] sm:p-10 lg:min-h-[520px] lg:p-12">
                  <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-4xl rounded-[1.75rem] bg-slate-950/55 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.3)] ring-1 ring-white/10 backdrop-blur-[2px] sm:p-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex rounded-full border border-white/70 bg-white/92 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-950 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur">
                          {featuredLabel}
                        </span>
                        <span className="inline-flex rounded-full border border-white/20 bg-slate-950/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                          {titleCase(getCategory(featuredPost, language).label)}
                        </span>
                      </div>
                      <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {featuredPost.title}
                      </h1>
                      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-50 sm:text-lg">
                        {featuredPost.excerpt}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200/90">
                        {featuredPost.publishedAt ? (
                          <span>{formatBlogDate(featuredPost.publishedAt, language)}</span>
                        ) : null}
                        {featuredPost.publishedAt ? (
                          <span className="h-1 w-1 rounded-full bg-white/40" />
                        ) : null}
                        <span>{getReadTimeLabel(featuredPost, language)}</span>
                      </div>
                    </div>

                    <div className="flex justify-start lg:justify-end">
                      <span className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-slate-900 transition-all duration-300 group-hover:bg-slate-100 group-hover:translate-x-1">
                        {readArticleLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </a>

            <div className="-mx-1 overflow-x-auto px-1 pb-4">
              <div className="flex items-center gap-3">
                {categoryFilters.map((filter) => (
                  <button
                    key={filter.slug}
                    type="button"
                    onClick={() => setActiveCategory(filter.slug)}
                    className={
                      activeCategory === filter.slug
                        ? 'flex h-10 shrink-0 items-center justify-center rounded-full border border-[#1173d4] bg-[#1173d4] px-6 text-sm font-bold text-white'
                        : 'flex h-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900'
                    }
                  >
                    {titleCase(filter.label)}
                  </button>
                ))}
              </div>
            </div>

            {remainingPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {remainingPosts.map((post, index) => {
                  const category = getCategory(post, language);
                  const href = buildBlogHref(post.slug, post.locale ?? language);

                  return (
                    <article
                      key={`${post.locale ?? 'shared'}-${post.slug}-${index}`}
                      className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]"
                    >
                      <a href={href} className="relative block overflow-hidden rounded-xl bg-slate-100 aspect-video">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          buildFallbackArtwork(post)
                        )}
                        <span className="absolute left-3 top-3 rounded-md bg-white/92 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-900">
                          {titleCase(category.label)}
                        </span>
                      </a>

                      <div className="flex flex-1 flex-col gap-3">
                        <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-[1.55rem]">
                          <a href={href} className="transition-colors group-hover:text-[#1173d4]">
                            {post.title}
                          </a>
                        </h2>
                        {post.excerpt ? <p className="text-sm leading-6 text-slate-500">{post.excerpt}</p> : null}
                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                          <div className="space-y-1">
                            {post.publishedAt ? (
                              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                {formatBlogDate(post.publishedAt, language)}
                              </p>
                            ) : null}
                            <p className="text-xs font-medium text-slate-400">{getReadTimeLabel(post, language)}</p>
                          </div>
                          <a
                            href={href}
                            aria-label={readArticleLabel}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#1173d4] transition-transform duration-200 group-hover:translate-x-1"
                          >
                            <span aria-hidden="true" className="text-xl">→</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogIndexPage;
