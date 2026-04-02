import Datastore from 'nedb-promises';
import path from 'node:path';
import { app } from 'electron';

const userDataPath = app.getPath('userData');

// One "table" = one file
export const snapshotsDB = Datastore.create({
  filename: path.join(userDataPath, 'snapshots.db'),
  autoload: true
});

export const warningsDB = Datastore.create({
  filename: path.join(userDataPath, 'warnings.db'),
  autoload: true
});

export const summaryDB = Datastore.create({
  filename: path.join(userDataPath, 'summary.db'),
  autoload: true
});

console.log('✅ DB initialized at', userDataPath);