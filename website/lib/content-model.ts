import { site } from '../src/content/site';
export type SiteContent = typeof site;
export type Field = {path:string; label:string; value:string; group:string; kind:'text'|'image'|'email'|'url'};
export const pageGroups = [
  {id:'home',label:'Home',url:'/'}, {id:'program',label:'The program',url:'/program/'},
  {id:'libraries',label:'For libraries',url:'/libraries/'}, {id:'parents',label:'For parents',url:'/parents/'},
  {id:'book',label:'The book',url:'/book/'}, {id:'about',label:'About',url:'/about/'},
  {id:'contact',label:'Contact',url:'/contact/'}, {id:'guide',label:'Parent guide',url:'/parent-guide/'},
  {id:'sessions',label:'Six sessions',url:'/program/'}, {id:'shared',label:'Site-wide text',url:'/'},
];
const words=(value:string)=>value.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,c=>c.toUpperCase());
const fields:Field[]=[];
function walk(value:unknown,path:string,group:string,label:string) {
  if(typeof value==='string') { fields.push({path,value,group,label,kind:path.endsWith('.src')?'image':path==='email'?'email':path==='bookPurchaseUrl'?'url':'text'}); return; }
  if(Array.isArray(value)) value.forEach((item,i)=>walk(item,`${path}.${i}`,group,`${label?label+' · ':''}${path==='sessions'?'Session':'Item'} ${i+1}`));
  else if(value && typeof value==='object') Object.entries(value).forEach(([key,item])=>walk(item,`${path}.${key}`,group,label?`${label} · ${words(key)}`:words(key)));
}
for(const group of pageGroups.filter(g=>g.id!=='shared')) {
  walk(site[group.id as keyof SiteContent],group.id,group.id,'');
  if(group.id in site.seo) walk(site.seo[group.id as keyof typeof site.seo],`seo.${group.id}`,group.id,'Search preview');
}
for(const key of ['name','brandFirstLine','brandMark','shortName','tagline','email','bookPurchaseUrl'] as const) walk(site[key],key,'shared',words(key));
walk(site.ui,'ui','shared','Labels');
site.nav.forEach((link,i)=>walk(link.label,`nav.${i}.label`,'shared',`Navigation · ${link.label}`));
walk(site.images,'images','photos','');
for(const [key,value] of Object.entries(site.forms)) {
  if(typeof value==='string') walk(value,`forms.${key}`,'shared',`Forms · ${words(key)}`);
  else {
    const group=key==='booking'?'libraries':key==='signup'?'parents':'contact';
    for(const property of ['submit','success'] as const) walk(value[property],`forms.${key}.${property}`,group,`Form · ${words(property)}`);
    value.fields.forEach((field,i)=> {
      walk(field.label,`forms.${key}.fields.${i}.label`,group,`Form · ${field.label}`);
      if('hint' in field) walk(field.hint,`forms.${key}.fields.${i}.hint`,group,`Form · ${field.label} hint`);
    });
  }
}
export const contentFields=fields;
export const fieldsByPath=new Map(fields.map(field=>[field.path,field]));
export const defaultSite=site;
