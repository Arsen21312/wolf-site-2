import { defineEventHandler } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

const SITE_URL = 'https://neuralwisewolf.com'

// Ручные маршруты, которые не лежат прямо в src/pages (или которые нужно включить явно).
const extraRoutes = [
  '/games/truth-or-dare',
  '/games/never-have-i-ever',
  '/games/5-seconds',
  '/games/true-or-false',
  '/games/coin',
  '/games/wolf-context',
  '/games/wolf-context/random'
]

const today = () => new Date().toISOString().split('T')[0]

const fileToRoute = (relativeFile: string) => {
  if (relativeFile.includes('[')) return null
  const noExt = relativeFile.replace(/\.vue$/, '')
  const cleaned = noExt.replace(/\/index$/i, '')
  const route = `/${cleaned}`.replace(/\/+/g, '/')
  return route === '' ? '/' : route
}

const collectPageRoutes = async () => {
  const pagesDir = path.resolve(process.cwd(), 'src/pages')
  const routes = new Set<string>()

  const walk = async (dir: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('_')) continue
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
        continue
      }
      if (!entry.isFile() || !entry.name.endsWith('.vue')) continue
      const relative = path.relative(pagesDir, fullPath).replace(/\\/g, '/')
      const route = fileToRoute(relative)
      if (route) routes.add(route)
    }
  }

  await walk(pagesDir)
  extraRoutes.forEach((route) => routes.add(route))
  return Array.from(routes).sort()
}

const priorityForRoute = (route: string) => {
  if (route === '/') return 1.0
  if (route.startsWith('/games/wolf-context')) return 0.8
  if (route.startsWith('/games') || route.startsWith('/generators')) return 0.7
  if (route.startsWith('/decisions')) return 0.6
  if (route === '/about') return 0.8
  if (route === '/ads') return 0.4
  return 0.5
}

const buildSitemap = (routes: string[]) => {
  const lastmod = today()
  const urls = routes
    .map(
      (route) => `<url>
  <loc>${SITE_URL}${route}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>${priorityForRoute(route).toFixed(1)}</priority>
</url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export default defineEventHandler(async (event) => {
  const routes = await collectPageRoutes()
  const xml = buildSitemap(routes)
  event.node.res.setHeader('Content-Type', 'application/xml')
  return xml
})
