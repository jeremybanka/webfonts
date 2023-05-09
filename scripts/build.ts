import { compileScssFiles } from "./utils/compile-scss"
import { writeLockfile } from "./utils/hash-fonts"

writeLockfile()
compileScssFiles()
