import ffmpeg from 'ffmpeg-static';
import { log, pathGetExt } from './utils';
import { execSync } from 'child_process';
import { EncodeOptions } from './types/encode';

function encode(filepath: string, options: EncodeOptions) {
  const fileExt: string = pathGetExt(filepath);
  if (fileExt === 'flac') {
    if (options.ogg) encodeFlacToOgg(filepath);
    if (options.wav) encodeFlacToWav(filepath);
  } else if (fileExt === 'ogg') {
    if (options.flac) encodeOggToFlac(filepath);
    if (options.wav) encodeOggToWav(filepath);
  } else if (fileExt === 'wav') {
    if (options.flac) encodeWavToFlac(filepath);
    if (options.ogg) encodeWavToOgg(filepath);
  } else {
    console.log(`Unsupported file extension ${fileExt}`);
  }
}

function encodeFlacToOgg(input: string, output?: string) {
  if (!output) output = input.replace('.flac', '.ogg');
  return encodeRun(`-i "${input}" "${output}"`);
}

function encodeFlacToWav(input: string, output?: string) {
  if (!output) output = input.replace('.flac', '.wav');
  return encodeRun(`-i "${input}" "${output}"`);
}

function encodeOggToFlac(input: string, output?: string) {
  if (!output) output = input.replace('.ogg', '.flac');
  return encodeRun(`-i "${input}" "${output}"`);
}

function encodeOggToWav(input: string, output?: string) {
  if (!output) output = input.replace('.ogg', '.wav');
  return encodeRun(`-i "${input}" "${output}"`);
}

function encodeWavToFlac(input: string, output?: string) {
  if (!output) output = input.replace('.wav', '.flac');
  return encodeRun(`-i "${input}" "${output}"`);
}

function encodeWavToOgg(input: string, output?: string) {
  if (!output) output = input.replace('.wav', '.ogg');
  return encodeRun(`-i "${input}" "${output}"`);
}

function encodeRun(command: string): string {
  try {
    log('⎋', `${ffmpeg} ${command}`);
    const sdout: Buffer = execSync(`${ffmpeg} ${command}`);
    return sdout.toString();
  } catch (error: any) {
    return error.output ? error.output.toString() : error.toString();
  }
}

export { encode, encodeFlacToOgg, encodeFlacToWav, encodeOggToFlac, encodeOggToWav, encodeWavToFlac, encodeWavToOgg };
