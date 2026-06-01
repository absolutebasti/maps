import { MetadataRoute } from 'next'
import { getBlogPosts } from './blog/posts'
import { getLastModified } from '../lib/sitemap-utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://maps-production-d32c.up.railway.app'
  const blogPosts = getBlogPosts()
  const ogImageUrl = `${baseUrl}/og-image.png`
  
  // Get last modified dates from git (with fallback to current date)
  const homepageDate = getLastModified('app/page.tsx')
  const countriesDate = getLastModified('app/countries/page.tsx')
  const aboutDate = getLastModified('app/about/page.tsx')
  const featuresDate = getLastModified('app/features/page.tsx')
  const faqDate = getLastModified('app/faq/page.tsx')
  const blogDate = getLastModified('app/blog/page.tsx')
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: homepageDate,
      changeFrequency: 'weekly',
      priority: 1.0, // Highest priority - homepage
    },
    {
      url: `${baseUrl}/countries`,
      lastModified: countriesDate,
      changeFrequency: 'weekly',
      priority: 0.9, // High priority - main feature
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: blogDate,
      changeFrequency: 'weekly',
      priority: 0.9, // High priority - SEO content
    },
    {
      url: `${baseUrl}/about`,
      lastModified: aboutDate,
      changeFrequency: 'monthly',
      priority: 0.8, // Important but less frequently updated
    },
    {
      url: `${baseUrl}/features`,
      lastModified: featuresDate,
      changeFrequency: 'monthly',
      priority: 0.8, // Important but less frequently updated
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: faqDate,
      changeFrequency: 'monthly',
      priority: 0.7, // Lower priority - support content
    },
  ]

  // Add blog post URLs with images
  blogPosts.forEach((post) => {
    // Try to get last modified from git for the blog post file
    const postFilePath = `app/blog/posts.ts`
    const postDate = getLastModified(postFilePath, new Date(post.date))
    
    routes.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: postDate,
      changeFrequency: 'monthly',
      priority: 0.8, // Blog posts are important for SEO
      // Add images for blog posts (using OG image)
      // Note: Next.js sitemap images format - array of image URLs or objects
      images: [ogImageUrl],
    })
  })

  return routes
}

