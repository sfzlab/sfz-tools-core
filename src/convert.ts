import { js2xml } from 'xml-js';
import { parseSfz } from './parse';

async function convertSfzToJson(sfzFile: string) {
  const elements: any = await parseSfz('', sfzFile);
  return { elements };
}

async function convertSfzToXml(sfzFile: string) {
  const elements: any = await parseSfz('', sfzFile);
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
