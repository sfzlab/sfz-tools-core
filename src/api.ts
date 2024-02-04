import fetch from 'node-fetch';
import { log } from './utils';

async function apiArrayBuffer(url: string): Promise<ArrayBuffer> {
  log('⤓', url);
  return fetch(url).then((res: any) => res.arrayBuffer());
}

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

export { apiArrayBuffer, apiBuffer, apiJson, apiText };
