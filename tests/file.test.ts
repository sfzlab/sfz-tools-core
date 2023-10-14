import {
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
  fileSize,
} from '../src/file';

const DIR_PATH: string = 'test/new-directory';
const DIR_PATH_GLOB: string = `${DIR_PATH}/**/*.txt`;
const DIR_RENAME: string = 'test/new-directory-renamed';

const FILE_PATH: string = `${DIR_PATH}/file.txt`;

test('Directory contains', () => {
  expect(dirContains('test', DIR_PATH)).toEqual(true);
  expect(dirContains('tests', DIR_PATH)).toEqual(false);
});

test('Create new directory', () => {
  expect(dirCreate(DIR_PATH)).toEqual(DIR_PATH);
});

test('Create existing directory', () => {
  expect(dirCreate(DIR_PATH)).toEqual(undefined);
});

test('Directory is empty', () => {
  expect(dirEmpty(DIR_PATH)).toEqual(true);
});

test('Directory exists', () => {
  expect(dirExists(DIR_PATH)).toEqual(true);
});

test('Directory is', () => {
  fileCreate(FILE_PATH, 'file contents');
  expect(dirIs(DIR_PATH)).toEqual(true);
  expect(dirIs(FILE_PATH)).toEqual(false);
});

test('Directory move', () => {
  expect(dirMove(DIR_PATH, DIR_RENAME)).toBeUndefined();
  expect(dirMove(DIR_RENAME, DIR_PATH)).toBeUndefined();
});

test('Directory open', () => {
  expect(dirOpen(DIR_PATH)).toEqual(new Buffer(''));
});

test('Read directory', () => {
  expect(dirRead(DIR_PATH)).toMatchObject([DIR_PATH]);
});

test('Read directory glob', () => {
  expect(dirRead(DIR_PATH_GLOB)).toMatchObject([FILE_PATH]);
});

test('Create file', () => {
  expect(fileCreate(FILE_PATH, 'file contents')).toBeUndefined();
});

test('Rename directory', () => {
  expect(dirRename(DIR_PATH, DIR_RENAME)).toBeUndefined();
});

test('Delete existing directory', () => {
  expect(dirDelete(DIR_RENAME)).toBeUndefined();
});
