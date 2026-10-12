import { getChatGPTUser, chatGPTSignInPath, chatGPTSignOutPath } from '../chatgpt-auth';
import { allowedEditorEmails } from '../../lib/editor-auth';
import { isEditor } from '../../lib/editor-policy.mjs';
import { loadEdits } from '../../lib/content-store';
import { contentFields, pageGroups } from '../../lib/content-model';
import Editor from '../../components/Editor';
export const dynamic='force-dynamic';
export const metadata={title:'Edit Reading with Sage',robots:{index:false,follow:false}};
export default async function EditPage() {
  const user=await getChatGPTUser();
  if(!user)return <main className="editor-signin"><p className="eyebrow">READING WITH SAGE</p><h1>Sign in to edit</h1><p>Use the ChatGPT account that has editing access to this website.</p><a className="button button-primary" href={chatGPTSignInPath('/edit')} target="_top">Sign in with ChatGPT</a><a className="text-link" href="/">Back to the website</a></main>;
  if(!isEditor(user,allowedEditorEmails()))return <main className="editor-signin"><h1>Editing access required</h1><p>This account can’t edit the website. Sign in with the account that has editing access.</p><a className="button button-primary" href={chatGPTSignOutPath('/edit')} target="_top">Use a different account</a><a className="text-link" href="/">Back to the website</a></main>;
  return <Editor initial={await loadEdits()} fields={contentFields} groups={pageGroups} email={user.email} />;
}
