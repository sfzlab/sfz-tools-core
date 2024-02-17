import { apiText } from './api';
import {
  ParseAttribute,
  ParseHeader,
  ParseHeaderNames,
  ParseOpcode,
  ParseOpcodeObj,
  ParseVariables,
} from './types/parse';
import { log, pathJoin } from './utils';

const skipCharacters: string[] = [' ', '\t', '\r', '\n'];
const endCharacters: string[] = [' ', '\r', '\n'];
const variables: any = {};
let fileReadString: any = apiText;

function parseDirective(input: string) {
  return input.match(/(?<=")[^#"]+(?=")|[^ \r\n"]+/g) || [];
}

function parseEnd(contents: string, startAt: number) {
  for (let index: number = startAt; index < contents.length; index++) {
    const char: string = contents.charAt(index);
    if (endCharacters.includes(char)) return index;
  }
  return contents.length;
}

function parseHeader(input: string) {
  return input.replace(/<|>/g, '');
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

async function parseLoad(includePath: string, prefix: string) {
  const pathJoined: string = pathJoin(prefix, includePath);
  let file: string = '';
  if (pathJoined.startsWith('http')) file = await apiText(pathJoined);
  else if (fileReadString) file = fileReadString(pathJoined);
  else file = await apiText(pathJoined);
  return await parseSfz(file, prefix);
}

function parseOpcode(input: string) {
  const output: ParseAttribute[] = [];
  const labels: string[] = input.match(/\w+(?==)/g) || [];
  const values: string[] = input.split(/\w+(?==)/g) || [];
  values.forEach((val: string) => {
    if (!val.length) return;
    output.push({
      name: labels[output.length],
      value: val.trim().replace(/[='"]/g, ''),
    });
  });
  return output;
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

function parseSetLoader(func: any) {
  fileReadString = func;
}

function parseSanitize(contents: string) {
  let santized = contents.replace(/(\r?\n|\r)+/g, ' ');
  return santized.replace(/>(?! )/g, '> ');
}

function parseSegment(contents: string, start: number) {
  for (let end: number = start; end < contents.length; end++) {
    const char: string = contents.charAt(end);
    if (endCharacters.includes(char)) return contents.slice(start, end);
  }
  return contents;
}

async function parseSfz(contents: string, prefix = '') {
  let element: any = {};
  let elements: ParseHeader[] = [];
  let santized = parseSanitize(contents);
  log(santized);
  let start: number = 0;
  for (let end: number = 0; end < santized.length; end++) {
    const charEnd: string = santized.charAt(end);
    if (endCharacters.includes(charEnd)) {
      const charStart: string = santized.charAt(start);
      let segment: string = santized.slice(start, end);
      if (segment.includes('$')) segment = parseVariables(segment, variables);
      log(start, end, `"${segment}"`);
      if (charStart === '/') {
        log('comment', segment);
      } else if (charStart === '#') {
        const key: string = parseSegment(santized, end + 1);
        const val: string = parseSegment(santized, end + key.length + 2);
        if (segment === '#include') {
          log('include', key, val);
        } else if (segment === '#define') {
          log('define', key, val);
          variables[key] = val;
          end += key.length + val.length + 2;
        }
      } else if (charStart === '<') {
        element = {
          type: 'element',
          name: parseHeader(segment) as ParseHeaderNames,
        };
        elements.push(element);
        log('header', element.name);
      } else {
        if (!element.elements) element.elements = [];
        const attributes: ParseAttribute[] = parseOpcode(segment);
        attributes.forEach((attribute: ParseAttribute) => {
          element.elements.push({
            type: 'element',
            name: 'opcode',
            attributes: attribute,
          });
        });
        log('opcode', attributes);
      }
      start = end + 1;
    }
  }
  if (elements.length > 0) return elements;
  return element;
}

function parseVariables(input: string, vars: ParseVariables) {
  const list: string = Object.keys(vars)
    .map((key) => '\\' + key)
    .join('|');
  const regEx: RegExp = new RegExp(list, 'g');
  return input.replace(regEx, (matched: string) => {
    return vars[matched];
  });
}

export {
  parseDirective,
  parseEnd,
  parseHeader,
  parseHeaders,
  parseLoad,
  parseOpcode,
  parseOpcodeObject,
  parseSetLoader,
  parseSfz,
  parseVariables,
};
