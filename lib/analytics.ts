import { sendGAEvent } from '@next/third-parties/google'

// Check if GA ID is configured
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID
export const isProd = process.env.NODE_ENV === 'production'

/**
 * Send a generic event to Google Analytics
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (!GA_ID) return

  if (!isProd) {
    console.log(`[GA4 Event (Dev Mode)]:`, eventName, eventParams)
    return
  }

  try {
    sendGAEvent({ event: eventName, ...eventParams })
  } catch (error) {
    console.error('Failed to send GA4 event:', error)
  }
}

/**
 * Track page views manually
 */
export function trackPageView(url: string, title?: string) {
  trackEvent('page_view', {
    page_path: url,
    page_title: title,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  })
}

/**
 * Track site searches
 */
export function trackSearch(searchTerm: string) {
  trackEvent('search', { search_term: searchTerm })
}

/**
 * Track article reading progress or language switch
 */
export function trackArticleInteraction(
  articleSlug: string,
  action: 'scroll_depth' | 'language_switch' | 'share',
  detail?: string
) {
  trackEvent('article_interaction', {
    slug: articleSlug,
    action,
    detail,
  })
}

/**
 * Track clicks on external outbound links & citations
 */
export function trackOutboundLink(url: string) {
  trackEvent('outbound_link', { destination_url: url })
}
