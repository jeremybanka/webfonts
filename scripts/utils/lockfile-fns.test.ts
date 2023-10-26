import * as fs from "fs-extra"
import tmp from "tmp"

import * as lock from "./lockfile-fns"
import { quickFileTree } from "./quick-file-tree"

let tmpDir: tmp.DirResult

beforeEach(() => {
  tmpDir = tmp.dirSync({ unsafeCleanup: true })
  quickFileTree(
    {
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
          [`${tmpDir.name}/src/fonts/ergata.glyphs`]: `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
        }),
      },
    },
    tmpDir.name
  )
  tmp.setGracefulCleanup()
})

describe(`lockfile functions`, () => {
  test(`read`, async () => {
    const lockfile = await lock.read(tmpDir.name)
    expect(lockfile).toStrictEqual({
      [`${tmpDir.name}/src/fonts/ergata.glyphs`]: `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
    })
  })
  test(`diff`, async () => {
    const diff = await lock.diff(tmpDir.name)
    console.log({ diff })
    expect(diff).toStrictEqual({
      [`${tmpDir.name}/packages/fonts-ergata/ergata-4.otf`]: `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
    })
  })
  test(`write`, async () => {
    await lock.write(tmpDir.name)
    expect(fs.existsSync(`${tmpDir.name}/export/font.lock.json`)).toBe(true)
    expect(
      JSON.parse(fs.readFileSync(`${tmpDir.name}/export/font.lock.json`, `utf8`))
    ).toStrictEqual({
      [`${tmpDir.name}/src/fonts/ergata.glyphs`]: `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
      [`${tmpDir.name}/packages/fonts-ergata/ergata-4.otf`]: `01b307acba4f54f55aafc33bb06bbbf6ca803e9a`,
    })
  })
})
