import { globSync } from 'glob';
import { convertSfzToJson, convertSfzToXml } from '../dist/convert';
import { fileJson, fileText } from '../dist/file';

const syntaxDir: string = './test/syntax/';
const syntaxTests: string[] = globSync(`${syntaxDir}/**/*.sfz`);

// test.each(syntaxTests)('Convert Sfz to Json %p', async (sfzFile: string) => {
//   const sfzText: string = fileText(sfzFile);
//   const sfzJson: string = fileJson(sfzFile.replace('.sfz', '.json'));
//   expect(await convertSfzToJson(sfzText, syntaxDir)).toEqual(sfzJson);
// });

test.each(syntaxTests)('Convert Sfz to Xml %p', async (sfzFile: string) => {
  const sfzText: string = fileText(sfzFile);
  const sfzXml: string = fileText(sfzFile.replace('.sfz', '.xml'));
  expect(await convertSfzToXml(sfzText, syntaxDir)).toEqual(sfzXml);
});

const sfzDir: string = './sfz-tests/';
const sfzTests: string[] = globSync(`${sfzDir}/**/*.sfz`);

// test.each(sfzTests)('Convert Sfz to Json %p', async (sfzFile: string) => {
//   const sfzText: string = fileText(sfzFile);
//   const sfzJson: string = fileJson(sfzFile.replace('.sfz', '.json'));
//   expect(await convertSfzToJson(sfzText, sfzDir)).toEqual(sfzJson);
// });

test.each(sfzTests)('Convert Sfz to Xml %p', async (sfzFile: string) => {
  const sfzText: string = fileText(sfzFile);
  const sfzXml: string = fileText(sfzFile.replace('.sfz', '.xml'));
  expect(await convertSfzToXml(sfzText, sfzDir)).toEqual(sfzXml);
});
