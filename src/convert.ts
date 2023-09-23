import { js2xml } from 'xml-js';
import { parseSfz } from './parse';

const declaration: any = {
  attributes: {
    version: '1.0',
  },
};

async function convertSfzToJson(sfzFile: string, prefix = '') {
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
    { spaces: '\t' }
  );
  // TODO do better
  return xml.replace(/\/>/g, ' />') + '\n';
}

export { convertSfzToJson, convertSfzToXml };
