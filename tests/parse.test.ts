import {
  parseDefines,
  parseHeader,
  parseHeaders,
  parseIncludes,
  parseLoad,
  parseOpcodeObject,
  parseSanitize,
  parseSegment,
  parseSetLoader,
  parseSfz,
  parseVariables,
} from '../src/parse';
import { apiJson, apiText } from '../src/api';
import { js2xml } from 'xml-js';
import { dirRead, fileReadString } from '../src/file';
import path from 'path';
import { normalizeLineEnds, normalizeXml, pathGetDirectory } from '../src/utils';
import { ParseDefinition, ParseHeader, ParseHeaderNames } from '../src/types/parse';

function convertToXml(elements: any) {
  const xml: string = js2xml(
    {
      declaration: {
        attributes: {
          version: '1.0',
        },
      },
      elements,
    },
    { spaces: '\t' }
  );
  return normalizeXml(xml);
}

function replaceFileExts(contents: string) {
  return contents.replace(/.flac/g, '.ogg');
}

beforeAll(() => {
  parseSetLoader(fileReadString);
});

// Test specific syntax edge-cases
const syntaxDir: string = path.join('test', 'syntax');
const syntaxFiles: string[] = dirRead(path.join(syntaxDir, '**', '*.sfz'));
test.each(syntaxFiles)('parseSfz %p', async (sfzFile: string) => {
  const sfzDir: string = pathGetDirectory(sfzFile, path.sep);
  const sfzText: string = fileReadString(sfzFile);
  const sfzXml: string = fileReadString(sfzFile.replace('.sfz', '.xml'));
  expect(convertToXml(await parseSfz(sfzText, sfzDir))).toEqual(sfzXml);
});

// Test entire sfz test suite
const testDir: string = path.join('sfz-tests');
const testFiles: string[] = dirRead(path.join(testDir, '**', '*.sfz'));
test.each(testFiles)('parseSfz %p', async (sfzFile: string) => {
  const sfzDir: string = pathGetDirectory(sfzFile, path.sep);
  const sfzText: string = fileReadString(sfzFile);
  const sfzXml: string = fileReadString(sfzFile.replace('.sfz', '.xml'));
  expect(convertToXml(await parseSfz(sfzText, sfzDir))).toEqual(sfzXml);
});

// Test complex hand-coded instrument
test('parseSfz 01-green_keyswitch.sfz', async () => {
  const sfzPath: string = 'https://raw.githubusercontent.com/studiorack/black-and-green-guitars/compact/Programs/';
  const sfzText: string = await apiText(`${sfzPath}01-green_keyswitch.sfz`);
  const sfzXml: string = await apiText(`${sfzPath}01-green_keyswitch.sfz.xml`);
  expect(replaceFileExts(convertToXml(await parseSfz(sfzText, sfzPath)))).toEqual(normalizeLineEnds(sfzXml));
});

// Test complex instrument
// test('parseSfz salamander-grand-piano.sfz', async () => {
//   const sfzPath: string = 'https://raw.githubusercontent.com/studiorack/salamander-grand-piano/compact/';
//   const sfzText: string = await apiText(`${sfzPath}salamander-grand-piano.sfz`);
//   const sfzXml: string = await apiText(`${sfzPath}salamander-grand-piano.sfz.xml`);
//   expect(replaceFileExts(convertToXml(await parseSfz(sfzText, sfzPath)))).toEqual(normalizeLineEnds(sfzXml));
// });

// Test second hand-coded instrument
test('parseSfz Hang-D-minor-20220330.sfz', async () => {
  const sfzPath: string = 'https://raw.githubusercontent.com/kmturley/hang-D-minor/main/';
  const sfzText: string = await apiText(`${sfzPath}Hang-D-minor-20220330.sfz`);
  const sfzXml: string = await apiText(`${sfzPath}Hang-D-minor-20220330.xml`);
  expect(convertToXml(await parseSfz(sfzText, sfzPath))).toEqual(normalizeLineEnds(sfzXml));
});

test('parseHeader', () => {
  expect(parseHeader('<region')).toEqual('region');
  expect(parseHeader('< region')).toEqual('region');
  expect(parseHeader('<region>')).toEqual('region');
  expect(parseHeader('<region >')).toEqual('region');
  expect(parseHeader('region>')).toEqual('region');
});

test('parseHeaders', async () => {
  const sfzPath: string = 'https://raw.githubusercontent.com/kmturley/hang-D-minor/main/';
  const sfzJson: ParseDefinition = await apiJson(`${sfzPath}Hang-D-minor-20220330.json`);
  expect(parseHeaders(sfzJson.elements)[0]).toEqual({
    ampeg_release: 8,
    hirand: 0.2,
    key: 57,
    lorand: 0,
    sample: 'samples/A3_01.flac',
  });

  const sfzHeaders: ParseHeader[] = [
    {
      type: 'element',
      name: ParseHeaderNames.region,
      elements: [
        {
          type: 'element',
          name: 'opcode',
          attributes: {
            name: 'sample',
            value: 'samples/A3_01.flac',
          },
        },
      ],
    },
  ];
  expect(parseHeaders(sfzHeaders)[0]).toEqual({ sample: 'samples/A3_01.flac' });
  expect(parseHeaders(sfzHeaders, 'http://www.test.com')[0]).toEqual({
    sample: 'http://www.test.com/samples/A3_01.flac',
  });
  expect(parseHeaders(sfzHeaders, 'https://www.test.com')[0]).toEqual({
    sample: 'https://www.test.com/samples/A3_01.flac',
  });

  const sfzHeadersDefault: ParseHeader[] = [
    {
      type: 'element',
      name: ParseHeaderNames.control,
      elements: [
        {
          type: 'element',
          name: 'opcode',
          attributes: {
            name: 'default_path',
            value: 'custom-folder/',
          },
        },
      ],
    },
    {
      type: 'element',
      name: ParseHeaderNames.region,
      elements: [
        {
          type: 'element',
          name: 'opcode',
          attributes: {
            name: 'sample',
            value: 'samples/A3_01.flac',
          },
        },
      ],
    },
  ];
  expect(parseHeaders(sfzHeadersDefault)[0]).toEqual({
    default_path: 'custom-folder/',
    sample: 'custom-folder/samples/A3_01.flac',
  });
  expect(parseHeaders(sfzHeadersDefault, 'http://www.test.com')[0]).toEqual({
    default_path: 'custom-folder/',
    sample: 'http://www.test.com/custom-folder/samples/A3_01.flac',
  });
  expect(parseHeaders(sfzHeadersDefault, 'https://www.test.com')[0]).toEqual({
    default_path: 'custom-folder/',
    sample: 'https://www.test.com/custom-folder/samples/A3_01.flac',
  });
});

test('parseOpcodeObject', () => {
  expect(
    parseOpcodeObject([
      {
        type: 'element',
        name: 'opcode',
        attributes: {
          name: 'ampeg_release',
          value: '8',
        },
      },
    ])
  ).toEqual({ ampeg_release: 8 });
});

test('parseVariables', () => {
  expect(parseVariables('sample=harmLA0.$EXT', {})).toEqual('sample=harmLA0.$EXT');
  expect(parseVariables('sample=harmLA0.$EXT', { $EXT: 'flac' })).toEqual('sample=harmLA0.flac');
  expect(parseVariables('sample=harmLA0.$EXT', { $OTHER: 'other' })).toEqual('sample=harmLA0.$EXT');
  expect(parseVariables('sample=harmLA0.$EXT', { $EXT: 'flac', $OTHER: 'other' })).toEqual('sample=harmLA0.flac');
});
