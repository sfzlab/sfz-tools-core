interface ParseAttribute {
  name: string;
  value: string;
}

interface ParseVariables {
  [name: string]: string;
}

export { ParseAttribute, ParseVariables };
