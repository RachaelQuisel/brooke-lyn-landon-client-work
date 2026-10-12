import { env } from 'cloudflare:workers';
import { isEditor, isSameOrigin, EditorError } from './editor-policy.mjs';
export function allowedEditorEmails() {
  return (env.EDITOR_EMAILS||process.env.EDITOR_EMAILS||'').split(',').map((email:string)=>email.trim().toLowerCase()).filter(Boolean);
}
export function authorizeRequest(request:Request,write=false) {
  const user={userId:request.headers.get('oai-authenticated-user-id'),email:request.headers.get('oai-authenticated-user-email')};
  if(!isEditor(user,allowedEditorEmails())) throw new EditorError('Sign in with an account that has editing access.',user.userId?403:401);
  if(write && !isSameOrigin(request)) throw new EditorError('Reload the editor and try again.',403);
  return {userId:user.userId!,email:user.email!};
}
export function jsonResponse(value:unknown,status=200) {
  return Response.json(value,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
export function editorFailure(error:unknown) {
  if(error instanceof EditorError) return jsonResponse({error:error.message},error.status);
  console.error('Editor operation failed',error instanceof Error?error.name:'UnknownError');
  return jsonResponse({error:'Your changes could not be saved. Keep this page open and try again.'},500);
}
