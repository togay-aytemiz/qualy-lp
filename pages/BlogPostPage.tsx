import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';

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
};

type Props = {
  slug: string;
  initialPost?: BlogPostRecord | null;
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

const getLocaleLabel = (post: BlogPostRecord, language: 'en' | 'tr') => {
  if (post.sharedAcrossLocales) {
    return language === 'en' ? 'Shared article' : 'Ortak yayin';
  }

  return post.locale === 'en' ? 'English' : 'Turkce';
};

const BlogPostPage: React.FC<Props> = ({ slug, initialPost }) => {
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPostRecord | null>(initialPost ?? null);

  useEffect(() => {
    if (initialPost !== undefined) return;

    let isMounted = true;

    const loadPost = async () => {
      const localeCandidates = language === 'en' ? ['en', 'tr'] : ['tr', 'en'];

      try {
        for (const locale of localeCandidates) {
          const response = await fetch(`/blog-posts/${locale}/${slug}.json`);
          if (!response.ok) {
            continue;
          }

          const data = (await response.json()) as BlogPostRecord;
          if (isMounted) setPost(data);
          return;
        }
      } catch {
        if (isMounted) setPost(null);
        return;
      }

      if (isMounted) setPost(null);
    };

    void loadPost();

    return () => {
      isMounted = false;
    };
  }, [initialPost, language, slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const backToBlogLabel = language === 'en' ? 'back to blog' : 'bloga dön';
  const backToBlogHref = language === 'en' ? '/en/blog' : '/blog';

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <a
          href={backToBlogHref}
          className="inline-flex items-center text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
          aria-label={backToBlogLabel}
        >
          {language === 'en' ? 'Back to blog' : 'Bloga dön'}
        </a>

        {post ? (
          <article className="mt-8 overflow-hidden rounded-[2rem] border border-slate-300 bg-[radial-gradient(120%_190%_at_0%_0%,#FFFFFF_0%,#F8FAFC_52%,#E2E8F0_100%)] p-2 shadow-lg">
            <div className="rounded-[calc(2rem-2px)] bg-white p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                  {getLocaleLabel(post, language)}
                </span>
                {post.publishedAt ? (
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {formatBlogDate(post.publishedAt, language)}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{post.title}</h1>
              {post.excerpt ? <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{post.excerpt}</p> : null}
              {post.coverImage ? (
                <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full object-cover"
                  />
                </div>
              ) : null}
              <div
                className="prose prose-slate mt-10 max-w-none"
                dangerouslySetInnerHTML={{ __html: post.contentHtml ?? post.content ?? '' }}
              />
            </div>
          </article>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
            {language === 'en' ? 'Post not found.' : 'Yazı bulunamadı.'}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPostPage;
