import { js2xml, xml2js } from 'xml-js';
import { parseDefinitionToHeaders, parseHeadersToDefinition, parseSetLoader, parseSfz } from './parse';
import { load, dump } from 'js-yaml';
import { ParseCompactHeader, ParseDefinition, ParseHeader, ParseOpcode } from './types/parse';
import { LINE_END, normalizeLineEnds, normalizeXml, pathGetDirectory, pathGetExt } from './utils';
import { ConvertOptions } from './types/convert';

const declaration: any = {
  attributes: {
    version: '1.0',
  },
};

const OPTIONS_JS: any = {
  ignoreDeclaration: true,
};

const OPTIONS_YAML: any = {
  indent: 2,
};

const OPTIONS_XML: any = {
  spaces: '\t',
};

function getFormatFromPath(filepath: string): string {
  if (filepath.endsWith('.sfz.json') || filepath.endsWith('.json')) return 'json';
  if (filepath.endsWith('.sfz.yaml') || filepath.endsWith('.yaml')) return 'yaml';
  if (filepath.endsWith('.sfz.xml') || filepath.endsWith('.xml')) return 'xml';
  if (pathGetExt(filepath) === 'sfz') return 'sfz';
  return '';
}

async function convert(filepath: string, file: any, options: ConvertOptions, sep?: string) {
  const fileDir: string = pathGetDirectory(filepath, sep);
  const fileFormat: string = getFormatFromPath(filepath);
  if (fileFormat === 'json') {
    if (options.sfz) return convertJsToSfz(file);
    if (options.yaml) return convertJsToYaml(file);
    if (options.xml) return convertJsToXml(file);
  } else if (fileFormat === 'sfz') {
    if (options.js) return await convertSfzToJs(file, fileDir);
    if (options.yaml) return convertSfzToYaml(file, fileDir);
    if (options.xml) return await convertSfzToXml(file, fileDir);
  } else if (fileFormat === 'yaml') {
    if (options.js) return convertYamlToJs(file);
    if (options.sfz) return convertYamlToSfz(file);
    if (options.xml) return convertYamlToXml(file);
  } else if (fileFormat === 'xml') {
    if (options.js) return convertXmlToJs(file);
    if (options.sfz) return convertXmlToSfz(file);
    if (options.yaml) return convertXmlToYaml(file);
  } else {
    console.log(`Unsupported file extension ${pathGetExt(filepath)}`);
  }
}

function convertJsToSfz(fileJs: ParseDefinition) {
  const headers: ParseHeader[] = parseDefinitionToHeaders(fileJs);
  let fileSfz: string = '';
  headers.forEach((header: ParseHeader) => {
    fileSfz += `<${header.name}>${LINE_END}`;
    header.elements.forEach((opcode: ParseOpcode) => {
      fileSfz += `${opcode.attributes.name}=${opcode.attributes.value}${LINE_END}`;
    });
  });
  return fileSfz;
}

function convertJsToYaml(fileJs: ParseDefinition) {
  const compactFile: ParseCompactHeader[] = parseHeadersToDefinition(parseDefinitionToHeaders(fileJs));
  return normalizeLineEnds(dump(compactFile, OPTIONS_YAML)) + LINE_END;
}

function convertJsToXml(fileJs: ParseDefinition) {
  const headers: ParseHeader[] = parseDefinitionToHeaders(fileJs);
  const fileXml: string = js2xml({ declaration, elements: headers }, OPTIONS_XML);
  return normalizeXml(fileXml);
}

function convertSetLoader(func: any) {
  parseSetLoader(func);
}

async function convertSfzToJs(fileSfz: string, prefix = '') {
  const headers: ParseHeader[] = await parseSfz(fileSfz, prefix);
  return parseHeadersToDefinition(headers);
}

async function convertSfzToYaml(fileSfz: string, prefix = '') {
  const fileJs: ParseCompactHeader[] = await convertSfzToJs(fileSfz, prefix);
  return convertJsToYaml(fileJs);
}

async function convertSfzToXml(fileSfz: string, prefix = '') {
  const headers: ParseHeader[] = await parseSfz(fileSfz, prefix);
  return normalizeXml(js2xml({ declaration, elements: headers }, OPTIONS_XML));
}

function convertYamlToJs(fileYaml: string) {
  const fileJs: ParseDefinition | ParseCompactHeader[] = load(fileYaml) as ParseDefinition | ParseCompactHeader[];
  return parseHeadersToDefinition(parseDefinitionToHeaders(fileJs));
}

function convertYamlToSfz(fileYaml: string) {
  const fileJs: ParseCompactHeader[] = convertYamlToJs(fileYaml);
  return convertJsToSfz(fileJs);
}

function convertYamlToXml(fileYaml: string) {
  const fileJs: ParseCompactHeader[] = convertYamlToJs(fileYaml);
  return convertJsToXml(fileJs);
}

function convertXmlToJs(fileXml: string) {
  const fileJs: ParseDefinition = xml2js(fileXml, OPTIONS_JS) as ParseDefinition;
  const headers: ParseHeader[] = parseDefinitionToHeaders(fileJs);
  return parseHeadersToDefinition(headers);
}

function convertXmlToSfz(fileXml: string) {
  const fileJs: ParseCompactHeader[] = convertXmlToJs(fileXml);
  return convertJsToSfz(fileJs);
}

function convertXmlToYaml(fileXml: string) {
  const fileJs: ParseCompactHeader[] = convertXmlToJs(fileXml);
  return convertJsToYaml(fileJs);
}

export {
  convert,
  convertJsToSfz,
  convertJsToYaml,
  convertJsToXml,
  convertSetLoader,
  convertSfzToJs,
  convertSfzToYaml,
  convertSfzToXml,
  convertYamlToJs,
  convertYamlToSfz,
  convertYamlToXml,
  convertXmlToJs,
  convertXmlToSfz,
  convertXmlToYaml,
};
