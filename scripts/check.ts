import { compileScssFiles } from "./utils/compile-scss-files"
import { compareLockfile } from "./utils/hash-fonts"

compareLockfile().then(() => compileScssFiles())
