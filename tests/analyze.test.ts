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
const audioFiles: string[] = dirRead(path.join(audioDir, '**', '*.wav'));

test.each(audioFiles)('Analyze Danceability %p', async (audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeDanceability(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Duration %p', async (audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeDuration(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Energy %p', async (audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeEnergy(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Key %p', async (audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeKey(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Loudness %p', async (audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeLoudness(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Notes %p', async (audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeNotes(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Scale %p', async (audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeScale(file)).toMatchSnapshot();
});

test.each(audioFiles)('Analyze Speed %p', async (audioFile: string) => {
  const file: AnalyzeFile = analyzeLoad(audioFile);
  expect(analyzeSpeed(file)).toMatchSnapshot();
});
