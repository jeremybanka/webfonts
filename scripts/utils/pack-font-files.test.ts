import * as fs from "fs-extra"
import mock from "mock-fs"

import { packFonts } from "./pack-font-files"

beforeEach(() => {
  mock({
    packages: {
      "fonts-ergata": {},
    },
    export: {
      "ergata-4.otf": `1234567890`,
    },
  })
})

describe(`pack font files`, () => {
  it(`moves files from export/ into their corresponding packages/`, async () => {
    await packFonts()
    expect(fs.existsSync(`packages/fonts-ergata/ergata-4.otf`)).toBe(true)
    expect(fs.existsSync(`export/fonts-ergata/ergata-4.otf`)).toBe(false)
  })
})
