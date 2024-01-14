import { js2xml, xml2js } from 'xml-js';
import { parseSetLoader, parseSfz } from './parse';
import { load, dump } from 'js-yaml';
import { ParseDefinition, ParseHeader, ParseOpcode } from './types/parse';
import { LINE_END, normalizeXml, pathGetDirectory, pathGetExt } from './utils';
import { ConvertOptions } from './types/convert';

const declaration: any = {
  attributes: {
    version: '1.0',
  },
};

const OPTIONS_JSON: any = {
  spaces: 2,
};

const OPTIONS_YAML: any = {
  indent: 2,
};

const OPTIONS_XML: any = {
  spaces: '\t',
};

async function convert(filepath: string, file: any, options: ConvertOptions, sep?: string) {
  const fileDir: string = pathGetDirectory(filepath, sep);
  const fileExt: string = pathGetExt(filepath);
  if (fileExt === 'json') {
    if (options.sfz) return convertJsToSfz(file);
    if (options.xml) return convertJsToXml(file);
  } else if (fileExt === 'sfz') {
    if (options.json) return await convertSfzToJs(file, fileDir);
    if (options.xml) return await convertSfzToXml(file, fileDir);
  } else if (fileExt === 'xml') {
    if (options.json) return convertXmlToJs(file);
    if (options.sfz) return convertXmlToSfz(file);
  } else {
    console.log(`Unsupported file extension ${fileExt}`);
  }
}

function convertJsToSfz(fileJs: ParseDefinition) {
  let fileSfz: string = '';
  fileJs.elements.forEach((header: ParseHeader) => {
    fileSfz += `<${header.name}>${LINE_END}`;
    header.elements.forEach((opcode: ParseOpcode) => {
      fileSfz += `${opcode.attributes.name}=${opcode.attributes.value}${LINE_END}`;
    });
  });
  return fileSfz;
}

function convertJsToYaml(fileJs: ParseDefinition) {
  return dump(fileJs, OPTIONS_YAML);
}

function convertJsToXml(fileJs: ParseDefinition) {
  const fileXml: string = js2xml({ declaration, elements: fileJs.elements }, OPTIONS_XML);
  return normalizeXml(fileXml);
}

async function convertSfzToJs(fileSfz: string, prefix = '', localFileFunc?: any) {
  if (localFileFunc) parseSetLoader(localFileFunc);
  const fileJs: ParseDefinition = {
    elements: await parseSfz(fileSfz, prefix),
  };
  return fileJs;
}

async function convertSfzToYaml(fileSfz: string, prefix = '') {
  const fileJs: ParseDefinition = await convertSfzToJs(fileSfz, prefix);
  return convertJsToYaml(fileJs);
}

async function convertSfzToXml(fileSfz: string, prefix = '') {
  const fileJs: ParseDefinition = await convertSfzToJs(fileSfz, prefix);
  return normalizeXml(js2xml({ declaration, elements: fileJs.elements }, OPTIONS_XML));
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
  const fileJs: ParseDefinition = xml2js(fileXml, OPTIONS_JSON) as ParseDefinition;
  return { elements: fileJs.elements };
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
