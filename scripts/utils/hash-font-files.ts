import * as crypto from "crypto"
import * as path from "path"

import * as fs from "fs-extra"

import {
  ASSET_GROUPS,
  FONT_SOURCE_EXTENSION,
  FONT_TARGET_EXTENSIONS,
  SOURCE_DIR,
  TARGET_DIR,
} from "./CONST"

export async function hashFontFiles(
  baseDir = `.`
): Promise<Record<string, string>> {
  try {
    const assetGroupHashRecords = await Promise.all(
      ASSET_GROUPS.map(async ({ sourceDirectory, packagePrefix }) => {
        const assetGroupSourceDir = path.join(
          baseDir,
          SOURCE_DIR,
          sourceDirectory
        )
        const sourceFilepaths = (await fs.readdir(assetGroupSourceDir)).map(
          (file) => path.join(assetGroupSourceDir, file)
        )
        const sourceFontFilepaths = sourceFilepaths.filter((file) =>
          file.endsWith(FONT_SOURCE_EXTENSION)
        )

        const packageDirectories = await fs
          .readdir(path.join(baseDir, `packages`))
          .then((contents) =>
            contents
              .filter((maybeDirectory) => {
                const maybeDirectoryPath = path.join(
                  baseDir,
                  `packages`,
                  maybeDirectory
                )
                return fs.lstatSync(maybeDirectoryPath).isDirectory()
              })
              .map((directory) => path.join(baseDir, `packages`, directory))
          )
        const targetFilepaths = (
          await Promise.all(
            packageDirectories
              .filter((packageDirectory) =>
                packageDirectory.startsWith(
                  path.join(baseDir, TARGET_DIR, packagePrefix)
                )
              )
              .map((packageDirectory) =>
                fs
                  .readdir(packageDirectory)
                  .then((contents) =>
                    contents.map((maybeFile) =>
                      path.join(packageDirectory, maybeFile)
                    )
                  )
              )
          )
        ).flat()
        const targetFontFilepaths = targetFilepaths.filter((file) =>
          FONT_TARGET_EXTENSIONS.some((extension) => file.endsWith(extension))
        )
        console.log(
          `${sourceFontFilepaths.length} source files for ${sourceDirectory}:`,
          sourceFontFilepaths
        )
        console.log(
          `${targetFontFilepaths.length} target files for ${sourceDirectory}:`,
          targetFontFilepaths
        )

        const fontHashes: { [fileName: string]: string } = {}

        const allFontFilepaths = [...sourceFontFilepaths, ...targetFontFilepaths]

        for (const filepath of allFontFilepaths) {
          const fileBuffer = await fs.readFile(filepath)
          const hash = crypto.createHash(`sha1`).update(fileBuffer).digest(`hex`)
          fontHashes[filepath] = hash
        }

        console.log(`${sourceDirectory} file hashes:`, fontHashes)

        return fontHashes
      })
    )
    const fontHashes = assetGroupHashRecords.reduce(
      (acc, hashRecord) => ({ ...acc, ...hashRecord }),
      {}
    )
    console.log(`All file hashes:`, fontHashes)
    return fontHashes
  } catch (error) {
    console.error(`Error while generating font file hashes:`, error)
    return {}
  }
}
