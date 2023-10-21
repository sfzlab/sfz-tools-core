// @ts-ignore
import { Essentia, EssentiaWASM } from 'essentia.js';
import * as wav from 'node-wav';
import { readFileSync } from 'fs';
import { AnalyzeBuffer, AnalyzeContour, AnalyzeMelodia, AnalyzeVector } from './types/analyze';

const essentia: Essentia = new Essentia(EssentiaWASM);

function analyzeDanceability(vector: AnalyzeVector): number {
  return essentia.Danceability(vector).danceability;
}

function analyzeDuration(vector: AnalyzeVector): number {
  return essentia.Duration(vector).duration;
}

function analyzeEnergy(vector: AnalyzeVector): number {
  return essentia.Energy(vector).energy;
}

function analyzeKey(vector: AnalyzeVector): string {
  return essentia.KeyExtractor(vector).key;
}

function analyzeLoad(filepath: string): AnalyzeVector {
  const fileBuffer: Buffer = readFileSync(filepath);
  const audioBuffer: AnalyzeBuffer = wav.decode(fileBuffer);
  return essentia.arrayToVector(audioBuffer.channelData[0]);
}

function analyzeLoudness(vector: AnalyzeVector): number {
  return essentia.DynamicComplexity(vector).loudness;
}

function analyzeNotes(vector: AnalyzeVector): any[] {
  const names: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const melodia: AnalyzeMelodia = essentia.PitchMelodia(vector).pitch;
  const segments: AnalyzeContour = essentia.PitchContourSegmentation(melodia, vector);
  const onsets: Float32Array = essentia.vectorToArray(segments.onset);
  const durations: Float32Array = essentia.vectorToArray(segments.duration);
  const pitches: Float32Array = essentia.vectorToArray(segments.MIDIpitch);
  const notes: any = [];
  onsets.forEach((value: number, i: number) => {
    notes.push({
      start: onsets[i],
      duration: durations[i],
      midi: pitches[i],
      octave: Math.floor(pitches[i] / 12),
      name: names[pitches[i] % 12],
    });
  });
  return notes;
}

function analyzeScale(vector: AnalyzeVector): string {
  return essentia.KeyExtractor(vector).scale;
}

function analyzeSpeed(vector: AnalyzeVector): number {
  return essentia.PercivalBpmEstimator(vector).bpm;
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
