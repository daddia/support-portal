import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '@/sanity/env'
import HomePage from '@/components/home/HomePage'

const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
})

export default async function Home() {
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

  return <HomePage frontPage={frontPage} />
}
