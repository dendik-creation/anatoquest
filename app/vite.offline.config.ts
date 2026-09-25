import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

import { optimizedAssetResolver } from './src/lib/optimizedAssetResolver.js'

const AUDIO_OR_IMAGE = /\.(webm|ogg|m4a|mp3|wav|webp|png|jpe?g|avif)$/i

/**
 * file:// has a null origin: external <script type="module"> and any
 * crossorigin-tagged subresource are blocked. Emit a classic deferred script
 * and drop crossorigin attributes.
 */
function fileProtocolHtml(): Plugin {
  return {
    name: 'anatoquest-file-protocol-html',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module"([^>]*)>/g, '<script defer$1>')
        .replace(/\s+crossorigin(="[^"]*")?/g, '')
    },
  }
}

export default defineConfig({
  base: './',
  experimental: {
    // Default IIFE asset URLs resolve against document.currentScript, which is null once
    // the entry script finished executing (lazily evaluated modules then resolve against
    // the page directory, dropping "assets/"). Resolve against the page URL instead.
    renderBuiltUrl: (filename, { hostType }) =>
      hostType === 'js' ? { runtime: `new URL(${JSON.stringify(filename)}, document.baseURI).href` } : undefined,
  },
  plugins: [optimizedAssetResolver(), react(), fileProtocolHtml()],
  build: {
    outDir: 'dist-offline',
    // Audio/images stay separate files instead of data URIs.
    assetsInlineLimit: (file) => (AUDIO_OR_IMAGE.test(file) ? false : undefined),
    modulePreload: false,
    rolldownOptions: {
      output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'assets/index-[hash].js' },
    },
  },
})
