declare module './onsets.module.js' {
  export class Onsets {
    constructor(alpha: number, silenceThreshold: number, framerate: number, minDuration: number);
    compute(odfMatrix: Float32Array[], odfsWeights: number[]): { positions: any };
    shutdown(): void;
  }
}

export default { Onsets };
