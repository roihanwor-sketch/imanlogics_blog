/**
 * Utility for formatting date and time across the blog (ID, EN, AR)
 * Gracefully handles ISO timestamp strings (with time) as well as YYYY-MM-DD strings.
 */

export function formatDateTime(
  dateInput: string | Date | undefined,
  locale: string = 'id-ID',
  options?: {
    includeTime?: boolean
    timeZone?: string
  }
): string {
  if (!dateInput) return ''

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return String(dateInput)

  const hasExplicitTime =
    typeof dateInput === 'string' &&
    (dateInput.includes('T') || dateInput.includes(':') || dateInput.includes(' '))

  const isRtl = locale.startsWith('ar')
  const activeLocale = isRtl ? 'ar-EG' : locale.startsWith('id') ? 'id-ID' : 'en-US'
  const timeZone = options?.timeZone || 'Asia/Jakarta'

  // Format Date Part
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone,
  }

  const formattedDate = date.toLocaleDateString(activeLocale, dateOptions)

  // If time is requested or explicitly present in the ISO string
  const shouldShowTime = options?.includeTime !== undefined ? options.includeTime : hasExplicitTime

  if (!shouldShowTime) {
    return formattedDate
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: activeLocale === 'en-US',
    timeZone,
  }

  const formattedTime = date.toLocaleTimeString(activeLocale, timeOptions)

  if (activeLocale === 'id-ID') {
    return `${formattedDate} • ${formattedTime} WIB`
  } else if (activeLocale === 'ar-EG') {
    return `${formattedDate} • ${formattedTime}`
  } else {
    return `${formattedDate} • ${formattedTime}`
  }
}

export function formatTimeOnly(
  dateInput: string | Date | undefined,
  locale: string = 'id-ID'
): string {
  if (!dateInput) return ''
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return ''

  const isRtl = locale.startsWith('ar')
  const activeLocale = isRtl ? 'ar-EG' : locale.startsWith('id') ? 'id-ID' : 'en-US'

  return date.toLocaleTimeString(activeLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: activeLocale === 'en-US',
    timeZone: 'Asia/Jakarta',
  })
}
