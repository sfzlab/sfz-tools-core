import ffmpeg from 'ffmpeg-static';
import { log } from './utils';
import { execSync } from 'child_process';

function encodeFlacToOgg(input: string, output?: string) {
  if (!output) output = input.replace('.flac', '.ogg');
  return encodeRun(`-i ${input} ${output}`);
}

function encodeFlacToWav(input: string, output?: string) {
  if (!output) output = input.replace('.flac', '.wav');
  return encodeRun(`-i ${input} ${output}`);
}

function encodeOggToFlac(input: string, output?: string) {
  if (!output) output = input.replace('.ogg', '.flac');
  return encodeRun(`-i ${input} ${output}`);
}

function encodeOggToWav(input: string, output?: string) {
  if (!output) output = input.replace('.ogg', '.wav');
  return encodeRun(`-i ${input} ${output}`);
}

function encodeWavToFlac(input: string, output?: string) {
  if (!output) output = input.replace('.wav', '.flac');
  return encodeRun(`-i ${input} ${output}`);
}

function encodeWavToOgg(input: string, output?: string) {
  if (!output) output = input.replace('.wav', '.ogg');
  return encodeRun(`-i ${input} ${output}`);
}

function encodeRun(command: string): string {
  try {
    log('⎋', `${ffmpeg} "${command}"`);
    const sdout: Buffer = execSync(`${ffmpeg} ${command}`);
    return sdout.toString();
  } catch (error: any) {
    return error.output ? error.output.toString() : error.toString();
  }
}

export { encodeFlacToOgg, encodeFlacToWav, encodeOggToFlac, encodeOggToWav, encodeWavToFlac, encodeWavToOgg };
