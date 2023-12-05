// @ts-ignore
import { Essentia, EssentiaWASM } from 'essentia.js';
import * as wav from 'node-wav';
import { readFileSync } from 'fs';
import { AnalyzeBuffer, AnalyzeContour, AnalyzeFile, AnalyzeMelodia, AnalyzeVector } from './types/analyze';
// @ts-ignore
import PolarFFTWASM from './lib/polarFFT.module.js';
// @ts-ignore
import OnsetsWASM from './lib/onsets.module.js';

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
  const melodia: AnalyzeMelodia = essentia.PredominantPitchMelodia(file.vector).pitch;
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
    const noteLoudness: number = essentia.DynamicComplexity(noteVector).loudness;
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

function analyzeOnsets(file: AnalyzeFile) {
  const params = {
    frameSize: 1024,
    hopSize: 512,
    odfs: ['hfc', 'complex'],
    odfsWeights: [0.5, 0.5],
    sensitivity: 0.65,
  };
  // Calculate polar frames.
  const polarFrames = [];
  const PolarFFT = new PolarFFTWASM.PolarFFT(params.frameSize);
  const frames = essentia.FrameGenerator(file.buffer.channelData[0], params.frameSize, params.hopSize);
  for (let i = 0; i < frames.size(); i++) {
    const currentFrame = frames.get(i);
    const windowed = essentia.Windowing(currentFrame).frame;
    const polar = PolarFFT.compute(essentia.vectorToArray(windowed));
    polarFrames.push(polar);
  }
  frames.delete();
  PolarFFT.shutdown();
  // Calculate onsets.
  const alpha = 1 - params.sensitivity;
  const Onsets = new OnsetsWASM.Onsets(alpha, 5, file.buffer.sampleRate / params.hopSize, 0.02);
  const odfMatrix = [];
  for (const func of params.odfs) {
    const odfArray = polarFrames.map((frame) => {
      return essentia.OnsetDetection(
        essentia.arrayToVector(essentia.vectorToArray(frame.magnitude)),
        essentia.arrayToVector(essentia.vectorToArray(frame.phase)),
        func,
        file.buffer.sampleRate
      ).onsetDetection;
    });
    odfMatrix.push(Float32Array.from(odfArray));
  }
  const onsetPositions = Onsets.compute(odfMatrix, params.odfsWeights).positions;
  Onsets.shutdown();
  if (onsetPositions.size() === 0) {
    return new Float32Array(0);
  } else {
    return essentia.vectorToArray(onsetPositions);
  }
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
  analyzeOnsets,
  analyzeScale,
  analyzeSpeed,
};
