interface CompactParseAttribute {
  name: string;
  value: string;
}

interface CompactParseDefinition {
  [header: string]: CompactParseHeader[];
}

interface CompactParseHeader {
  opcode: CompactParseOpcode[];
}

interface CompactParseOpcode {
  _attributes: CompactParseAttribute;
}

interface CompactParseOpcodeObj {
  [name: string]: any;
}

interface CompactParseVariables {
  [name: string]: string;
}

export {
  CompactParseAttribute,
  CompactParseDefinition,
  CompactParseHeader,
  CompactParseOpcode,
  CompactParseOpcodeObj,
  CompactParseVariables,
};
