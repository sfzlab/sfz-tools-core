// This file is used for local development
// Use the `npm run dev` command to build and run the file
// Debug particular methods quickly without having to run all tests `npm test`

const convert = require('./dist/convert.js');
const file = require('./dist/file.js');
const utils = require('./dist/utils.js');

async function run() {
  // Enable logging to see what is going on
  utils.logEnable();

  // File for testing
  const FILE_DIR = './test/';
  const FILE_NAME = 'example';
  const sfzText = file.fileText(`${FILE_DIR}${FILE_NAME}.sfz`);

  const convertSfzToJson = await convert.convertSfzToJson(sfzText);
  console.log('convertSfzToJson', convertSfzToJson);

  const convertSfzToXml = await convert.convertSfzToXml(sfzText);
  console.log('convertSfzToXml', convertSfzToXml);
}

run();
