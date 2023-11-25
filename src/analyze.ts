// @ts-ignore
import { Essentia, EssentiaWASM } from 'essentia.js';
import * as wav from 'node-wav';
import { readFileSync } from 'fs';
import { AnalyzeBuffer, AnalyzeContour, AnalyzeFile, AnalyzeMelodia, AnalyzeVector } from './types/analyze';

const essentia: Essentia = new Essentia(EssentiaWASM);

function analyzeDanceability(file: AnalyzeFile): number {
  return essentia.Danceability(file.vector).danceability;
}

function analyzeDuration(file: AnalyzeFile): number {
  return essentia.Duration(file.vector).duration;
}

function analyzeEnergy(file: AnalyzeFile): number {
  return essentia.Energy(file.vector).energy;
}

function analyzeKey(file: AnalyzeFile): string {
  return essentia.KeyExtractor(file.vector).key;
}

function analyzeLoad(filepath: string): AnalyzeFile {
  const fileBuffer: Buffer = readFileSync(filepath);
  const audioBuffer: AnalyzeBuffer = wav.decode(fileBuffer);
  return {
    buffer: audioBuffer,
    vector: essentia.arrayToVector(audioBuffer.channelData[0]),
  };
}

function analyzeLoudness(file: AnalyzeFile): number {
  return essentia.DynamicComplexity(file.vector).loudness;
}

function analyzeNotes(file: AnalyzeFile): any[] {
  const names: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const melodia: AnalyzeMelodia = essentia.PitchMelodia(file.vector).pitch;
  const segments: AnalyzeContour = essentia.PitchContourSegmentation(melodia, file.vector);
  const onsets: Float32Array = essentia.vectorToArray(segments.onset);
  const durations: Float32Array = essentia.vectorToArray(segments.duration);
  const pitches: Float32Array = essentia.vectorToArray(segments.MIDIpitch);
  const notes: any = [];
  onsets.forEach((onset: number, i: number) => {
    // TODO: Find a better way to obtain loudness per note
    const startIndex: number = Math.floor(onset * file.buffer.sampleRate);
    const endIndex: number = Math.floor((onset + durations[i]) * file.buffer.sampleRate);
    const noteArray: Float32Array = file.buffer.channelData[0].slice(startIndex, endIndex);
    const noteVector: AnalyzeVector = essentia.arrayToVector(noteArray);
    const noteLoudness: number = essentia.Loudness(noteVector).loudness;
    notes.push({
      start: onset,
      duration: durations[i],
      loudness: noteLoudness,
      midi: pitches[i],
      octave: Math.floor(pitches[i] / 12),
      name: names[pitches[i] % 12],
    });
  });
  return notes;
}

function analyzeScale(file: AnalyzeFile): string {
  return essentia.KeyExtractor(file.vector).scale;
}

function analyzeSpeed(file: AnalyzeFile): number {
  return essentia.PercivalBpmEstimator(file.vector).bpm;
}

export {
  analyzeDanceability,
  analyzeDuration,
  analyzeEnergy,
  analyzeKey,
  analyzeLoad,
  analyzeLoudness,
  analyzeNotes,
  analyzeScale,
  analyzeSpeed,
};
