'use client';
import { useEffect, useState } from 'react';
import type { Field } from '../lib/content-model';
type Group={id:string;label:string;url:string};
type Snapshot={values:Record<string,string>;revision:number;updatedAt:string|null};
const photos=[{id:'brookeSage',label:'Brooke & Sage',description:'Used on the home and About pages.'},{id:'book',label:'Book cover',description:'Used on the home and book pages.'},{id:'og',label:'Social sharing image',description:'Used when someone shares a page link.'}];
export default function Editor({initial,fields,groups,email}:{initial:Snapshot;fields:Field[];groups:Group[];email:string}) {
  const [values,setValues]=useState(initial.values);const [savedValues,setSavedValues]=useState(initial.values);
  const [revision,setRevision]=useState(initial.revision);const [group,setGroup]=useState('home');
  const [busy,setBusy]=useState(false);const [uploading,setUploading]=useState('');const [status,setStatus]=useState('');const [failed,setFailed]=useState(false);
  const [ready,setReady]=useState(false);
  useEffect(()=>setReady(true),[]);
  const dirty=JSON.stringify(values)!==JSON.stringify(savedValues);
  useEffect(()=>{if(!dirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  const fieldValue=(field:Field)=>values[field.path]??field.value;
  const byPath=(path:string)=>fields.find(field=>field.path===path)!;
  function change(path:string,value:string) {setValues(current=>({...current,[path]:value}));setStatus('');setFailed(false);}
  async function upload(id:string,file?:File) {
    if(!file)return;if(file.size>5*1024*1024){setStatus('Choose a photo smaller than 5 MB.');setFailed(true);return;}
    setUploading(id);setStatus('Uploading photo…');setFailed(false);
    try {const response=await fetch('/api/editor/upload',{method:'POST',headers:{'Content-Type':file.type||'application/octet-stream'},body:file});const result=await response.json() as {url?:string;error?:string};if(!response.ok||typeof result.url!=='string')throw new Error(result.error||'The photo could not be uploaded.');const photoUrl=result.url;setValues(current=>({...current,[`images.${id}.src`]:photoUrl}));setStatus('Photo uploaded. Save changes to show it on the website.');}
    catch(error){setStatus(error instanceof Error?error.message:'The photo could not be uploaded. Try again.');setFailed(true);}
    finally{setUploading('');}
  }
  async function save(event:React.FormEvent) {
    event.preventDefault();setBusy(true);setStatus('Saving changes…');setFailed(false);
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),30000);
    try {const response=await fetch('/api/editor/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision,values}),signal:controller.signal});const result=await response.json() as {revision?:number;error?:string};if(!response.ok||typeof result.revision!=='number')throw new Error(result.error||'Your changes could not be saved.');setRevision(result.revision);setSavedValues(values);setStatus('Saved. Your changes are live on the website.');}
    catch(error){setStatus(error instanceof Error?error.message:'Could not save. Your entries are still here. Try again.');setFailed(true);}
    finally{clearTimeout(timer);setBusy(false);}
  }
  const currentGroup=groups.find(item=>item.id===group);
  function textField(field:Field) {const value=fieldValue(field);const id=`edit-${field.path}`;return <div className="editor-field" key={field.path}><label htmlFor={id}>{field.label}</label>{field.kind==='text'&&(value.length>100||/paragraph|description|intro|text|note|privacy/i.test(field.path))?<textarea id={id} rows={3} maxLength={12000} value={value} onChange={e=>change(field.path,e.target.value)} />:<input id={id} type="text" maxLength={12000} value={value} onChange={e=>change(field.path,e.target.value)} />}</div>;}
  return <div className="editor-app">
    <header className="editor-header"><a className="editor-brand" href="/">Reading with Sage</a><span>{email}</span><a href="/signout-with-chatgpt?return_to=%2Fedit" target="_top">Sign out</a></header>
    <main className="editor-shell"><div className="editor-intro"><p className="eyebrow">YOUR WEBSITE</p><h1>Edit Reading with Sage</h1><p>Update the words and photos. Changes appear on the website when you save.</p></div>
      <form onSubmit={save}>
        <div className="editor-actions"><div role="status" aria-live="polite" className={failed?'editor-status editor-error':'editor-status'}>{!ready?'Loading editor…':status|| (dirty?'You have unsaved changes.':'Ready to edit.')}</div><button className="button button-primary" disabled={!ready||!dirty||busy||Boolean(uploading)} type="submit">{busy?'Saving…':'Save changes'}</button></div>
        <fieldset disabled={!ready||busy||Boolean(uploading)}>
          <div className="editor-controls"><label htmlFor="editor-section">Choose a page or photos<select id="editor-section" value={group} onChange={e=>setGroup(e.target.value)}><option value="photos">Photos</option>{groups.map(item=><option value={item.id} key={item.id}>{item.label}</option>)}</select></label>{group!=='photos'&&<a className="text-link" href={currentGroup?.url||'/'} target="_blank" rel="noopener">View live page ↗</a>}</div>
          {group==='photos'?<div className="editor-photos">{photos.map(photo=>{const src=fieldValue(byPath(`images.${photo.id}.src`));return <section className="editor-photo" key={photo.id}><h2>{photo.label}</h2><p>{photo.description}</p><div className="editor-photo-preview">{src?<img src={src} alt={fieldValue(byPath(`images.${photo.id}.alt`))} />:<span>No photo yet</span>}</div><label className="editor-upload">Upload {photo.label} photo<input aria-label={`Upload ${photo.label} photo`} type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const file=e.target.files?.[0];e.target.value='';void upload(photo.id,file);}} /></label><p className="editor-hint">JPG, PNG, or WebP · Up to 5 MB</p>{textField({...byPath(`images.${photo.id}.alt`),label:'Photo description (for accessibility)'})}{fields.filter(field=>field.path.startsWith(`images.${photo.id}.`)&&field.kind!=='image'&&!field.path.endsWith('.alt')).map(field=>textField({...field,label:field.label.replace(/^.*? · /,'')}))}<button type="button" className="editor-remove" onClick={()=>change(`images.${photo.id}.src`,byPath(`images.${photo.id}.src`).value)}>{photo.id==='og'?'Restore default image':'Remove photo'}</button></section>;})}</div>:<section className="editor-text"><h2>{currentGroup?.label}</h2>{group==='sessions'&&<p className="editor-hint">These words also appear on the Parents page and printable parent guide.</p>}<div className="editor-fields">{fields.filter(field=>field.group===group&&field.kind!=='image').map(textField)}</div></section>}
        </fieldset>
      </form>
    </main>
  </div>;
}
