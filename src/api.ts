import fetch from 'node-fetch';
import { log } from './utils';

async function apiBuffer(url: string): Promise<Buffer> {
  log('⤓', url);
  return fetch(url).then((res: any) => res.buffer());
}

async function apiJson(url: string): Promise<any> {
  log('⤓', url);
  return fetch(url).then((res: any) => res.json());
}

async function apiText(url: string): Promise<string> {
  log('⤓', url);
  return fetch(url).then((res: any) => res.text());
}

export { apiBuffer, apiJson, apiText };
