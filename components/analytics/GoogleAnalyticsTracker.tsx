'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '../../lib/analytics'

export function GoogleAnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstLoad = useRef(true)

  useEffect(() => {
    if (!pathname) return

    // Skip the very first load to avoid duplicate pageview with Gtag's automatic config initialization
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }

    // Construct the full URL path (pathname + query string)
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    // Track the page view with GA4
    trackPageView(url, document.title)
  }, [pathname, searchParams])

  return null
}
