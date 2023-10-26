import { existsSync } from "fs"

import tmp from "tmp"

import { packFonts } from "./pack-font-files"
import { quickFileTree } from "./quick-file-tree"

let tmpDir: tmp.DirResult

beforeEach(() => {
  tmpDir = tmp.dirSync({ unsafeCleanup: true })
  quickFileTree(
    {
      packages: {
        "fonts-ergata": {
          "ergata-4.otf": `1234567890`,
        },
      },
      export: {
        "ergata-4.otf": `1234567890`,
      },
    },
    tmpDir.name
  )
  return () => {
    tmpDir.removeCallback()
  }
})

describe(`pack font files`, () => {
  it(`moves files from export/ into their corresponding packages/`, async () => {
    await packFonts(tmpDir.name)
    expect(existsSync(`${tmpDir.name}/packages/fonts-ergata/ergata-4.otf`)).toBe(
      true
    )
    expect(existsSync(`${tmpDir.name}/export/fonts-ergata/ergata-4.otf`)).toBe(
      false
    )
  })
})
