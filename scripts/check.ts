import { compileScssFiles } from "./utils/compile-scss-files"
import { compareLockfile } from "./utils/hash-font-files"

compareLockfile().then(() => compileScssFiles())
