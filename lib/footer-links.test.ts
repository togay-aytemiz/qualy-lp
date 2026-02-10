import { describe, expect, it } from 'vitest';
import { buildHomeSectionHref, getProductFooterSectionId, isHomePath } from './footer-links';

describe('getProductFooterSectionId', () => {
  it('maps product links to existing home sections', () => {
    expect(getProductFooterSectionId('features')).toBe('features');
    expect(getProductFooterSectionId('pricing')).toBe('pricing');
    expect(getProductFooterSectionId('leadScoring')).toBe('testimonials');
    expect(getProductFooterSectionId('updates')).toBe('how-it-works');
  });
});

describe('buildHomeSectionHref', () => {
  it('builds hash routes pointing to home sections', () => {
    expect(buildHomeSectionHref('features')).toBe('/#features');
    expect(buildHomeSectionHref('pricing')).toBe('/#pricing');
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
