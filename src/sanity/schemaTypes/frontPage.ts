export default {
  name: 'frontPage',
  title: 'Front Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    },
    {
      name: 'featuredArticles',
      title: 'Featured Articles',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'knowledgeBase' }],
        },
      ],
      validation: (Rule: any) => Rule.max(3),
    },
    {
      name: 'categories',
      title: 'Featured Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
      validation: (Rule: any) => Rule.max(4),
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
} 