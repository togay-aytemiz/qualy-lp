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
};

type Props = {
  slug: string;
  initialPost?: BlogPostRecord | null;
};

const BlogPostPage: React.FC<Props> = ({ slug, initialPost }) => {
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPostRecord | null>(initialPost ?? null);

  useEffect(() => {
    if (initialPost !== undefined) return;

    let isMounted = true;

    const loadPost = async () => {
      try {
        const response = await fetch(`/blog-posts/${language}/${slug}.json`);
        if (!response.ok) {
          if (isMounted) setPost(null);
          return;
        }

        const data = (await response.json()) as BlogPostRecord;
        if (isMounted) setPost(data);
      } catch {
        if (isMounted) setPost(null);
      }
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
          <article className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              {post.locale === 'en' ? 'English' : 'Turkish'}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{post.title}</h1>
            {post.excerpt ? <p className="mt-4 text-base leading-7 text-slate-600">{post.excerpt}</p> : null}
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="mt-8 w-full rounded-3xl border border-slate-200 object-cover"
              />
            ) : null}
            <div
              className="prose prose-slate mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: post.contentHtml ?? post.content ?? '' }}
            />
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
