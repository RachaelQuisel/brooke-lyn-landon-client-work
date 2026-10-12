import { authorizeRequest, editorFailure, jsonResponse } from '../../../../lib/editor-auth';
import { bucket, rateLimit } from '../../../../lib/content-store';
import { readLimitedBody, detectImageType, EditorError } from '../../../../lib/editor-policy.mjs';
export async function POST(request:Request) {try {
  const user=authorizeRequest(request,true);await rateLimit(user.userId,'upload',10);
  const bytes=await readLimitedBody(request,5*1024*1024);const type=detectImageType(bytes);
  if(!type) throw new EditorError('Choose a JPG, PNG, or WebP photo, up to 5 MB.',415);
  const key=`${crypto.randomUUID()}.${type.extension}`;
  await bucket().put(key,bytes,{httpMetadata:{contentType:type.mime},customMetadata:{uploadedBy:user.userId}});
  return jsonResponse({url:`/media/${key}`});
}catch(error){return editorFailure(error);}}
