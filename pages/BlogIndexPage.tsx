import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';

type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  locale?: 'en' | 'tr';
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

  const visiblePosts = posts.filter((post) => !post.locale || post.locale === language);
  const emptyStateLabel = language === 'en' ? 'No blog posts yet.' : 'Henüz blog yazısı yok.'; // empty state
  const pageTitle = language === 'en' ? 'Blog' : 'Blog';
  const intro =
    language === 'en'
      ? 'Latest product notes, rollout updates, and practical guides.'
      : 'En güncel ürün notları, yayın notları ve pratik rehberler.';

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{pageTitle}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{pageTitle}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{intro}</p>

        {visiblePosts.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
            {emptyStateLabel}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {visiblePosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {post.locale === 'en' ? 'English' : 'Turkish'}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">
                  <a href={buildBlogHref(post.slug, post.locale ?? language)} className="hover:underline">
                    {post.title}
                  </a>
                </h2>
                {post.excerpt ? <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p> : null}
                {post.publishedAt ? (
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    {post.publishedAt}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogIndexPage;
