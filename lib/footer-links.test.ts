import { describe, expect, it } from 'vitest';
import { buildHomeSectionHref, getProductFooterSectionId, isHomePath, PRICING_PAGE_HREF } from './footer-links';

describe('getProductFooterSectionId', () => {
  it('maps product links to existing home sections', () => {
    expect(getProductFooterSectionId('features')).toBe('features');
    expect(getProductFooterSectionId('faq')).toBe('faq');
    expect(getProductFooterSectionId('leadScoring')).toBe('testimonials');
    expect(getProductFooterSectionId('updates')).toBe('how-it-works');
  });
});

describe('buildHomeSectionHref', () => {
  it('builds hash routes pointing to home sections', () => {
    expect(buildHomeSectionHref('features')).toBe('/#features');
    expect(buildHomeSectionHref('how-it-works')).toBe('/#how-it-works');
  });
});

describe('PRICING_PAGE_HREF', () => {
  it('uses dedicated pricing route', () => {
    expect(PRICING_PAGE_HREF).toBe('/pricing');
  });
});

describe('isHomePath', () => {
  it('accepts root path and rejects nested routes', () => {
    expect(isHomePath('/')).toBe(true);
    expect(isHomePath('')).toBe(true);
    expect(isHomePath('/terms')).toBe(false);
    expect(isHomePath('/legal')).toBe(false);
  });
});
