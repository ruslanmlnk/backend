import type { CollectionConfig } from 'payload'
import { slugify } from '../utils/slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      required: false,
      defaultValue: 0,
      admin: {
        description: 'Lower values are rendered first on the storefront.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      index: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.slug) return data;
        const src = (data?.title as string) || '';
        if (!src.trim()) return data;
        const slug = slugify(src);
        return slug ? { ...data, slug } : data;
      },
    ],
  },
}
