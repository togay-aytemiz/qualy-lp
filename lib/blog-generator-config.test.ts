import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog generator config', () => {
  it('supports Sanity configuration, translation grouping, and cache fallback', () => {
    const source = readFileSync(path.join(process.cwd(), 'scripts', 'generate-blog-assets.mjs'), 'utf8');

    expect(source).toContain('SANITY_PROJECT_ID');
    expect(source).toContain('SANITY_DATASET');
    expect(source).toContain('SANITY_API_VERSION');
    expect(source).toContain('SANITY_API_TOKEN');
    expect(source).toContain('SANITY_API_KEY');
    expect(source).toContain('translationKey');
    expect(source).toContain('bodyMarkdown');
    expect(source).toContain('titleTr');
    expect(source).toContain('titleEn');
    expect(source).toContain('normalizeCategory(item?.category, locale)');
    expect(source).toContain('.env.local');
    expect(source).toContain('loadEnvironmentFiles');
    expect(source).toContain('/data/query/');
    expect(source).toContain("source: enabled ? 'sanity' : 'empty'");
    expect(source).toContain('Falling back to empty blog artifacts');
    expect(source).toContain('localizations');
    expect(source).toContain('marked.parse');
    expect(source).toContain('async function fetchWithRetries');
    expect(source).toContain('cleanGeneratedBlogArtifacts');
    expect(source).toContain("fs.rm(POSTS_DIR");
    expect(source).toContain('FETCH_RETRY_DELAYS_MS');
    expect(source).toContain('FETCH_TIMEOUT_MS');
    expect(source).toContain('15000');
    expect(source).toContain('controller.abort');
    expect(source).toContain('Sanity blog fetch timed out');
    expect(source).toContain('ENOTFOUND');
    expect(source).toContain("message.includes('fetch failed')");
    expect(source).toContain('BLOG_CACHE_DIR');
    expect(source).toContain('loadCachedPosts');
    expect(source).toContain('writeCacheArtifacts');
    expect(source).toContain('enabledSettingRaw');
    expect(source).toContain('hasExplicitEnableFlag');
    expect(source).toContain('shouldRestoreFromCache');
    expect(source).toContain('Restored blog artifacts from cache because Sanity env is disabled or missing.');
    expect(source).toContain('Sanity blog fetch failed');
  });
});
