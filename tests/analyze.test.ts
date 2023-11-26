import path from 'path';
import {
  analyzeDanceability,
  analyzeDuration,
  analyzeEnergy,
  analyzeKey,
  analyzeLoad,
  analyzeLoudness,
  analyzeNotes,
  analyzeScale,
  analyzeSpeed,
} from '../src/analyze';
import { AnalyzeFile } from '../src/types/analyze';
import { dirRead } from '../src/file';

const audioDir: string = path.join('test', 'audio');
const audioPaths: string[] = dirRead(path.join(audioDir, '**', '*.wav'));
const audioFiles: string[][] = audioPaths.map((audioFile: string) => {
  return [path.normalize(audioFile), audioFile];
});

console.log(audioFiles);

test.each(audioFiles)('Analyze Danceability %s', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeDanceability(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Duration %s', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeDuration(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Energy %s', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeEnergy(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Key %s', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeKey(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Loudness %s', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeLoudness(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Notes %s', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeNotes(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Scale %s', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeScale(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Speed %s', async (audioNorm: string, audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeSpeed(file)).toMatchSnapshot();
});
