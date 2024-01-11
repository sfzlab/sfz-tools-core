import path from 'path';
import {
  convertJsToSfz,
  convertJsToXml,
  convertJsToYaml,
  convertSfzToJs,
  convertSfzToXml,
  convertSfzToYaml,
  convertXmlToJs,
  convertXmlToSfz,
  convertXmlToYaml,
  convertYamlToJs,
} from '../src/convert';
import { fileReadJson, fileReadString } from '../src/file';
import { ParseDefinition } from '../src/types/parse';

const syntaxDir: string = path.join('test', 'syntax');
const sfzJs: ParseDefinition = fileReadJson(path.join(syntaxDir, 'basic.json'));
const sfzText: string = fileReadString(path.join(syntaxDir, 'basic.sfz'));
const sfzYaml: string = fileReadString(path.join(syntaxDir, 'basic.yaml'));
const sfzXml: string = fileReadString(path.join(syntaxDir, 'basic.xml'));

test('Convert Js to Sfz', async () => {
  expect(await convertJsToSfz(sfzJs)).toEqual(sfzText);
});

test('Convert Js to Yaml', async () => {
  expect(await convertJsToYaml(sfzJs) + '\n').toEqual(sfzYaml);
});

test('Convert Js to Xml', async () => {
  expect(await convertJsToXml(sfzJs)).toEqual(sfzXml);
});

test('Convert Sfz to Js', async () => {
  expect(await convertSfzToJs(sfzText, syntaxDir, fileReadString)).toEqual(sfzJs);
});

test('Convert Sfz to Yaml', async () => {
  expect(await convertSfzToYaml(sfzText, syntaxDir) + '\n').toEqual(sfzYaml);
});

test('Convert Sfz to Xml', async () => {
  expect(await convertSfzToXml(sfzText, syntaxDir)).toEqual(sfzXml);
});

test('Convert Yaml to Js', async () => {
  expect(await convertYamlToJs(sfzYaml)).toEqual(sfzJs);
});

test('Convert Xml to Js', async () => {
  expect(await convertXmlToJs(sfzXml)).toEqual(sfzJs);
});

test('Convert Xml to Yaml', async () => {
  expect(await convertXmlToYaml(sfzXml) + '\n').toEqual(sfzYaml);
});

test('Convert Xml to Sfz', async () => {
  expect(await convertXmlToSfz(sfzXml)).toEqual(sfzText);
});
