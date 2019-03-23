import { app, dialog } from 'electron';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { unzipPRMap, loadUnzippedMap } from '../../common/map-io';
import store from '../../store';

let lastPath;

export default async function importMapWithDialog(window = undefined) {
  const directories = await dialog.showOpenDialog(window, {
    title: 'Open map',
    defaultPath: lastPath,
    properties: ['openDirectory'],
  });

  if (!directories || directories[0] === '') return;

  const sourceDirectory = directories[0];
  const targetDirectory = path.join(app.getPath('userData'), 'map');
  const mapName = path.basename(sourceDirectory);

  try {
    await promisify(fs.stat)(targetDirectory);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await promisify(fs.mkdir(targetDirectory));
    }
  }

  try {
    await unzipPRMap(sourceDirectory, targetDirectory);
  } catch (error) {
    dialog.showErrorBox('Failed to load map', error.message);
  }

  try {
    lastPath = path.dirname(sourceDirectory);
  } catch (error) {
    lastPath = undefined;
  }

  let loadedMap;
  try {
    loadedMap = await loadUnzippedMap(targetDirectory);
  } catch (error) {
    dialog.showErrorBox('Failed to load map', 'Map files corrupted.');
    return;
  }

  loadedMap.mapName = mapName;

  store.dispatch('core/aLoadMap', { loadedMap });
}
