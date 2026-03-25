import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { applySeoToDocument } from '../lib/seo-dom';
import { getSeoByRoute } from '../lib/seo';
import { getDisplayCategory, sortDisplayCategories } from '../lib/blog-categories';

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

type ArchiveCardProps = {
  post: BlogPostSummary;
  language: 'en' | 'tr';
};

const INITIAL_VISIBLE_COUNT = 9;
const SCROLL_FADE_EPSILON = 4;

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

const buildCategoryOptions = (posts: BlogPostSummary[], language: 'en' | 'tr') => {
  return sortDisplayCategories(posts.map((post) => getDisplayCategory(post.category, language)), language);
};

const buildFallbackArtwork = (post: BlogPostSummary) => {
  const palettes = [
    {
      base: 'from-[#dbeafe] via-[#eff6ff] to-[#93c5fd]',
      orbA: 'bg-[#60a5fa]/55',
      orbB: 'bg-white/70',
      orbC: 'bg-[#1d4ed8]/20',
    },
    {
      base: 'from-[#fde68a] via-[#fff7ed] to-[#fda4af]',
      orbA: 'bg-[#fb7185]/45',
      orbB: 'bg-white/70',
      orbC: 'bg-[#f97316]/20',
    },
    {
      base: 'from-[#ede9fe] via-[#e0f2fe] to-[#2563eb]',
      orbA: 'bg-[#8b5cf6]/45',
      orbB: 'bg-[#bfdbfe]/65',
      orbC: 'bg-[#1d4ed8]/25',
    },
    {
      base: 'from-[#dcfce7] via-[#cffafe] to-[#0f766e]',
      orbA: 'bg-[#14b8a6]/35',
      orbB: 'bg-[#a7f3d0]/45',
      orbC: 'bg-[#14532d]/18',
    },
  ];
  const index = Math.abs(post.slug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palettes.length;
  const palette = palettes[index];

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${palette.base}`}>
      <div className={`absolute -left-10 bottom-[-12%] h-40 w-40 rounded-full blur-3xl ${palette.orbA}`} />
      <div className={`absolute right-[-10%] top-[8%] h-36 w-36 rounded-full blur-3xl ${palette.orbB}`} />
      <div className={`absolute left-[28%] top-[18%] h-28 w-28 rounded-full blur-2xl ${palette.orbC}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_48%),linear-gradient(160deg,transparent_15%,rgba(15,23,42,0.06)_100%)]" />
    </div>
  );
};

const ArchiveCard = ({ post, language }: ArchiveCardProps) => {
  const category = getDisplayCategory(post.category, language);
  const dateLabel = formatBlogDate(post.publishedAt, language);
  const href = buildBlogHref(post.slug, post.locale ?? language);
  const cardLabel = [post.title, category.label, dateLabel].filter(Boolean).join(' - ');

  return (
    <article className="group relative">
      <div className="absolute inset-x-0 top-0 aspect-square rounded-md bg-slate-100" />
      <div className="relative mx-auto w-full overflow-hidden rounded-md transition-opacity duration-300">
        <div className="relative aspect-square w-full overflow-hidden rounded-md">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.025]"
              loading="lazy"
            />
          ) : (
            buildFallbackArtwork(post)
          )}
        </div>
      </div>

      <a
        href={href}
        aria-label={cardLabel}
        className="block w-full pt-4 transition-[opacity,background] duration-300 after:absolute after:inset-0 after:content-['']"
      >
        <div className="relative w-full text-slate-950">
          <h2 className="pr-4 text-[1.35rem] font-medium leading-[1.14] tracking-tight transition-colors group-hover:text-slate-700">
            {post.title}
          </h2>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-medium text-slate-900">{category.label}</span>
            {dateLabel ? (
              <time className="text-slate-400" dateTime={post.publishedAt}>
                {dateLabel}
              </time>
            ) : null}
          </p>
        </div>
      </a>
    </article>
  );
};

const BlogIndexPage: React.FC<Props> = ({ initialPosts }) => {
  const { language } = useLanguage();
  const categoryRailRef = useRef<HTMLDivElement | null>(null);
  const [posts, setPosts] = useState<BlogPostSummary[]>(initialPosts ?? []);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    let isMounted = true;
    const refreshKey = String(Date.now());

    const loadManifest = async () => {
      try {
        const manifestUrl = new URL('/blog_manifest.json', window.location.origin);
        manifestUrl.searchParams.set('ts', refreshKey);

        const response = await fetch(manifestUrl.toString(), { cache: 'no-store' });
        if (!response.ok) {
          if (isMounted && initialPosts === undefined) setPosts([]);
          return;
        }

        const data = await response.json();
        if (isMounted) {
          setPosts(normalizeManifestPosts(data));
        }
      } catch {
        if (isMounted && initialPosts === undefined) setPosts([]);
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

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [language, selectedCategorySlug]);

  const visiblePosts = selectVisiblePosts(posts, language);
  const categories = buildCategoryOptions(visiblePosts, language);
  const selectedCategory = categories.find((category) => category.slug === selectedCategorySlug) ?? null;
  const activeCategorySlug = selectedCategory ? selectedCategorySlug : 'all';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const railElement = categoryRailRef.current;
    if (!railElement) return;

    const updateFades = () => {
      const maxScrollLeft = railElement.scrollWidth - railElement.clientWidth;
      const canScroll = maxScrollLeft > SCROLL_FADE_EPSILON;

      if (!canScroll) {
        setShowLeftFade(false);
        setShowRightFade(false);
        return;
      }

      setShowLeftFade(railElement.scrollLeft > SCROLL_FADE_EPSILON);
      setShowRightFade(railElement.scrollLeft < maxScrollLeft - SCROLL_FADE_EPSILON);
    };

    const animationFrameId = window.requestAnimationFrame(updateFades);

    railElement.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      railElement.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
    };
  }, [categories.length, language, selectedCategorySlug]);

  const allLabel = language === 'en' ? 'All' : 'Tümü';
  const categoryNavLabel = language === 'en' ? 'Blog categories' : 'Blog kategorileri';
  const emptyStateLabel = language === 'en' ? 'No blog posts yet.' : 'Henüz blog yazısı yok.'; // empty state
  const noCategoryPostsLabel = language === 'en' ? 'No posts in this category yet.' : 'Bu kategoride henüz yazı yok.';
  const loadMoreLabel = language === 'en' ? 'Load more' : 'Daha fazla yükle';

  const activeHeading = selectedCategory?.label ?? allLabel;
  const filteredPosts = activeCategorySlug === 'all'
    ? visiblePosts
    : visiblePosts.filter((post) => getDisplayCategory(post.category, language).slug === activeCategorySlug);
  const renderedPosts = filteredPosts.slice(0, visibleCount);
  const canLoadMore = filteredPosts.length > renderedPosts.length;

  const handleCategoryChange = (slug: string) => {
    setSelectedCategorySlug(slug);
  };

  if (visiblePosts.length === 0) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36 lg:px-10 lg:pt-40">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl font-medium tracking-tight text-slate-950 sm:text-5xl">{allLabel}</h1>
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-slate-600">
              {emptyStateLabel}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36 lg:px-10 lg:pt-40">
        <div className="flex flex-col gap-16">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-medium tracking-tight text-slate-950 sm:text-5xl">{activeHeading}</h1>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative min-w-0">
                <div ref={categoryRailRef} className="mobile-scrollbar-hide overflow-x-auto overflow-y-hidden pb-2">
                  <nav aria-label={categoryNavLabel}>
                    <ul className="flex min-w-max items-center gap-5 whitespace-nowrap text-base font-medium tracking-tight text-slate-500 sm:gap-6 sm:text-[1.05rem] lg:text-[1.15rem]">
                      {categories.map((category) => {
                        const isActive = activeCategorySlug === category.slug;

                        return (
                          <li key={category.slug}>
                            <button
                              type="button"
                              onClick={() => handleCategoryChange(category.slug)}
                              className={`rounded-sm transition-colors ${
                                isActive ? 'text-slate-950' : 'text-slate-500 hover:text-slate-800'
                              }`}
                              aria-pressed={isActive}
                            >
                              {category.label}
                            </button>
                          </li>
                        );
                      })}

                      <li>
                        <button
                          type="button"
                          onClick={() => handleCategoryChange('all')}
                          className={`rounded-sm transition-colors ${
                            activeCategorySlug === 'all' ? 'text-slate-950' : 'text-slate-500 hover:text-slate-800'
                          }`}
                          aria-pressed={activeCategorySlug === 'all'}
                        >
                          {allLabel}
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-white/95 to-transparent transition-opacity duration-200 sm:hidden ${
                    showLeftFade ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-white/95 to-transparent transition-opacity duration-200 sm:hidden ${
                    showRightFade ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            </div>
          </section>

          <section>
            {renderedPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {renderedPosts.map((post) => (
                  <ArchiveCard
                    key={`${post.locale ?? 'shared'}-${post.slug}`}
                    language={language}
                    post={post}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-slate-600">
                {noCategoryPostsLabel}
              </div>
            )}

            {canLoadMore ? (
              <div className="flex justify-center pt-10">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + INITIAL_VISIBLE_COUNT)}
                  className="inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
                >
                  {loadMoreLabel}
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </section>
  );
};

export default BlogIndexPage;
