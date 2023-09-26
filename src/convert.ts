import { js2xml, json2xml, xml2js, xml2json } from 'xml-js';
import { parseSfz } from './parse';
import { ParseDefinition, ParseHeader, ParseOpcode } from './types/parse';

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
    sfzText += `<${header.name}>\n`;
    header.elements.forEach((opcode: ParseOpcode) => {
      sfzText += `${opcode.attributes.name}=${opcode.attributes.value}\n`;
    });
  });
  return sfzText;
}

function convertJsToXml(jsObj: ParseDefinition) {
  const xml: string = js2xml(jsObj, OPTIONS_XML);
  return xml.replace(/\/>/g, ' />') + '\n';
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
  return xml.replace(/\/>/g, ' />') + '\n';
}

function convertXmlToJs(xmlFile: string) {
  return xml2js(xmlFile, OPTIONS_JSON);
}

function convertXmlToSfz(xmlFile: string) {
  const jsObj: ParseDefinition = xml2js(xmlFile, OPTIONS_JSON) as ParseDefinition;
  return convertJsToSfz(jsObj);
}

export { convertJsToSfz, convertJsToXml, convertSfzToJs, convertSfzToXml, convertXmlToJs, convertXmlToSfz };
