import { SafeImage, ImageCreditRecord } from '../../core/types'

export class CreditBuilder {
  static buildImageCredits(
    images: SafeImage[],
    articleSlug: string,
    today: string
  ): ImageCreditRecord[] {
    return images.map((img) => ({
      url: img.url,
      localPath: img.localPath || img.url,
      sourceWebsite: img.source,
      creator: img.author,
      license: img.license,
      licenseUrl: img.licenseUrl,
      downloadDate: today,
      articleAssociation: articleSlug,
      attributionText: `${img.source} / Foto oleh ${img.author} (${img.license})`,
    }))
  }
}
