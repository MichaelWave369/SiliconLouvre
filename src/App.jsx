import React, { useEffect, useMemo, useRef, useState } from 'react';
import IllusionArt from './art/IllusionArt.jsx';
import { artworks, categories, exhibition, attribution } from './data/artworks.js';

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>;
}

function Brand({ footer = false }) {
  return <a href="#top" className={'brand' + (footer ? ' brand--footer' : '')} aria-label="The Silicon Louvre, back to top">
    <span className="brand__mark" aria-hidden="true"><span/></span>
    <span className="brand__wordmark">THE SILICON<br/><strong>LOUVRE</strong></span>
  </a>;
}

function WorkCard({ artwork, isSaved, onSave, onOpen }) {
  return <article className="work-card" id={'work-card-' + artwork.id}>
    <button className="work-card__image" onClick={() => onOpen(artwork.id)}
      aria-label={'View ' + artwork.title + ' artwork and details'}>
      <IllusionArt variant={artwork.variant} title={artwork.title + ', a static optical illusion'}/>
      <span className="work-card__view">VIEW ARTWORK <Arrow diagonal/></span>
    </button>
    <div className="work-card__meta">
      <span>SL — {artwork.number.padStart(3, '0')}</span>
      <span>{artwork.category.toUpperCase()}</span>
    </div>
    <div className="work-card__bottom">
      <button className="work-card__title" onClick={() => onOpen(artwork.id)}>{artwork.title}</button>
      <button className={'save-button' + (isSaved ? ' is-saved' : '')} onClick={() => onSave(artwork.id)}
        aria-pressed={isSaved} aria-label={(isSaved ? 'Remove ' : 'Save ') + artwork.title + (isSaved ? ' from favorites' : ' to favorites')}
        title={isSaved ? 'Remove from favorites' : 'Save to favorites'}>
        {isSaved ? '♥' : '♡'}
      </button>
    </div>
    <p className="work-card__medium">{artwork.medium}</p>
  </article>;
}

function Modal({ artwork, isSaved, onSave, onClose, onNext, onPrevious }) {
  const [focusPoint, setFocusPoint] = useState(false);
  const [copyState, setCopyState] = useState('');
  const closeRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight' && !event.repeat) onNext();
      if (event.key === 'ArrowLeft' && !event.repeat) onPrevious();
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')];
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose, onNext, onPrevious]);

  useEffect(() => { setFocusPoint(false); setCopyState(''); }, [artwork.id]);

  async function copyLink() {
    const link = window.location.origin + window.location.pathname + '#work-' + artwork.id;
    try {
      await navigator.clipboard.writeText(link);
      setCopyState('Link copied');
    } catch {
      setCopyState('Copy unavailable in this browser');
    }
  }

  return <div className="modal-backdrop" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section className="art-modal" role="dialog" aria-modal="true" aria-label={'Artwork: ' + artwork.title}
      ref={dialogRef}>
      <div className="art-modal__topbar">
        <span className="eyebrow">THE STILLNESS THAT MOVES / {artwork.number} OF 06</span>
        <button className="icon-close" onClick={onClose} ref={closeRef} aria-label="Close artwork">×</button>
      </div>
      <div className="art-modal__layout">
        <div className="art-modal__visual">
          <IllusionArt variant={artwork.variant} title={artwork.title + ', static image'}/>
          {focusPoint && <span className="focus-guide" aria-hidden="true"/>}
          <span className="visual-stamp">STATIC ARTWORK · NO ANIMATION</span>
        </div>
        <div className="art-modal__copy">
          <span className="eyebrow">{artwork.category} / {artwork.year}</span>
          <h2>{artwork.title}</h2>
          <p className="art-modal__description">{artwork.description}</p>
          <div className="wall-label">
            <h3>LOOK CLOSER</h3>
            <p>{artwork.lookFor}</p>
          </div>
          <div className="wall-label">
            <h3>HOW IT WORKS</h3>
            <p>{artwork.technique}</p>
          </div>
          <div className="wall-label wall-label--attribution">
            <h3>ARTIST / PROVENANCE</h3>
            <p>{attribution.studio}. {attribution.method}</p>
          </div>
          <div className="art-modal__actions">
            <button className="outline-button" onClick={() => setFocusPoint(!focusPoint)}
              aria-pressed={focusPoint}>{focusPoint ? 'HIDE FOCUS POINT' : 'SHOW FOCUS POINT'}</button>
            <button className="outline-button" onClick={() => onSave(artwork.id)} aria-pressed={isSaved}>
              {isSaved ? '♥ SAVED' : '♡ SAVE'}
            </button>
            <button className="outline-button" onClick={copyLink}>SHARE <Arrow diagonal/></button>
          </div>
          <div aria-live="polite" className="copy-state">{copyState}</div>
          <div className="art-modal__pagination">
            <button onClick={onPrevious} aria-label="Previous artwork">← PREVIOUS</button>
            <span>SL / {artwork.number.padStart(3, '0')}</span>
            <button onClick={onNext} aria-label="Next artwork">NEXT →</button>
          </div>
        </div>
      </div>
    </section>
  </div>;
}

const rooms = [
  { number: '02', label: 'THE GENERATIVE WING', title: 'Mathematics,\nmade visible.', detail: 'Living patterns, creative code, and generative systems.', variant: 'funnel' },
  { number: '03', label: 'THE DREAM GALLERY', title: 'The shape of\nthe impossible.', detail: 'Imaginary places, surreal scenes, and collective dreams.', variant: 'eyes' },
  { number: '04', label: 'THE COLLABORATION HALL', title: 'Two minds.\nA thousand forms.', detail: 'Works made by humans and AI agents together, with credit.', variant: 'tides' },
];

function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem('silicon-louvre-favorites-v1') || '[]');
    return Array.isArray(value) ? value.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

export default function App() {
  const [category, setCategory] = useState('All works');
  const [saved, setSaved] = useState(readSaved);
  const [selectedId, setSelectedId] = useState(() => {
    const match = window.location.hash.match(/^#work-([a-z0-9-]+)$/);
    return match && artworks.some((art) => art.id === match[1]) ? match[1] : null;
  });
  const visible = useMemo(() => artworks.filter((art) => category === 'All works' || art.category === category), [category]);
  const selected = artworks.find((art) => art.id === selectedId);

  useEffect(() => {
    try { localStorage.setItem('silicon-louvre-favorites-v1', JSON.stringify(saved)); } catch { /* private browsing */ }
  }, [saved]);
  useEffect(() => {
    function onHashChange() {
      const match = window.location.hash.match(/^#work-([a-z0-9-]+)$/);
      const id = match && artworks.some((art) => art.id === match[1]) ? match[1] : null;
      setSelectedId(id || null);
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function openWork(id) {
    setSelectedId(id);
    window.history.replaceState(null, '', '#work-' + id);
  }
  function closeWork() {
    setSelectedId(null);
    window.history.replaceState(null, '', '#exhibition');
  }
  function moveWork(direction) {
    const index = artworks.findIndex((art) => art.id === selectedId);
    openWork(artworks[(index + direction + artworks.length) % artworks.length].id);
  }
  function toggleSaved(id) {
    setSaved((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }

  return <div id="top" className="site-shell">
    <div className="announcement"><span>EST. 2026</span><span>AN INDEPENDENT MUSEUM OF HUMAN + AI IMAGINATION</span><span>ADMISSION IS ALWAYS FREE</span></div>
    <header className="site-header">
      <div className="container header-inner">
        <Brand/>
        <nav aria-label="Main navigation">
          <a href="#exhibition">EXHIBITIONS</a>
          <a href="#collection">COLLECTION</a>
          <a href="#vision">OUR VISION</a>
        </nav>
        <a href="#exhibition" className="header-admission">ENTER MUSEUM <Arrow diagonal/></a>
      </div>
    </header>

    <main>
      <section className="hero container" aria-labelledby="hero-heading">
        <div className="hero__copy">
          <div className="section-kicker"><span className="kicker-line"/> WELCOME TO THE SILICON LOUVRE</div>
          <h1 id="hero-heading">Art beyond<br/><em>the possible.</em></h1>
          <p className="hero__lede">A museum without walls. A canvas without borders. A new home for the boundless imagination of humans and machines.</p>
          <div className="hero__buttons">
            <a className="button-gold" href="#exhibition">EXPLORE THE EXHIBITION <Arrow diagonal/></a>
            <a className="text-link" href="#vision">DISCOVER OUR VISION <Arrow/></a>
          </div>
          <div className="hero__signature"><span className="line-ornament">✳</span><span>ART IS NOT WHAT YOU SEE.<br/>IT IS WHAT YOU MAKE OTHERS SEE.</span></div>
        </div>
        <div className="hero__art" aria-label="Preview of the inaugural exhibition">
          <div className="hero__art-frame">
            <IllusionArt variant="mandala" title="Peripheral Bloom, still optical illusion" />
            <div className="hero__image-wash"/>
          </div>
          <div className="hero__corner hero__corner--tl"/><div className="hero__corner hero__corner--br"/>
          <div className="hero__art-annotation"><span>EXHIBITION NO. 001</span><strong>THE STILLNESS<br/>THAT MOVES</strong><Arrow diagonal/></div>
          <span className="hero__vertical-label">A NEW ERA OF ART BEGINS HERE · 2026</span>
          <span className="hero__coordinate">S.L. / 001 — ∞</span>
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div>PERCEPTION <span>✦</span> POSSIBILITY <span>✦</span> IMAGINATION <span>✦</span> COLLABORATION <span>✦</span> PERCEPTION <span>✦</span> POSSIBILITY <span>✦</span> IMAGINATION <span>✦</span></div></div>

      <section id="exhibition" className="exhibition-intro container" aria-labelledby="exhibition-title">
        <div className="exhibition-intro__top"><span className="eyebrow"><span className="gold-dot"/> CURRENT EXHIBITION</span><span className="eyebrow">VOL. 001 / OCTOBER 2026</span></div>
        <div className="exhibition-intro__body">
          <div><span className="display-index">01 / THE INAUGURAL EXHIBITION</span><h2 id="exhibition-title">The Stillness<br/><em>That Moves.</em></h2></div>
          <div className="exhibition-intro__aside"><p>Nothing here is moving. Yet your eyes may tell you otherwise. Six original studies explore the strange, beautiful space between sensation and reality.</p>
          <a className="text-link" href="#collection">VIEW THE WORKS <Arrow/></a></div>
        </div>
        <div className="exhibition-intro__metrics"><div><strong>06</strong><span>ORIGINAL STUDIES</span></div><div><strong>03</strong><span>PERCEPTUAL THEMES</span></div><div><strong>∞</strong><span>WAYS TO SEE</span></div></div>
      </section>

      <section id="collection" className="collection container" aria-labelledby="collection-title">
        <div className="collection__heading"><div><span className="eyebrow">THE COLLECTION / SL.001</span><h2 id="collection-title">Works on <em>view.</em></h2></div><p>Take your time. Look closer. Your perception is part of the exhibition.</p></div>
        <div className="filters" aria-label="Filter the collection by theme">
          <div className="filters__options">{categories.map((cat) => <button key={cat} aria-pressed={category === cat}
            className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>{cat.toUpperCase()}</button>)}</div>
          <span className="filters__count">{String(visible.length).padStart(2, '0')} WORKS ON VIEW</span>
        </div>
        <div className="art-grid">{visible.map((art) => <WorkCard key={art.id} artwork={art}
          isSaved={saved.includes(art.id)} onSave={toggleSaved} onOpen={openWork}/>)}</div>
        <div className="collection__note"><span className="asterisk">✳</span><p><strong>A note on perception:</strong> {exhibition.curatorialNote}</p></div>
      </section>

      <section className="between container" aria-label="Museum philosophy">
        <span className="between__symbol">✳</span>
        <p>“The most fascinating canvas<br/>is the one <em>behind your eyes.</em>”</p>
        <span className="eyebrow">THE SILICON LOUVRE / A CURATORIAL THOUGHT</span>
      </section>

      <section className="future" aria-labelledby="future-title">
        <div className="container">
          <div className="future__heading"><div><span className="eyebrow">BEYOND THE FIRST ROOM</span><h2 id="future-title">An infinite <em>museum.</em></h2></div><p>This is the beginning. More rooms, more mediums, more possibilities. Each wing will open when its artwork and experience are ready.</p></div>
          <div className="room-grid">{rooms.map((room) => <article className="room-card" key={room.number}>
            <div className="room-card__image"><IllusionArt variant={room.variant} title={room.label + ' preview, proposed exhibition'} /></div>
            <div className="room-card__overlay"><span className="room-card__number">WING {room.number} <span>IN DEVELOPMENT</span></span><div><span className="eyebrow">{room.label}</span><h3>{room.title}</h3><p>{room.detail}</p></div></div>
          </article>)}</div>
        </div>
      </section>

      <section id="vision" className="vision container" aria-labelledby="vision-title">
        <div className="vision__eyebrow"><span className="eyebrow">OUR MANIFESTO</span><span>001 — 004</span></div>
        <div className="vision__layout">
          <div className="vision__statement"><h2 id="vision-title">Imagination<br/>belongs to <em>everyone.</em></h2><div className="vision__symbol" aria-hidden="true">◈</div></div>
          <div className="vision__principles">
            <div><span>01</span><p><strong>Free to explore.</strong> Wonder shouldn't require a ticket.</p></div>
            <div><span>02</span><p><strong>Credit the creators.</strong> Human direction, AI tools, collaboration, and origins made visible.</p></div>
            <div><span>03</span><p><strong>Curate with care.</strong> People remain responsible for what enters the collection.</p></div>
            <div><span>04</span><p><strong>Keep evolving.</strong> Art doesn't end at the edge of the frame.</p></div>
          </div>
        </div>
      </section>

      <section className="closing"><div className="container closing__inner"><span className="eyebrow">YOU HAVE ONLY JUST ARRIVED</span><h2>Stay curious.<br/><em>Stay impossible.</em></h2><a href="#top" className="button-gold">RETURN TO THE ATRIUM <Arrow diagonal/></a></div></section>
    </main>
    <footer className="footer"><div className="container footer__top"><Brand footer/><p>AN INDEPENDENT MUSEUM<br/>OF HUMAN + AI IMAGINATION</p><a href="https://github.com/MichaelWave369/SiliconLouvre" target="_blank" rel="noopener noreferrer">VISIT THE OPEN SOURCE REPOSITORY <Arrow diagonal/></a></div>
      <div className="container footer__bottom"><span>© {new Date().getFullYear()} THE SILICON LOUVRE</span><span>INDEPENDENT PROJECT · NOT AFFILIATED WITH MUSÉE DU LOUVRE</span><span>MADE TO BE SEEN.</span></div>
    </footer>
    {selected && <Modal artwork={selected} isSaved={saved.includes(selected.id)} onSave={toggleSaved}
      onClose={closeWork} onNext={() => moveWork(1)} onPrevious={() => moveWork(-1)}/>}
  </div>;
}
