import path from 'path';
import { pathGetDirectory, pathGetExt, pathGetFilename, pathJoin } from '../src/utils';

const FILE_EXT: string = 'txt';
const FILE_NAME: string = 'filename';
const FILE_NAME_EXT: string = `${FILE_NAME}.${FILE_EXT}`;
const FILE_PATH = path.join('foldera', 'folderb', FILE_NAME_EXT);

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

  expect(pathJoin('Programs/', '', '..\\Samples\\Noise\\Slide_Noise\\Slide_Noise1.flac')).toEqual(
    'Samples/Noise/Slide_Noise/Slide_Noise1.flac'
  );
  expect(pathJoin('Programs/', '', '../Samples/Release4/e6_Rel4_4.flac')).toEqual('Samples/Release4/e6_Rel4_4.flac');
});
