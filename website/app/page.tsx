import { getSiteContent } from '../lib/content-store';
import { pageMetadata } from '../lib/page-metadata';
import WebsiteShell from '../components/WebsiteShell';
import PageContent from '../components/PageContent';
export const dynamic='force-dynamic';
export const generateMetadata=()=>pageMetadata('home','/');
export default async function Home() {const site=await getSiteContent();return <WebsiteShell site={site} path="/"><PageContent site={site} page="home" /></WebsiteShell>;}
