import { bucket } from '../../../lib/content-store';
import { MEDIA_PATH } from '../../../lib/editor-policy.mjs';
export async function GET(_request:Request,{params}:{params:Promise<{key:string}>}) {
  const {key}=await params;if(!MEDIA_PATH.test(`/media/${key}`)) return new Response('Not found',{status:404});
  const photo=await bucket().get(key);if(!photo) return new Response('Not found',{status:404});
  const mime=photo.httpMetadata?.contentType;
  if(!['image/jpeg','image/png','image/webp'].includes(mime||'')) return new Response('Not found',{status:404});
  return new Response(photo.body,{headers:{'Content-Type':mime!,'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'ETag':photo.httpEtag}});
}
