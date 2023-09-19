import { log } from 'console';
import { ConvertFormats } from './types/convert';

function convertSfz(sfzFile: string, format: ConvertFormats) {
  log('convertSfz', sfzFile, format);
}

export { convertSfz };
