import ffmpeg from 'ffmpeg-static';
import wav from 'wav';
import { log } from './utils.js';
import { execSync } from 'child_process';
import { createReadStream } from 'fs';
import * as flac from 'flac-bindings';
import { metadata } from 'flac-bindings/lib/api.js';

const SHARED_PARAMS = '-map_metadata 0';

function encodeFlacToOgg(input: string, output?: string) {
  if (!output) output = input.replace('.flac', '.ogg');
  return encodeRun(`-i "${input}" ${SHARED_PARAMS} "${output}"`);
}

function encodeFlacToWav(input: string, output?: string) {
  if (!output) output = input.replace('.flac', '.wav');
  return encodeRun(`-i "${input}" ${SHARED_PARAMS} "${output}"`);
}

function encodeOggToFlac(input: string, output?: string) {
  if (!output) output = input.replace('.ogg', '.flac');
  return encodeRun(`-i "${input}" ${SHARED_PARAMS} "${output}"`);
}

function encodeOggToWav(input: string, output?: string) {
  if (!output) output = input.replace('.ogg', '.wav');
  return encodeRun(`-i "${input}" ${SHARED_PARAMS} "${output}"`);
}

// ffmpeg does not copy RIFF chunk metadata
// use flac library instead
async function encodeWavToFlac(input: string, output?: string) {
  if (!output) output = input.replace('.wav', '.flac');
  // return encodeRun(`-i "${input}" ${SHARED_PARAMS} "${output}"`);
  console.log('metadata', metadata);
  const wavReader = new wav.Reader();
  return createReadStream(input || 'in.wav')
    .pipe(wavReader)
    .pipe(
      new flac.FileEncoder({
        file: output || 'out.flac',
        compressionLevel: 9,
        metadata: [new metadata.ApplicationMetadata(), new metadata.PaddingMetadata(), new metadata.SeekTableMetadata(), new metadata.UnknownMetadata(), new metadata.VorbisCommentMetadata()]
      })
    )
    .on('error', (error) => {
      console.error(error);
    });
}

function encodeWavToOgg(input: string, output?: string) {
  if (!output) output = input.replace('.wav', '.ogg');
  return encodeRun(`-i "${input}" ${SHARED_PARAMS} "${output}"`);
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
