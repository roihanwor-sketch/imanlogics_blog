'use client'

import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDateTime } from '@/lib/utils/formatDateTime'
import NewsletterForm from '@/components/NewsletterForm'

const MAX_DISPLAY = 5

interface Post {
  slug: string
  date: string
  title: string
  summary?: string
  tags: string[]
  readingTime?: { text: string }
}

export default function Home({ posts }: { posts: Post[] }) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Intro Singkat Section */}
        <div className="space-y-4 pt-0 pb-6 md:space-y-6">
          <h1 className="text-4xl leading-none font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
            Selamat Datang di{' '}
            <span className="text-emerald-500 dark:text-cyan-400">Iman Logics Blog</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-500 md:text-xl dark:text-gray-400">
            Temukan berita teknologi harian terkini, kajian logika & hikmah Islam, serta wawasan
            digital mendalam yang mencerahkan akal budi Anda.
          </p>
        </div>

        {/* Articles List */}
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && (
            <li className="py-12 text-center text-gray-500 dark:text-gray-400">
              Tidak ada artikel.
            </li>
          )}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, readingTime } = post
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-sm leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date} suppressHydrationWarning>
                          {formatDateTime(date, siteMetadata.locale)}
                        </time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{readingTime?.text || '1 min read'}</span>
                            {tags && tags.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex flex-wrap gap-1">
                                  {tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wider text-emerald-600 uppercase dark:bg-cyan-500/10 dark:text-cyan-400"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 transition-colors hover:text-emerald-500 dark:text-gray-100 dark:hover:text-cyan-400"
                            >
                              {title}
                            </Link>
                          </h2>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/blog/${slug}`}
                          className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-600 dark:text-cyan-400 dark:hover:text-cyan-300"
                          aria-label={`Baca selengkapnya: "${title}"`}
                        >
                          Baca Selengkapnya &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end pt-4 text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-emerald-500 hover:text-emerald-600 dark:text-cyan-400 dark:hover:text-cyan-300"
            aria-label="Semua artikel"
          >
            Lihat Semua Artikel &rarr;
          </Link>
        </div>
      )}

      <div className="flex items-center justify-center pt-8">
        <NewsletterForm />
      </div>
    </>
  )
}
