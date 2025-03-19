import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-19',
  useCdn: process.env.NODE_ENV === 'production',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export const knowledgeBaseQuery = `*[_type == "knowledgeBase"] {
  _id,
  title,
  slug,
  content,
  category,
  tags,
  publishedAt,
  updatedAt,
  author->{
    name,
    image
  }
}`;

export const categoryQuery = `*[_type == "category"] {
  _id,
  name,
  slug,
  description
}`; 