import React from 'react';
import events from './data/curatorialEvents.json' with {type:'json'};
import { recentPublicDecisions } from './lib/curatorialLifecycle.js';
import './styles/curatorialLedger.css';

const labels={
  publish:'Exhibition opened',
  revise:'Exhibition revised',
  withdraw:'Work withdrawn',
};
const changeUrl='https://github.com/MichaelWave369/SiliconLouvre/issues/new?template=curatorial-change.yml';

export default function CuratorialLedger() {
  const recent=recentPublicDecisions(events,6);
  return <aside className="curator-ledger" id="curatorial-ledger" aria-labelledby="curator-ledger-title">
    <div className="curator-ledger__heading">
      <div>
        <span className="eyebrow">OPEN CURATION / DECISION RECORD</span>
        <h3 id="curator-ledger-title">Art deserves<br/><em>accountability.</em></h3>
      </div>
      <p>The museum records when reviewed artworks enter the collection, change, or leave. Publication decisions remain human-controlled, and history is reviewed before release.</p>
    </div>
    {recent.length ? <ol className="curator-ledger__events" aria-label="Recent public curatorial decisions">
      {recent.map(event=><li key={event.id} className="curator-ledger__event">
        <span className="curator-ledger__event-icon" aria-hidden="true">{event.action==='publish'?'✳':event.action==='revise'?'◇':'−'}</span>
        <div>
          <span className="curator-ledger__event-label">{labels[event.action]} · {event.date}</span>
          <strong>{event.action==='withdraw'?'Previously exhibited artwork':event.workId.replaceAll('-',' ')}</strong>
          <p>{event.action==='withdraw'
            ? 'This work has been removed from the current exhibition. Its image and creator details are no longer displayed here.'
            : event.note}</p>
        </div>
        <span className="curator-ledger__revision">REV {String(event.revision).padStart(2,'0')}</span>
      </li>)}
    </ol> : <div className="curator-ledger__empty">
      <span aria-hidden="true">◇</span>
      <div><strong>The ledger begins with the first reviewed exhibition.</strong>
        <p>No publication, revision, or withdrawal decisions have been recorded yet. We won't create imaginary records for an empty gallery.</p></div>
    </div>}
    <div className="curator-ledger__footer">
      <p>Need to request a correction or withdrawal? Proposals are reviewed by the curator, and nothing changes automatically. Don't include private identity evidence in a public GitHub issue.</p>
      <a href={changeUrl} rel="noopener noreferrer" target="_blank">REQUEST A CORRECTION OR WITHDRAWAL ↗</a>
    </div>
  </aside>;
}
