const IS_WIN: boolean = typeof process !== 'undefined' && process.platform === 'win32';
const LINE_END: string = IS_WIN ? '\r\n' : '\n';
let LOGGING_ENABLED: boolean = false;

function encodeHashes(item: string) {
  return item.replace(/#/g, encodeURIComponent('#'));
}

function findCaseInsentive(items: string[], match: string) {
  return items.findIndex((item) => {
    return item.toLowerCase() === match.toLowerCase();
  });
}

function findNumber(input: string) {
  const matches: any = input.match(/\d+/g);
  return Number(matches[0]);
}

function log(...args: any) {
  if (LOGGING_ENABLED) {
    console.log(...args);
  }
}

function logEnable(...args: any) {
  LOGGING_ENABLED = true;
}

function logDisable(...args: any) {
  LOGGING_ENABLED = false;
}

function midiNameToNum(name: string | number) {
  if (!name) return 0;
  if (typeof name === 'number') return name;
  const mapPitches: any = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };
  const letter = name[0];
  let pc = mapPitches[letter.toUpperCase()];
  const mapMods: any = { b: -1, '#': 1 };
  const mod = name[1];
  const trans = mapMods[mod] || 0;
  pc += trans;
  const octave = parseInt(name.slice(name.length - 1), 10);
  if (octave) {
    return pc + 12 * (octave + 1);
  } else {
    return ((pc % 12) + 12) % 12;
  }
}

function normalizeLineEnds(input: string) {
  if (IS_WIN) return input.replace(/\r?\n/g, LINE_END);
  return input;
}

function normalizeXml(input: string) {
  input = normalizeLineEnds(input);
  return input.replace(/\/>/g, ' />') + LINE_END;
}

function pathGetDirectory(pathItem: string, separator: string = '/'): string {
  return pathItem.substring(0, pathItem.lastIndexOf(separator));
}

function pathGetExt(pathItem: string): string {
  return pathItem.substring(pathItem.lastIndexOf('.') + 1);
}

function pathGetFilename(str: string, separator: string = '/'): string {
  let base: string = str.substring(str.lastIndexOf(separator) + 1);
  if (base.lastIndexOf('.') !== -1) {
    base = base.substring(0, base.lastIndexOf('.'));
  }
  return base;
}

function pathGetRoot(item: string, separator: string = '/'): string {
  return item.substring(0, item.indexOf(separator) + 1);
}

function pathGetSubDirectory(item: string, dir: string): string {
  return item.replace(dir, '');
}

function pathJoin(...segments: any) {
  const parts = segments.reduce((partItems: any, segment: any) => {
    // Replace backslashes with forward slashes
    if (segment.includes('\\')) {
      segment = segment.replace(/\\/g, '/');
    }
    // Remove leading slashes from non-first part.
    if (partItems.length > 0) {
      segment = segment.replace(/^\//, '');
    }
    // Remove trailing slashes.
    segment = segment.replace(/\/$/, '');
    return partItems.concat(segment.split('/'));
  }, []);
  const resultParts = [];
  for (let part of parts) {
    if (part === 'https:' || part === 'http:') part += '/';
    if (part === '') continue;
    if (part === '.') continue;
    if (part === resultParts[resultParts.length - 1]) continue;
    if (part === '..') {
      const partRemoved: string = resultParts.pop();
      if (partRemoved === '') resultParts.pop();
      continue;
    }
    resultParts.push(part);
  }
  return resultParts.join('/');
}

function pathReplaceVariables(str: string, items: any) {
  if (Array.isArray(items)) {
    items.forEach((item: string, itemIndex: number) => {
      str = str.replace(`$item[${itemIndex}]`, item);
    });
  } else {
    Object.keys(items).forEach((key: string) => {
      str = str.replace(`$${key}`, items[key]);
    });
  }
  return str;
}

function pitchToMidi(pitch: number) {
  // A4 = 440 Hz, 69 MIDI note
  const A4_HZ = 440;
  const A4_MIDI = 69;
  // The number of semitones between the given pitch and A4
  const semitones = Math.log2(pitch / A4_HZ) * 12;
  // The MIDI note number
  const midiNote = A4_MIDI + semitones;
  return Math.round(midiNote);
}

export {
  IS_WIN,
  LINE_END,
  encodeHashes,
  findCaseInsentive,
  findNumber,
  log,
  logEnable,
  logDisable,
  midiNameToNum,
  normalizeLineEnds,
  normalizeXml,
  pathGetDirectory,
  pathGetExt,
  pathGetFilename,
  pathGetRoot,
  pathGetSubDirectory,
  pathJoin,
  pathReplaceVariables,
  pitchToMidi,
};
