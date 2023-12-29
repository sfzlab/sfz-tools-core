import path from 'path';
import {
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
} from '../src/analyze';
import { AnalyzeFile } from '../src/types/analyze';
import { dirRead } from '../src/file';

const audioDir: string = path.join('test', 'audio');
const audioPaths: string[] = dirRead(path.join(audioDir, '**', '*.wav'));

// Windows paths contain backslashes, which result in snapshot names not matching Linux/Mac.
// Loop through paths and create a 2d array of forward slash paths to use in snpashot names.
const audioFiles: string[][] = audioPaths.map((audioFile: string) => {
  return [audioFile.replace(/\\/g, '/'), audioFile];
});

test.each(audioFiles)('Analyze Danceability %p', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeDanceability(file.vector)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Duration %p', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeDuration(file.vector)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Energy %p', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeEnergy(file.vector)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Key %p', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeKey(file.vector)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Loudness %p', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeLoudness(file.vector)).toMatchSnapshot();
});

// test.each(audioFiles)('Analyze Notes %p', async (audioNorm: string, audioFile: string) => {
//   const file: AnalyzeFile = analyzeLoad(audioFile);
//   expect(analyzeNotes(file)).toMatchSnapshot();
// });

// test.each(audioFiles)('Analyze Onsets %p', async (audioNorm: string, audioFile: string) => {
//   const file: AnalyzeFile = analyzeLoad(audioFile);
//   expect(analyzeOnsets(file)).toMatchSnapshot();
// });

test.each(audioFiles)('Analyze Pitches %p', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzePitch(file.vector)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Scale %p', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeScale(file.vector)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Speed %p', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeSpeed(file.vector)).toMatchSnapshot();
});
