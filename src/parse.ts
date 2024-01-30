import { apiText } from './api';
import { fileReadString } from './file';
import { ParseAttribute, ParseDefinition, ParseHeader, ParseOpcodeObj, ParseVariables } from './types/parse';
import { pathJoin } from './utils';

const DEBUG: boolean = false;
const skipCharacters: string[] = [' ', '\t', '\r', '\n'];
const endCharacters: string[] = ['>', '\r', '\n'];
const variables: any = {};
let fileReadStringMethod = fileReadString;

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
  else file = fileReadStringMethod(pathJoined);
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

function parseOpcodeObject(input: string) {
  const attributes: ParseAttribute[] = parseOpcode(input);
  const properties: ParseOpcodeObj = {};
  attributes.forEach((attribute: ParseAttribute) => {
    if (!isNaN(attribute.value as any)) {
      properties[attribute.name] = Number(attribute.value);
    } else {
      properties[attribute.name] = attribute.value;
    }
  });
  return properties;
}

function parseSetLoader(func: any) {
  fileReadStringMethod = func;
}

async function parseSfz(contents: string, prefix = '') {
  let definition: ParseDefinition = {};
  let header: ParseHeader = { opcode: [] };
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
        if (header.opcode && includeVal.opcode) {
          header.opcode = header.opcode.concat(includeVal.opcode);
        } else {
          definition = Object.assign(definition, includeVal);
        }
        if (DEBUG) console.log('include', includePath, JSON.stringify(includeVal));
      } else if (matches[0] === 'define') {
        variables[matches[1]] = matches[2];
        if (DEBUG) console.log('define', matches[1], variables[matches[1]]);
      }
    } else if (char === '<') {
      const matches: string[] = parseHeader(line);
      header = { opcode: [] };
      if (!definition[matches[0]]) definition[matches[0]] = [];
      definition[matches[0]].push(header);
      if (DEBUG) console.log(`<${matches[0]}>`);
    } else {
      if (line.includes('$')) line = parseVariables(line, variables);
      if (!header.opcode) {
        header.opcode = [];
      }
      const attributes: ParseAttribute[] = parseOpcode(line);
      attributes.forEach((attribute: ParseAttribute) => {
        header.opcode.push({ _attributes: attribute });
      });
      if (DEBUG) console.log(line, attributes);
    }
    i = iEnd;
  }
  if (Object.keys(definition).length > 0) return definition;
  return header;
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
  parseSetLoader,
  parseSfz,
  parseVariables,
};
