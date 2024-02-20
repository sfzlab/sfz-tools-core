import path from 'path';
import { midiNameToNum, midiNumToName, pathGetDirectory, pathGetExt, pathGetFilename, pathJoin } from '../src/utils';

const FILE_EXT: string = 'txt';
const FILE_NAME: string = 'filename';
const FILE_NAME_EXT: string = `${FILE_NAME}.${FILE_EXT}`;
const FILE_PATH = path.join('foldera', 'folderb', FILE_NAME_EXT);

test('midiNameToNum', async () => {
  expect(midiNameToNum('a0')).toEqual(21);
  expect(midiNameToNum('c1')).toEqual(24);
  expect(midiNameToNum('C#1')).toEqual(25);
  expect(midiNameToNum('Db1')).toEqual(25);
  expect(midiNameToNum('c4')).toEqual(60);
  expect(midiNameToNum('C#5')).toEqual(73);
  expect(midiNameToNum('Db5')).toEqual(73);
  expect(midiNameToNum('g7')).toEqual(103);
  expect(midiNameToNum('g#7')).toEqual(104);
  expect(midiNameToNum('C9')).toEqual(120);
  expect(midiNameToNum('G9')).toEqual(127);
});

test('midiNumToName', async () => {
  expect(midiNumToName(21)).toEqual('A0');
  expect(midiNumToName(24)).toEqual('C1');
  expect(midiNumToName(25)).toEqual('C#1');
  expect(midiNumToName(25)).toEqual('C#1');
  expect(midiNumToName(60)).toEqual('C4');
  expect(midiNumToName(73)).toEqual('C#5');
  expect(midiNumToName(103)).toEqual('G7');
  expect(midiNumToName(104)).toEqual('G#7');
  expect(midiNumToName(120)).toEqual('C9');
  expect(midiNumToName(127)).toEqual('G9');
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

  expect(pathJoin('Programs/mappings', 'mappings/kick_dampen.sfz')).toEqual('Programs/mappings/kick_dampen.sfz');
});
