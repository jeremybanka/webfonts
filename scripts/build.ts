import { compileScssFiles } from "./utils/compile-scss-files"
import * as lock from "./utils/lockfile-fns"
import { packFonts } from "./utils/pack-font-files"

void packFonts().then(() => lock.write().then(() => compileScssFiles()))
