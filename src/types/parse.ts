interface ParseAttribute {
  name: string;
  value: string;
}

interface ParseDefinition {
  [header: string]: ParseHeader[];
}

interface ParseHeader {
  opcode?: ParseOpcode[];
}

interface ParseOpcode {
  _attributes: ParseAttribute;
}

interface ParseOpcodeObj {
  [name: string]: any;
}

interface ParseVariables {
  [name: string]: string;
}

export { ParseAttribute, ParseDefinition, ParseHeader, ParseOpcode, ParseOpcodeObj, ParseVariables };
