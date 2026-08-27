export class Logger {
  static info(prefix: string, message: string, ...args: unknown[]) {
    console.error(`ℹ️ [${prefix}] ${message}`, ...args)
  }

  static success(prefix: string, message: string, ...args: unknown[]) {
    console.error(`✅ [${prefix}] ${message}`, ...args)
  }

  static warn(prefix: string, message: string, ...args: unknown[]) {
    console.error(`⚠️ [${prefix}] ${message}`, ...args)
  }

  static error(prefix: string, message: string, ...args: unknown[]) {
    console.error(`❌ [${prefix}] ${message}`, ...args)
  }

  static header(title: string) {
    console.error(`\n===============================================================`)
    console.error(`🚀 ${title}`)
    console.error(`===============================================================`)
  }
}
