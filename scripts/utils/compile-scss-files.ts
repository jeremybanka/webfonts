import * as fs from "fs-extra"
import * as path from "path"
import * as sass from "sass"

import { ASSET_GROUPS, SCSS_EXTENSION, SOURCE_DIR, TARGET_DIR } from "./CONST"

export async function compileScssFiles(baseDir = `.`): Promise<void> {
	try {
		for (const {
			packagePrefix,
			sourceDirectory,
			sourceSuffix,
		} of ASSET_GROUPS) {
			const assetGroupSourceDir = path.join(baseDir, SOURCE_DIR, sourceDirectory)
			const files = await fs.readdir(assetGroupSourceDir)
			const scssFiles = files.filter(
				(file) => path.extname(file) === SCSS_EXTENSION
			)
			console.log(
				`Found ${scssFiles.length} SCSS files in ${assetGroupSourceDir}`
			)

			for (const file of scssFiles) {
				const scssFilePath = path.join(assetGroupSourceDir, file)
				const fileNameWithoutExt = path.basename(file, SCSS_EXTENSION)
				const fileNameWithoutSuffix = fileNameWithoutExt.replace(
					sourceSuffix,
					``
				)
				const cssTargetDirectory = path.join(
					baseDir,
					TARGET_DIR,
					packagePrefix + fileNameWithoutSuffix
				)

				await fs.ensureDir(cssTargetDirectory)

				const result = sass.compile(scssFilePath)
				const cssOutputPath = path.join(cssTargetDirectory, `font-face.css`)
				await fs.writeFile(cssOutputPath, result.css)
				console.log(`Compiled ${file} to ${cssOutputPath}`)
			}
		}
	} catch (error) {
		console.error(`Error while processing SCSS files:`, error)
	}
}
