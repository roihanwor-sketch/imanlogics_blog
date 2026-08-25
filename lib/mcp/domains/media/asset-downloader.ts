import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { MCP_CONFIG } from '../../config/env'
import { SafeImage } from '../../core/types'
import { SAFE_EDITORIAL_IMAGE_VAULT } from './image-vault'
import { Logger } from '../../core/logger'

export class AssetDownloader {
  /**
   * Downloads a remote image file to local public storage with timeout, redirect follow and verification
   */
  static async downloadAndVerifyLocalImage(
    remoteUrl: string,
    slug: string,
    fileName: string
  ): Promise<{ success: boolean; localPath: string; absolutePath: string }> {
    const publicDir = path.join(MCP_CONFIG.publicEditorialImagesDir, slug)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    const localRelativePath = `/static/images/editorial/${slug}/${fileName}`
    const localAbsolutePath = path.join(publicDir, fileName)

    // If already exists and valid size (>5KB), reuse
    if (fs.existsSync(localAbsolutePath)) {
      const stats = fs.statSync(localAbsolutePath)
      if (stats.size > 5000) {
        return { success: true, localPath: localRelativePath, absolutePath: localAbsolutePath }
      }
    }

    return new Promise((resolve) => {
      try {
        const client = remoteUrl.startsWith('https') ? https : http
        const request = client.get(
          remoteUrl,
          {
            headers: {
              'User-Agent':
                'ImanLogicsBot/2.4 (https://blog.imanlogics.web.id; contact@imanlogics.web.id)',
              Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            timeout: 10000,
          },
          (response) => {
            // Handle redirects
            if (
              response.statusCode === 301 ||
              response.statusCode === 302 ||
              response.statusCode === 307
            ) {
              const redirectUrl = response.headers.location
              if (redirectUrl) {
                this.downloadAndVerifyLocalImage(redirectUrl, slug, fileName).then(resolve)
                return
              }
            }

            if (response.statusCode !== 200) {
              Logger.warn(
                'AssetDownloader',
                `Failed download from ${remoteUrl} (HTTP ${response.statusCode})`
              )
              resolve({ success: false, localPath: remoteUrl, absolutePath: '' })
              return
            }

            const fileStream = fs.createWriteStream(localAbsolutePath)
            response.pipe(fileStream)

            fileStream.on('finish', () => {
              fileStream.close(() => {
                const stats = fs.statSync(localAbsolutePath)
                if (stats.size > 2000) {
                  resolve({
                    success: true,
                    localPath: localRelativePath,
                    absolutePath: localAbsolutePath,
                  })
                } else {
                  resolve({ success: false, localPath: remoteUrl, absolutePath: localAbsolutePath })
                }
              })
            })

            fileStream.on('error', () => {
              resolve({ success: false, localPath: remoteUrl, absolutePath: '' })
            })
          }
        )

        request.on('error', () => {
          resolve({ success: false, localPath: remoteUrl, absolutePath: '' })
        })

        request.on('timeout', () => {
          request.destroy()
          resolve({ success: false, localPath: remoteUrl, absolutePath: '' })
        })
      } catch {
        resolve({ success: false, localPath: remoteUrl, absolutePath: '' })
      }
    })
  }

  static async discoverAndDownloadSafeImages(
    keywords: string[],
    category: 'tech-ai' | 'islamic-logic',
    minCount = 2,
    maxCount = 3,
    articleSlug = 'default'
  ): Promise<{ images: SafeImage[]; rejectedCount: number; allLicensed: boolean }> {
    const lowerKeywords = keywords.map((k) => k.toLowerCase())

    const scoredImages = SAFE_EDITORIAL_IMAGE_VAULT.map((img) => {
      let matchScore = 0
      for (const kw of lowerKeywords) {
        if (img.tags.some((t) => t.includes(kw) || kw.includes(t))) {
          matchScore += 2
        }
      }
      if (
        category === 'islamic-logic' &&
        img.tags.some((t) => ['qumran', 'birmingham', 'manuscript', 'archaeology'].includes(t))
      ) {
        matchScore += 3
      }
      if (
        category === 'tech-ai' &&
        img.tags.some((t) =>
          ['hardware', 'chip', 'gpu', 'semiconductor', 'lpddr6', 'blackwell'].includes(t)
        )
      ) {
        matchScore += 3
      }
      return { img, matchScore }
    })

    scoredImages.sort((a, b) => b.matchScore - a.matchScore)

    const selectedImages: SafeImage[] = []
    const chosenVaultImages = scoredImages.slice(0, maxCount).map((s) => s.img)

    let idx = 0
    for (const vaultImg of chosenVaultImages) {
      const ext = vaultImg.url.includes('.png') ? '.png' : '.jpg'
      const fileName = `figure-${idx + 1}${ext}`

      const downloadRes = await this.downloadAndVerifyLocalImage(
        vaultImg.url,
        articleSlug,
        fileName
      )

      selectedImages.push({
        ...vaultImg,
        localPath: downloadRes.success ? downloadRes.localPath : vaultImg.url,
      })
      idx++
    }

    while (
      selectedImages.length < minCount &&
      SAFE_EDITORIAL_IMAGE_VAULT.length > selectedImages.length
    ) {
      const fallback = SAFE_EDITORIAL_IMAGE_VAULT[selectedImages.length]
      selectedImages.push(fallback)
    }

    return {
      images: selectedImages.slice(0, maxCount),
      rejectedCount: 0,
      allLicensed: true,
    }
  }
}
