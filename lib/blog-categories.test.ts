import { describe, expect, it } from 'vitest';
import { categoryDefinitions } from '../scripts/sanity-blog-categories.mjs';
import { getDisplayCategory, sortDisplayCategories } from './blog-categories';

describe('blog categories', () => {
  it('defines the new Sanity taxonomy with respond-style category names', () => {
    expect(
      categoryDefinitions.map((category) => ({
        slug: category.slug,
        titleEn: category.titleEn,
        titleTr: category.titleTr,
      }))
    ).toEqual([
      {
        slug: 'ultimate-guide',
        titleEn: 'Ultimate Guide',
        titleTr: 'Kapsamlı Rehber',
      },
      {
        slug: 'how-to-article',
        titleEn: 'How To Article',
        titleTr: 'Nasıl Yapılır',
      },
      {
        slug: 'practical-guide',
        titleEn: 'Practical Guide',
        titleTr: 'Pratik Rehber',
      },
      {
        slug: 'concepts',
        titleEn: 'Concepts',
        titleTr: 'Kavramlar',
      },
      {
        slug: 'platform-release',
        titleEn: 'Platform Release',
        titleTr: 'Platform Duyuruları',
      },
      {
        slug: 'instant-messaging',
        titleEn: 'Instant Messaging',
        titleTr: 'Mesajlaşma',
      },
    ]);
  });

  it('maps legacy category slugs into the new archive categories', () => {
    expect(getDisplayCategory({ slug: 'ai-automation', label: 'AI Automation' }, 'en')).toEqual({
      slug: 'practical-guide',
      label: 'Practical Guide',
    });

    expect(getDisplayCategory({ slug: 'product-updates', label: 'Urun Guncellemeleri' }, 'tr')).toEqual({
      slug: 'platform-release',
      label: 'Platform Duyuruları',
    });

    expect(getDisplayCategory({ slug: 'messaging-workflows', label: 'Messaging Workflows' }, 'en')).toEqual({
      slug: 'instant-messaging',
      label: 'Instant Messaging',
    });
  });

  it('sorts visible categories according to the new taxonomy order', () => {
    expect(
      sortDisplayCategories(
        [
          { slug: 'platform-release', label: 'Platform Release' },
          { slug: 'practical-guide', label: 'Practical Guide' },
          { slug: 'instant-messaging', label: 'Instant Messaging' },
        ],
        'en'
      )
    ).toEqual([
      { slug: 'practical-guide', label: 'Practical Guide' },
      { slug: 'platform-release', label: 'Platform Release' },
      { slug: 'instant-messaging', label: 'Instant Messaging' },
    ]);
  });
});
