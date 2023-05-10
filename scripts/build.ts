import { compileScssFiles } from "./utils/compile-scss-files"
import { writeLockfile } from "./utils/hash-fonts"
import { packFonts } from "./utils/pack-fonts"

packFonts()
writeLockfile()
compileScssFiles()
