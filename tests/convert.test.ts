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
  convertYamlToSfz,
  convertYamlToXml,
} from '../src/convert';
import { fileReadJson, fileReadString } from '../src/file';
import { ParseDefinition } from '../src/types/parse';

const syntaxDir: string = path.join('test', 'syntax');
const fileJs: ParseDefinition = fileReadJson(path.join(syntaxDir, 'basic.json'));
const fileSfz: string = fileReadString(path.join(syntaxDir, 'basic.sfz'));
const fileYaml: string = fileReadString(path.join(syntaxDir, 'basic.yaml'));
const fileXml: string = fileReadString(path.join(syntaxDir, 'basic.xml'));

test('Convert Js to Sfz', async () => {
  expect(await convertJsToSfz(fileJs)).toEqual(fileSfz);
});

test('Convert Js to Yaml', async () => {
  expect(await convertJsToYaml(fileJs)).toEqual(fileYaml);
});

test('Convert Js to Xml', async () => {
  expect(await convertJsToXml(fileJs)).toEqual(fileXml);
});

test('Convert Sfz to Js', async () => {
  expect(await convertSfzToJs(fileSfz, syntaxDir, fileReadString)).toEqual(fileJs);
});

test('Convert Sfz to Yaml', async () => {
  expect(await convertSfzToYaml(fileSfz, syntaxDir)).toEqual(fileYaml);
});

test('Convert Sfz to Xml', async () => {
  expect(await convertSfzToXml(fileSfz, syntaxDir)).toEqual(fileXml);
});

test('Convert Yaml to Js', async () => {
  expect(await convertYamlToJs(fileYaml)).toEqual(fileJs);
});

test('Convert Yaml to Sfz', async () => {
  expect(await convertYamlToSfz(fileYaml)).toEqual(fileSfz);
});

test('Convert Yaml to Xml', async () => {
  expect(await convertYamlToXml(fileYaml)).toEqual(fileXml);
});

test('Convert Xml to Js', async () => {
  expect(await convertXmlToJs(fileXml)).toEqual(fileJs);
});

test('Convert Xml to Yaml', async () => {
  expect(await convertXmlToYaml(fileXml)).toEqual(fileYaml);
});

test('Convert Xml to Sfz', async () => {
  expect(await convertXmlToSfz(fileXml)).toEqual(fileSfz);
});
