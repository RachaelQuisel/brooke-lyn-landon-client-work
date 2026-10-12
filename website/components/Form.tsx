'use client';
import { useRef, useState } from 'react';
import type { SiteContent } from '../lib/content-model';
export default function Form({site,kind,endpoint=''}:{site:SiteContent;kind:'booking'|'contact'|'signup';endpoint?:string}) {
  const data=site.forms[kind];const configured=/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
  const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [error,setError]=useState(false);const status=useRef<HTMLParagraphElement>(null);
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();if(!configured||busy)return;const form=event.currentTarget;if(!form.reportValidity())return;
    setBusy(true);setMessage('');setError(false);const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
    try {const response=await fetch(endpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal});if(!response.ok){setError(true);setMessage(site.forms.error);}else{setMessage(data.success);form.reset();}}
    catch(e){setError(true);setMessage(e instanceof DOMException&&e.name==='AbortError'?site.forms.timeout:site.forms.networkError);}
    finally{clearTimeout(timer);setBusy(false);status.current?.focus();}
  }
  return <form className="sage-form" id={data.id} action={configured?endpoint:undefined} method="POST" onSubmit={submit} aria-busy={busy||undefined}>
    <input type="hidden" name="_subject" value={data.subject} /><input type="hidden" name="form_type" value={kind} />
    <div className="honeypot" aria-hidden="true"><input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-label={site.ui.honeypot} /></div>
    {!configured&&<p className="form-notice" id={`${data.id}-notice`}>{site.forms.unavailable}</p>}<p className="form-small">{site.ui.required}</p>
    <fieldset disabled={!configured} aria-describedby={!configured?`${data.id}-notice`:undefined}>
      <div className={kind==='booking'?'form-fields form-fields-two':'form-fields'}>{data.fields.map(field=><div key={field.name} className={field.type==='textarea'?'field field-wide':'field'}>
        <label htmlFor={`${data.id}-${field.name}`}>{field.label}{field.required&&<span aria-hidden="true"> *</span>}</label>
        {field.type==='textarea'?<textarea id={`${data.id}-${field.name}`} name={field.name} required={field.required} rows={4} maxLength={4000} />:
          <input id={`${data.id}-${field.name}`} name={field.name} type={field.type} required={field.required} autoComplete={'autocomplete' in field?field.autocomplete:undefined} min={'min' in field?field.min:undefined} max={'max' in field?field.max:undefined} maxLength={field.type==='number'?undefined:254} aria-describedby={'hint' in field?`${data.id}-${field.name}-hint`:undefined} />}
        {'hint' in field&&<span className="field-hint" id={`${data.id}-${field.name}-hint`}>{field.hint}</span>}
      </div>)}</div>
      {kind==='signup'&&<label className="consent"><input type="checkbox" name="parent_email_consent" value="yes" required /><span>{site.forms.consent} *</span></label>}
      <p className="form-small">{kind==='signup'?site.forms.signupPrivacy:site.forms.privacy}</p><button className="button button-primary" type="submit" disabled={busy}>{busy?site.forms.pending:data.submit}</button>
    </fieldset>
    <p ref={status} className={error?'form-status is-error':'form-status'} role="status" aria-live="polite" tabIndex={-1}>{message}</p>
    {kind==='signup'&&<a className="text-link" href={site.guideUrl}>{site.ui.downloadGuide}</a>}
  </form>;
}
