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

const syntaxDir: string = './test/syntax/';

test('Convert Js to Sfz', async () => {
  const sfzJs: ParseDefinition = fileReadJson(`${syntaxDir}/basic.json`);
  const sfzText: string = fileReadString(`${syntaxDir}/basic.sfz`);
  expect(await convertJsToSfz(sfzJs)).toEqual(sfzText);
});

test('Convert Js to Xml', async () => {
  const sfzJs: ParseDefinition = fileReadJson(`${syntaxDir}/basic.json`);
  const sfzXml: string = fileReadString(`${syntaxDir}/basic.xml`);
  expect(await convertJsToXml(sfzJs)).toEqual(sfzXml);
});

test('Convert Sfz to Js', async () => {
  const sfzText: string = fileReadString(`${syntaxDir}/basic.sfz`);
  const sfzJs: string = fileReadJson(`${syntaxDir}/basic.json`);
  expect(await convertSfzToJs(sfzText, syntaxDir)).toEqual(sfzJs);
});

test('Convert Sfz to Xml', async () => {
  const sfzText: string = fileReadString(`${syntaxDir}/basic.sfz`);
  const sfzXml: string = fileReadString(`${syntaxDir}/basic.xml`);
  expect(await convertSfzToXml(sfzText, syntaxDir)).toEqual(sfzXml);
});

test('Convert Xml to Js', async () => {
  const sfzXml: string = fileReadString(`${syntaxDir}/basic.xml`);
  const sfzJs: string = fileReadJson(`${syntaxDir}/basic.json`);
  expect(await convertXmlToJs(sfzXml)).toEqual(sfzJs);
});

test('Convert Xml to Sfz', async () => {
  const sfzXml: string = fileReadString(`${syntaxDir}/basic.xml`);
  const sfzText: string = fileReadString(`${syntaxDir}/basic.sfz`);
  expect(await convertXmlToSfz(sfzXml)).toEqual(sfzText);
});
