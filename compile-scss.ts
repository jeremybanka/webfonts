import * as fs from 'fs-extra';
import * as path from 'path';
import sass from 'sass';

const sourceDirectory = './src/fonts';
const targetDirectory = './packages';
const scssExtension = '.scss';

async function compileScssFiles(): Promise<void> {
  try {
    const files = await fs.readdir(sourceDirectory);
    const scssFiles = files.filter(file => path.extname(file) === scssExtension);
    console.log(`Found ${scssFiles.length} SCSS files in ${sourceDirectory}`);

    for (const file of scssFiles) {
      const scssFilePath = path.join(sourceDirectory, file);
      const fileNameWithoutExt = path.basename(file, scssExtension);
      const fileNameWithoutSuffix = fileNameWithoutExt.replace('-font', '');
      const cssTargetDirectory = path.join(targetDirectory, `fonts-` + fileNameWithoutSuffix);

      await fs.ensureDir(cssTargetDirectory);

      const result = sass.compile(scssFilePath)
      const cssOutputPath = path.join(cssTargetDirectory, `font-face.css`);
      fs.writeFile(cssOutputPath, result.css);
      console.log(`Compiled ${file} to ${cssOutputPath}`);
    }
  } catch (error) {
    console.error('Error while processing SCSS files:', error);
  }
}

compileScssFiles();
