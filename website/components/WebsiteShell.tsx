import type { SiteContent } from '../lib/content-model';
import SiteInteractions from './SiteInteractions';
export default function WebsiteShell({site,path,print=false,children}:{site:SiteContent;path:string;print?:boolean;children:React.ReactNode}) {
  const currentPath=path.replace(/\/$/,'')||'/';
  const preview=!site.email||site.email.includes('[')||site.libraries.packages.some(p=>p.price.includes('['));
  return <div className={print?'print-page':undefined}>
    <a className="skip-link" href="#main">{site.ui.skip}</a>
    {!print && <header className="site-header"><div className="container header-inner">
      <a className="brand" href="/" aria-label={site.name}><span className="brand-mark" aria-hidden="true">{site.brandMark}</span><span className="brand-words">{site.brandFirstLine} <em>{site.shortName}</em></span></a>
      <nav className="desktop-nav" aria-label={site.ui.navLabel}>{site.nav.slice(1).map(link=><a key={link.href} href={link.href} aria-current={currentPath===link.href.replace(/\/$/,'')?'page':undefined}>{link.label}</a>)}</nav>
      <details className="mobile-menu"><summary>{site.ui.menu}<span aria-hidden="true">≡</span></summary><nav aria-label={site.ui.navLabel}>{site.nav.map(link=><a key={link.href} href={link.href} aria-current={currentPath===(link.href.replace(/\/$/,'')||'/')?'page':undefined}>{link.label}</a>)}</nav></details>
    </div></header>}
    <main id="main" tabIndex={-1}>{children}</main>
    {!print && <footer className="site-footer">
      <div className="container footer-top"><div><a className="footer-brand" href="/">{site.name}</a><p>{site.ui.footerLabel}</p></div><div className="footer-links"><a href="/libraries/#booking">{site.ui.bookLibrary}</a><a href="/parents/#parent-guide">{site.ui.parentGuide}</a><a href="/contact/">{site.nav[6].label}</a></div></div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {site.ui.copyright}</span>{preview && <span>{site.ui.preview}</span>}</div>
    </footer>}
    <SiteInteractions />
  </div>;
}
