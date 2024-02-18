import { apiText } from './api';
import {
  ParseHeader,
  ParseHeaderNames,
  ParseOpcode,
  ParseOpcodeObj,
  ParseVariables,
} from './types/parse';
import { log, pathJoin } from './utils';

const variables: any = {};
let fileReadString: any = apiText;

function parseDefines(contents: string) {
  const defines: string[] | null = contents.match(/(?<=#define ).+(?=\r|\n)/g);
  if (!defines) return contents;
  for (const define of defines) {
    log(define);
    const val: string[] = define.split(' ');
    variables[val[0]] = val[1];
  }
  return contents;
}

function parseHeader(input: string) {
  return input.replace(/<| |>/g, '');
}

function parseHeaders(headers: ParseHeader[], prefix?: string) {
  const regions: ParseOpcodeObj[] = [];
  let defaultPath: string = '';
  let globalObj: ParseOpcodeObj = {};
  let masterObj: ParseOpcodeObj = {};
  let controlObj: ParseOpcodeObj = {};
  let groupObj: ParseOpcodeObj = {};
  headers.forEach((header: ParseHeader) => {
    if (header.name === ParseHeaderNames.global) {
      globalObj = parseOpcodeObject(header.elements);
    } else if (header.name === ParseHeaderNames.master) {
      masterObj = parseOpcodeObject(header.elements);
    } else if (header.name === ParseHeaderNames.control) {
      controlObj = parseOpcodeObject(header.elements);
      if (controlObj.default_path) defaultPath = controlObj.default_path;
    } else if (header.name === ParseHeaderNames.group) {
      groupObj = parseOpcodeObject(header.elements);
    } else if (header.name === ParseHeaderNames.region) {
      const regionObj: ParseOpcodeObj = parseOpcodeObject(header.elements);
      const mergedObj: ParseOpcodeObj = Object.assign({}, globalObj, masterObj, controlObj, groupObj, regionObj);
      if (mergedObj.sample) {
        if (prefix && !mergedObj.sample.startsWith(prefix)) {
          mergedObj.sample = pathJoin(prefix, defaultPath, mergedObj.sample);
        } else if (!mergedObj.sample.startsWith(defaultPath)) {
          mergedObj.sample = pathJoin(defaultPath, mergedObj.sample);
        }
      }
      regions.push(mergedObj);
    }
  });
  return regions;
}

async function parseIncludes(contents: string, prefix = '') {
  contents = parseDefines(contents);
  const includes: string[] | null = contents.match(/#include "(.+?)"/g);
  if (!includes) return contents;
  for (const include of includes) {
    const includePaths: string[] | null = include.match(/(?<=")(.*?)(?=")/g);
    if (!includePaths) continue;
    if (includePaths[0].includes('$')) includePaths[0] = parseVariables(includePaths[0], variables);
    const subcontent: any = await parseLoad(includePaths[0], prefix);
    const subcontentFlat: string = await parseIncludes(subcontent, prefix);
    contents = contents.replace(include, subcontentFlat);
  }
  return contents;
}

async function parseLoad(includePath: string, prefix: string) {
  const pathJoined: string = pathJoin(prefix, includePath);
  let file: string = '';
  if (pathJoined.startsWith('http')) file = await apiText(pathJoined);
  else if (fileReadString) file = fileReadString(pathJoined);
  else file = await apiText(pathJoined);
  return file;
}

function parseOpcodeObject(opcodes: ParseOpcode[]) {
  const properties: ParseOpcodeObj = {};
  opcodes.forEach((opcode: ParseOpcode) => {
    if (!isNaN(opcode.attributes.value as any)) {
      properties[opcode.attributes.name] = Number(opcode.attributes.value);
    } else {
      properties[opcode.attributes.name] = opcode.attributes.value;
    }
  });
  return properties;
}

function parseSanitize(contents: string) {
  // Remove comments.
  contents = contents.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, '');
  // Remove new lines and returns.
  contents = contents.replace(/(\r?\n|\r)+/g, ' ');
  // Ensure there are always spaces after <header>.
  contents = contents.replace(/>(?! )/g, '> ');
  // Replace multiple spaces/tabs with single space.
  contents = contents.replace(/( |\t)+/g, ' ');
  // Trim whitespace.
  return contents.trim();
}

function parseSegment(segment: string) {
  if (segment.includes('"')) segment = segment.replace(/"/g, '');
  if (segment.includes('$')) console.log(segment);
  segment = parseVariables(segment, variables);
  return segment;
}

function parseSetLoader(func: any) {
  fileReadString = func;
}

async function parseSfz(contents: string, prefix = '') {
  let element: any = {};
  const elements: ParseHeader[] = [];
  const contentsFlat: string = await parseIncludes(contents, prefix);
  const santized: string = parseSanitize(contentsFlat);
  const segments: string[] = santized.split(' ');
  for (let i: number = 0; i < segments.length; i++) {
    const segment: string = parseSegment(segments[i]);
    if (segment.charAt(0) === '/') {
      log('comment:', segment);
    } else if (segment === '#define') {
      const key: string = segments[i + 1];
      const val: string = segments[i + 2];
      log('define:', key, val);
      variables[key] = val;
      i += 2;
    } else if (segment.charAt(0) === '<') {
      element = {
        type: 'element',
        name: parseHeader(segment) as ParseHeaderNames,
        elements: [],
      };
      log('header:', element.name);
      elements.push(element);
    } else {
      if (!element.elements) element.elements = [];
      const opcode: string[] = segment.split('=');
      log('opcode:', opcode);
      // If orphaned string, add on to previous opcode value.
      if (opcode.length === 1 && element.elements.length && opcode[0] !== '') {
        element.elements[element.elements.length - 1].attributes.value += ' ' + opcode[0];
      } else {
        element.elements.push({
          type: 'element',
          name: 'opcode',
          attributes: {
            name: opcode[0],
            value: opcode[1],
          },
        });
      }
    }
  }
  if (elements.length > 0) return elements;
  return element;
}

function parseVariables(input: string, vars: ParseVariables) {
  for (const key in vars) {
    const regEx: RegExp = new RegExp('\\' + key, 'g');
    input = input.replace(regEx, vars[key]);
  }
  return input;
}

export {
  parseDefines,
  parseHeader,
  parseHeaders,
  parseIncludes,
  parseLoad,
  parseOpcodeObject,
  parseSanitize,
  parseSegment,
  parseSetLoader,
  parseSfz,
  parseVariables,
};
