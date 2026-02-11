import { describe, expect, it } from 'vitest';
import { buildRobotsTxt } from './robots';

describe('buildRobotsTxt', () => {
  it('includes allow all and sitemap declaration', () => {
    const robots = buildRobotsTxt('https://askqualy.com');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://askqualy.com/sitemap.xml');
  });
});

