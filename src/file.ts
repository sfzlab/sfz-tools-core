import { execSync } from 'child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  moveSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs-extra';
import { globSync } from 'glob';
import { log } from './utils';
import path from 'path';
const fsUtils: any = require('nodejs-fs-utils');

function dirContains(dirParent: string, dirChild: string): boolean {
  const relative = path.relative(dirParent, dirChild);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? true : false;
}

function dirCreate(dirPath: string): string | boolean {
  if (!dirExists(dirPath)) {
    log('+', dirPath);
    mkdirSync(dirPath, { recursive: true });
    return dirPath;
  }
  return false;
}

function dirDelete(dirPath: string): void {
  log('-', dirPath);
  return rmSync(dirPath, { recursive: true });
}

function dirEmpty(dirPath: string): boolean {
  const files: string[] = readdirSync(dirPath);
  return files.length === 0 || (files.length === 1 && files[0] === '.DS_Store');
}

function dirExists(dirPath: string): boolean {
  return existsSync(dirPath);
}

function dirIs(dirPath: string): boolean {
  return statSync(dirPath).isDirectory();
}

function dirMove(dirPath: string, newPath: string): void {
  log('-', dirPath);
  log('+', newPath);
  return moveSync(dirPath, newPath, { overwrite: true });
}

function dirOpen(dirPath: string): Buffer {
  if (process.env.CI) return new Buffer('');
  let command: string = '';
  switch (process.platform) {
    case 'darwin':
      command = 'open';
      break;
    case 'win32':
      command = 'start ""';
      break;
    default:
      command = 'xdg-open';
      break;
  }
  log('⎋', `${command} "${dirPath}"`);
  return execSync(`${command} "${dirPath}"`);
}

function dirRead(dirPath: string, options?: any): string[] {
  log('⌕', dirPath);
  // Glob now expects forward slashes on Windows
  // Convert backslashes from path.join() to forwardslashes
  if (process.platform === 'win32') {
    dirPath = dirPath.replace(/\\/g, '/');
  }
  return globSync(dirPath, options);
}

function dirRename(oldPath: string, newPath: string): void {
  return moveSync(oldPath, newPath, { overwrite: true });
}

function fileCreate(filePath: string, data: string | Buffer): void {
  log('+', filePath);
  return writeFileSync(filePath, data);
}

function fileDate(filePath: string): Date {
  return statSync(filePath).mtime;
}

function fileDelete(filePath: string): void {
  log('-', filePath);
  return unlinkSync(filePath);
}

function fileExec(filePath: string): void {
  return chmodSync(filePath, '755');
}

function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

function fileMove(dirPath: string, newPath: string): void {
  log('-', dirPath);
  log('+', newPath);
  return moveSync(dirPath, newPath, { overwrite: true });
}

function fileOpen(filePath: string): Buffer {
  let command: string = '';
  switch (process.platform) {
    case 'darwin':
      command = 'open';
      break;
    case 'win32':
      command = 'start';
      break;
    default:
      command = 'xdg-open';
      break;
  }
  log('⎋', `${command} "${filePath}"`);
  return execSync(`${command} "${filePath}"`);
}

function fileRead(filePath: string): Buffer {
  log('⎋', filePath);
  return readFileSync(filePath);
}

function fileReadJson(filePath: string): any {
  log('⎋', filePath);
  return JSON.parse(readFileSync(filePath).toString());
}

function fileReadString(filePath: string): string {
  log('⎋', filePath);
  return readFileSync(filePath).toString();
}

function fileSize(filePath: string): number {
  return fsUtils.fsizeSync(filePath);
}

export {
  dirContains,
  dirCreate,
  dirDelete,
  dirEmpty,
  dirExists,
  dirIs,
  dirMove,
  dirOpen,
  dirRead,
  dirRename,
  fileCreate,
  fileDate,
  fileDelete,
  fileExec,
  fileExists,
  fileMove,
  fileOpen,
  fileRead,
  fileReadJson,
  fileReadString,
  fileSize,
};
