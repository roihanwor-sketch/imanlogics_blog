export class Logger {
  static info(prefix: string, message: string, ...args: unknown[]) {
    console.log(`ℹ️ [${prefix}] ${message}`, ...args)
  }

  static success(prefix: string, message: string, ...args: unknown[]) {
    console.log(`✅ [${prefix}] ${message}`, ...args)
  }

  static warn(prefix: string, message: string, ...args: unknown[]) {
    console.warn(`⚠️ [${prefix}] ${message}`, ...args)
  }

  static error(prefix: string, message: string, ...args: unknown[]) {
    console.error(`❌ [${prefix}] ${message}`, ...args)
  }

  static header(title: string) {
    console.log(`\n===============================================================`)
    console.log(`🚀 ${title}`)
    console.log(`===============================================================`)
  }
}
