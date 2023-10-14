import {
  convertJsToSfz,
  convertJsToXml,
  convertSfzToJs,
  convertSfzToXml,
  convertXmlToJs,
  convertXmlToSfz,
} from '../dist/convert';
import { fileReadJson, fileReadString } from '../dist/file';
import { ParseDefinition } from '../dist/types/parse';

const syntaxDir: string = 'test/syntax';
const sfzJs: ParseDefinition = fileReadJson(`${syntaxDir}/basic.json`);
const sfzText: string = fileReadString(`${syntaxDir}/basic.sfz`);
const sfzXml: string = fileReadString(`${syntaxDir}/basic.xml`);

test('Convert Js to Sfz', async () => {
  expect(await convertJsToSfz(sfzJs)).toEqual(sfzText);
});

test('Convert Js to Xml', async () => {
  expect(await convertJsToXml(sfzJs)).toEqual(sfzXml);
});

test('Convert Sfz to Js', async () => {
  expect(await convertSfzToJs(sfzText, syntaxDir)).toEqual(sfzJs);
});

test('Convert Sfz to Xml', async () => {
  expect(await convertSfzToXml(sfzText, syntaxDir)).toEqual(sfzXml);
});

test('Convert Xml to Js', async () => {
  expect(await convertXmlToJs(sfzXml)).toEqual(sfzJs);
});

test('Convert Xml to Sfz', async () => {
  expect(await convertXmlToSfz(sfzXml)).toEqual(sfzText);
});
