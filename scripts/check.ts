import { compileScssFiles } from "./utils/compile-scss-files"
import * as lock from "./utils/lockfile-fns"

void lock.diff().then((delta) => (delta === null ? compileScssFiles() : null))
