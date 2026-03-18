import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

const mockedLanguage = vi.hoisted(() => ({ value: 'tr' as 'tr' | 'en' }));

vi.mock('../LanguageContext', () => ({
  useLanguage: () => ({ language: mockedLanguage.value }),
}));

import BlogIndexPage from '../pages/BlogIndexPage';
import BlogPostPage from '../pages/BlogPostPage';

describe('blog layout render', () => {
  it('renders the featured blog card with a more relaxed title leading and a high-contrast badge', () => {
    mockedLanguage.value = 'tr';

    const html = renderToStaticMarkup(
      <BlogIndexPage
        initialPosts={[
          {
            slug: 'qualy-blog-yayin-optimizasyonu',
            title: "Qualy blog'u yayina alirken neleri optimize ettik",
            excerpt: 'Kisa ozet',
            publishedAt: '2026-03-18T09:00:00.000Z',
            locale: 'tr',
            contentHtml: '<p>icerik</p>',
            category: {
              slug: 'product-updates',
              label: 'Product Updates',
            },
          },
        ]}
      />
    );

    expect(html).toContain('leading-[1.02]');
    expect(html).toContain('bg-white/92');
    expect(html).toContain('text-slate-950');
    expect(html).not.toContain('bg-sky-500/15');
  });

  it('renders the blog detail page as a single-column article layout without boxed chrome or a sticky sidebar', () => {
    mockedLanguage.value = 'tr';

    const html = renderToStaticMarkup(
      <BlogPostPage
        slug="qualy-blog-yayin-optimizasyonu"
        initialPost={{
          slug: 'qualy-blog-yayin-optimizasyonu',
          title: "Qualy blog'u yayina alirken neleri optimize ettik",
          excerpt: 'Kisa ozet',
          publishedAt: '2026-03-18T09:00:00.000Z',
          locale: 'tr',
          contentHtml: '<p>Paragraf</p><h2>Ara baslik</h2><p>Devam</p>',
          category: {
            slug: 'product-updates',
            label: 'Product Updates',
          },
        }}
      />
    );

    expect(html).toContain('blog-article-content');
    expect(html).toContain('mx-auto w-full max-w-3xl');
    expect(html).not.toContain('lg:grid-cols-12');
    expect(html).not.toContain('lg:sticky lg:top-28');
    expect(html).not.toContain('rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10');
  });
});
