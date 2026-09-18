import { existsSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

/**
 * Transparently swaps a raster import for its generated WebP candidate when
 * one exists under src/assets-optimized, falling back to the source file
 * otherwise. Components always import the source path; no `if (webpExists)`
 * branching belongs outside this resolver. See
 * docs/architecture/02-assets-performance-and-verification.md.
 */
const toPosix = (p: string) => p.split(path.sep).join('/')

export function optimizedAssetResolver(): Plugin {
  const sourceRoot = toPosix(path.resolve(import.meta.dirname, '../assets'))
  const optimizedRoot = path.resolve(import.meta.dirname, '../assets-optimized')
  const rasterExt = /\.(png|jpe?g)$/i

  return {
    name: 'anatoquest-optimized-asset-resolver',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      const queryIndex = source.indexOf('?')
      const bareSource = queryIndex === -1 ? source : source.slice(0, queryIndex)
      const query = queryIndex === -1 ? '' : source.slice(queryIndex)
      if (!rasterExt.test(bareSource)) return null

      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true })
      if (!resolved) return null
      const idQueryIndex = resolved.id.indexOf('?')
      const bareId = idQueryIndex === -1 ? resolved.id : resolved.id.slice(0, idQueryIndex)
      const idQuery = idQueryIndex === -1 ? query : resolved.id.slice(idQueryIndex)
      const resolvedId = toPosix(bareId)
      if (!resolvedId.startsWith(sourceRoot)) return resolved

      const rel = resolvedId.slice(sourceRoot.length).replace(/^\//, '')
      const candidate = path.join(optimizedRoot, rel).replace(rasterExt, '.webp')
      return existsSync(candidate) ? { ...resolved, id: candidate + idQuery } : resolved
    },
  }
}
