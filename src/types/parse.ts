interface ParseAttribute {
  name: string;
  value: string;
}

interface ParseDefinition {
  declaration?: {
    attributes: {
      version: string;
    };
  };
  elements?: ParseHeader[];
  sfz?: ParseCompactHeader[];
}

interface ParseCompactOpcode {
  [name: string]: string | number;
}

interface ParseCompactHeader {
  [name: string]: ParseCompactOpcode[];
}

interface ParseHeader {
  elements: ParseOpcode[];
  name: ParseHeaderNames;
  type: 'element';
}

enum ParseHeaderNames {
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

export {
  ParseAttribute,
  ParseCompactHeader,
  ParseCompactOpcode,
  ParseDefinition,
  ParseHeader,
  ParseHeaderNames,
  ParseOpcode,
  ParseOpcodeObj,
  ParseVariables,
};
