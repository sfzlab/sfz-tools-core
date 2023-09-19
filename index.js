// This file is used for local development
// Use the `npm run dev` command to build and run the file
// Debug particular methods quickly without having to run all tests `npm test`

const convert = require('./dist/convert.js');
const file = require('./dist/file.js');
const utils = require('./dist/utils.js');

async function run() {
  // Enable logging to see what is going on
  utils.logEnable();

  // Test a method
  // const sfzFile = file.fileText('./test/example.sfz');
  // const sfzXml = convert.convertSfz(sfzFile, 'xml');
  // console.log('convertSfz', sfzFile, sfzXml);
}

run();
