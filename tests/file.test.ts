import {
  dirContains,
  dirCreate,
  dirDelete,
  dirEmpty,
  dirExists,
  dirIs,
  dirMove,
  dirOpen,
  dirRead,
  dirRename,
  fileCreate,
  fileDate,
  fileDelete,
  fileExec,
  fileExists,
  filenameParse,
  fileMove,
  fileOpen,
  fileSize,
} from '../src/file';
import os from 'os';
import path from 'path';

const DIR_PATH: string = path.join('test', 'new-directory');
const DIR_PATH_GLOB: string = path.join('test', 'new-directory', '**', '*.txt');
const DIR_RENAME: string = path.join('test', 'new-directory-renamed');

const FILE_PATH: string = path.join('test', 'new-directory', 'file.txt');

test('Directory contains', () => {
  expect(dirContains('test', DIR_PATH)).toEqual(true);
  expect(dirContains('tests', DIR_PATH)).toEqual(false);
});

test('Create new directory', () => {
  expect(dirCreate(DIR_PATH)).toEqual(DIR_PATH);
});

test('Create existing directory', () => {
  expect(dirCreate(DIR_PATH)).toEqual(false);
});

test('Directory is empty', () => {
  expect(dirEmpty(DIR_PATH)).toEqual(true);
});

test('Directory exists', () => {
  expect(dirExists(DIR_PATH)).toEqual(true);
});

test('Directory is', () => {
  fileCreate(FILE_PATH, 'file contents');
  expect(dirIs(DIR_PATH)).toEqual(true);
  expect(dirIs(FILE_PATH)).toEqual(false);
});

test('Directory move', () => {
  expect(dirMove(DIR_PATH, DIR_RENAME)).toBeUndefined();
  expect(dirMove(DIR_RENAME, DIR_PATH)).toBeUndefined();
});

test('Directory open', () => {
  expect(dirOpen(DIR_PATH)).toEqual(new Buffer(''));
});

test('Read directory', () => {
  expect(dirRead(DIR_PATH)).toMatchObject([DIR_PATH]);
});

test('Read directory glob', () => {
  expect(dirRead(DIR_PATH_GLOB)).toMatchObject([FILE_PATH]);
});

test('Create file', () => {
  expect(fileCreate(FILE_PATH, 'file contents')).toBeUndefined();
});

test('Rename directory', () => {
  expect(dirRename(DIR_PATH, DIR_RENAME)).toBeUndefined();
});

test('Delete existing directory', () => {
  expect(dirDelete(DIR_RENAME)).toBeUndefined();
});

// Following the pattern
// Instrument_articulation_mic_velocity_pitch_rrRR
// Trumpet_SusNV_Main_vl1_F4_rr2.wav

test('Filename parser', () => {
  expect(filenameParse('Cello_stacc_RR1_D#2_p.wav')).toEqual({
    dynamics: 'p',
    note: 'D#2',
    round: 1,
    other: ['Cello', 'stacc'],
  });
  expect(filenameParse('Upright1_Sus_C0_vl3_rr1.wav')).toEqual({
    velocity: 3,
    note: 'C0',
    round: 1,
    other: ['Upright1', 'Sus'],
  });
  expect(filenameParse('Trumpet_SusNV_Main_vl1_F4_rr2.wav')).toEqual({
    velocity: 1,
    note: 'F4',
    round: 2,
    other: ['Trumpet', 'SusNV', 'Main'],
  });
  expect(filenameParse('027-D#1-FF.wav', '-')).toEqual({
    dynamics: 'ff',
    note: 'D#1',
    other: ['027'],
  });
  expect(filenameParse('A_029__F1_3.wav')).toEqual({
    note: 'F1',
    other: ['A', '029', '3'],
  });
  expect(filenameParse('MartinGM2_040__E2_1.wav')).toEqual({
    note: 'E2',
    other: ['MartinGM2', '040', '1'],
  });
  expect(filenameParse('killer_bass_a5_vl1.wav')).toEqual({
    velocity: 1,
    note: 'A5',
    other: ['killer', 'bass'],
  });
  expect(filenameParse('VS_TremStr_C1.wav')).toEqual({
    note: 'C1',
    other: ['VS', 'TremStr'],
  });
  expect(filenameParse('bagpipes_2reed_a4_ord_rr1.wav')).toEqual({
    note: 'A4',
    round: 1,
    other: ['bagpipes', '2reed', 'ord'],
  });
  expect(filenameParse('cithara_ab4_finger_rr1.wav')).toEqual({
    note: 'Ab4',
    round: 1,
    other: ['cithara', 'finger'],
  });
});
