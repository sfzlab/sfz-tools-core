import {
  parseDirective,
  parseEnd,
  parseHeader,
  parseHeaders,
  parseLoad,
  parseOpcode,
  parseOpcodeObject,
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

beforeAll(() => {
  parseSetLoader(fileReadString);
});

// Test specific syntax edge-cases
const syntaxDir: string = path.join('test', 'syntax');
const syntaxFiles: string[] = dirRead(path.join(syntaxDir, '**', '*.sfz'));
test.each(syntaxFiles)('parseSfz %p', async (sfzFile: string) => {
  const sfzDir: string = pathGetDirectory(sfzFile);
  const sfzText: string = fileReadString(sfzFile);
  const sfzXml: string = fileReadString(sfzFile.replace('.sfz', '.xml'));
  expect(convertToXml(await parseSfz(sfzText, sfzDir))).toEqual(sfzXml);
});

// Test entire sfz test suite
const testDir: string = path.join('sfz-tests');
const testFiles: string[] = dirRead(path.join(testDir, '**', '*.sfz'));
test.each(testFiles)('parseSfz %p', async (sfzFile: string) => {
  const sfzDir: string = pathGetDirectory(sfzFile);
  const sfzText: string = fileReadString(sfzFile);
  const sfzXml: string = fileReadString(sfzFile.replace('.sfz', '.xml'));
  expect(convertToXml(await parseSfz(sfzText, sfzDir))).toEqual(sfzXml);
});

// Test complex hand-coded instrument
test('parseSfz 01-green_keyswitch.sfz', async () => {
  const sfzPath: string = 'https://raw.githubusercontent.com/kmturley/karoryfer.black-and-green-guitars/main/Programs/';
  const sfzText: string = await apiText(`${sfzPath}01-green_keyswitch.sfz`);
  const sfzXml: string = await apiText(`${sfzPath}01-green_keyswitch.xml`);
  expect(convertToXml(await parseSfz(sfzText, sfzPath))).toEqual(normalizeLineEnds(sfzXml));
});

// Test second hand-coded instrument
test('parseSfz Hang-D-minor-20220330.sfz', async () => {
  const sfzPath: string = 'https://raw.githubusercontent.com/kmturley/hang-D-minor/main/';
  const sfzText: string = await apiText(`${sfzPath}Hang-D-minor-20220330.sfz`);
  const sfzXml: string = await apiText(`${sfzPath}Hang-D-minor-20220330.xml`);
  expect(convertToXml(await parseSfz(sfzText, sfzPath))).toEqual(normalizeLineEnds(sfzXml));
});

test('parseDirective', () => {
  expect(parseDirective('#include "green/stac_tp.sfz"')).toEqual(['#include', 'green/stac_tp.sfz']);
  expect(parseDirective('#include "Individual Patchs/In.sfz"')).toEqual(['#include', 'Individual Patchs/In.sfz']);
  expect(parseDirective('#include "$directory/$filename.sfz"')).toEqual(['#include', '$directory/$filename.sfz']);
  expect(parseDirective('#define $KICKKEY 36')).toEqual(['#define', '$KICKKEY', '36']);
  expect(parseDirective('#define $filename region')).toEqual(['#define', '$filename', 'region']);
  expect(parseDirective('#define $RETUNED C#0')).toEqual(['#define', '$RETUNED', 'C#0']);
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

test('parseOpcode', () => {
  expect(parseOpcode('seq_position=3')).toEqual([{ name: 'seq_position', value: '3' }]);
  expect(parseOpcode('seq_position=3 pitch_keycenter=50')).toEqual([
    { name: 'seq_position', value: '3' },
    { name: 'pitch_keycenter', value: '50' },
  ]);
  expect(parseOpcode('region_label=01 sample=harmLA0.$EXT')).toEqual([
    { name: 'region_label', value: '01' },
    { name: 'sample', value: 'harmLA0.$EXT' },
  ]);
  expect(parseOpcode('label_cc27="Release vol"')).toEqual([{ name: 'label_cc27', value: 'Release vol' }]);
  expect(parseOpcode('label_cc27=Release vol')).toEqual([{ name: 'label_cc27', value: 'Release vol' }]);
  expect(parseOpcode('apple=An Apple banana=\'A Banana\' carrot="A Carrot"')).toEqual([
    { name: 'apple', value: 'An Apple' },
    { name: 'banana', value: 'A Banana' },
    { name: 'carrot', value: 'A Carrot' },
  ]);
  expect(parseOpcode('lokey=c5  hikey=c#5')).toEqual([
    { name: 'lokey', value: 'c5' },
    { name: 'hikey', value: 'c#5' },
  ]);
  expect(parseOpcode('ampeg_hold=0.3')).toEqual([{ name: 'ampeg_hold', value: '0.3' }]);
  expect(parseOpcode('ampeg_decay_oncc70=-1.2')).toEqual([{ name: 'ampeg_decay_oncc70', value: '-1.2' }]);
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
  expect(parseVariables('sample=harmLA0.$EXT', { $EXT: 'flac' })).toEqual('sample=harmLA0.flac');
});

// test('parseEnd', () => {
//   const sfzHeader: string = `//----
//   //
//   // The <group> header
//   //`;
//   expect(parseEnd(sfzHeader, 0)).toEqual(6);
//   expect(parseEnd(sfzHeader, 9)).toEqual(11);
//   expect(parseEnd(sfzHeader, 14)).toEqual(35);
//   expect(parseEnd('sample=example.wav key=c4 // will play', 0)).toEqual(26);
//   expect(parseEnd('/// long release group, cc1 < 64', 0)).toEqual(32);
// });
