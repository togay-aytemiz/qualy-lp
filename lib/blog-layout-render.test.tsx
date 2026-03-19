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
  it('renders the blog index as a category-led archive with a single default grid layout', () => {
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

    expect(html).toContain('Tümü');
    expect(html).toContain('Filtrele');
    expect(html).toContain('AI Otomasyonu');
    expect(html).toContain('Musteri Hikayeleri');
    expect(html).toContain('Ürün Güncellemeleri');
    expect(html).toContain('grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3');
    expect(html).toContain('aspect-square');
    expect(html).toContain('block w-full pt-4');
    expect(html).toMatch(/<a[^>]+href="\/blog\/qualy-blog-yayin-optimizasyonu"[^>]*>.*Qualy blog&#x27;u yayina alirken neleri optimize ettik/s);
    expect(html).not.toContain('border-b border-slate-200 py-8');
    expect(html).not.toContain('md:basis-[17rem] md:shrink-0');
    expect(html).not.toContain('Sırala');
    expect(html).not.toContain('name="mediaView"');
    expect(html).not.toContain('value="grid"');
    expect(html).not.toContain('value="list"');
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
    expect(html).toMatch(/<header[^>]*>.*18 Mar 2026.*4 dk okuma.*Qualy blog&#x27;u yayina alirken neleri optimize ettik/s);
    expect(html).not.toMatch(/<header[^>]*>.*Product Updates.*18 Mar 2026.*4 dk okuma/s);
    expect(html).not.toContain('rounded-full border border-slate-200 bg-white px-3 py-1');
    expect(html).not.toContain('lg:grid-cols-12');
    expect(html).not.toContain('lg:sticky lg:top-28');
    expect(html).not.toContain('rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10');
  });
});
