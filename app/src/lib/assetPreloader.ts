/**
 * Application asset preloader.
 *
 * The splash progress bar reports real network/decode progress for every image
 * bundled under `src/assets`. Vite resolves the glob at build time, so the list
 * always matches what actually ships; nothing has to be maintained by hand.
 */

export type PreloadProgress = {
  loaded: number
  total: number
  ratio: number
}

export type PreloadResult = {
  loaded: number
  total: number
  failed: string[]
}

const ASSET_MODULES = import.meta.glob(
  '/src/assets/**/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

/** Every bundled asset URL, in a stable order. */
export const APP_ASSET_URLS: string[] = Object.keys(ASSET_MODULES)
  .sort()
  .map((key) => ASSET_MODULES[key])

function loadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = url
  })
}

/**
 * Loads every URL and reports progress after each settled item. Failures do not
 * reject: a missing decorative asset must never trap the learner on Splash.
 */
export async function preloadAppAssets(
  urls: string[],
  onProgress: (progress: PreloadProgress) => void,
): Promise<PreloadResult> {
  const total = urls.length
  const failed: string[] = []
  let loaded = 0

  if (total === 0) {
    onProgress({ loaded: 0, total: 0, ratio: 1 })
    return { loaded: 0, total: 0, failed }
  }

  onProgress({ loaded: 0, total, ratio: 0 })

  await Promise.all(
    urls.map(async (url) => {
      const ok = await loadImage(url)
      if (!ok) failed.push(url)
      loaded += 1
      onProgress({ loaded, total, ratio: loaded / total })
    }),
  )

  return { loaded, total, failed }
}
