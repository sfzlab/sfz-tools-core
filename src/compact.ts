import { ParseDefinition, ParseHeader, ParseOpcode } from './types/parse';

type CompactDefinition = [string, [string, string | number][]][];

function convertJsToCompact(fileJs: ParseDefinition): [string, [string, string | number][]][] {
  const compact: [string, [string, string | number][]][] = [];

  fileJs.elements.forEach((header: ParseHeader) => {
    const opcodes: [string, string | number][] = [];

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

function convertCompactToJs(compact: [string, [string, string | number][]][]): ParseDefinition {
  const elements: ParseHeader[] = [];

  compact.forEach(([headerName, opcodes]) => {
    const header: ParseHeader = {
      type: 'element',
      name: headerName as any,
      elements: opcodes.map(([name, value]) => ({
        type: 'element',
        name: 'opcode',
        attributes: { name, value: String(value) },
      })),
    };
    elements.push(header);
  });

  return { elements };
}

export { CompactDefinition, convertJsToCompact, convertCompactToJs };
