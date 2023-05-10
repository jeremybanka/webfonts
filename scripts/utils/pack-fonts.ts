import * as path from "path"

import * as fs from "fs-extra"

import {
  ASSET_GROUPS,
  EXPORT_DIR,
  FONT_TARGET_EXTENSIONS,
  TARGET_DIR,
} from "./CONST"

export async function packFonts(): Promise<void> {
  const successfulFamilies: Set<string> = new Set()
  try {
    for (const {
      packagePrefix,
      sourceDirectory,
      sourceSuffix,
    } of ASSET_GROUPS) {
      const files = await fs.readdir(EXPORT_DIR)
      const fontFiles = files.filter((file) =>
        FONT_TARGET_EXTENSIONS.includes(path.extname(file).toLowerCase())
      )

      // Group files by family name
      const fontFamilies: { [family: string]: string[] } = {}
      for (const file of fontFiles) {
        const familyName = file.split(/[^a-zA-Z]/)[0].toLowerCase()
        if (!fontFamilies[familyName]) {
          fontFamilies[familyName] = []
        }
        fontFamilies[familyName].push(file)
      }

      // Process each font family
      // eslint-disable-next-line no-restricted-syntax
      for (const familyName in fontFamilies) {
        const sourceFiles = fontFamilies[familyName]
        const targetFamilyDirectory = path.join(
          TARGET_DIR,
          packagePrefix + familyName
        )

        // Check if target directory exists
        if (!fs.existsSync(targetFamilyDirectory)) {
          console.warn(
            `Warning: Target directory not found for family '${familyName}', font files will not be moved.`
          )
          continue
        }

        // Delete existing font files in target directory
        const existingFiles = await fs.readdir(targetFamilyDirectory)
        const existingFontFiles = existingFiles.filter((file) =>
          FONT_TARGET_EXTENSIONS.includes(path.extname(file).toLowerCase())
        )
        for (const file of existingFontFiles) {
          await fs.remove(path.join(targetFamilyDirectory, file))
        }

        // Move font files to target directory
        for (const file of sourceFiles) {
          const sourcePath = path.join(EXPORT_DIR, file)
          const targetPath = path.join(targetFamilyDirectory, file)
          successfulFamilies.add(familyName)
          await fs.move(sourcePath, targetPath)
        }
      }

      if (successfulFamilies.size > 0) {
        console.log(
          `${sourceDirectory} for ${[...successfulFamilies].join(
            `, `
          )} families packed successfully.`
        )
        successfulFamilies.clear()
      } else {
        console.log(`No ${sourceDirectory} found.`)
      }
    }
  } catch (error) {
    console.error(`Error while packing font files:`, error)
  }
}
