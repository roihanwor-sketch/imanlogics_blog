'use client'

import { Suspense } from 'react'
import { GoogleAnalyticsTracker } from './GoogleAnalyticsTracker'

export function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTracker />
    </Suspense>
  )
}
