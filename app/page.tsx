import { sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = sortedPosts.map((post) => ({
    slug: post.slug,
    date: post.date,
    title: post.title,
    summary: post.summary,
    tags: post.tags || [],
    readingTime: post.readingTime,
  }))
  return <Main posts={posts} />
}
