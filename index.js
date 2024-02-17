// This file is used for local development
// Use the `npm run dev` command to build and run the file
// Debug particular methods quickly without having to run all tests `npm test`

const analyze = require('./dist/analyze.js');
const api = require('./dist/api.js');
const convert = require('./dist/convert.js');
const encode = require('./dist/encode.js');
const file = require('./dist/file.js');
const parse = require('./dist/parse.js');
const utils = require('./dist/utils.js');

async function run() {
  // Enable logging to see what is going on
  utils.logEnable();

  // load local files
  parse.parseSetLoader(file.fileReadString);
  convert.convertSetLoader(file.fileReadString);

  // File testing
  const sfzDir = './test/syntax/';
  const sfzFile = 'defines';
  const sfzJs = file.fileReadJson(`${sfzDir}${sfzFile}.json`);
  const sfzText = file.fileReadString(`${sfzDir}${sfzFile}.sfz`);
  const sfzXml = file.fileReadString(`${sfzDir}${sfzFile}.xml`);
  const sfzYaml = file.fileReadString(`${sfzDir}${sfzFile}.yaml`);

  // Api testing
  // const sfzDir = 'https://raw.githubusercontent.com/kmturley/karoryfer.black-and-green-guitars/main/Programs/';
  // const sfzFile = '01-green_keyswitch';
  // const sfzJs = await api.apiJson(`${sfzDir}${sfzFile}.json`);
  // const sfzText = await api.apiText(`${sfzDir}${sfzFile}.sfz`);
  // const sfzXml = await api.apiText(`${sfzDir}${sfzFile}.xml`);

  // const parseSfz = await parse.parseSfz(sfzText, sfzDir);
  // console.log('parseSfz', parseSfz);
  
  // const parseRegions = await parse.parseRegions(parseSfz);
  // console.log('parseRegions', parseRegions);

  // const convertJsToSfz = await convert.convertJsToSfz(sfzJs, sfzDir);
  // console.log('convertJsToSfz', convertJsToSfz);

  // const convertJsToXml = await convert.convertJsToXml(sfzJs, sfzDir);
  // console.log('convertJsToXml', convertJsToXml);

  const convertSfzToJs = await convert.convertSfzToJs(sfzText, sfzDir);
  // console.log('convertSfzToJs', convertSfzToJs);
  file.fileCreate('./output.json', JSON.stringify(convertSfzToJs, null, 2));

  // const convertSfzToXml = await convert.convertSfzToXml(sfzText, sfzDir);
  // console.log('convertSfzToXml', convertSfzToXml);

  // const convertXmlToJs = await convert.convertXmlToJs(sfzXml, sfzDir);
  // console.log('convertXmlToJs', convertXmlToJs);

  // const convertXmlToSfz = await convert.convertXmlToSfz(sfzXml, sfzDir);
  // console.log('convertXmlToSfz', convertXmlToSfz);

  // const file = analyze.analyzeLoad('./test/audio/velocity-saw.wav');
  // console.log('analyzeDanceability', analyze.analyzeDanceability(file));
  // console.log('analyzeDuration', analyze.analyzeDuration(file));
  // console.log('analyzeEnergy', analyze.analyzeEnergy(file));
  // console.log('analyzeKey', analyze.analyzeKey(file));
  // console.log('analyzeLoudness', analyze.analyzeLoudness(file));
  // console.log('analyzeNotes', analyze.analyzeNotes(file));
  // console.log('analyzeScale', analyze.analyzeScale(file));
  // console.log('analyzeSpeed', analyze.analyzeSpeed(file));
  // console.log('analyzeOnsets', analyze.analyzeOnsets(file));

  // const encodeWavToFlac = await encode.encodeWavToFlac('./test/scale.wav');
  // console.log('encodeWavToFlac', encodeWavToFlac);
}

run();
