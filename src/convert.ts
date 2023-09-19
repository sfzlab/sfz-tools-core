import { js2xml } from 'xml-js';
import { parseSfz } from './parse';

async function convertSfzToJson(sfzFile: string, prefix = '') {
  const elements: any = await parseSfz(sfzFile, prefix);
  return { elements };
}

async function convertSfzToXml(sfzFile: string, prefix = '') {
  const elements: any = await parseSfz(sfzFile, prefix);
  const xml: string = js2xml(
    {
      declaration: {
        attributes: {
          version: '1.0',
        },
      },
      elements,
    },
    { spaces: '\t' }
  );
  // TODO do better
  return xml.replace(/\/>/g, ' />') + '\n';
}

export { convertSfzToJson, convertSfzToXml };
