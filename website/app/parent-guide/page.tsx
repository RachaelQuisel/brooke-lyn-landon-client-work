import { getSiteContent } from '../../lib/content-store';
import { pageMetadata } from '../../lib/page-metadata';
import WebsiteShell from '../../components/WebsiteShell';
export const dynamic='force-dynamic';
export const generateMetadata=()=>pageMetadata('guide','/parent-guide/');
export default async function Guide() {const site=await getSiteContent();return <WebsiteShell site={site} path="/parent-guide/" print>
  <div className="guide-toolbar container"><a className="text-link" href="/parents/#parent-guide">{site.guide.back}</a><button className="button button-primary" id="print-guide">{site.ui.print}</button></div>
  <article className="print-guide"><header><span className="eyebrow">{site.guide.eyebrow}</span><h1>{site.guide.title}</h1><p>{site.guide.intro}</p></header>
    <ol className="guide-phrases">{site.sessions.map(session=><li key={session.number}><div className="guide-number" aria-hidden="true">{String(session.number).padStart(2,'0')}</div><div><h2>{session.parentIdea}</h2><p>“{session.phrase}”</p></div></li>)}</ol>
    <footer><p>{site.guide.footer}</p><span>{site.guide.byline}</span></footer>
  </article>
</WebsiteShell>;}
