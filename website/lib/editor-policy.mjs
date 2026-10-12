export class EditorError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export const MEDIA_PATH = /^\/media\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.(jpg|png|webp)$/;
export function isEditor(user, allowed) {
  return Boolean(user?.userId && user?.email && allowed.includes(user.email.trim().toLowerCase()));
}
export function isSameOrigin(request) {
  return request.headers.get('origin') === new URL(request.url).origin && request.headers.get('sec-fetch-site') !== 'cross-site';
}
/** @returns {{revision:number, values:Record<string,string>}} */
export function validateEdits(payload, fields) {
  if (!payload || !Number.isSafeInteger(payload.revision) || payload.revision < 0 || !payload.values || typeof payload.values !== 'object' || Array.isArray(payload.values)) throw new EditorError('Invalid edits. Reload the editor and try again.');
  for (const [path,value] of Object.entries(payload.values)) {
    const field=fields.get(path);
    if (!field || path.split('.').some(p=>['__proto__','prototype','constructor'].includes(p)) || typeof value !== 'string' || value.length>12000) throw new EditorError('One of the text fields is invalid or too long.');
    if(field.kind==='image' && value!==field.value && value!=='' && !MEDIA_PATH.test(value)) throw new EditorError('Choose an uploaded photo.');
    if(path==='images.og.src' && !value) throw new EditorError('Keep a sharing image or restore the original.');
    if(field.kind==='email' && value!==field.value && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new EditorError('Enter a valid contact email.');
    if(field.kind==='url' && value!==field.value && value) {
      let url; try { url=new URL(value); } catch { throw new EditorError('Enter a full https:// book link.'); }
      if(url.protocol!=='https:' || url.username || url.password) throw new EditorError('Book links must use https://.');
    }
  }
  return {revision:payload.revision,values:payload.values};
}
export function detectImageType(bytes) {
  const starts=(values)=>values.every((value,index)=>bytes[index]===value);
  if(bytes.length>=33 && starts([137,80,78,71,13,10,26,10]) && String.fromCharCode(...bytes.subarray(12,16))==='IHDR') return {mime:'image/png',extension:'png'};
  if(bytes.length>=4 && starts([255,216,255]) && bytes.at(-2)===255 && bytes.at(-1)===217) return {mime:'image/jpeg',extension:'jpg'};
  if(bytes.length>=20 && String.fromCharCode(...bytes.subarray(0,4))==='RIFF' && String.fromCharCode(...bytes.subarray(8,12))==='WEBP') {
    const size=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(4,true);
    if(size===bytes.length-8) return {mime:'image/webp',extension:'webp'};
  }
  return null;
}
export async function readLimitedBody(request, limit) {
  const length=request.headers.get('content-length');
  if(length && Number(length)>limit) throw new EditorError('This file or request is too large.',413);
  if(!request.body) return new Uint8Array();
  const reader=request.body.getReader(); const chunks=[]; let size=0;
  try {
    while(true) {
      const {done,value}=await reader.read(); if(done) break;
      size+=value.byteLength;
      if(size>limit) { await reader.cancel(); throw new EditorError('This file or request is too large.',413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes=new Uint8Array(size); let offset=0;
  for(const chunk of chunks) { bytes.set(chunk,offset); offset+=chunk.byteLength; }
  return bytes;
}
export function applyValues(original,values) {
  const result=structuredClone(original);
  for(const [path,value] of Object.entries(values)) {
    const parts=path.split('.');
    if(parts.some(p=>['__proto__','prototype','constructor'].includes(p))) throw new EditorError('Invalid content field.');
    let target=result;
    for(const part of parts.slice(0,-1)) {
      if(!Object.hasOwn(target,part)) throw new EditorError('Invalid content field.');
      target=target[part];
    }
    if(!Object.hasOwn(target,parts.at(-1))) throw new EditorError('Invalid content field.');
    target[parts.at(-1)]=value;
  }
  return result;
}
