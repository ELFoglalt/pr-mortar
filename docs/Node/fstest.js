const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unzipper = require('unzipper');
const ndarray = require('ndarray');
const unpack = require('ndarray-unpack');
const { mulseq, addseq, maxseq } = require('ndarray-ops');

async function unzip(zipPath, outFolder, filePath) {
  const directory = await unzipper.Open.file(zipPath);
  const outFilePath = path.join(outFolder, filePath);

  return new Promise((resolve, reject) => {
    directory.files
      .find(f => f.path === filePath)
      .stream()
      .pipe(fs.createWriteStream(outFilePath))
      .on('error', reject)
      .on('finish', resolve);
  });
}

async function isValidPRMap(folder) {
  const serverZip = path.join(folder, 'server.zip');
  try {
    await promisify(fs.stat)(serverZip);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }

  const directory = await unzipper.Open.file(serverZip);
  const hasHeightMap = directory.find(f => f.path === 'heightmapprimary.raw');
  const hasMetaData = directory.find(f => f.path === 'heightdata.con');

  return hasHeightMap && hasMetaData;
}

async function unzipPRMap(mapFolder, outFolder) {
  if (!(await isValidPRMap(mapFolder))) {
    throw Error('Folder is not a valid PRBF2 map.');
  }

  const zipPath = path.join(mapFolder, 'server.zip');

  try {
    await Promise.all([
      unzip(zipPath, outFolder, 'heightmapprimary.raw'),
      unzip(zipPath, outFolder, 'heightdata.con'),
    ]);
  } catch (error) {
    throw Error(`Failed to unzip map: ${error.message}`);
  }
}

const readFilePromise = promisify(fs.readFile);

async function loadMetaData(filePath) {
  const configStr = (await readFilePromise(filePath)).toString();

  const scaleRegExp = /Heightmap 0 0$[\s\S]*?^heightmap\.setScale ([\d.]*)\/([\d.]*)\/([\d.]*)$/gm;
  const seawaterlevelRegExp = /^heightmapcluster\.setSeaWaterLevel ([\d.]*)$/gm;

  const scaleResults = scaleRegExp.exec(configStr);
  if (scaleResults.length < 4) {
    throw Error('Invalid config file.');
  }

  const scale = scaleResults.slice(1, 3).map(parseFloat);

  const seawaterlevelResults = seawaterlevelRegExp.exec(configStr);
  if (seawaterlevelResults.length < 2) {
    throw Error('Invalid config file.');
  }

  const seawaterlevel = parseFloat(seawaterlevelResults[1]);

  return { scale, seawaterlevel };
}

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
  const heightDataAsUInt16 = ndarray(new Uint16Array(buffer));
  const heightDataUnpacked = unpack(heightDataAsUInt16);
  const heightDataAsNumber = ndarray(heightDataUnpacked, shape).step(-1, 1);

  return heightDataAsNumber;
}

function convertToMetersInPlace(heightData, metaData) {
  mulseq(heightData, metaData.scale[1]);
  addseq(heightData, -metaData.seawaterlevel);
  maxseq(heightData, 0);
}

async function loadUnzippedMap(folder) {
  let heightData;
  let metaData;
  try {
    [heightData, metaData] = await Promise.all([
      loadHeightData(path.join(folder, 'heightmapprimary.raw')),
      loadMetaData(path.join(folder, 'heightdata.con')),
    ]);
  } catch (error) {
    throw Error(`Failed to load map: ${error.message}`);
  }

  convertToMetersInPlace(heightData, metaData);

  return { heightData, ...metaData };
}

async function main() {
  await unzipPRMap('C:\\Games\\Project Reality BF2\\mods\\pr\\levels', '.\\docs\\Node');

  const prMap = await loadUnzippedMap('.\\docs\\Node\\');

  console.log(prMap); // eslint-disable-line
}

main();
