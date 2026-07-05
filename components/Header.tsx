'use client'

import { useState, useEffect } from 'react'
import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/logo.svg'
import Link from './Link'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import globalData from '@/data/global.json'
import tagData from 'app/tag-data.json'
import { slug } from 'github-slugger'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mobileArtikelOpen, setMobileArtikelOpen] = useState(false)
  const [mobileKategoriOpen, setMobileKategoriOpen] = useState(false)

  // Use brand settings from globalData or defaults
  const brandPrefix = globalData?.footer?.brand_prefix || 'Iman'
  const brandSuffix = globalData?.footer?.brand_suffix || 'Logics'

  // Sort and display top tags for categories dropdown
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
  const displayTags = sortedTags.slice(0, 6)

  // Lock body scroll when side drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/10 bg-white/45 bg-gradient-to-b from-black/[0.01] to-transparent shadow-[inset_0_1px_0_0_rgba(0,0,0,0.05),0_8px_32px_0_rgba(0,0,0,0.03)] backdrop-blur-2xl transition-all dark:border-white/10 dark:bg-[#0B0F19]/45 dark:from-white/[0.04] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            aria-label={siteMetadata.headerTitle}
            className="relative z-50 flex items-center gap-2.5 font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-emerald-500/10">
              <Logo className="h-6 w-6 fill-current text-emerald-500" />
            </div>
            <span className="text-xl">
              {brandPrefix} <span className="text-gray-500 dark:text-slate-400">{brandSuffix}</span>
            </span>
          </Link>

          {/* Desktop Nav - Clickable Links and Hover Dropdowns */}
          <nav className="hidden items-center space-x-8 text-sm font-semibold text-gray-500 md:flex dark:text-slate-400">
            <Link
              href="/"
              className="transition-colors hover:text-emerald-500 dark:hover:text-cyan-400"
            >
              Beranda
            </Link>

            {/* Clickable Artikel Link with Hover Dropdown */}
            <div className="group relative py-2">
              <Link
                href="/blog"
                className="flex items-center gap-1 transition-colors outline-none hover:text-emerald-500 dark:hover:text-cyan-400"
              >
                <span>Artikel</span>
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <div className="pointer-events-none absolute left-0 mt-2 w-48 origin-top-left scale-95 rounded-xl border border-gray-200/50 bg-white/95 p-1.5 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 dark:border-white/10 dark:bg-[#0B0F19]/95">
                <Link
                  href="/blog"
                  className="block rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Semua Artikel
                </Link>
                <Link
                  href="/tags"
                  className="block rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Arsip Kategori
                </Link>
              </div>
            </div>

            {/* Clickable Kategori Link with Hover Dropdown */}
            <div className="group relative py-2">
              <Link
                href="/tags"
                className="flex items-center gap-1 transition-colors outline-none hover:text-emerald-500 dark:hover:text-cyan-400"
              >
                <span>Kategori</span>
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <div className="pointer-events-none absolute left-1/2 mt-2 w-60 origin-top -translate-x-1/2 scale-95 rounded-2xl border border-gray-200/50 bg-white/95 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 dark:border-white/10 dark:bg-[#0B0F19]/95">
                <div className="grid grid-cols-1 gap-0.5">
                  {displayTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${slug(tag)}`}
                      className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <span className="text-xs font-semibold uppercase">{tag}</span>
                      <span className="ml-1.5 text-[10px] font-medium text-gray-400">
                        ({tagCounts[tag]})
                      </span>
                    </Link>
                  ))}
                  <div className="my-1.5 border-t border-gray-200/50 dark:border-white/10" />
                  <Link
                    href="/tags"
                    className="block rounded-xl px-4 py-2 text-center text-xs font-bold text-emerald-500 transition-colors hover:text-emerald-600 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Semua Kategori &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="transition-colors hover:text-emerald-500 dark:hover:text-cyan-400"
            >
              Tentang
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Search -> Theme -> CTA */}
            <SearchButton />
            <ThemeSwitch />

            {/* Desktop CTA */}
            <a
              href="https://imanlogics.web.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center justify-center rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/20 md:inline-flex dark:bg-cyan-600 dark:shadow-cyan-500/10 dark:hover:bg-cyan-700"
            >
              Kunjungi Situs Utama
              <svg
                className="-mr-0.5 ml-1.5 h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50 p-2 text-gray-500 transition-colors hover:text-gray-900 focus:outline-none md:hidden dark:text-slate-400 dark:hover:text-white"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav - Backdrop */}
      <button
        type="button"
        className={`fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-label="Tutup Menu"
      />

      {/* Mobile Nav - Side Drawer (Off-canvas Menu) */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-[260px] flex-col border-l border-gray-200/50 bg-white/95 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out sm:w-[300px] md:hidden dark:border-white/10 dark:bg-[#0B0F19]/95 ${
          isMenuOpen ? 'translate-x-0' : 'invisible translate-x-full'
        }`}
      >
        <div className="mb-8 flex justify-end pt-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none dark:text-slate-400 dark:hover:text-white"
            aria-label="Close Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-4 text-lg font-bold">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="py-1 text-gray-900 transition-colors hover:text-emerald-500 dark:text-slate-100 dark:hover:text-cyan-400"
          >
            Beranda
          </Link>

          {/* Mobile Artikel Split Link / Dropdown Toggle */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-1">
              <Link
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-900 transition-colors hover:text-emerald-500 dark:text-slate-100 dark:hover:text-cyan-400"
              >
                Artikel
              </Link>
              <button
                onClick={() => setMobileArtikelOpen(!mobileArtikelOpen)}
                className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none dark:text-slate-400 dark:hover:text-white"
                aria-label="Buka Submenu Artikel"
              >
                <svg
                  className={`h-4.5 w-4.5 transition-transform duration-200 ${mobileArtikelOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {mobileArtikelOpen && (
              <div className="animate-fadeIn mt-1 flex flex-col space-y-2 border-l-2 border-emerald-500/30 pl-4 text-sm font-semibold text-gray-500 dark:border-cyan-400/30 dark:text-slate-400">
                <Link
                  href="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1 hover:text-emerald-500 dark:hover:text-cyan-400"
                >
                  Semua Artikel
                </Link>
                <Link
                  href="/tags"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1 hover:text-emerald-500 dark:hover:text-cyan-400"
                >
                  Arsip Kategori
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Kategori Split Link / Dropdown Toggle */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-1">
              <Link
                href="/tags"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-900 transition-colors hover:text-emerald-500 dark:text-slate-100 dark:hover:text-cyan-400"
              >
                Kategori
              </Link>
              <button
                onClick={() => setMobileKategoriOpen(!mobileKategoriOpen)}
                className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none dark:text-slate-400 dark:hover:text-white"
                aria-label="Buka Submenu Kategori"
              >
                <svg
                  className={`h-4.5 w-4.5 transition-transform duration-200 ${mobileKategoriOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {mobileKategoriOpen && (
              <div className="animate-fadeIn mt-1 flex flex-col space-y-2 border-l-2 border-emerald-500/30 pl-4 text-sm font-semibold text-gray-500 dark:border-cyan-400/30 dark:text-slate-400">
                {displayTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${slug(tag)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-1 uppercase hover:text-emerald-500 dark:hover:text-cyan-400"
                  >
                    {tag} <span className="text-[10px] text-gray-400">({tagCounts[tag]})</span>
                  </Link>
                ))}
                <Link
                  href="/tags"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1 font-bold text-emerald-500 dark:text-cyan-400"
                >
                  Semua Kategori &rarr;
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className="py-1 text-gray-900 transition-colors hover:text-emerald-500 dark:text-slate-100 dark:hover:text-cyan-400"
          >
            Tentang
          </Link>
        </nav>

        {/* Mobile CTA at the very bottom */}
        <div className="mt-auto pb-4">
          <a
            href="https://imanlogics.web.id"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="flex w-full items-center justify-center rounded-xl bg-emerald-600 py-3 text-center text-sm font-bold text-white shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-700 dark:bg-cyan-600 dark:shadow-cyan-500/10 dark:hover:bg-cyan-700"
          >
            Kunjungi Situs Utama
            <svg
              className="ml-1.5 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}

export default Header
