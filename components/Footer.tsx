'use client'

import Link from './Link'
import Logo from '@/data/logo.svg'
import headerNavLinks from '@/data/headerNavLinks'
import globalData from '@/data/global.json'

export default function Footer() {
  const brandPrefix = globalData?.footer?.brand_prefix || 'Iman'
  const brandSuffix = globalData?.footer?.brand_suffix || 'Logics'
  const tagline = globalData?.footer?.tagline || 'AI • Systems • Digital Products'
  const socials = globalData?.footer?.socials || []
  const copyright =
    globalData?.footer?.copyright ||
    `© ${new Date().getFullYear()} Iman Logics. All rights reserved.`
  const builtWith = globalData?.footer?.built_with || 'Built as a Digital Garden.'

  return (
    <footer className="mt-auto w-full border-t border-gray-200/50 bg-gray-50 px-6 pt-16 pb-8 dark:border-white/5 dark:bg-[#0B0F19]">
      <div className="mx-auto mb-16 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <Link
            href="/"
            className="mb-4 flex items-center gap-2.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-emerald-500/10">
              <Logo className="h-5.5 w-5.5 fill-current text-emerald-500" />
            </div>
            <span>
              {brandPrefix} <span className="text-gray-500 dark:text-slate-400">{brandSuffix}</span>
            </span>
          </Link>
          <p className="text-sm font-medium tracking-wide text-gray-500 uppercase dark:text-slate-500">
            {tagline}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-2 md:justify-self-end">
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Navigasi</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
              {headerNavLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-emerald-500 dark:hover:text-cyan-400"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Kontak</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-emerald-500 dark:hover:text-cyan-400"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between border-t border-gray-200/50 pt-8 text-xs text-gray-500 md:flex-row dark:border-white/5 dark:text-slate-500">
        <p>{copyright}</p>
        <div className="mt-2 flex gap-4 md:mt-0">
          <Link
            href="https://imanlogics.web.id/privacy-policy"
            className="transition-colors hover:text-emerald-500 dark:hover:text-cyan-400"
          >
            Kebijakan Privasi
          </Link>
          <span className="text-gray-300 dark:text-white/10">|</span>
          <Link
            href="https://imanlogics.web.id/terms-of-service"
            className="transition-colors hover:text-emerald-500 dark:hover:text-cyan-400"
          >
            Syarat &amp; Ketentuan
          </Link>
        </div>
        <p className="mt-2 md:mt-0">{builtWith}</p>
      </div>
    </footer>
  )
}
