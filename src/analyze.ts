import * as wav from 'node-wav';
// @ts-ignore
import { Essentia, EssentiaWASM } from 'essentia.js';
const essentia: Essentia = new Essentia(EssentiaWASM);

const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getChroma(fileBuffer: Buffer, bufferSize = 2048) {
  const audioBuffer = wav.decode(fileBuffer);
  const channelData: Float32Array = audioBuffer.channelData[0];
  const results: any[] = [];
  const frames = essentia.FrameGenerator(channelData, 2048, bufferSize);
  for (var i = 0; i < frames.size(); i++) {
    const frameWindowed = essentia.Windowing(frames.get(i), true, 2048).frame;
    const spectrum = essentia.Spectrum(frameWindowed).spectrum;
    results.push(essentia.PitchYinFFT(spectrum).pitch);
    frameWindowed.delete();
    spectrum.delete();
  }
  frames.delete();
  return results;

  // const audioBuffer = wav.decode(fileBuffer);
  // const channelData: Float32Array = audioBuffer.channelData[0];
  // const numFrames: number = Math.floor(channelData.length / bufferSize);
  // const results: any[] = [];
  // for (let i = 0; i < numFrames; i++) {
  //   const start: number = i * bufferSize;
  //   const end: number = start + bufferSize;
  //   const frame: Float32Array = channelData.subarray(start, end);
  //   const inputSignalVector = essentia.arrayToVector(frame);
  //   const outputPyYin = essentia.PitchYinProbabilistic(inputSignalVector);
  //   const chroma: number[] = essentia.vectorToArray(outputPyYin.voicedProbabilities);
  //   results.push(chroma);
  // }
  // return results;
}

function noteFromPitch(frequency: number) {
  var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

// function centsOffFromPitch( frequency, note ) {
// 	return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
// }

function getNoteIndex(chroma: number) {
  return Math.round(chroma * 10);
}

function getNoteName(chroma: number) {
  return pitches[noteFromPitch(chroma % 12)];
}

function analyzePitch(fileBuffer: Buffer, type = 'values', bufferSize = 2048) {
  const results: any[] = [];
  const chromaResults: any[] = getChroma(fileBuffer, bufferSize);
  chromaResults.forEach((chroma: number) => {
    if (type === 'index') results.push(getNoteIndex(chroma));
    else if (type === 'name') results.push(getNoteName(chroma));
    else results.push(chroma);
  });
  return results;
}

export { analyzePitch };
