interface ParseAttribute {
  name: string;
  value: string;
}

interface ParseHeader {
  elements: ParseOpcode[];
  name: ParseHeaders;
  type: 'element';
}

enum ParseHeaders {
  region = 'region',
  group = 'group',
  control = 'control',
  global = 'global',
  curve = 'curve',
  effect = 'effect',
  master = 'master',
  midi = 'midi',
  sample = 'sample',
}

interface ParseOpcode {
  attributes: ParseAttribute;
  name: 'opcode';
  type: 'element';
}

interface ParseOpcodeObj {
  [name: string]: any;
}

interface ParseVariables {
  [name: string]: string;
}

export { ParseAttribute, ParseHeader, ParseHeaders, ParseOpcode, ParseOpcodeObj, ParseVariables };
