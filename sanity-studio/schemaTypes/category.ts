import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Legacy Title',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'titleTr',
      title: 'Title (TR)',
      type: 'string',
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (EN)',
      type: 'string',
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => doc?.titleEn || doc?.titleTr || '',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Legacy Description',
      type: 'text',
      rows: 3,
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'descriptionTr',
      title: 'Description (TR)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description (EN)',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      legacyTitle: 'title',
      titleTr: 'titleTr',
      titleEn: 'titleEn',
      subtitle: 'slug.current',
    },
    prepare(selection) {
      const {legacyTitle, titleTr, titleEn, subtitle} = selection

      return {
        title: [titleTr, titleEn].filter(Boolean).join(' / ') || legacyTitle || 'Untitled category',
        subtitle,
      }
    },
  },
})
