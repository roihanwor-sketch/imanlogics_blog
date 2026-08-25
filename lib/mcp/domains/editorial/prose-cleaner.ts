export class ProseCleaner {
  static extractCleanProseForAudit(rawMdx: string): string {
    let body = rawMdx.replace(/^---[\s\S]*?---\n*/, '')
    body = body.replace(/```[\s\S]*?```/g, '')
    body = body.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    body = body.replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    body = body.replace(/https?:\/\/\S+/g, '')
    return body
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}
