import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')

  const formatDate = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return new Date().toISOString().split('T')[0]
    try {
      const date = new Date(dateInput)
      return isNaN(date.getTime())
        ? new Date().toISOString().split('T')[0]
        : date.toISOString().split('T')[0]
    } catch {
      return new Date().toISOString().split('T')[0]
    }
  }

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => {
      const postPath = post.path.replace(/^\/|\/$/g, '')
      return {
        url: `${siteUrl}/${postPath}/`,
        lastModified: formatDate(post.lastmod || post.date),
      }
    })

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => {
    const path = route ? `${route}/` : ''
    return {
      url: `${siteUrl}/${path}`,
      lastModified: formatDate(new Date()),
    }
  })

  return [...routes, ...blogRoutes]
}
