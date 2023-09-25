import { convertSfzToJson, convertSfzToXml } from '../dist/convert';
import { fileJson, fileText } from '../dist/file';

const syntaxDir: string = './test/syntax/';

test('Convert Sfz to Json', async () => {
  const sfzText: string = fileText(`${syntaxDir}/basic.sfz`);
  const sfzJson: string = fileJson(`${syntaxDir}/basic.json`);
  expect(await convertSfzToJson(sfzText, syntaxDir)).toEqual(sfzJson);
});

test('Convert Sfz to Xml', async () => {
  const sfzText: string = fileText(`${syntaxDir}/basic.sfz`);
  const sfzXml: string = fileText(`${syntaxDir}/basic.xml`);
  expect(await convertSfzToXml(sfzText, syntaxDir)).toEqual(sfzXml);
});
