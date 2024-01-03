interface AnalyzeBuffer {
  readonly sampleRate: number;
  readonly channelData: readonly Float32Array[];
}

interface AnalyzeContour {
  onset: number;
  duration: number;
  MIDIpitch: number;
}

interface AnalyzeFile {
  buffer: AnalyzeBuffer;
  vector: AnalyzeVector;
}

interface AnalyzeMelodia {
  pitch: number;
  pitchConfidence: number;
}

interface AnalyzeNote {
  channelData?: ArrayBuffer[];
  sampleRate?: number;
  start: number;
  duration: number;
  loudness: number;
  midi: number;
  octave: number;
  name: string;
}

interface AnalyzeOptions {
  danceability?: boolean;
  duration?: boolean;
  energy?: boolean;
  key?: boolean;
  loudness?: boolean;
  notes?: boolean;
  onsets?: boolean;
  pitch?: boolean;
  scale?: boolean;
  speed?: boolean;
}

interface AnalyzePitch {
  frequency: number;
  midi: number;
  name: string;
  octave: number;
}

// tslint:disable-next-line
interface AnalyzeVector {}

export {
  AnalyzeBuffer,
  AnalyzeContour,
  AnalyzeFile,
  AnalyzeMelodia,
  AnalyzeNote,
  AnalyzeOptions,
  AnalyzePitch,
  AnalyzeVector,
};
