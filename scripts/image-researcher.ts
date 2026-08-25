import { SAFE_EDITORIAL_IMAGE_VAULT } from '../lib/mcp/domains/media/image-vault'
import { AssetDownloader } from '../lib/mcp/domains/media/asset-downloader'
import { SafeImage, ImageCreditRecord } from '../lib/mcp/core/types'

export type { SafeImage, ImageCreditRecord }

export interface ImageQueryResult {
  images: SafeImage[]
  rejectedCount: number
  allLicensed: boolean
}

export const downloadAndVerifyLocalImage =
  AssetDownloader.downloadAndVerifyLocalImage.bind(AssetDownloader)
export const discoverSafeImagesForTopic =
  AssetDownloader.discoverAndDownloadSafeImages.bind(AssetDownloader)
