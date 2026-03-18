import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';

type BlogCategory = {
  slug: string;
  label: string;
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
  category?: BlogCategory | null;
};

type Props = {
  slug: string;
  initialPost?: BlogPostRecord | null;
};

const buildBlogHref = (slug: string, locale: 'en' | 'tr') => (locale === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`);

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

  const backToBlogLabel = language === 'en' ? 'Back to blog' : 'Bloga dön';
  const backToBlogAriaLabel = language === 'en' ? 'back to blog' : 'bloga dön';
  const backToBlogHref = language === 'en' ? '/en/blog' : '/blog';
  const relatedArticlesLabel = language === 'en' ? 'Related articles' : 'İlgili yazılar';
  const viewAllArticlesLabel = language === 'en' ? 'View all articles' : 'Tüm yazıları gör';
  const notFoundLabel = language === 'en' ? 'Post not found.' : 'Yazı bulunamadı.';
  const postCategory = post ? getCategory(post, language) : null;
  const articleSpanClass = relatedPosts.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12 xl:col-span-10 xl:col-start-2';

  return (
    <section className="bg-[#f6f7f8]">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
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

        {post ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <article className={`${articleSpanClass} rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10`}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-600">
                    {titleCase(postCategory?.label ?? '')}
                  </span>
                  {post.publishedAt ? (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {formatBlogDate(post.publishedAt, language)}
                    </span>
                  ) : null}
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {getReadTimeLabel(post, language)}
                  </span>
                </div>

                <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-5xl">
                  {post.title}
                </h1>
                {post.excerpt ? (
                  <p className="max-w-4xl text-xl font-medium leading-9 text-slate-700">
                    {post.excerpt}
                  </p>
                ) : null}
              </div>

              <div className="mt-8 overflow-hidden rounded-[1.35rem] bg-slate-100 shadow-[0_12px_36px_rgba(15,23,42,0.08)]">
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

              <div
                className="prose prose-slate mt-10 max-w-none text-slate-700 prose-headings:font-black prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-3xl prose-h3:mt-10 prose-h3:text-2xl prose-p:leading-8 prose-li:leading-8 prose-figure:my-8 prose-blockquote:border-l-4 prose-blockquote:border-[#1173d4] prose-blockquote:bg-[#1173d4]/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic"
                dangerouslySetInnerHTML={{ __html: post.contentHtml ?? post.content ?? '' }}
              />
            </article>

            {relatedPosts.length > 0 ? (
              <aside className="lg:col-span-4">
                <div className="space-y-6 lg:sticky lg:top-28">
                  <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-2">
                      <span className="text-lg text-[#1173d4]">↗</span>
                      <h2 className="text-lg font-bold text-slate-900">{relatedArticlesLabel}</h2>
                    </div>

                    <div className="space-y-5">
                      {relatedPosts.map((relatedPost) => {
                        const href = buildBlogHref(relatedPost.slug, relatedPost.locale ?? language);
                        const relatedCategory = getCategory(relatedPost, language);

                        return (
                          <a
                            key={`${relatedPost.locale ?? 'shared'}-${relatedPost.slug}`}
                            href={href}
                            className="group flex gap-4"
                          >
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
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
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-sm font-bold leading-6 text-slate-900 transition-colors group-hover:text-[#1173d4]">
                                {relatedPost.title}
                              </h3>
                              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                {titleCase(relatedCategory.label)} • {getReadTimeLabel(relatedPost, language)}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>

                    <a
                      href={backToBlogHref}
                      className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      {viewAllArticlesLabel}
                    </a>
                  </div>
                </div>
              </aside>
            ) : null}
          </div>
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
