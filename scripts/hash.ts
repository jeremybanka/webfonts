import * as crypto from "crypto"
import * as path from "path"

import * as fs from "fs-extra"

import {
  ASSET_GROUPS,
  FONT_LOCKFILE,
  FONT_SOURCE_EXTENSION,
  FONT_TARGET_EXTENSIONS,
  SOURCE_DIR,
} from "./constants"

export async function generateFontFileHashes(): Promise<Record<string, string>> {
  try {
    const assetGroupHashRecords = await Promise.all(
      ASSET_GROUPS.map(async ({ sourceDirectory }) => {
        const assetGroupSourceDir = path.join(SOURCE_DIR, sourceDirectory)
        const sourceFilepaths = (await fs.readdir(assetGroupSourceDir)).map(
          (file) => path.join(assetGroupSourceDir, file)
        )
        const sourceFontFilepaths = sourceFilepaths.filter((file) =>
          file.endsWith(FONT_SOURCE_EXTENSION)
        )
        const packageDirectories = await fs
          .readdir(`./packages`)
          .then((contents) =>
            contents
              .filter((maybeDirectory) => {
                const maybeDirectoryPath = path.join(
                  `./packages`,
                  maybeDirectory
                )
                return fs.lstatSync(maybeDirectoryPath).isDirectory()
              })
              .map((directory) => path.join(`./packages`, directory))
          )
        const targetFilepaths = (
          await Promise.all(
            packageDirectories.map((packageDirectory) =>
              fs
                .readdir(packageDirectory)
                .then((contents) =>
                  contents.filter((maybeFile) =>
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

export async function readLockfile(): Promise<Record<string, string>> {
  try {
    const lockFile = await fs.readFile(FONT_LOCKFILE, `utf8`)
    const lockFileJson = JSON.parse(lockFile)
    return lockFileJson
  } catch (error) {
    console.error(`Error while reading lock file:`, error)
    return {}
  }
}

export async function compareLockfile(): Promise<void> {
  try {
    const lockfile = await readLockfile()
    const newLockfile = await generateFontFileHashes()
    const lockfileEntries = Object.entries(lockfile)
    const newLockfileEntries = Object.entries(newLockfile)
    const lockfileEntriesWithChanges = lockfileEntries.filter(
      ([filepath, hash]) => newLockfile[filepath] !== hash
    )
    const newLockfileEntriesWithChanges = newLockfileEntries.filter(
      ([filepath, hash]) => lockfile[filepath] !== hash
    )
    console.log(
      `Lockfile entries with changes:`,
      lockfileEntriesWithChanges.map(([filepath, hash]) => ({
        filepath,
        oldHash: hash,
        newHash: newLockfile[filepath],
      }))
    )
    console.log(
      `New lockfile entries with changes:`,
      newLockfileEntriesWithChanges.map(([filepath, hash]) => ({
        filepath,
        oldHash: lockfile[filepath],
        newHash: hash,
      }))
    )
  } catch (error) {
    console.error(`Error while comparing lock files:`, error)
  }
}

export async function writeLockfile(): Promise<void> {
  try {
    const lockfile = await generateFontFileHashes()
    await fs.writeFile(FONT_LOCKFILE, JSON.stringify(lockfile, null, 2))
  } catch (error) {
    console.error(`Error while writing lock file:`, error)
  }
}
