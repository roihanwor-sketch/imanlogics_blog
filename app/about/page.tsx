import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import Image from '@/components/Image'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Tentang Kami & Tim Editorial' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)
  const specialistAuthors = allAuthors.filter((p) => p.slug !== 'default')

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />

        {specialistAuthors.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-10 dark:border-gray-700">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
              Tim Penulis & Kolumnis Spesialis
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {specialistAuthors.map((auth) => (
                <div
                  key={auth.slug}
                  className="rounded-2xl border border-gray-200/70 bg-white/50 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/50 flex flex-col items-center text-center space-y-3"
                >
                  {auth.avatar && (
                    <Image
                      src={auth.avatar}
                      alt={auth.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full border-2 border-emerald-500/20 dark:border-cyan-500/20 object-cover shadow-sm"
                    />
                  )}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {auth.name}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-cyan-400 font-medium">
                      {auth.occupation}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {auth.body.raw.replace(/^---[\s\S]*?---/, '').trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </AuthorLayout>
    </>
  )
}
