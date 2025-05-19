/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_DEV_COORDS_LONG: string
    readonly VITE_DEV_COORDS_LAT: string
    readonly SSR: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}