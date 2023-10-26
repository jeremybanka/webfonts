import * as path from "path"

import * as fs from "fs-extra"
import tmp from "tmp"

import { compileScssFiles } from "./compile-scss-files"
import { quickFileTree } from "./quick-file-tree"

let tmpDir: tmp.DirResult

beforeEach(() => {
  tmpDir = tmp.dirSync({ unsafeCleanup: true })
  quickFileTree(
    {
      src: {
        fonts: {
          "ergata.glyphs": ``,
          "ergata.scss": ``,
        },
      },
      packages: {
        "fonts-ergata": {},
      },
    },
    tmpDir.name
  )
  return () => {
    tmpDir.removeCallback()
  }
})

describe(`compileScssFiles`, () => {
  it(`compiles SCSS files`, async () => {
    await compileScssFiles(tmpDir.name)
    console.log(fs.readdirSync(tmpDir.name))
    console.log(fs.readdirSync(path.join(tmpDir.name, `packages`)))
    console.log(
      fs.readdirSync(path.join(tmpDir.name, `packages`, `fonts-ergata`))
    )
    expect(
      fs.existsSync(
        path.join(tmpDir.name, `packages`, `fonts-ergata`, `font-face.css`)
      )
    ).toBe(true)
  })
})
