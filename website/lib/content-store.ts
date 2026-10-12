import { env } from 'cloudflare:workers';
import { cache } from 'react';
import { defaultSite, fieldsByPath, type SiteContent } from './content-model';
import { applyValues, EditorError, MEDIA_PATH, validateEdits } from './editor-policy.mjs';
export function database() { if(!env.DB) throw new Error('Content database unavailable'); return env.DB; }
export function bucket() { if(!env.BUCKET) throw new Error('Photo storage unavailable'); return env.BUCKET; }
export async function loadEdits() {
  const row=await database().prepare('SELECT data, revision, updated_at FROM site_content WHERE id = ?').bind('website').first<{data:string;revision:number;updated_at:string}>();
  return {values:row?JSON.parse(row.data) as Record<string,string>:{},revision:row?.revision??0,updatedAt:row?.updated_at??null};
}
export const getSiteContent=cache(async ():Promise<SiteContent> => applyValues(defaultSite,(await loadEdits()).values));
export async function saveEdits(payload:unknown,userId:string) {
  const edits=validateEdits(payload,fieldsByPath);
  const photos=Object.entries(edits.values).filter(([path,value])=>path.endsWith('.src') && MEDIA_PATH.test(value));
  for(const [,value] of photos) if(!await bucket().head(value.slice('/media/'.length))) throw new EditorError('An uploaded photo is no longer available. Upload it again.');
  const updatedAt=new Date().toISOString();
  const row=await database().prepare('INSERT INTO site_content (id, data, revision, updated_at, updated_by) VALUES (?, ?, 1, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, revision = site_content.revision + 1, updated_at = excluded.updated_at, updated_by = excluded.updated_by WHERE site_content.revision = ? RETURNING revision')
    .bind('website',JSON.stringify(edits.values),updatedAt,userId,edits.revision).first<{revision:number}>();
  if(!row) throw new EditorError('Someone saved a newer version. Reload the editor before saving again.',409);
  return {revision:row.revision,updatedAt};
}
export async function rateLimit(userId:string,action:string,maximum:number) {
  const now=Date.now();
  const row=await database().prepare('INSERT INTO editor_rate_limits (id, window_start, count) VALUES (?, ?, 1) ON CONFLICT(id) DO UPDATE SET window_start = CASE WHEN editor_rate_limits.window_start <= ? THEN excluded.window_start ELSE editor_rate_limits.window_start END, count = CASE WHEN editor_rate_limits.window_start <= ? THEN 1 ELSE editor_rate_limits.count + 1 END RETURNING count')
    .bind(`${userId}:${action}`,now,now-60000,now-60000).first<{count:number}>();
  if(!row || row.count>maximum) throw new EditorError('Please wait a minute before trying again.',429);
}
