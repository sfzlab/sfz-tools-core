// @ts-ignore
import { Essentia, EssentiaWASM } from 'essentia.js';
import * as wav from 'node-wav';
import { readFileSync } from 'fs';
import {
  AnalyzeBuffer,
  AnalyzeContour,
  AnalyzeFile,
  AnalyzeMelodia,
  AnalyzeNote,
  AnalyzePitch,
  AnalyzeVector,
} from './types/analyze';
// @ts-ignore
import PolarFFTWASM from './lib/polarFFT.module.js';
// @ts-ignore
import OnsetsWASM from './lib/onsets.module.js';
import { pitchToMidi } from './utils';

const essentia: Essentia = new Essentia(EssentiaWASM);

function analyzeDanceability(vector: AnalyzeVector): number {
  /**
   * This algorithm estimates danceability of a given audio signal. The algorithm is derived from Detrended Fluctuation Analysis (DFA) described in [1]. The parameters minTau and maxTau are used to define the range of time over which DFA will be performed. The output of this algorithm is the danceability of the audio signal. These values usually range from 0 to 3 (higher values meaning more danceable). Check https://essentia.upf.edu/reference/std_Danceability.html for more details.
   * @param vector - Wav file buffer which has been decoded and converted from an array to a vector.
   * @returns Returns the danceability value. Normal values range from 0 to ~3. The higher, the more danceable.
   */
  return essentia.Danceability(vector).danceability;
}

function analyzeDuration(vector: AnalyzeVector): number {
  /**
   * This algorithm outputs the total duration of an audio signal. Check https://essentia.upf.edu/reference/std_Duration.html for more details.
   * @param vector - Wav file buffer which has been decoded and converted from an array to a vector.
   * @returns Returns the duration of the signal in seconds (s).
   */
  return essentia.Duration(vector).duration;
}

function analyzeEnergy(vector: AnalyzeVector): number {
  /**
   * This algorithm computes the energy of an array. Check https://essentia.upf.edu/reference/std_Energy.html for more details.
   * @param vector - Wav file buffer which has been decoded and converted from an array to a vector.
   * @returns Returns the energy of the input array.
   */
  return essentia.Energy(vector).energy;
}

function analyzeKey(vector: AnalyzeVector): string {
  /**
   * This algorithm computes key estimate given a pitch class profile (HPCP). The algorithm was severely adapted and changed from the original implementation for readability and speed. Check https://essentia.upf.edu/reference/std_Key.html for more details.
   * @param vector - Wav file buffer which has been decoded and converted from an array to a vector.
   * @returns Returns the estimated key, from A to G.
   */
  return essentia.KeyExtractor(vector).key;
}

function analyzeLoad(filepath: string): AnalyzeFile {
  /**
   * This function reads a wav file into a file buffer, decodes the wav data, then converts the array to a vector for use with essentia.js.
   * @param filepath - Path to wave file
   * @returns Returns an object containing the buffer and vector data.
   */
  const fileBuffer: Buffer = readFileSync(filepath);
  const audioBuffer: AnalyzeBuffer = wav.decode(fileBuffer);
  return {
    buffer: audioBuffer,
    vector: essentia.arrayToVector(audioBuffer.channelData[0]),
  };
}

function analyzeLoudness(vector: AnalyzeVector): number {
  /**
   * This algorithm computes the dynamic complexity defined as the average absolute deviation from the global loudness level estimate on the dB scale. It is related to the dynamic range and to the amount of fluctuation in loudness present in a recording. Silence at the beginning and at the end of a track are ignored in the computation in order not to deteriorate the results. Check https://essentia.upf.edu/reference/std_DynamicComplexity.html for more details.
   * @param vector - Wav file buffer which has been decoded and converted from an array to a vector.
   * @returns Returns an estimate of the loudness in decibels (dB).
   */
  return essentia.DynamicComplexity(vector).loudness;
}

// Prototype using custom onsets algorithm and slower PitchYin algorithm
function analyzeNotes(file: AnalyzeFile, includeData = false): AnalyzeNote[] {
  /**
   * This algorithm identifies individual notes within a file, and detects their specific audio features.
   * @param file - An object containing the wav file buffer and vector data from analyzeLoad().
   * @returns Returns an array of note objects containing start (s), duration (s), loudness (dB), midi, name and octave values.
   */
  const fileDuration: number = essentia.Duration(file.vector).duration;
  const onsets: Float32Array = analyzeOnsets(file);
  const notes: any = [];
  onsets.forEach((onset: number, i: number) => {
    const noteDuration: number = (onsets[i + 1] || fileDuration) - onsets[i];
    if (Math.round(noteDuration) === 0) return;
    const startIndex: number = Math.floor(onset * file.buffer.sampleRate);
    const endIndex: number = Math.floor((onset + noteDuration) * file.buffer.sampleRate);
    const noteArray: Float32Array = file.buffer.channelData[0].slice(startIndex, endIndex);
    const noteVector: AnalyzeVector = essentia.arrayToVector(noteArray);
    const notePitch: AnalyzePitch = analyzePitch(noteVector);
    const note: AnalyzeNote = {
      start: onset,
      duration: noteDuration,
      loudness: analyzeLoudness(noteVector),
      midi: notePitch.midi,
      name: notePitch.name,
      octave: notePitch.octave,
    };
    if (includeData) {
      // Stereo
      if (file.buffer.channelData.length > 1) {
        note.channelData = [
          file.buffer.channelData[0].slice(startIndex, endIndex),
          file.buffer.channelData[1].slice(startIndex, endIndex),
        ];
      } else {
        // Mono
        note.channelData = [noteArray];
      }
      note.sampleRate = file.buffer.sampleRate;
    }
    notes.push(note);
  });
  return notes;
}

function analyzeOnsets(file: AnalyzeFile) {
  /**
   * This algorithm identifies individual notes start times.
   * @param file - An object containing the wav file buffer and vector data from analyzeLoad().
   * @returns Returns an array of note offset values.
   */
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

function analyzePitch(vector: AnalyzeVector): AnalyzePitch {
  /**
   * This algorithm computes the dynamic complexity defined as the average absolute deviation from the global loudness level estimate on the dB scale. It is related to the dynamic range and to the amount of fluctuation in loudness present in a recording. Silence at the beginning and at the end of a track are ignored in the computation in order not to deteriorate the results. Check https://essentia.upf.edu/reference/std_DynamicComplexity.html for more details.
   * @param vector - Wav file buffer which has been decoded and converted from an array to a vector.
   * @returns Returns an pitch object containing frequency, midi, name, midi and octave values.
   */
  const frequency: number = essentia.PitchYin(vector).pitch;
  const midi: number = pitchToMidi(frequency);
  const names: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return {
    frequency,
    midi,
    name: names[midi % 12],
    octave: Math.floor(midi / 12),
  };
}

function analyzeScale(vector: AnalyzeVector): string {
  /**
   * This algorithm computes key estimate given a pitch class profile (HPCP). The algorithm was severely adapted and changed from the original implementation for readability and speed. Check https://essentia.upf.edu/reference/std_Key.html for more details.
   * @param vector - Wav file buffer which has been decoded and converted from an array to a vector.
   * @returns Returns the scale of the key (major or minor).
   */
  return essentia.KeyExtractor(vector).scale;
}

function analyzeSpeed(vector: AnalyzeVector): number {
  /**
   * This algorithm estimates the tempo in beats per minute (BPM) from an input signal as described in [1]. Check https://essentia.upf.edu/reference/std_PercivalBpmEstimator.html for more details.
   * @param vector - Wav file buffer which has been decoded and converted from an array to a vector.
   * @returns Returns the tempo estimation in beats per minute (bpm).
   */
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
  analyzeOnsets,
  analyzePitch,
  analyzeScale,
  analyzeSpeed,
};
