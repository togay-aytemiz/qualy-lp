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
  it('renders the blog index as a latest-led editorial layout with grouped category sections', () => {
    mockedLanguage.value = 'tr';

    const html = renderToStaticMarkup(
      <BlogIndexPage
        initialPosts={[
          {
            slug: 'qualy-ai-yanit-hizi',
            title: "Qualy'de AI ile yanit surelerini nasil kisalttik",
            excerpt: 'Destek ve operasyon akislarinda daha hizli cevap almak icin yaptigimiz iyilestirmeler.',
            publishedAt: '2026-03-17T09:00:00.000Z',
            locale: 'tr',
            contentHtml: '<p>icerik</p>',
            category: {
              slug: 'ai-automation',
              label: 'AI Otomasyonu',
            },
          },
          {
            slug: 'qualy-customer-stories',
            title: 'Musteri ekipleri hangi akislarda daha hizli donus aldi',
            excerpt: 'Gercek kullanim senaryolarindan kisa ozetler.',
            publishedAt: '2026-03-16T09:00:00.000Z',
            locale: 'tr',
            contentHtml: '<p>icerik</p>',
            category: {
              slug: 'customer-stories',
              label: 'Musteri Hikayeleri',
            },
          },
          {
            slug: 'qualy-product-playbook',
            title: 'Yeni urun akislarini tek ekranda toparlamak',
            excerpt: 'Operasyon playbook yapisini nasil sadeleştirdigimizi anlatiyoruz.',
            publishedAt: '2026-03-15T09:00:00.000Z',
            locale: 'tr',
            contentHtml: '<p>icerik</p>',
            category: {
              slug: 'product-updates',
              label: 'Ürün Güncellemeleri',
            },
          },
          {
            slug: 'qualy-blog-yayin-optimizasyonu',
            title: "Qualy blog'u yayina alirken neleri optimize ettik",
            excerpt: 'Kisa ozet',
            publishedAt: '2026-03-18T12:00:00.000Z',
            locale: 'tr',
            contentHtml: '<p>icerik</p>',
            category: {
              slug: 'product-updates',
              label: 'Ürün Güncellemeleri',
            },
          },
        ]}
      />
    );

    expect(html).toContain('En son');
    expect(html).toContain('id="blog-latest"');
    expect(html).toContain('Son yazılar');
    expect(html).toContain('Önerilenler');
    expect(html).toContain('id="blog-section-product-updates"');
    expect(html).toContain('id="blog-section-ai-automation"');
    expect(html).toContain('id="blog-section-customer-stories"');
    expect(html).toMatch(/<a href="\/blog\/qualy-blog-yayin-optimizasyonu"[^>]*>.*Yazıyı oku/s);
    expect(html).toContain('Kategorideki tüm yazılar');
    expect(html).not.toContain('bg-sky-500/15');
    expect(html).not.toContain('bg-slate-950/55');
    expect(html).not.toContain('ring-1 ring-white/10');
    expect(html).not.toContain('aria-pressed');
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
