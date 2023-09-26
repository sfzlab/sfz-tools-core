let LOGGING_ENABLED: boolean = false;

function log(...args: any) {
  if (LOGGING_ENABLED) {
    console.log(...args);
  }
}

function logEnable(...args: any) {
  LOGGING_ENABLED = true;
}

function logDisable(...args: any) {
  LOGGING_ENABLED = false;
}

function pathGetDirectory(pathItem: string, separator: string = '/'): string {
  return pathItem.substring(0, pathItem.lastIndexOf(separator));
}

function pathGetExt(pathItem: string): string {
  return pathItem.substring(pathItem.lastIndexOf('.') + 1);
}

function pathGetFilename(str: string, separator: string = '/'): string {
  let base: string = str.substring(str.lastIndexOf(separator) + 1);
  if (base.lastIndexOf('.') !== -1) {
    base = base.substring(0, base.lastIndexOf('.'));
  }
  return base;
}

function pathJoin(...segments: any) {
  const parts = segments.reduce((partItems: any, segment: any) => {
    // Replace backslashes with forward slashes
    if (segment.includes('\\')) {
      segment = segment.replace(/\\/g, '/');
    }
    // Remove leading slashes from non-first part.
    if (partItems.length > 0) {
      segment = segment.replace(/^\//, '');
    }
    // Remove trailing slashes.
    segment = segment.replace(/\/$/, '');
    return partItems.concat(segment.split('/'));
  }, []);
  const resultParts = [];
  for (let part of parts) {
    if (part === 'https:') part += '/';
    if (part === '') continue;
    if (part === '.') {
      continue;
    }
    if (part === '..') {
      const partRemoved: string = resultParts.pop();
      if (partRemoved === '') resultParts.pop();
      continue;
    }
    resultParts.push(part);
  }
  return resultParts.join('/');
}

export { log, logEnable, logDisable, pathGetDirectory, pathGetExt, pathGetFilename, pathJoin };
