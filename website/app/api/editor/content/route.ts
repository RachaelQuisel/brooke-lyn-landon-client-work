import { authorizeRequest, editorFailure, jsonResponse } from '../../../../lib/editor-auth';
import { loadEdits, saveEdits, rateLimit } from '../../../../lib/content-store';
import { readLimitedBody, EditorError } from '../../../../lib/editor-policy.mjs';
export async function GET(request:Request) {try {authorizeRequest(request);return jsonResponse(await loadEdits());}catch(error){return editorFailure(error);}}
export async function POST(request:Request) {
  try {
    const user=authorizeRequest(request,true);
    if(request.headers.get('content-type')?.split(';')[0]!=='application/json') throw new EditorError('Use the editor to save these changes.',415);
    await rateLimit(user.userId,'save',30);
    const bytes=await readLimitedBody(request,512*1024);
    let payload;try{payload=JSON.parse(new TextDecoder().decode(bytes));}catch{throw new EditorError('Invalid edits. Reload and try again.');}
    return jsonResponse(await saveEdits(payload,user.userId));
  }catch(error){return editorFailure(error);}
}
