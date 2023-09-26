import fs from 'fs';
import { log } from './utils';

function fileBuffer(filePath: string): Buffer {
  log('⎋', filePath);
  return fs.readFileSync(filePath);
}

function fileJson(filePath: string): any {
  log('⎋', filePath);
  return JSON.parse(fs.readFileSync(filePath).toString());
}

function fileText(filePath: string): string {
  log('⎋', filePath);
  return fs.readFileSync(filePath).toString();
}

export { fileBuffer, fileJson, fileText };
