import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'
import { apiVersion, dataset, projectId, useCdn } from '@/sanity/env'

const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
})

export async function GET() {
  try {
    const query = `*[_type == "frontPage"][0]{
      title,
      description,
      heroImage {
        asset->{
          _id,
          url,
          metadata
        },
        alt
      },
      featuredArticles[]->{
        title,
        slug,
        publishedAt,
        author->{
          name
        }
      },
      categories[]->{
        title,
        slug,
        description
      }
    }`

    const frontPage = await client.fetch(query)
    return NextResponse.json(frontPage)
  } catch (error) {
    console.error('Error fetching front page:', error)
    return NextResponse.json({ error: 'Failed to fetch front page data' }, { status: 500 })
  }
} 