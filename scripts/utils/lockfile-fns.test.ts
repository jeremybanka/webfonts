import * as fs from "fs-extra"
import mock from "mock-fs"

import * as lock from "./lockfile-fns"

beforeEach(() => {
  mock({
    src: {
      fonts: {
        "ergata.glyphs": `1234567890`,
        "ergata.scss": ``,
      },
      icons: {},
    },
    packages: {
      "fonts-ergata": {
        "ergata-4.otf": `1234567890`,
      },
    },
    export: {
      "font.lock.json": JSON.stringify({
        "src/fonts/ergata.glyphs": `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
      }),
    },
  })
})

describe(`lockfile functions`, () => {
  test(`read`, async () => {
    const lockfile = await lock.read()
    expect(lockfile).toStrictEqual({
      "src/fonts/ergata.glyphs": `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
    })
  })
  test(`diff`, async () => {
    const diff = await lock.diff()
    console.log({ diff })
    expect(diff).toStrictEqual({
      "packages/fonts-ergata/ergata-4.otf": `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
    })
  })
  test(`write`, async () => {
    await lock.write()
    expect(fs.existsSync(`export/font.lock.json`)).toBe(true)
    expect(
      JSON.parse(fs.readFileSync(`export/font.lock.json`, `utf8`))
    ).toStrictEqual({
      "src/fonts/ergata.glyphs": `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
      "packages/fonts-ergata/ergata-4.otf": `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
    })
  })
})
