import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { optimizedAssetResolver } from './src/lib/optimizedAssetResolver.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [optimizedAssetResolver(), react()],
})
