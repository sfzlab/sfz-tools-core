import * as wav from 'node-wav';
import Meyda from "meyda";

const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getChroma(fileBuffer: Buffer, bufferSize = 2048) {
  const audioBuffer = wav.decode(fileBuffer);
  Meyda.bufferSize = bufferSize;
  Meyda.sampleRate = audioBuffer.sampleRate;
  const channelData: Float32Array = audioBuffer.channelData[0];
  const numFrames: number = Math.floor(channelData.length / bufferSize);
  const results: any[] = [];
  for (let i = 0; i < numFrames; i++) {
    const start: number = i * bufferSize;
    const end: number = start + bufferSize;
    const frame: Float32Array = channelData.subarray(start, end);
    const chroma: number[] = Meyda.extract('chroma', frame) as number[];
    results.push(chroma);
  }
  return results;
}

function getNoteIndex(chroma: number[]) {
  return chroma.indexOf(Math.max(...chroma));
}

function getNoteName(chroma: number[]) {
  return pitches[getNoteIndex(chroma)];
}

function analyzePitch(fileBuffer: Buffer, type = 'values', bufferSize = 2048) {
  let results: any[] = [];
  const chromaResults: any[] = getChroma(fileBuffer, bufferSize);
  chromaResults.forEach((chroma: number[]) => {
    if (type === 'index') results.push(getNoteIndex(chroma));
    else if (type === 'name') results.push(getNoteName(chroma));
    else results.push(chroma);
  });
  return results;
}

export { analyzePitch }
