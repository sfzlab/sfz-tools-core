import {
  parseDirective,
  parseEnd,
  parseHeader,
  parseLoad,
  parseOpcode,
  parseOpcodeObject,
  parseSetLoader,
  parseSfz,
  parseVariables,
} from '../src/parse';
import { apiText } from '../src/api';
import { js2xml } from 'xml-js';
import { dirRead, fileReadString } from '../src/file';
import path from 'path';
import { LINE_END, normalizeLineEnds, normalizeXml } from '../src/utils';

const XML_DECLARATION = '<?xml version="1.0"?>' + LINE_END;

function convertToXml(elements: any) {
  const xml: string = js2xml(elements, {
    compact: true,
    ignoreDeclaration: true,
    spaces: '\t',
  });
  return XML_DECLARATION + normalizeXml(xml);
}

beforeAll(() => {
  parseSetLoader(fileReadString);
});

// Test specific syntax edge-cases
const syntaxDir: string = path.join('test', 'syntax');
const syntaxTests: string[] = dirRead(path.join(syntaxDir, '**', '*.sfz'));
test.each(syntaxTests)('parseSfz %p', async (sfzFile: string) => {
  const sfzText: string = fileReadString(sfzFile);
  const sfzXml: string = fileReadString(sfzFile.replace('.sfz', '.xml'));
  expect(convertToXml(await parseSfz(sfzText, syntaxDir))).toEqual(sfzXml);
});

// Test entire sfz test suite
const sfzDir: string = path.join('sfz-tests');
const sfzTests: string[] = dirRead(path.join(sfzDir, '**', '*.sfz'));
test.each(sfzTests)('parseSfz %p', async (sfzFile: string) => {
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

test('parseDirective', () => {
  expect(parseDirective('#include "green/stac_tp.sfz"')).toEqual(['include', 'green/stac_tp.sfz']);
  expect(parseDirective('#include "Individual Patchs/In.sfz"')).toEqual(['include', 'Individual Patchs/In.sfz']);
  expect(parseDirective('#include "$directory/$filename.sfz"')).toEqual(['include', '$directory/$filename.sfz']);
  expect(parseDirective('#define $KICKKEY 36')).toEqual(['define', '$KICKKEY', '36']);
  expect(parseDirective('#define $filename region')).toEqual(['define', '$filename', 'region']);
});

test('parseHeader', () => {
  expect(parseHeader('<region')).toEqual(['region']);
  expect(parseHeader('< region')).toEqual(['region']);
  expect(parseHeader('<region>')).toEqual(['region']);
  expect(parseHeader('<region >')).toEqual(['region']);
  expect(parseHeader('region>')).toEqual(['region']);
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
  expect(parseOpcode('lovel=103 hivel=127 sample=36-CajonCenter-5.wav')).toEqual([
    { name: 'lovel', value: '103' },
    { name: 'hivel', value: '127' },
    { name: 'sample', value: '36-CajonCenter-5.wav' },
  ]);
});

test('parseOpcodeObject', () => {
  expect(parseOpcodeObject('seq_position=3')).toEqual({ seq_position: 3 });
  expect(parseOpcodeObject('seq_position=3 pitch_keycenter=50')).toEqual({ seq_position: 3, pitch_keycenter: 50 });
  expect(parseOpcodeObject('region_label=01 sample=harmLA0.$EXT')).toEqual({
    region_label: 1,
    sample: 'harmLA0.$EXT',
  });
  expect(parseOpcodeObject('label_cc27="Release vol"')).toEqual({ label_cc27: 'Release vol' });
  expect(parseOpcodeObject('label_cc27=Release vol')).toEqual({ label_cc27: 'Release vol' });
  expect(parseOpcodeObject('apple=An Apple banana=\'A Banana\' carrot="A Carrot"')).toEqual({
    apple: 'An Apple',
    banana: 'A Banana',
    carrot: 'A Carrot',
  });
  expect(parseOpcodeObject('lokey=c5  hikey=c#5')).toEqual({ lokey: 'c5', hikey: 'c#5' });
});

test('parseVariables', () => {
  expect(parseVariables('sample=harmLA0.$EXT', { $EXT: 'flac' })).toEqual('sample=harmLA0.flac');
});

test('parseEnd', () => {
  const sfzHeader: string = `//----
  //
  // The <group> header
  //`;
  expect(parseEnd(sfzHeader, 0)).toEqual(6);
  expect(parseEnd(sfzHeader, 9)).toEqual(11);
  expect(parseEnd(sfzHeader, 14)).toEqual(35);
  expect(parseEnd('sample=example.wav key=c4 // will play', 0)).toEqual(26);
  expect(parseEnd('/// long release group, cc1 < 64', 0)).toEqual(32);
});
