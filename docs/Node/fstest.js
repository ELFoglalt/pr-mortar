const fs = require('fs');
const { promisify } = require('util');
const { Open } = require('unzipper');
const ndarray = require('ndarray');

async function unzip(zip, path, outPath) {
  const directory = await Open.file(zip);
  // console.log('files', directory.files.filter((f) => f.path === path)); // eslint-disable-line

  return new Promise((resolve, reject) => {
    directory.files
      .find(f => f.path === path)
      .stream()
      .pipe(fs.createWriteStream(outPath))
      .on('error', reject)
      .on('finish', resolve);
  });
}

const readFilePromise = promisify(fs.readFile);

function toArrayBuffer(buf) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; i += 1) {
    view[i] = buf[i];
  }
  return ab;
}

async function loadHeightData(path, shape = [1025, 1025]) {
  const buffer = toArrayBuffer(await readFilePromise(path));

  // ndarray.get(x, y): x selects row, y selects column on map;
  const heightdata = ndarray(new Uint16Array(buffer), shape).step(-1, 1);

  return heightdata;
}

async function main() {
  const zippath = 'C:\\Games\\Project Reality BF2\\mods\\pr\\levels\\albasrah_2\\server.zip';
  await Promise.all([
    unzip(zippath, 'heightmapprimary.raw', '.\\docs\\Node\\heightmapprimary.raw'),
    unzip(zippath, 'heightdata.con', '.\\docs\\Node\\heightdata.con'),
  ]);

  const heightdata = await loadHeightData('.\\docs\\Node\\heightmapprimary.raw');

  let x = 0;
  let y = 0;
  console.log(`x=${x}, y=${y}: `, heightdata.get(x, y)); // eslint-disable-line
  x = 1024;
  y = 0;
  console.log(`x=${x}, y=${y}: `, heightdata.get(x, y)); // eslint-disable-line
  x = 0;
  y = 1024;
  console.log(`x=${x}, y=${y}: `, heightdata.get(x, y)); // eslint-disable-line
  x = 1024;
  y = 1024;
  console.log(`x=${x}, y=${y}: `, heightdata.get(x, y)); // eslint-disable-line
}

main();
