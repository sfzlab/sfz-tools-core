declare module './polarFFT.module.js' {
  export class PolarFFT {
    constructor(frameSize: number);
    compute(windowed: any): { magnitude: any; phase: any };
    shutdown(): void;
  }
}

export default { PolarFFT };
