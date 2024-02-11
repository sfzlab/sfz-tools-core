import { Options, js2xml, xml2js } from 'xml-js';
import { parseSetLoader, parseSfz } from './parse';
import { load, dump, DumpOptions } from 'js-yaml';
import { ParseDefinition, ParseHeader, ParseOpcode } from './types/parse';
import { LINE_END, normalizeLineEnds, normalizeXml, pathGetDirectory, pathGetExt } from './utils';
import { ConvertOptions } from './types/convert';

const XML_DECLARATION = '<?xml version="1.0"?>' + LINE_END;

const OPTIONS_JS: Options.XML2JS = {
  alwaysArray: true,
  compact: true,
  ignoreDeclaration: true,
};

const OPTIONS_YAML: DumpOptions = {
  indent: 2,
};

const OPTIONS_XML: Options.JS2XML = {
  compact: true,
  ignoreDeclaration: true,
  spaces: '\t',
};

async function convert(filepath: string, file: any, options: ConvertOptions, sep?: string) {
  const fileDir: string = pathGetDirectory(filepath, sep);
  const fileExt: string = pathGetExt(filepath);
  if (fileExt === 'json') {
    if (options.sfz) return convertJsToSfz(file);
    if (options.yaml) return convertJsToYaml(file);
    if (options.xml) return convertJsToXml(file);
  } else if (fileExt === 'sfz') {
    if (options.js) return await convertSfzToJs(file, fileDir);
    if (options.yaml) return convertSfzToYaml(file, fileDir);
    if (options.xml) return await convertSfzToXml(file, fileDir);
  } else if (fileExt === 'yaml') {
    if (options.js) return convertYamlToJs(file);
    if (options.sfz) return convertYamlToSfz(file);
    if (options.xml) return convertYamlToXml(file);
  } else if (fileExt === 'xml') {
    if (options.js) return convertXmlToJs(file);
    if (options.sfz) return convertXmlToSfz(file);
    if (options.yaml) return convertXmlToYaml(file);
  } else {
    console.log(`Unsupported file extension ${fileExt}`);
  }
}

function convertJsToSfz(fileJs: ParseDefinition) {
  let fileSfz: string = '';
  Object.keys(fileJs).forEach((headerName: string) => {
    const headers: ParseHeader[] = fileJs[headerName];
    fileSfz += `<${headerName}>${LINE_END}`;
    headers.forEach((header: ParseHeader) => {
      header.opcode?.forEach((opcode: ParseOpcode) => {
        fileSfz += `${opcode._attributes.name}=${opcode._attributes.value}${LINE_END}`;
      });
    });
  });
  return fileSfz;
}

function convertJsToYaml(fileJs: ParseDefinition | ParseHeader) {
  return normalizeLineEnds(dump(fileJs, OPTIONS_YAML)) + LINE_END;
}

function convertJsToXml(fileJs: ParseDefinition | ParseHeader) {
  const fileXml: string = js2xml(fileJs, OPTIONS_XML);
  return XML_DECLARATION + normalizeXml(fileXml);
}

async function convertSfzToJs(fileSfz: string, prefix = '', localFileFunc?: any) {
  if (localFileFunc) parseSetLoader(localFileFunc);
  const fileJs: ParseDefinition | ParseHeader = await parseSfz(fileSfz, prefix);
  return fileJs;
}

async function convertSfzToYaml(fileSfz: string, prefix = '') {
  const fileJs: ParseDefinition | ParseHeader = await convertSfzToJs(fileSfz, prefix);
  return convertJsToYaml(fileJs);
}

async function convertSfzToXml(fileSfz: string, prefix = '') {
  const fileJs: ParseDefinition | ParseHeader = await convertSfzToJs(fileSfz, prefix);
  return XML_DECLARATION + normalizeXml(js2xml(fileJs, OPTIONS_XML));
}

function convertYamlToJs(fileYaml: string) {
  return load(fileYaml) as ParseDefinition;
}

function convertYamlToSfz(fileYaml: string) {
  const fileJs: ParseDefinition = convertYamlToJs(fileYaml);
  return convertJsToSfz(fileJs);
}

function convertYamlToXml(fileYaml: string) {
  const fileJs: ParseDefinition = convertYamlToJs(fileYaml);
  return convertJsToXml(fileJs);
}

function convertXmlToJs(fileXml: string) {
  return xml2js(fileXml, OPTIONS_JS) as ParseDefinition;
}

function convertXmlToSfz(fileXml: string) {
  const fileJs: ParseDefinition = convertXmlToJs(fileXml);
  return convertJsToSfz(fileJs);
}

function convertXmlToYaml(fileXml: string) {
  const fileJs: ParseDefinition = convertXmlToJs(fileXml);
  return convertJsToYaml(fileJs);
}

export {
  convert,
  convertJsToSfz,
  convertJsToYaml,
  convertJsToXml,
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
