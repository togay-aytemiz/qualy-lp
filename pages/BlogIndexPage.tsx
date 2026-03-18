import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';

type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  locale?: 'en' | 'tr';
  coverImage?: string | null;
  sharedAcrossLocales?: boolean;
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

const getLocalePillLabel = (post: BlogPostSummary, language: 'en' | 'tr') => {
  if (post.sharedAcrossLocales) {
    return language === 'en' ? 'Shared article' : 'Ortak yayin';
  }

  return post.locale === 'en' ? 'English' : 'Turkce';
};

const sortPostsByDate = (posts: BlogPostSummary[]) =>
  posts
    .slice()
    .sort((left, right) => String(right.publishedAt ?? '').localeCompare(String(left.publishedAt ?? '')));

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

  const visiblePosts = sortPostsByDate(
    posts.filter((post) => post.sharedAcrossLocales || !post.locale || post.locale === language),
  );
  const [featuredPost, ...remainingPosts] = visiblePosts;
  const emptyStateLabel = language === 'en' ? 'No blog posts yet.' : 'Henüz blog yazısı yok.'; // empty state
  const pageEyebrow = 'BLOG';
  const pageTitle = language === 'en' ? 'Blog' : 'Blog';
  const intro =
    language === 'en'
      ? 'Latest product notes, rollout updates, and practical guides.'
      : 'En güncel ürün notları, yayın notları ve pratik rehberler.';
  const featuredLabel = language === 'en' ? 'Latest drop' : 'Son yayin';
  const featuredFallbackExcerpt =
    language === 'en'
      ? 'Fresh notes from the product, sharp lessons from shipping, and practical guidance your team can use immediately.'
      : 'Urunden gelen taze notlar, yayin sirasinda cikan dersler ve ekiplerin hemen kullanabilecegi pratik rehberler.';
  const openArticleLabel = language === 'en' ? 'Read article' : 'Yaziyi ac';
  const archiveLabel = language === 'en' ? 'From the archive' : 'Arsivden diger yazilar';
  const archiveEmptyLabel =
    language === 'en'
      ? 'New posts will stack up here as the archive grows.'
      : 'Yeni yazilar geldikce arsiv burada birikecek.';
  const supportEyebrow = language === 'en' ? 'Reading lane' : 'Okuma hatti';
  const supportTitle = language === 'en' ? 'What shows up here' : 'Burada ne bulacaksin';
  const supportCopy =
    language === 'en'
      ? 'Shipping notes, operational lessons, and practical explainers collected in one quiet archive.'
      : 'Yayin notlari, operasyon dersleri ve pratik aciklamalar tek bir sakin arsivde toplaniyor.';
  const liveCountLabel =
    language === 'en'
      ? `${visiblePosts.length} live article${visiblePosts.length === 1 ? '' : 's'}`
      : `${visiblePosts.length} canli yazi`;
  const nextUpLabel = language === 'en' ? 'Next up' : 'Siradaki yazi';

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{pageEyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{pageTitle}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{intro}</p>
        </div>

        {!featuredPost ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
            {emptyStateLabel}
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            <article className="overflow-hidden rounded-[2rem] border border-slate-300 bg-[radial-gradient(120%_190%_at_0%_0%,#FFFFFF_0%,#F8FAFC_52%,#E2E8F0_100%)] p-2 shadow-lg">
              <div className="grid gap-6 rounded-[calc(2rem-2px)] bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:p-10">
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                        {featuredLabel}
                      </span>
                      <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {getLocalePillLabel(featuredPost, language)}
                      </span>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                      <a
                        href={buildBlogHref(featuredPost.slug, featuredPost.locale ?? language)}
                        className="transition-colors duration-200 hover:text-slate-700"
                      >
                        {featuredPost.title}
                      </a>
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                      {featuredPost.excerpt || featuredFallbackExcerpt}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    {featuredPost.publishedAt ? <span>{formatBlogDate(featuredPost.publishedAt, language)}</span> : null}
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{liveCountLabel}</span>
                  </div>

                  <a
                    href={buildBlogHref(featuredPost.slug, featuredPost.locale ?? language)}
                    className="mt-8 inline-flex w-fit items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    {openArticleLabel}
                  </a>
                </div>

                <div className="flex flex-col gap-4">
                  {featuredPost.coverImage ? (
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        className="h-full min-h-60 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{supportEyebrow}</p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{supportTitle}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{supportCopy}</p>

                    {remainingPosts[0] ? (
                      <div className="mt-5 rounded-2xl border border-white bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{nextUpLabel}</p>
                        <a
                          href={buildBlogHref(remainingPosts[0].slug, remainingPosts[0].locale ?? language)}
                          className="mt-2 block text-base font-semibold text-slate-900 transition-colors hover:text-slate-700"
                        >
                          {remainingPosts[0].title}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>

            {remainingPosts.length > 0 ? (
              <section aria-label={archiveLabel} className="rounded-[2rem] border border-dashed border-slate-300 p-4 sm:p-5">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {remainingPosts.map((post) => (
                    <article
                      key={`${post.locale ?? 'shared'}-${post.slug}`}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-1"
                    >
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <span>{getLocalePillLabel(post, language)}</span>
                        {post.publishedAt ? <span>{formatBlogDate(post.publishedAt, language)}</span> : null}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                        <a
                          href={buildBlogHref(post.slug, post.locale ?? language)}
                          className="transition-colors duration-200 hover:text-slate-700"
                        >
                          {post.title}
                        </a>
                      </h3>
                      {post.excerpt ? <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p> : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
                {archiveEmptyLabel}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogIndexPage;
