import path from 'path'

export const MCP_CONFIG = {
  appName: 'ImanLogics MCP Server',
  version: '1.0.0',
  blogRootDir: process.cwd(),
  blogDataDir: path.join(process.cwd(), 'data', 'blog'),
  publicEditorialImagesDir: path.join(process.cwd(), 'public', 'static', 'images', 'editorial'),
  lockFilePath: path.join(process.cwd(), 'data', '.scheduler.lock'),
  historyFilePath: path.join(process.cwd(), 'data', '.cycle-history.json'),
  blogBaseUrl: 'https://blog.imanlogics.web.id',
  targetWhatsAppNumber: '6285335329341',
  agentKuliahDir: 'D:\\KULIAH\\AGENT',
  waDispatcherPath: path.join('D:\\KULIAH\\AGENT', 'src', 'wa_dispatcher.py'),
}
