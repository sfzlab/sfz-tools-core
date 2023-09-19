import { convertSfzToJson, convertSfzToXml } from '../dist/convert';
import { fileJson, fileText } from '../dist/file';

const FILE_DIR = './test/';
const FILE_NAME = 'example';
const sfzJson = fileJson(`${FILE_DIR}${FILE_NAME}.json`);
const sfzText = fileText(`${FILE_DIR}${FILE_NAME}.sfz`);
const sfzXml = fileText(`${FILE_DIR}${FILE_NAME}.xml`);

test('Convert Sfz to Json', async () => {
  expect(await convertSfzToJson(sfzText)).toEqual(sfzJson);
});

test('Convert Sfz to Xml', async () => {
  expect(await convertSfzToXml(sfzText)).toEqual(sfzXml);
});
