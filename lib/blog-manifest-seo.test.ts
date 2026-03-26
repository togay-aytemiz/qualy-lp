import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

type BlogManifestEntry = {
  canonicalUrl?: string;
  localizations?: Array<{
    canonicalUrl?: string;
  }>;
};

type BlogManifestPayload = {
  posts?: BlogManifestEntry[];
};

describe('blog manifest seo urls', () => {
  it('publishes trailing-slash canonical urls for blog posts and localizations', () => {
    const manifest = JSON.parse(
      readFileSync(path.join(process.cwd(), 'public', 'blog_manifest.json'), 'utf8')
    ) as BlogManifestPayload;

    const posts = Array.isArray(manifest.posts) ? manifest.posts : [];
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.canonicalUrl).toMatch(/^https:\/\/www\.askqualy\.com\/.+\/$/);
      for (const localization of post.localizations ?? []) {
        expect(localization.canonicalUrl).toMatch(/^https:\/\/www\.askqualy\.com\/.+\/$/);
      }
    }
  });
});
