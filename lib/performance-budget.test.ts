import { describe, expect, it } from 'vitest';
import { evaluateBudget } from '../scripts/check-performance-budget.mjs';

describe('evaluateBudget', () => {
  it('passes when metrics are under threshold', () => {
    const result = evaluateBudget(
      {
        js: { file: 'index.js', rawKb: 300, gzipKb: 120 },
        css: { file: 'index.css', rawKb: 40, gzipKb: 10 },
      },
      { maxJsGzipKb: 140, maxCssGzipKb: 30 }
    );

    expect(result.pass).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails when js gzip crosses threshold', () => {
    const result = evaluateBudget(
      {
        js: { file: 'index.js', rawKb: 400, gzipKb: 170 },
        css: { file: 'index.css', rawKb: 40, gzipKb: 10 },
      },
      { maxJsGzipKb: 140, maxCssGzipKb: 30 }
    );

    expect(result.pass).toBe(false);
    expect(result.errors[0]).toContain('JS gzip budget exceeded');
  });
});

