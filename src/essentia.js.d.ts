declare module 'essentia.js' {
  export const EssentiaWASM: any;

  export class Essentia {
    constructor(wasmModule: any);
    arrayToVector(array: Float32Array): any;
    vectorToArray(vector: any): Float32Array;
    Danceability(vector: any): { danceability: number };
    Duration(vector: any): { duration: number };
    DynamicComplexity(vector: any): { loudness: number };
    Energy(vector: any): { energy: number };
    FrameGenerator(array: Float32Array, frameSize: number, hopSize: number): any;
    KeyExtractor(vector: any): { key: string; scale: string };
    OnsetDetection(magnitude: any, phase: any, method: string, sampleRate: number): { onsetDetection: number };
    PercivalBpmEstimator(vector: any): { bpm: number };
    PitchYin(vector: any): { pitch: number };
    Windowing(frame: any): { frame: any };
  }
}
