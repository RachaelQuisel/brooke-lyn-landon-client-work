import type { SiteContent } from '../lib/content-model';
export default function SessionPlan({site}:{site:SiteContent}) { return <>
<div className="sessions-mobile">
  {site.sessions.map(session => <article key={session.number} className="session-card">
    <span className="eyebrow">{site.ui.sessionLabel} {String(session.number).padStart(2, '0')}</span>
    <h3>{session.theme}</h3>
    <p className="session-book"><cite>{session.book}</cite><span>{session.author}</span></p>
    <dl>
      <div><dt>{site.ui.animal}</dt><dd>{session.animal}</dd></div>
      <div><dt>{site.ui.practice}</dt><dd>{session.practice}</dd></div>
      <div><dt>{site.ui.parentIdea}</dt><dd>{session.parentIdea}</dd></div>
    </dl>
    <div className="session-phrase"><span>{site.ui.trySaying}</span><p>“{session.phrase}”</p></div>
  </article>)}
</div>
<div className="sessions-desktop">
  <table>
    <caption className="sr-only">{site.ui.sessionsCaption}</caption>
    <thead><tr><th scope="col">{site.ui.sessionLabel} / {site.ui.theme}</th><th scope="col">{site.ui.bookLabel}</th><th scope="col">{site.ui.animal}</th><th scope="col">{site.ui.practice}</th><th scope="col">{site.ui.parentIdea}</th><th scope="col">{site.ui.trySaying}</th></tr></thead>
    <tbody>{site.sessions.map(session => <tr key={session.number}>
      <th scope="row"><span className="table-number">{String(session.number).padStart(2, '0')}</span>{session.theme}</th>
      <td><cite>{session.book}</cite><span className="table-author">{session.author}</span></td>
      <td>{session.animal}</td><td>{session.practice}</td><td>{session.parentIdea}</td><td className="table-phrase">“{session.phrase}”</td>
    </tr>)}</tbody>
  </table>
</div>
</>; }
