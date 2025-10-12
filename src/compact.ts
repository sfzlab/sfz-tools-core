import { ParseDefinition, ParseHeader, ParseOpcode } from './types/parse';

type CompactDefinition = Array<[string, Array<[string, string | number]>]>;

function convertJsToCompact(fileJs: ParseDefinition): Array<[string, Array<[string, string | number]>]> {
  const compact: Array<[string, Array<[string, string | number]>]> = [];
  
  fileJs.elements.forEach((header: ParseHeader) => {
    const opcodes: Array<[string, string | number]> = [];
    
    if (header.elements) {
      header.elements.forEach((opcode: ParseOpcode) => {
        const value = !isNaN(opcode.attributes.value as any) 
          ? Number(opcode.attributes.value) 
          : opcode.attributes.value;
        opcodes.push([opcode.attributes.name, value]);
      });
    }
    
    compact.push([header.name, opcodes]);
  });
  
  return compact;
}

function convertCompactToJs(compact: Array<[string, Array<[string, string | number]>]>): ParseDefinition {
  const elements: ParseHeader[] = [];
  
  compact.forEach(([headerName, opcodes]) => {
    const header: ParseHeader = {
      type: 'element',
      name: headerName as any,
      elements: opcodes.map(([name, value]) => ({
        type: 'element',
        name: 'opcode',
        attributes: { name, value: String(value) }
      }))
    };
    elements.push(header);
  });
  
  return { elements };
}

export { CompactDefinition, convertJsToCompact, convertCompactToJs };