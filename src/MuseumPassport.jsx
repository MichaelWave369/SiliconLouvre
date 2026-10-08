import React, { useState } from 'react';
import { artworks } from './data/artworks.js';
import { foundingMasters } from './data/foundingMasters.js';
import { visitedCount } from './lib/passport.js';
import './styles/passport.css';

const installedFiles = import.meta.glob('./assets/masters/*.webp', {
  eager: true, query: '?url', import: 'default'
});
const installedMasters = foundingMasters.filter((work) =>
  Boolean(installedFiles['./assets/masters/' + work.file])
);

const rooms = [
  {
    id: 'atrium',
    number: '01',
    title: 'The Virtual Atrium',
    detail: 'A navigable introduction to the opening collection',
    label: 'ENTER ATRIUM',
    status: 'OPEN',
    icon: '◈',
  },
  {
    id: 'collection',
    number: '02',
    title: 'The Stillness That Moves',
    detail: 'Six optical studies and a self-paced Gallery Walk',
    label: 'VIEW THE COLLECTION',
    status: 'OPEN',
    icon: '✳',
  },
  {
    id: 'perception-lab',
    number: '03',
    title: 'The Perception Lab',
    detail: 'Three accessible experiments on contrast, perspective and apparent motion',
    label: 'TRY THE EXPERIMENTS',
    status: 'OPEN',
    icon: '◉',
  },
  {
    id: 'masters',
    number: '04',
    title: 'The Founding Masters',
    detail: 'Original AI-generated artwork, separately archived from the SVG studies',
    label: 'VISIT FOUNDING MASTERS',
    status: installedMasters.length === 6 ? 'OPEN' : 'INSTALLATION PENDING',
    icon: '◇',
  },
  {
    id: 'artists',
    number: '05',
    title: 'The Artist Registry',
    detail: 'Who contributed, how the work was made, and how to propose art',
    label: 'MEET THE ARTISTS',
    status: 'OPEN',
    icon: '⌘',
  },
];

export default function MuseumPassport({ visited, favorites, onOpenArtwork, onClearVisits }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const count = visitedCount(visited, artworks);
  const favoritesCount = artworks.filter((art) => favorites.includes(art.id)).length;

  function reset() {
    onClearVisits();
    setConfirmReset(false);
  }

  return <section className="passport" id="passport" aria-labelledby="passport-title">
    <div className="container">
      <div className="passport__topline">
        <span className="eyebrow"><span className="gold-dot"/> VISITOR EXPERIENCE · NO ACCOUNT REQUIRED</span>
        <span className="eyebrow">THE SILICON LOUVRE / YOUR PERSONAL WALK</span>
      </div>
      <div className="passport__intro">
        <div>
          <span className="display-index">THE MAP & THE MEMORY OF YOUR VISIT</span>
          <h2 id="passport-title">Make this museum<br/><em>your own.</em></h2>
        </div>
        <p>The museum belongs to everyone. Explore its rooms, collect a stamp when you open each work in Exhibition 001, and revisit the art you love. Your passport stays on this device.</p>
      </div>

      <div className="passport__cards">
        <div className="passport__booklet">
          <div className="passport__booklet-head">
            <span>THE SILICON LOUVRE</span>
            <span>VISITOR PASSPORT / 2026</span>
          </div>
          <div className="passport__booklet-title">
            <div className="passport__emblem" aria-hidden="true">◈</div>
            <h3>Your journey<br/><em>through perception.</em></h3>
          </div>
          <div className="passport__stats" aria-live="polite" aria-atomic="true">
            <div><strong>{String(count).padStart(2,'0')} / 06</strong><span>WORKS OPENED</span></div>
            <div><strong>{String(favoritesCount).padStart(2,'0')}</strong><span>FAVORITES SAVED</span></div>
          </div>
          <label className="passport__progress-label" htmlFor="passport-visit-progress">
            EXHIBITION 001 · WORKS OPENED
          </label>
          <progress id="passport-visit-progress" max={artworks.length} value={count}>{count} of {artworks.length}</progress>

          <div className="passport__stamps" role="group" aria-label="Visit stamps for the six optical artworks">
            {artworks.map((art) => {
              const stamped = visited.includes(art.id);
              return <button type="button" key={art.id} onClick={() => onOpenArtwork(art.id)}
                className={'passport__stamp' + (stamped ? ' is-stamped' : '')}
                aria-label={'Open ' + art.title + ', ' + (stamped ? 'already viewed' : 'not yet viewed')}>
                <span className="passport__stamp-symbol" aria-hidden="true">{stamped ? '✳' : '◇'}</span>
                <span className="passport__stamp-number">NO. {art.number}</span>
                <span className="passport__stamp-title">{art.title}</span>
                <span className="passport__stamp-status">{stamped ? 'OPENED' : 'NOT YET OPENED'}</span>
              </button>;
            })}
          </div>
          <div className="passport__complete" role="status">
            {count === artworks.length
              ? 'Your six Exhibition 001 stamps are collected. The works remain open for another visit.'
              : count === 0
                ? 'Your passport begins with the first artwork you open.'
                : 'Keep exploring at your own pace. There is no required order or deadline.'}
          </div>
          <div className="passport__privacy">
            <p>Only this browser stores your visit stamps and favorites. No login, analytics, stress score, or public activity history.</p>
            {!confirmReset
              ? <button type="button" onClick={() => setConfirmReset(true)}>CLEAR VISIT STAMPS</button>
              : <div className="passport__reset" role="group" aria-label="Confirm clearing visit stamps">
                  <span>Clear all six visit stamps on this device? Your favorites stay saved.</span>
                  <button type="button" onClick={reset}>CONFIRM CLEAR</button>
                  <button type="button" onClick={() => setConfirmReset(false)}>CANCEL</button>
                </div>}
          </div>
        </div>
        <div className="passport__map">
          <div className="passport__map-heading">
            <span className="eyebrow">MUSEUM DIRECTORY / CURRENT ROOMS</span>
            <h3>Choose your <em>next room.</em></h3>
          </div>
          <div className="passport__map-list">
            {rooms.map((room) => <a key={room.id} href={'#' + room.id} className="passport__room">
              <span className="passport__room-index">{room.number}</span>
              <span className="passport__room-symbol" aria-hidden="true">{room.icon}</span>
              <span className="passport__room-content">
                <strong>{room.title}</strong>
                <small>{room.detail}</small>
                <span className="passport__room-link">{room.label} ↗</span>
              </span>
              <span className={'passport__room-status' + (room.status !== 'OPEN' ? ' is-pending' : '')}>{room.status}</span>
            </a>)}
          </div>
          <p className="passport__map-note">
            {installedMasters.length}/6 original-image files currently installed in Exhibition 002. That room remains accessible while installation is pending.
          </p>
        </div>
      </div>
    </div>
  </section>;
}
