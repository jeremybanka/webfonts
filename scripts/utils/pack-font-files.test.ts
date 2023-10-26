import { mkdirSync, writeFileSync } from "fs"

import * as fs from "fs-extra"
import tmp from "tmp"

import { packFonts } from "./pack-font-files"

let tmpDir: tmp.DirResult

beforeEach(() => {
  tmpDir = tmp.dirSync({ unsafeCleanup: true })
  mkdirSync(`${tmpDir.name}/packages`)
  mkdirSync(`${tmpDir.name}/packages/fonts-ergata`)
  mkdirSync(`${tmpDir.name}/export`)
  writeFileSync(`${tmpDir.name}/export/ergata-4.otf`, `1234567890`)
  tmp.setGracefulCleanup()
})

describe(`pack font files`, () => {
  it(`moves files from export/ into their corresponding packages/`, async () => {
    await packFonts(tmpDir.name)
    expect(
      fs.existsSync(`${tmpDir.name}/packages/fonts-ergata/ergata-4.otf`)
    ).toBe(true)
    expect(
      fs.existsSync(`${tmpDir.name}/export/fonts-ergata/ergata-4.otf`)
    ).toBe(false)
  })
})
