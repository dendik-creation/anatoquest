/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dev-only scene jump for testing. Empty/unset = normal splash flow. */
  readonly VITE_DEV_SCENE?: string
  /** Dev-only microscene jump within VITE_DEV_SCENE (e.g. "4.3", "5.2"). */
  readonly VITE_DEV_MICROSCENE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
