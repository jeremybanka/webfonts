import * as fs from "fs-extra"
import mock from "mock-fs"

import { compileScssFiles } from "./compile-scss-files"

beforeEach(() => {
  mock({
    src: {
      fonts: {
        "ergata.glyphs": ``,
        "ergata.scss": ``,
      },
    },
    packages: {
      "fonts-ergata": {},
    },
  })
})

describe(`compileScssFiles`, () => {
  it(`compiles SCSS files`, async () => {
    await compileScssFiles()
    console.log(fs.readdirSync(`.`))
    console.log(fs.readdirSync(`./packages`))
    console.log(fs.readdirSync(`./packages/fonts-ergata`))
    expect(fs.existsSync(`packages/fonts-ergata/font-face.css`)).toBe(true)
  })
})
