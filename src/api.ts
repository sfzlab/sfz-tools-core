import { log } from './utils';

type FetchResponse = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  json: () => Promise<any>;
  text: () => Promise<string>;
};

type FetchLike = (url: string) => Promise<FetchResponse>;

let fetchLoader: Promise<FetchLike> | null = null;

async function getFetch(): Promise<FetchLike> {
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch.bind(globalThis) as FetchLike;
  }
  if (!fetchLoader) {
    const dynamicImport = new Function('return import("node-fetch")');
    fetchLoader = (dynamicImport() as Promise<{ default: FetchLike }>).then((mod) => mod.default);
  }
  return fetchLoader;
}

async function apiArrayBuffer(url: string): Promise<ArrayBuffer> {
  log('⤓', url);
  const fetchFn = await getFetch();
  const response = await fetchFn(url);
  return response.arrayBuffer();
}

async function apiBuffer(url: string): Promise<Buffer> {
  log('⤓', url);
  const responseArrayBuffer: ArrayBuffer = await apiArrayBuffer(url);
  return Buffer.from(responseArrayBuffer);
}

async function apiJson(url: string): Promise<any> {
  log('⤓', url);
  const fetchFn = await getFetch();
  const response = await fetchFn(url);
  return response.json();
}

async function apiText(url: string): Promise<string> {
  log('⤓', url);
  const fetchFn = await getFetch();
  const response = await fetchFn(url);
  return response.text();
}

export { apiArrayBuffer, apiBuffer, apiJson, apiText };
