import type { SiteContent } from '../lib/content-model';
import { env } from 'cloudflare:workers';
import Photo from './Photo';
import Form from './Form';
import SessionPlan from './SessionPlan';
export type PublicPage = 'home'|'program'|'libraries'|'parents'|'book'|'about'|'contact';
export default function PageContent({page,site}:{page:PublicPage;site:SiteContent}) {
const content = page === 'home' ? site.program : site[page];
const formEndpoint = (page:string) => page==='parents' ? env.PUBLIC_FORMSPREE_PARENT_ENDPOINT||env.PUBLIC_FORMSPREE_ENDPOINT||'' : env.PUBLIC_FORMSPREE_ENDPOINT||'';
return <>
{page === 'home' ? <>
  <section className="home-hero container">
    <div className="hero-copy">
      <p className="eyebrow"><span className="little-rule" aria-hidden="true"></span>{site.home.eyebrow}</p>
      <h1>{site.home.heading[0]}<br />{site.home.heading[1]}<br /><em>{site.home.heading[2]}</em></h1>
      <p className="hero-promise">{site.home.promise}</p>
      <p className="hero-description">{site.home.description}</p>
      <div className="button-row"><a className="button button-primary" href="/libraries/#booking">{site.ui.bookLibrary}</a><a className="button button-outline" href="/parents/#parent-guide">{site.ui.parentGuide}</a></div>
    </div>
    <div className="hero-visual">
      <div className="photo-tab">{site.home.photoBadge}</div>
      <Photo image={site.images.brookeSage} variant="hero-photo" />
      <div className="quote-note"><span className="quote-mark" aria-hidden="true">“</span><p>{site.home.quote.replace(/[“”]/g, '')}</p><span>{site.home.quoteNote}</span></div>
    </div>
  </section>
  <div className="stats-strip"><div className="container stats-inner">{site.home.stats.map(stat => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}<a className="text-link" href="/program/">{site.ui.exploreProgram}</a></div></div>
  <section className="section container">
    <div className="section-intro"><div><p className="eyebrow">{site.home.introEyebrow}</p><h2>{site.home.introTitle}</h2></div><p>{site.home.introText}</p></div>
    <div className="values-grid">{site.home.values.map(value => <article key={value.number}><span className="value-number">{value.number}</span><h3>{value.title}</h3><p>{value.text}</p></article>)}</div>
  </section>
  <section className="library-band"><div className="container library-band-inner"><div><p className="eyebrow">{site.home.libraryEyebrow}</p><h2>{site.home.libraryTitle}</h2><p>{site.home.libraryText}</p><a className="button button-cream" href="/libraries/">{site.ui.bookLibrary}</a></div><ul className="large-checklist">{site.home.libraryDetails.map(detail => <li key={detail}>{detail}</li>)}</ul></div></section>
  <section className="section container home-book"><div className="mini-book">{site.images.book.src ? <img src={site.images.book.src} alt={site.images.book.alt} /> : <><span>{site.images.book.status}</span><strong>{site.book.title}</strong><small>{site.images.book.note}</small></>}</div><div><p className="eyebrow">{site.home.bookEyebrow}</p><h2>{site.home.bookTitle}</h2><p>{site.home.bookText}</p><a className="text-link" href="/book/">{site.ui.aboutBook}</a></div></section>
</> : <>
  <section className="page-heading container"><p className="eyebrow">{content.eyebrow}</p><h1>{content.title}</h1>{'intro' in content && <p className="page-intro">{content.intro}</p>}</section>

  {page === 'program' && <>
    <section className="container section section-first"><h2>{site.program.formatTitle}</h2><ol className="format-grid">{site.program.format.map((part, i) => <li key={part.name}><span>{String(i + 1).padStart(2, '0')}</span><h3>{part.name}</h3><p>{part.text}</p></li>)}</ol><p className="program-note">{site.program.note}</p></section>
    <section className="session-section"><div className="container"><div className="section-heading"><h2>{site.program.planTitle}</h2><p>{site.program.planIntro}</p></div><SessionPlan site={site} /></div></section>
    <section className="container section centered-cta"><h2>{site.program.ctaTitle}</h2><a className="button button-primary" href="/libraries/#booking">{site.ui.bookLibrary}</a></section>
  </>}

  {page === 'libraries' && <>
    <section className="container section section-first two-col library-lists"><div><span className="eyebrow">01</span><h2>{site.libraries.includesTitle}</h2><ul className="checklist">{site.libraries.includes.map((text,i) => <li key={i}>{text}</li>)}</ul></div><div><span className="eyebrow">02</span><h2>{site.libraries.providesTitle}</h2><ul className="checklist">{site.libraries.provides.map((text,i) => <li key={i}>{text}</li>)}</ul></div></section>
    <section className="requirements-section"><div className="container two-col"><div><p className="eyebrow">03</p><h2>{site.libraries.requirementsTitle}</h2><p>{site.libraries.requirementsIntro}</p><p className="small-copy">{site.libraries.dogNote}</p></div><dl className="requirements-list">{site.libraries.requirements.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div></section>
    <section className="container section"><div className="section-heading"><h2>{site.libraries.pricingTitle}</h2><p>{site.libraries.pricingNote}</p></div><div className="pricing-grid">{site.libraries.packages.map((item, index) => <article key={index} className={index === 0 ? 'price-card price-featured' : 'price-card'}><p className="eyebrow">{item.note}</p><h3>{item.label}</h3><p className="price">{item.price}</p><p>{item.detail}</p></article>)}</div><p className="small-copy">{site.libraries.pricingFootnote}</p></section>
    <section className="booking-section" id="booking"><div className="container form-section"><div><p className="eyebrow">{site.ui.bookLibrary}</p><h2>{site.libraries.bookingTitle}</h2><p>{site.libraries.bookingText}</p></div><Form site={site} endpoint={formEndpoint(page)} kind="booking" /></div></section>
  </>}

  {page === 'parents' && <>
    <section className="container section section-first"><h2>{site.parents.phrasesTitle}</h2><div className="phrases-grid">{site.sessions.map(session => <article key={session.number} className="phrase-card"><span className="eyebrow">{String(session.number).padStart(2, '0')} · {session.theme}</span><blockquote>“{session.phrase}”</blockquote><p>{session.parentIdea}.</p></article>)}</div></section>
    <aside className="container parent-reminder"><h2>{site.parents.reminderTitle}</h2><p>{site.parents.reminderText}</p></aside>
    <section className="signup-section" id="parent-guide"><div className="container form-section"><div><p className="eyebrow">{site.parents.signupEyebrow}</p><h2>{site.parents.signupTitle}</h2><p>{site.parents.signupText}</p><a className="button button-outline" href={site.guideUrl}>{site.ui.downloadGuide}</a><p className="small-copy">{site.parents.guideNote}</p></div><Form site={site} endpoint={formEndpoint(page)} kind="signup" /></div></section>
  </>}

  {page === 'book' && <section className="container section section-first book-detail"><Photo image={site.images.book} variant="book-cover" /><div><h2>{site.book.lead}</h2>{site.book.paragraphs.map((text,i) => <p key={i}>{text}</p>)}<div className="book-purchase">{site.bookPurchaseUrl && !site.bookPurchaseUrl.includes('[') ? <a className="button button-primary" href={site.bookPurchaseUrl} rel="noopener noreferrer">{site.ui.buyBook}</a> : <><button className="button button-primary" disabled>{site.ui.buyUnavailable}</button><p className="small-copy">{site.book.purchaseNote}</p></>}</div><blockquote className="pull-quote">{site.book.quote}</blockquote></div></section>}

  {page === 'about' && <><section className="container section section-first about-detail"><div><h2>{site.about.brookeTitle}</h2>{site.about.paragraphs.map((text,i) => <p key={i}>{text}</p>)}</div><Photo image={site.images.brookeSage} /></section><section className="sage-section"><div className="container two-col"><h2>{site.about.sageTitle}</h2><div><p>{site.about.sageText}</p><a className="text-link" href="/program/">{site.ui.exploreProgram}</a></div></div></section><div className="container section centered-cta"><blockquote className="pull-quote">{site.about.quote}</blockquote><a className="button button-primary" href="/libraries/#booking">{site.ui.bookLibrary}</a></div></>}

  {page === 'contact' && <section className="container section section-first form-section contact-section"><div><h2>{site.contact.emailLabel}</h2>{!site.email || site.email.includes('[') ? <><p className="email-placeholder">{site.email}</p><p className="small-copy">{site.contact.emailPending}</p></> : <a className="text-link" href={`mailto:${site.email}`}>{site.email}</a>}<div className="contact-library"><p>{site.contact.libraryNote}</p><a className="text-link" href="/libraries/#booking">{site.contact.libraryLink}</a></div></div><Form site={site} endpoint={formEndpoint(page)} kind="contact" /></section>}
</>}
</>;
}
