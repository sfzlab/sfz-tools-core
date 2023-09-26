import { apiText } from './api';
import { fileText } from './file';
import {
  ParseAttribute,
  ParseHeader,
  ParseHeaderNames,
  ParseOpcode,
  ParseOpcodeObj,
  ParseVariables,
} from './types/parse';
import { pathJoin } from './utils';

const DEBUG: boolean = false;
const skipCharacters: string[] = [' ', '\t', '\r', '\n'];
const endCharacters: string[] = ['>', '\r', '\n'];
const variables: any = {};

function parseDirective(input: string) {
  return input.match(/(?<=")[^#"]+(?=")|[^# \r\n"]+/g) || [];
}

function parseEnd(contents: string, startAt: number) {
  const isComment: boolean = contents.charAt(startAt) === '/' && contents.charAt(startAt + 1) === '/';
  for (let index: number = startAt; index < contents.length; index++) {
    const char: string = contents.charAt(index);
    if (isComment && char === '>') continue;
    if (endCharacters.includes(char)) return index;
    if (index > startAt + 1 && char === '/' && contents.charAt(index + 1) === '/') return index;
  }
  return contents.length;
}

function parseHeader(input: string) {
  return input.match(/[^< >]+/g) || [];
}

async function parseLoad(includePath: string, prefix: string) {
  const pathJoined: string = pathJoin(prefix, includePath);
  let file: string = '';
  if (pathJoined.startsWith('http')) file = await apiText(pathJoined);
  else file = fileText(pathJoined);
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

function parseRegions(headers: ParseHeader[]) {
  const regions: any = [];
  let globalObj: ParseOpcodeObj = {};
  let masterObj: ParseOpcodeObj = {};
  let controlObj: ParseOpcodeObj = {};
  let groupObj: ParseOpcodeObj = {};
  headers.forEach((header: ParseHeader) => {
    if (header.name === ParseHeaderNames.global) {
      globalObj = parseOpcodeObject(header.elements);
    }
    if (header.name === ParseHeaderNames.master) {
      masterObj = parseOpcodeObject(header.elements);
    }
    if (header.name === ParseHeaderNames.control) {
      controlObj = parseOpcodeObject(header.elements);
    }
    if (header.name === ParseHeaderNames.group) {
      groupObj = parseOpcodeObject(header.elements);
    } else if (header.name === ParseHeaderNames.region) {
      const regionObj: ParseOpcodeObj = parseOpcodeObject(header.elements);
      const mergedObj: ParseOpcodeObj = Object.assign({}, globalObj, masterObj, controlObj, groupObj, regionObj);
      regions.push(mergedObj);
    }
  });
  return regions;
}

async function parseSfz(contents: string, prefix = '') {
  let elements: any[] = [];
  let element: any = {};
  for (let i: number = 0; i < contents.length; i++) {
    const char: string = contents.charAt(i);
    if (skipCharacters.includes(char)) continue; // skip character
    const iEnd: number = parseEnd(contents, i);
    let line: string = contents.slice(i, iEnd);
    if (char === '/') {
      // do nothing
    } else if (char === '#') {
      const matches: string[] = parseDirective(line);
      if (matches[0] === 'include') {
        let includePath: string = matches[1];
        if (includePath.includes('$')) includePath = parseVariables(includePath, variables);
        const includeVal: any = await parseLoad(includePath, prefix);
        if (element.elements && includeVal.elements) {
          element.elements = element.elements.concat(includeVal.elements);
        } else {
          elements = elements.concat(includeVal);
        }
        if (DEBUG) console.log('include', includePath, JSON.stringify(includeVal));
      } else if (matches[0] === 'define') {
        variables[matches[1]] = matches[2];
        if (DEBUG) console.log('define', matches[1], variables[matches[1]]);
      }
    } else if (char === '<') {
      const matches: string[] = parseHeader(line);
      element = {
        type: 'element',
        name: matches[0],
        elements: [],
      };
      elements.push(element);
      if (DEBUG) console.log(`<${element.name}>`);
    } else {
      if (line.includes('$')) line = parseVariables(line, variables);
      if (!element.elements) {
        element.elements = [];
      }
      const attributes: ParseAttribute[] = parseOpcode(line);
      attributes.forEach((attribute: ParseAttribute) => {
        element.elements.push({
          type: 'element',
          name: 'opcode',
          attributes: attribute,
        });
      });
      if (DEBUG) console.log(line, attributes);
    }
    i = iEnd;
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
  parseLoad,
  parseOpcode,
  parseOpcodeObject,
  parseRegions,
  parseSfz,
  parseVariables,
};
