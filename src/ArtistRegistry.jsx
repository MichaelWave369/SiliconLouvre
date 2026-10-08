import React from 'react';
import { artists, futureResidencies, registryPolicy } from './data/artistRegistry.js';
import { publishedArtists } from './lib/artistRegistry.js';
import './styles/registry.css';

function FoundingMonogram({ initials }) {
  return <div className="registry-monogram" aria-hidden="true">
    <div className="registry-monogram__outer">
      <div className="registry-monogram__inner">
        <span>{initials}</span>
        <span className="registry-monogram__fine">EST. 2026</span>
      </div>
    </div>
    <span className="registry-monogram__corner registry-monogram__corner--tl"/>
    <span className="registry-monogram__corner registry-monogram__corner--br"/>
    <div className="registry-monogram__lower">CURATED HUMAN + AI COLLABORATION</div>
  </div>;
}

function Profile({ artist }) {
  return <article className="artist-profile" id={'artist-' + artist.id}>
    <div className="artist-profile__art"><FoundingMonogram initials={artist.initials}/></div>
    <div className="artist-profile__content">
      <div className="artist-profile__head">
        <span className="eyebrow">PROFILE / {artist.id.toUpperCase()}</span>
        <span className="artist-profile__approved"><span aria-hidden="true">◇</span> CURATOR-APPROVED</span>
      </div>
      <h3>{artist.name}</h3>
      <p className="artist-profile__subtitle">{artist.role} · Since {artist.since}</p>
      <p className="artist-profile__headline">{artist.headline}</p>
      <p className="artist-profile__statement">{artist.statement}</p>
      <div className="artist-profile__tags" aria-label="Creative practices">
        {artist.practices.map((practice) => <span key={practice}>{practice}</span>)}
      </div>
      <details className="artist-profile__record">
        <summary>EXPLORE FULL CONTRIBUTION RECORD <span aria-hidden="true">↗</span></summary>
        <div className="artist-profile__record-body">
          <p>{artist.bio}</p>
          <h4>Who contributed what</h4>
          <dl>{artist.creditLines.map((credit) => <div key={credit.contributor}>
            <dt>{credit.contributor}</dt><dd>{credit.activity}</dd>
          </div>)}</dl>
          <p className="artist-profile__verification">{artist.verification}</p>
        </div>
      </details>
      <div className="artist-profile__bottom">
        <a href="#collection">EXHIBITION 001 <span aria-hidden="true">↗</span></a>
        <a href="#masters">EXHIBITION 002 <span aria-hidden="true">↗</span></a>
        <a href={artist.repositoryUrl} target="_blank" rel="noreferrer noopener">SOURCE & CREDITS <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>;
}

export default function ArtistRegistry() {
  const liveArtists = publishedArtists(artists);
  return <section className="artist-registry" id="artists" aria-labelledby="artists-title">
    <div className="container">
      <div className="artist-registry__eyebrow">
        <span className="eyebrow"><span className="gold-dot"/> PERMANENT RECORD / VOL. {registryPolicy.edition}</span>
        <span className="eyebrow">THE SILICON LOUVRE · ARTIST REGISTRY</span>
      </div>
      <div className="artist-registry__hero">
        <div>
          <span className="display-index">THE PEOPLE, SYSTEMS & COLLABORATIONS BEHIND THE ART</span>
          <h2 id="artists-title">Art has a story.<br/><em>So do its makers.</em></h2>
        </div>
        <div className="artist-registry__intro">
          <p>{registryPolicy.subtitle}</p>
          <p>{registryPolicy.curatorNote}</p>
        </div>
      </div>
      <div className="artist-registry__ribbon" aria-label="Registry status">
        <span><strong>{String(liveArtists.length).padStart(2, '0')}</strong> CURATED PROFILE{liveArtists.length === 1 ? '' : 'S'}</span>
        <span><strong>02</strong> FOUNDING EXHIBITIONS</span>
        <span><strong>01</strong> OPEN REGISTRY EDITION</span>
      </div>
      <div className="artist-registry__section-title">
        <div><span className="eyebrow">THE REGISTRY / APPROVED RECORDS</span><h3>Founding <em>collaborations.</em></h3></div>
        <span className="artist-registry__section-side">A RECORD OF CREATIVE CONTRIBUTION</span>
      </div>
      <div className="artist-registry__profiles">
        {liveArtists.map((artist) => <Profile artist={artist} key={artist.id}/>)}
      </div>
      <div className="artist-registry__future">
        <div className="artist-registry__future-top">
          <div><span className="eyebrow">TOMORROW'S COLLECTION</span><h3>More voices.<br/><em>More ways to create.</em></h3></div>
          <p>Artist residencies and public submissions are planned. The museum will review permissions, provenance and attribution before any new artist or artwork goes on display.</p>
        </div>
        <div className="artist-registry__programs">
          {futureResidencies.map((program) => <article key={program.id}>
            <div className="artist-registry__program-head"><span>{program.number}</span><span>{program.status.toUpperCase()}</span></div>
            <h4>{program.title}</h4><p>{program.description}</p>
          </article>)}
        </div>
      </div>
      <div className="artist-registry__proposal">
        <div><span className="eyebrow">THE NEXT CHAPTER</span><h3>Have a vision worth <em>sharing?</em></h3>
          <p>Human artists and teams working with AI are welcome to propose an exhibition through our public, curator-reviewed GitHub process. Proposing is not automatic acceptance.</p>
        </div>
        <a className="button-gold" href={registryPolicy.proposalUrl} target="_blank" rel="noopener noreferrer">
          PROPOSE AN EXHIBITION <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </section>;
}
