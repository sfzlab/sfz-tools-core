import * as wav from 'node-wav';
// @ts-ignore
import { Essentia, EssentiaWASM } from 'essentia.js';
const essentia: Essentia = new Essentia(EssentiaWASM);

const SEMITONE_RATIO = Math.pow(2, 1 / 12);
const C2 = 440 * Math.pow(SEMITONE_RATIO, -33);
const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getChroma(fileBuffer: Buffer) {
  const audioBuffer = wav.decode(fileBuffer);
  const channelData: Float32Array = audioBuffer.channelData[0];
  const results: any[] = [];
  const frames = essentia.FrameGenerator(channelData);
  for (var i = 0; i < frames.size(); i++) {
    const frameWindowed = essentia.Windowing(frames.get(i), true, 2048).frame;
    const spectrum = essentia.Spectrum(frameWindowed).spectrum;
    results.push(essentia.PitchYinFFT(spectrum).pitch);
    frameWindowed.delete();
    spectrum.delete();
  }
  frames.delete();
  return results;
}

function getNoteIndex(chroma: number) {
  return Math.round(chroma * 10);
}

function getNoteName(chroma: number) {
  const semitonesAboveC2 = Math.round(12 * Math.log2(chroma / C2));
  return pitches[semitonesAboveC2 % 12];
}

function analyzePitch(fileBuffer: Buffer, type = 'values') {
  const results: any[] = [];
  const chromaResults: any[] = getChroma(fileBuffer);
  chromaResults.forEach((chroma: number) => {
    if (type === 'index') results.push(getNoteIndex(chroma));
    else if (type === 'name') results.push(getNoteName(chroma));
    else results.push(chroma);
  });
  return results;
}

export { analyzePitch };
