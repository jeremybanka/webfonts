import * as path from "path"

import * as fs from "fs-extra"

import { FONT_LOCKFILE } from "./CONST"
import { hashFontFiles } from "./hash-font-files"

export async function write(baseDir = `.`): Promise<void> {
  try {
    const lockfile = await hashFontFiles(baseDir)
    await fs.writeFile(
      path.join(baseDir, FONT_LOCKFILE),
      JSON.stringify(lockfile, null, 2)
    )
  } catch (error) {
    console.error(`Error while writing lock file:`, error)
  }
}

export async function read(baseDir = `.`): Promise<Record<string, string>> {
  try {
    const lockFile = await fs.readFile(path.join(baseDir, FONT_LOCKFILE), `utf8`)
    const lockFileJson = JSON.parse(lockFile)
    return lockFileJson
  } catch (error) {
    console.error(`Error while reading lock file:`, error)
    return {}
  }
}

export async function diff(
  baseDir = `.`
): Promise<Record<string, string> | null> {
  try {
    const lockfile = await read(baseDir)
    const newLockfile = await hashFontFiles(baseDir)
    const lockfileEntries = Object.entries(lockfile)
    const newLockfileEntries = Object.entries(newLockfile)
    const lockfileEntriesWithChanges = lockfileEntries.filter(
      ([filepath, hash]) => newLockfile[filepath] !== hash
    )
    const newLockfileEntriesWithChanges = newLockfileEntries.filter(
      ([filepath, hash]) => lockfile[filepath] !== hash
    )
    const changeEntries = [
      ...lockfileEntriesWithChanges,
      ...newLockfileEntriesWithChanges,
    ]
    console.log({ lockfileEntriesWithChanges, newLockfileEntriesWithChanges })
    console.log(
      `Lockfile entries with changes:`,
      lockfileEntriesWithChanges.map(([filepath, hash]) => ({
        filepath,
        oldHash: hash,
        newHash: newLockfile[filepath],
      }))
    )
    return changeEntries.length > 0 ? Object.fromEntries(changeEntries) : null
  } catch (error) {
    console.error(`Error while comparing lock files:`, error)
    return null
  }
}
