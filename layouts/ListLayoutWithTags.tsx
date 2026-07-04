'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-8 xl:space-x-10">
          {isSidebarOpen && (
            <div className="hidden h-full max-h-[calc(100vh-140px)] max-w-[210px] min-w-[210px] scrollbar-none flex-wrap overflow-y-auto rounded-2xl border border-gray-200/50 bg-white/45 p-4 shadow-xl backdrop-blur-xl transition-all sm:-ml-6 sm:flex xl:-ml-14 dark:border-white/10 dark:bg-[#0B0F19]/45">
              <div className="w-full">
                {pathname.startsWith('/blog') ? (
                  <h3 className="mb-4 px-2 text-[11px] font-bold tracking-wider text-emerald-500 uppercase dark:text-cyan-400">
                    Semua Postingan
                  </h3>
                ) : (
                  <Link
                    href={`/blog`}
                    className="mb-4 block px-2 text-[11px] font-bold tracking-wider text-gray-700 uppercase transition-colors hover:text-emerald-500 dark:text-gray-300 dark:hover:text-cyan-400"
                  >
                    Semua Postingan
                  </Link>
                )}
                <div className="my-3 border-t border-gray-200/50 dark:border-white/10" />
                <ul className="space-y-1">
                  {sortedTags.map((t) => {
                    const isActive = decodeURI(pathname.split('/tags/')[1]) === slug(t)
                    return (
                      <li key={t}>
                        {isActive ? (
                          <h3 className="block rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-600 uppercase dark:bg-cyan-500/10 dark:text-cyan-400">
                            {`${t} (${tagCounts[t]})`}
                          </h3>
                        ) : (
                          <Link
                            href={`/tags/${slug(t)}`}
                            className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase transition-all hover:bg-gray-100 hover:text-emerald-500 dark:text-gray-300 dark:hover:bg-slate-800/65 dark:hover:text-cyan-400"
                            aria-label={`View posts tagged ${t}`}
                          >
                            {`${t} (${tagCounts[t]})`}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            {/* Show/Hide Sidebar Toggle Button (Desktop only) */}
            <div className="hidden justify-start pb-6 sm:flex">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/60 px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-all hover:bg-white active:scale-[0.98] dark:border-white/10 dark:bg-black/20 dark:text-slate-300 dark:hover:bg-black/35"
              >
                <svg
                  className={`h-4 w-4 transition-colors ${
                    isSidebarOpen ? 'text-emerald-500 dark:text-cyan-400' : 'text-gray-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {isSidebarOpen ? 'Sembunyikan Kategori' : 'Tampilkan Kategori'}
              </button>
            </div>

            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <li key={path} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
