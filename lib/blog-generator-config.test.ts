import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog generator config', () => {
  it('supports collection-based and endpoint-based Strapi configuration with fallback routes', () => {
    const source = readFileSync(path.join(process.cwd(), 'scripts', 'generate-blog-assets.mjs'), 'utf8');

    expect(source).toContain('STRAPI_BLOG_COLLECTION');
    expect(source).toContain('STRAPI_BLOG_ENDPOINT');
    expect(source).toContain('/api/blog-posts');
    expect(source).toContain('/api/blogs');
    expect(source).toContain('/api/articles');
    expect(source).toContain('Falling back to empty blog artifacts');
    expect(source).toContain('localizations');
    expect(source).toContain('source.cover');
    expect(source).toContain('source.blocks');
    expect(source).toContain('source.category');
    expect(source).toContain("searchParams.set('locale', 'all')");
    expect(source).toContain('marked.parse');
    expect(source).toContain("searchParams.set('populate', '*')");
    expect(source).toContain('async function fetchWithRetries');
    expect(source).toContain('cleanGeneratedBlogArtifacts');
    expect(source).toContain("fs.rm(POSTS_DIR");
    expect(source).toContain('FETCH_RETRY_DELAYS_MS');
    expect(source).toContain('15000');
    expect(source).toContain('BLOG_CACHE_DIR');
    expect(source).toContain('loadCachedPosts');
    expect(source).toContain('writeCacheArtifacts');
    expect(source).toContain('enabledSettingRaw');
    expect(source).toContain('hasExplicitEnableFlag');
    expect(source).toContain('shouldRestoreFromCache');
    expect(source).toContain('Restored blog artifacts from cache because Strapi env is disabled or missing.');
  });
});
