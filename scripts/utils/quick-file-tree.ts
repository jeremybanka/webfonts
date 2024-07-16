import * as fs from "fs-extra"
import * as path from "path"

export type FileTree = {
	[key: string]: FileTree | string
}

export function quickFileTree(tree: FileTree, baseDir = `.`): void {
	for (const [key, value] of Object.entries(tree)) {
		// if (typeof value === `string`) {
		//   const filePath = path.join(baseDir, key)
		//   const fileDir = path.dirname(filePath)
		//   fs.ensureDirSync(fileDir)
		//   fs.writeFileSync(filePath, value)
		// } else {
		//   quickFileTree(value, path.join(baseDir, key))
		// }
		switch (typeof value) {
			case `string`: {
				const filePath = path.join(baseDir, key)
				const fileDir = path.dirname(filePath)
				fs.ensureDirSync(fileDir)
				fs.writeFileSync(filePath, value)
				break
			}
			case `object`: {
				const dirPath = path.join(baseDir, key)
				fs.ensureDirSync(dirPath)
				quickFileTree(value, path.join(baseDir, key))
				break
			}
		}
	}
}
