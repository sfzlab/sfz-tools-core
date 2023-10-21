interface AnalyzeBuffer {
  readonly sampleRate: number;
  readonly channelData: readonly Float32Array[];
}

interface AnalyzeContour {
  onset: number;
  duration: number;
  MIDIpitch: number;
}

interface AnalyzeMelodia {
  pitch: number;
  pitchConfidence: number;
}

// tslint:disable-next-line
interface AnalyzeVector {}

export { AnalyzeBuffer, AnalyzeContour, AnalyzeMelodia, AnalyzeVector };
