import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('sanity studio contract', () => {
  it('defines post and category schema files for the blog', () => {
    const indexSource = readFileSync(path.join(process.cwd(), 'sanity-studio', 'schemaTypes', 'index.ts'), 'utf8');
    const postSource = readFileSync(path.join(process.cwd(), 'sanity-studio', 'schemaTypes', 'post.ts'), 'utf8');
    const categorySource = readFileSync(path.join(process.cwd(), 'sanity-studio', 'schemaTypes', 'category.ts'), 'utf8');

    expect(indexSource).toContain("from './post'");
    expect(indexSource).toContain("from './category'");
    expect(indexSource).toContain('postType');
    expect(indexSource).toContain('categoryType');

    expect(postSource).toContain("name: 'post'");
    expect(postSource).toContain("name: 'language'");
    expect(postSource).toContain("name: 'translationKey'");
    expect(postSource).toContain("name: 'title'");
    expect(postSource).toContain("name: 'slug'");
    expect(postSource).toContain("name: 'excerpt'");
    expect(postSource).toContain("name: 'seoTitle'");
    expect(postSource).toContain("name: 'seoDescription'");
    expect(postSource).toContain("name: 'publishedAt'");
    expect(postSource).toContain("name: 'bodyMarkdown'");
    expect(postSource).toContain("name: 'coverImage'");
    expect(postSource).toContain("name: 'category'");

    expect(categorySource).toContain("name: 'category'");
    expect(categorySource).toContain("name: 'title'");
    expect(categorySource).toContain("name: 'slug'");
  });

  it('defines a seed script for sample localized blog content', () => {
    const seedSource = readFileSync(path.join(process.cwd(), 'scripts', 'seed-sanity-blog.mjs'), 'utf8');

    expect(seedSource).toContain('SANITY_PROJECT_ID');
    expect(seedSource).toContain('SANITY_DATASET');
    expect(seedSource).toContain('SANITY_API_TOKEN');
    expect(seedSource).toContain('SANITY_API_KEY');
    expect(seedSource).toContain("_type: 'category'");
    expect(seedSource).toContain("_type: 'post'");
    expect(seedSource).toContain('translationKey');
    expect(seedSource).toContain('bodyMarkdown');
    expect(seedSource).toContain('/data/mutate/');
  });

  it('configures a fixed Sanity studio host for unattended deploys', () => {
    const cliSource = readFileSync(path.join(process.cwd(), 'sanity-studio', 'sanity.cli.ts'), 'utf8');

    expect(cliSource).toContain('studioHost');
    expect(cliSource).toContain('qualy-n55lf918');
    expect(cliSource).toContain('appId');
    expect(cliSource).toContain('ot1ps6g2osnr1rwap82yx8zg');
  });
});
