import ffmpeg from 'ffmpeg-static';
import { log } from './utils';
import { execSync } from 'child_process';

function encodeFlacToOgg(filepath: string) {
  return encodeRun(`-i ${filepath} ${filepath.replace('.flac', '.ogg')}`);
}

function encodeFlacToWav(filepath: string) {
  return encodeRun(`-i ${filepath} ${filepath.replace('.flac', '.wav')}`);
}

function encodeOggToFlac(filepath: string) {
  return encodeRun(`-i ${filepath} ${filepath.replace('.ogg', '.flac')}`);
}

function encodeOggToWav(filepath: string) {
  return encodeRun(`-i ${filepath} ${filepath.replace('.ogg', '.wav')}`);
}

function encodeWavToFlac(filepath: string) {
  return encodeRun(`-i ${filepath} ${filepath.replace('.wav', '.flac')}`);
}

function encodeWavToOgg(filepath: string) {
  return encodeRun(`-i ${filepath} ${filepath.replace('.wav', '.ogg')}`);
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
