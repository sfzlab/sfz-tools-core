// This file is used for local development
// Use the `npm run dev` command to build and run the file
// Debug particular methods quickly without having to run all tests `npm test`

const convert = require('./dist/convert.js');
const file = require('./dist/file.js');
const parse = require('./dist/parse.js');
const utils = require('./dist/utils.js');

async function run() {
  // Enable logging to see what is going on
  utils.logEnable();

  // File for testing
  const sfzDir = './test/syntax/';
  const sfzText = file.fileText(`${sfzDir}basic.sfz`);

  const parseSfz = await parse.parseSfz(sfzText);
  console.log('parseSfz', parseSfz);
  
  const parseRegions = await parse.parseRegions(parseSfz);
  console.log('parseRegions', parseRegions);

  const convertSfzToJson = await convert.convertSfzToJson(sfzText);
  console.log('convertSfzToJson', convertSfzToJson);

  const convertSfzToXml = await convert.convertSfzToXml(sfzText);
  console.log('convertSfzToXml', convertSfzToXml);
}

run();
