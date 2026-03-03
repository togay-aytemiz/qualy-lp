import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

const mockedLanguage = vi.hoisted(() => ({ value: 'tr' as 'tr' | 'en' }));

vi.mock('../LanguageContext', () => ({
  useLanguage: () => ({ language: mockedLanguage.value }),
}));

import AboutPage from '../pages/AboutPage';

describe('about page content', () => {
  it('renders extended, Turkish SEO-focused copy without boxed wrapper and keeps company info lower', () => {
    mockedLanguage.value = 'tr';
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain('Neden Qualy?');
    expect(html).toContain('Kimler için uygun?');
    expect(html).toContain('Şirket Bilgisi');
    expect(html).toContain('askqualy@gmail.com');
    expect(html).toContain('underline');
    expect(html).toContain('potansiyel müşteri sınıflandırması');
    expect(html).toContain('WhatsApp otomatik yanıt');
    expect(html).toContain('Instagram mesaj yönetimi');
    expect(html).not.toContain('lead qualification');
    expect(html).not.toContain('rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8');

    const whyIndex = html.indexOf('Neden Qualy?');
    const companyIndex = html.indexOf('Şirket Bilgisi');
    expect(whyIndex).toBeGreaterThan(-1);
    expect(companyIndex).toBeGreaterThan(-1);
    expect(companyIndex).toBeGreaterThan(whyIndex);
  });
});
