import * as path from "path"

import * as fs from "fs-extra"
import sass from "sass"

const ASSET_GROUPS = [
  { packagePrefix: `fonts-`, sourceDirectory: `fonts`, sourceSuffix: `-font` },
  { packagePrefix: `icons-`, sourceDirectory: `icons`, sourceSuffix: `-icon` },
] as const

const SOURCE_DIR = `./src`
const TARGET_DIR = `./packages`
const SCSS_EXTENSION = `.scss`

async function compileScssFiles(): Promise<void> {
  try {
    for (const {
      packagePrefix,
      sourceDirectory,
      sourceSuffix,
    } of ASSET_GROUPS) {
      const assetGroupSourceDir = path.join(SOURCE_DIR, sourceDirectory)
      const files = await fs.readdir(assetGroupSourceDir)
      const scssFiles = files.filter(
        (file) => path.extname(file) === SCSS_EXTENSION
      )
      console.log(
        `Found ${scssFiles.length} SCSS files in ${assetGroupSourceDir}`
      )

      for (const file of scssFiles) {
        const scssFilePath = path.join(assetGroupSourceDir, file)
        const fileNameWithoutExt = path.basename(file, SCSS_EXTENSION)
        const fileNameWithoutSuffix = fileNameWithoutExt.replace(
          sourceSuffix,
          ``
        )
        const cssTargetDirectory = path.join(
          TARGET_DIR,
          packagePrefix + fileNameWithoutSuffix
        )

        await fs.ensureDir(cssTargetDirectory)

        const result = sass.compile(scssFilePath)
        const cssOutputPath = path.join(cssTargetDirectory, `font-face.css`)
        fs.writeFile(cssOutputPath, result.css)
        console.log(`Compiled ${file} to ${cssOutputPath}`)
      }
    }
  } catch (error) {
    console.error(`Error while processing SCSS files:`, error)
  }
}

compileScssFiles()
