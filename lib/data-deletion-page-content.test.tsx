import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

const mockedLanguage = vi.hoisted(() => ({ value: 'tr' as 'tr' | 'en' }));

vi.mock('../LanguageContext', () => ({
  useLanguage: () => ({ language: mockedLanguage.value }),
}));

import DataDeletionPage from '../pages/DataDeletionPage';

describe('data deletion page content', () => {
  it('renders only Turkish content when language is tr', () => {
    mockedLanguage.value = 'tr';
    const html = renderToStaticMarkup(<DataDeletionPage />);

    expect(html).toContain('Veri Silme Talimatlari');
    expect(html).toContain('Nasil silerim?');
    expect(html).not.toContain('How do I delete my data?');
  });

  it('renders only English content when language is en', () => {
    mockedLanguage.value = 'en';
    const html = renderToStaticMarkup(<DataDeletionPage />);

    expect(html).toContain('Data Deletion Instructions');
    expect(html).toContain('How do I delete my data?');
    expect(html).not.toContain('Nasil silerim?');
  });

  it('keeps enough top spacing for fixed navbar', () => {
    mockedLanguage.value = 'en';
    const html = renderToStaticMarkup(<DataDeletionPage />);

    expect(html).toContain('pt-28');
  });
});
