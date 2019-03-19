import * as fs from 'fs';
import { Open } from 'unzipper';

async function unzip(zip, path, outPath) {
  const directory = await Open.file(zip);

  console.log('files', directory.files.filter((f) => f.path === path)); // eslint-disable-line

  return new Promise((resolve, reject) => {
    directory.files
      .find(f => f.path === path)
      .stream()
      .pipe(fs.createWriteStream(outPath))
      .on('error', reject)
      .on('finish', resolve);
  });
}

export default { unzip };

/* async function readHeightmap(path, shape = { x: 1025, y: 1025 }) {
  const buffer = await promisify(fs.readFile)(path);
  const reader = new FileReader();

  
} */
