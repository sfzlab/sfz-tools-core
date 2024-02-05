import path from 'path';
import { midiNameToNum, pathGetDirectory, pathGetExt, pathGetFilename, pathJoin } from '../src/utils';

const FILE_EXT: string = 'txt';
const FILE_NAME: string = 'filename';
const FILE_NAME_EXT: string = `${FILE_NAME}.${FILE_EXT}`;
const FILE_PATH = path.join('foldera', 'folderb', FILE_NAME_EXT);

test('midiNameToNum', async () => {
  expect(midiNameToNum('c1')).toEqual(24);
  expect(midiNameToNum('C#1')).toEqual(25);
  expect(midiNameToNum('Db1')).toEqual(25);
  expect(midiNameToNum('c4')).toEqual(60);
  expect(midiNameToNum('C#5')).toEqual(73);
  expect(midiNameToNum('Db5')).toEqual(73);
});

test('Path get directory', () => {
  expect(pathGetDirectory(FILE_PATH, path.sep)).toEqual(path.join('foldera', 'folderb'));
});

test('Path get extension', () => {
  expect(pathGetExt(FILE_PATH)).toEqual(FILE_EXT);
});

test('Path get filename', () => {
  expect(pathGetFilename(FILE_PATH, path.sep)).toEqual(FILE_NAME);
});

test('pathJoin', async () => {
  expect(pathJoin('https://domain.com/apple', 'banana')).toEqual('https://domain.com/apple/banana');
  expect(pathJoin('https://domain.com/apple/', 'banana')).toEqual('https://domain.com/apple/banana');

  expect(pathJoin('https://domain.com/apple', '/banana')).toEqual('https://domain.com/apple/banana');
  expect(pathJoin('https://domain.com/apple/', '/banana')).toEqual('https://domain.com/apple/banana');
  expect(pathJoin('https://domain.com/apple/', '', 'banana')).toEqual('https://domain.com/apple/banana');

  expect(pathJoin('https://domain.com/apple', '../banana')).toEqual('https://domain.com/banana');
  expect(pathJoin('https://domain.com/apple/', '../banana')).toEqual('https://domain.com/banana');

  expect(pathJoin('http://domain.com/apple', 'banana')).toEqual('http://domain.com/apple/banana');

  expect(pathJoin('Programs/', '', '..\\Samples\\Noise\\Slide_Noise\\Slide_Noise1.flac')).toEqual(
    'Samples/Noise/Slide_Noise/Slide_Noise1.flac'
  );
  expect(pathJoin('Programs/', '', '../Samples/Release4/e6_Rel4_4.flac')).toEqual('Samples/Release4/e6_Rel4_4.flac');
});
