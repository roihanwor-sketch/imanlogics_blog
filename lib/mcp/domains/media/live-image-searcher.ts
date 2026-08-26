import https from 'https'
import http from 'http'
import { Logger } from '../../core/logger'

export interface LiveImageSearchResult {
  url: string
  source: string
  sourceUrl: string
  author: string
  license: string
  licenseUrl: string
  description: string
  title: string
  width?: number
  height?: number
}

export class LiveImageSearcher {
  /**
   * Searches Wikimedia Commons API for high-resolution, open-licensed authentic photos,
   * manuscripts, device hardware, brand logos, and scientific diagrams.
   */
  static async searchWikimediaCommons(
    query: string,
    maxResults = 8
  ): Promise<LiveImageSearchResult[]> {
    const cleanQuery = query.replace(/[^\w\s-]/g, ' ').trim()
    const encodedQuery = encodeURIComponent(cleanQuery)
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodedQuery}&gsrlimit=${maxResults}&prop=imageinfo&iiprop=url|extmetadata|size|mime&format=json`

    try {
      const data = (await this.fetchJson(apiUrl)) as {
        query?: {
          pages?: Record<
            string,
            {
              title?: string
              imageinfo?: Array<{
                url?: string
                descriptionurl?: string
                width?: number
                height?: number
                mime?: string
                extmetadata?: {
                  Artist?: { value?: string }
                  LicenseShortName?: { value?: string }
                  LicenseUrl?: { value?: string }
                  ImageDescription?: { value?: string }
                }
              }>
            }
          >
        }
      }
      if (!data?.query?.pages) return []

      const results: LiveImageSearchResult[] = []
      const pages = Object.values(data.query.pages)

      for (const page of pages) {
        if (!page.imageinfo || page.imageinfo.length === 0) continue
        const info = page.imageinfo[0]
        if (!info.url) continue

        // Filter out non-image files or tiny thumbnails
        if (info.mime && !info.mime.startsWith('image/')) continue
        if (info.width && info.width < 350) continue
        if (info.url.endsWith('.svg') && !query.toLowerCase().includes('logo')) continue

        const extMeta = info.extmetadata || {}
        const rawArtist = extMeta.Artist?.value || 'Wikimedia Commons Contributor'
        const artist = rawArtist.replace(/<[^>]*>/g, '').trim() || 'Wikimedia Commons'
        const license =
          extMeta.LicenseShortName?.value || 'Creative Commons Attribution / Public Domain'
        const licenseUrl = extMeta.LicenseUrl?.value || 'https://creativecommons.org/licenses/'
        const rawDesc =
          extMeta.ImageDescription?.value || page.title?.replace(/^File:/, '') || query
        const description = rawDesc.replace(/<[^>]*>/g, '').trim()

        // Strip UTM tracking parameters for clean file URLs
        const cleanUrl = info.url.split('?')[0]

        results.push({
          url: cleanUrl,
          source: 'Wikimedia Commons',
          sourceUrl: info.descriptionurl || cleanUrl,
          author: artist,
          license,
          licenseUrl,
          description,
          title: page.title?.replace(/^File:/, '') || query,
          width: info.width,
          height: info.height,
        })
      }

      Logger.info(
        'LiveImageSearcher',
        `Found ${results.length} authentic images on Wikimedia Commons for "${query}"`
      )
      return results
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      Logger.warn('LiveImageSearcher', `Wikimedia Commons search error for "${query}": ${msg}`)
      return []
    }
  }

  /**
   * Helper to perform HTTP/HTTPS GET request returning parsed JSON
   */
  private static fetchJson(url: string): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http
      const req = client.get(
        url,
        {
          headers: {
            'User-Agent':
              'ImanLogics-EditorialBot/2.0 (https://imanlogics.com; redaksi@imanlogics.com)',
            Accept: 'application/json',
          },
          timeout: 10000,
        },
        (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            this.fetchJson(res.headers.location).then(resolve).catch(reject)
            return
          }

          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`))
            return
          }

          let rawData = ''
          res.on('data', (chunk) => {
            rawData += chunk
          })
          res.on('end', () => {
            try {
              const parsed = JSON.parse(rawData)
              resolve(parsed)
            } catch (err) {
              reject(err)
            }
          })
        }
      )

      req.on('error', reject)
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Request timeout'))
      })
    })
  }
}
