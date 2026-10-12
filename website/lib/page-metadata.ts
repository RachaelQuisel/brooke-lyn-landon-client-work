import type { Metadata } from 'next';
import { getSiteContent } from './content-store';
export async function pageMetadata(page:'home'|'program'|'libraries'|'parents'|'book'|'about'|'contact'|'guide',path:string):Promise<Metadata> {
  const site=await getSiteContent(); const seo=site.seo[page];
  return {title:seo.title,description:seo.description,alternates:{canonical:path},robots:page==='guide'?{index:false}:undefined,
    openGraph:{type:'website',siteName:site.name,title:seo.title,description:seo.description,url:path,images:[{url:site.images.og.src,alt:site.images.og.alt}]},twitter:{card:'summary_large_image'}};
}
