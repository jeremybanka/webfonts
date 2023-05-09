export const ASSET_GROUPS = [
  { packagePrefix: `fonts-`, sourceDirectory: `fonts`, sourceSuffix: `-font` },
  { packagePrefix: `icons-`, sourceDirectory: `icons`, sourceSuffix: `-icon` },
] as const

export const SOURCE_DIR = `./src`
export const TARGET_DIR = `./packages`
export const SCSS_EXTENSION = `.scss`

export const FONT_SOURCE_EXTENSION = `.glyphs`
export const FONT_TARGET_EXTENSIONS = [`.ttf`, `.otf`, `.woff`, `.woff2`]

export const FONT_LOCKFILE = `./export/fonts.lock.json`
