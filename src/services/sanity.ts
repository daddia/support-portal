import { client, knowledgeBaseQuery, categoryQuery } from '@/lib/sanity';

export interface KnowledgeBaseArticle {
  _id: string;
  title: string;
  slug: string;
  content: any;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    image: any;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

class SanityService {
  async getAllArticles(): Promise<KnowledgeBaseArticle[]> {
    try {
      return await client.fetch(knowledgeBaseQuery);
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  async getArticleBySlug(slug: string): Promise<KnowledgeBaseArticle | null> {
    try {
      const query = `*[_type == "knowledgeBase" && slug.current == $slug][0] {
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
      return await client.fetch(query, { slug });
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await client.fetch(categoryQuery);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async searchArticles(query: string): Promise<KnowledgeBaseArticle[]> {
    try {
      const searchQuery = `*[_type == "knowledgeBase" && (
        title match $query + "*" ||
        content match $query + "*" ||
        tags match $query + "*"
      )] {
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
      return await client.fetch(searchQuery, { query });
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  }
}

export const sanityService = new SanityService(); 