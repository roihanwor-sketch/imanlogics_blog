import path from 'path'

const projectRoot =
  process.env.BLOG_ROOT_DIR ||
  (process.cwd().toLowerCase().includes('blog')
    ? process.cwd()
    : path.resolve(__dirname, '../../../..'))

export const MCP_CONFIG = {
  appName: 'ImanLogics MCP Server',
  version: '1.0.0',
  blogRootDir: projectRoot,
  blogDataDir: path.join(projectRoot, 'data', 'blog'),
  publicEditorialImagesDir: path.join(projectRoot, 'public', 'static', 'images', 'editorial'),
  lockFilePath: path.join(projectRoot, 'data', '.scheduler.lock'),
  historyFilePath: path.join(projectRoot, 'data', '.cycle-history.json'),
  blogBaseUrl: 'https://blog.imanlogics.web.id',
  targetWhatsAppNumber: '6285335329341',
  agentKuliahDir: 'D:\\KULIAH\\AGENT',
  waDispatcherPath: path.join('D:\\KULIAH\\AGENT', 'src', 'wa_dispatcher.py'),
}
