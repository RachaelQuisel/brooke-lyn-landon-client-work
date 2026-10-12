import { notFound } from 'next/navigation';
import { getSiteContent } from '../../lib/content-store';
import { pageMetadata } from '../../lib/page-metadata';
import WebsiteShell from '../../components/WebsiteShell';
import PageContent, {type PublicPage} from '../../components/PageContent';
export const dynamic='force-dynamic';
const pages=['program','libraries','parents','book','about','contact'];
async function select(params:Promise<{page:string}>) {const {page}=await params;if(!pages.includes(page))notFound();return page as Exclude<PublicPage,'home'>;}
export async function generateMetadata({params}:{params:Promise<{page:string}>}) {const page=await select(params);return pageMetadata(page,`/${page}/`);}
export default async function Page({params}:{params:Promise<{page:string}>}) {const page=await select(params);const site=await getSiteContent();return <WebsiteShell site={site} path={`/${page}/`}><PageContent site={site} page={page} /></WebsiteShell>;}
