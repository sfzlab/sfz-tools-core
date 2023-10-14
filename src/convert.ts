import { js2xml, xml2js } from 'xml-js';
import { parseSfz } from './parse';
import { ParseDefinition, ParseHeader, ParseOpcode } from './types/parse';
import { LINE_END, normalizeXml } from './utils';

const declaration: any = {
  attributes: {
    version: '1.0',
  },
};

const OPTIONS_JSON: any = {
  spaces: 2,
};

const OPTIONS_XML: any = {
  spaces: '\t',
};

function convertJsToSfz(jsObj: ParseDefinition) {
  let sfzText: string = '';
  jsObj.elements.forEach((header: ParseHeader) => {
    sfzText += `<${header.name}>${LINE_END}`;
    header.elements.forEach((opcode: ParseOpcode) => {
      sfzText += `${opcode.attributes.name}=${opcode.attributes.value}${LINE_END}`;
    });
  });
  return sfzText;
}

function convertJsToXml(jsObj: ParseDefinition) {
  const xml: string = js2xml(jsObj, OPTIONS_XML);
  return normalizeXml(xml);
}

async function convertSfzToJs(sfzFile: string, prefix = '') {
  const elements: any = await parseSfz(sfzFile, prefix);
  return {
    declaration,
    elements,
  };
}

async function convertSfzToXml(sfzFile: string, prefix = '') {
  const elements: any = await parseSfz(sfzFile, prefix);
  const xml: string = js2xml(
    {
      declaration,
      elements,
    },
    OPTIONS_XML
  );
  return normalizeXml(xml);
}

function convertXmlToJs(xmlFile: string) {
  return xml2js(xmlFile, OPTIONS_JSON);
}

function convertXmlToSfz(xmlFile: string) {
  const jsObj: ParseDefinition = xml2js(xmlFile, OPTIONS_JSON) as ParseDefinition;
  return convertJsToSfz(jsObj);
}

export { convertJsToSfz, convertJsToXml, convertSfzToJs, convertSfzToXml, convertXmlToJs, convertXmlToSfz };
