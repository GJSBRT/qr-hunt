/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_DEV_COORDS_LONG: number
    readonly VITE_DEV_COORDS_LAT: number
    readonly SSR: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}