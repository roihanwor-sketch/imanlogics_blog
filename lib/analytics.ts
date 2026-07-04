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
    // Send event using @next/third-parties/google helper
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
 * Specific GA4 standard events helpers
 */

export interface PurchaseItem {
  item_id: string
  item_name: string
  price: number
  quantity?: number
  item_category?: string
}

// Track purchases (E-commerce)
export function trackPurchase(
  transactionId: string,
  value: number,
  currency = 'IDR',
  items: PurchaseItem[]
) {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    items,
  })
}

// Track user login
export function trackLogin(method: 'email' | 'google' | 'facebook' | string) {
  trackEvent('login', { method })
}

// Track user sign-up
export function trackSignUp(method: 'email' | 'google' | 'facebook' | string) {
  trackEvent('sign_up', { method })
}

// Track searches on the site
export function trackSearch(searchTerm: string) {
  trackEvent('search', { search_term: searchTerm })
}

// Track file downloads
export function trackDownload(fileName: string, fileType?: string) {
  trackEvent('download', {
    file_name: fileName,
    file_type: fileType,
  })
}

// Track clicks on external outbound links
export function trackOutboundLink(url: string) {
  trackEvent('outbound_link', { destination_url: url })
}

// Track clicks on contact channels (WhatsApp, Email, etc.)
export function trackContactClick(channel: 'whatsapp' | 'email', value?: string) {
  trackEvent('contact_click', {
    channel,
    value,
  })
}

// Track CTA button clicks
export function trackCtaClick(ctaName: string, sectionId?: string) {
  trackEvent('cta_click', {
    cta_name: ctaName,
    section_id: sectionId,
  })
}
