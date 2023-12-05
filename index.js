// This file is used for local development
// Use the `npm run dev` command to build and run the file
// Debug particular methods quickly without having to run all tests `npm test`

const analyze = require('./dist/analyze.js');
const convert = require('./dist/convert.js');
const encode = require('./dist/encode.js');
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

  const file = analyze.analyzeLoad('./test/audio/velocity-saw.wav');
  // console.log('analyzeDanceability', analyze.analyzeDanceability(file));
  // console.log('analyzeDuration', analyze.analyzeDuration(file));
  // console.log('analyzeEnergy', analyze.analyzeEnergy(file));
  // console.log('analyzeKey', analyze.analyzeKey(file));
  // console.log('analyzeLoudness', analyze.analyzeLoudness(file));
  // console.log('analyzeNotes', analyze.analyzeNotes(file));
  // console.log('analyzeScale', analyze.analyzeScale(file));
  // console.log('analyzeSpeed', analyze.analyzeSpeed(file));
  console.log('analyzeOnsets', analyze.analyzeOnsets(file));

  // const encodeWavToFlac = await encode.encodeWavToFlac('./test/scale.wav');
  // console.log('encodeWavToFlac', encodeWavToFlac);
}

run();
