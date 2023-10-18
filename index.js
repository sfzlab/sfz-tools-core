// This file is used for local development
// Use the `npm run dev` command to build and run the file
// Debug particular methods quickly without having to run all tests `npm test`

const analyze = require('./dist/analyze.js');
const convert = require('./dist/convert.js');
const file = require('./dist/file.js');
const parse = require('./dist/parse.js');
const utils = require('./dist/utils.js');

async function run() {
  // Enable logging to see what is going on
  utils.logEnable();

  // File for testing
  // const sfzDir = './test/syntax/';
  // const sfzJs = file.fileJson(`${sfzDir}basic.json`);
  // const sfzText = file.fileText(`${sfzDir}basic.sfz`);
  // const sfzXml = file.fileText(`${sfzDir}basic.xml`);

  // const parseSfz = await parse.parseSfz(sfzText);
  // console.log('parseSfz', parseSfz);
  
  // const parseRegions = await parse.parseRegions(parseSfz);
  // console.log('parseRegions', parseRegions);

  // const convertJsToSfz = await convert.convertJsToSfz(sfzJs);
  // console.log('convertJsToSfz', convertJsToSfz);

  // const convertJsToXml = await convert.convertJsToXml(sfzJs);
  // console.log('convertJsToXml', convertJsToXml);

  // const convertSfzToJs = await convert.convertSfzToJs(sfzText);
  // console.log('convertSfzToJs', convertSfzToJs);

  // const convertSfzToXml = await convert.convertSfzToXml(sfzText);
  // console.log('convertSfzToXml', convertSfzToXml);

  // const convertXmlToJs = await convert.convertXmlToJs(sfzXml);
  // console.log('convertXmlToJs', convertXmlToJs);

  // const convertXmlToSfz = await convert.convertXmlToSfz(sfzXml);
  // console.log('convertXmlToSfz', convertXmlToSfz);

  const audioFile = file.fileRead(`./test/flute.wav`);
  const analyzePitch = analyze.analyzePitch(audioFile, 'values');
  console.log('analyzePitch', analyzePitch);
}

run();
