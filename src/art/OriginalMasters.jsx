import React, { useEffect, useRef, useState } from 'react';
import { foundingMasters, foundingMastersExhibition, foundingMastersProvenance } from '../data/foundingMasters.js';
import { masterFromHash, masterNextId } from '../lib/masters.js';

// Vite discovers approved originals at build time. No missing-file requests.
const files = import.meta.glob('../assets/masters/*.webp', { eager: true, query: '?url', import: 'default' });
const available = foundingMasters.filter((work) => files['../assets/masters/' + work.file]);
const urlFor = (work) => files['../assets/masters/' + work.file];

function MasterViewer({ artwork, onClose, onNext, onPrevious }) {
  const closeButton = useRef(null);
  const dialog = useRef(null);
  const handlers = useRef({ onClose, onNext, onPrevious });
  handlers.current = { onClose, onNext, onPrevious };
  const [copied, setCopied] = useState('');
  useEffect(() => { setCopied(''); }, [artwork.id]);
  useEffect(() => {
    const priorFocus = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    function onKey(event) {
      if (event.key === 'Escape') handlers.current.onClose();
      if (event.key === 'ArrowLeft' && !event.repeat) handlers.current.onPrevious();
      if (event.key === 'ArrowRight' && !event.repeat) handlers.current.onNext();
      if (event.key === 'Tab') {
        const elements = [...dialog.current.querySelectorAll('button:not([disabled]), a[href]')]
          .filter((el) => el.getClientRects().length > 0);
        if (!elements.length) return;
        if (!dialog.current.contains(document.activeElement)) { event.preventDefault(); elements[0].focus(); }
        else if (event.shiftKey && document.activeElement === elements[0]) { event.preventDefault(); elements.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === elements.at(-1)) { event.preventDefault(); elements[0].focus(); }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = oldOverflow;
      if (priorFocus?.isConnected) priorFocus.focus();
    };
  }, []);
  async function share() {
    const link = new URL('#master-' + artwork.id, window.location.href).href;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(link);
      setCopied('Link copied');
    } catch { setCopied('Share link: ' + link); }
  }
  return <div className="masters-viewer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="masters-viewer" role="dialog" aria-modal="true" aria-label={'Founding Master: ' + artwork.title} ref={dialog}>
      <div className="masters-viewer__header">
        <span>THE SILICON LOUVRE / EXHIBITION 002 / {artwork.number} OF 06</span>
        <button ref={closeButton} onClick={onClose} aria-label="Close original artwork">×</button>
      </div>
      <div className="masters-viewer__body">
        <div className="masters-viewer__image-shell">
          <img src={urlFor(artwork)} alt={artwork.alt}/>
          <span>ORIGINAL MASTER · STILL IMAGE</span>
        </div>
        <aside className="masters-viewer__wall-label">
          <span className="eyebrow">FOUNDING MASTER / {artwork.number}</span>
          <h2>{artwork.title}</h2>
          <p>{artwork.description}</p>
          <div><strong>VISUAL LANGUAGE</strong><p>{artwork.technique}</p></div>
          <div><strong>CREATIVE PROVENANCE</strong><p>{foundingMastersProvenance.direction} {foundingMastersProvenance.generation}</p></div>
          <div><strong>MEDIUM</strong><p>AI-generated still image, optimized WebP edition of an archived PNG master.</p></div>
          <p className="masters-viewer__disclaimer">{foundingMastersProvenance.disclaimer}</p>
          <button className="masters-viewer__share" onClick={share}>COPY ARTWORK LINK ↗</button>
          <p className="masters-viewer__feedback" role="status">{copied}</p>
        </aside>
      </div>
      <div className="masters-viewer__navigation" aria-label="Founding Masters navigation">
        <button onClick={onPrevious}>← PREVIOUS WORK</button>
        <span>FOUNDING MASTERS / {artwork.number} OF {String(available.length).padStart(2, '0')} ON VIEW</span>
        <button onClick={onNext}>NEXT WORK →</button>
      </div>
    </div>
  </div>;
}

export default function OriginalMasters() {
  const [selectedId, setSelectedId] = useState(() => masterFromHash(available, window.location.hash)?.id ?? null);
  const selected = available.find((art) => art.id === selectedId);
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  useEffect(() => {
    const onHash = () => setSelectedId(masterFromHash(available, window.location.hash)?.id ?? null);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  function open(id) {
    if (!available.some((art) => art.id === id)) return;
    setSelectedId(id);
    window.history.replaceState(null, '', '#master-' + id);
  }
  function close() { setSelectedId(null); window.history.replaceState(null, '', '#masters'); }
  function move(delta) { const id = masterNextId(available, selectedRef.current, delta); if (id) open(id); }

  return <section className="masters" id="masters" aria-labelledby="masters-title"><div className="container">
    <div className="masters__heading">
      <div><span className="eyebrow">EXHIBITION 002 / THE FOUNDING COLLECTION</span>
        <h2 id="masters-title">The original <em>masters.</em></h2>
        <p>{foundingMastersExhibition.subtitle} An evolving archive of the first creations that inspired the museum.</p>
      </div>
      <div className="masters__count"><strong>{String(available.length).padStart(2, '0')} / 06</strong><span>ORIGINALS ON VIEW</span></div>
    </div>
    {available.length ? <>
      <div className="masters__grid">{available.map((work) => <article key={work.id} className="masters__card">
        <button onClick={() => open(work.id)} aria-label={'View original artwork: ' + work.title}>
          <img src={urlFor(work)} alt={work.alt} loading="lazy" decoding="async"/>
          <span className="masters__open">VIEW ORIGINAL ↗</span>
        </button>
        <div className="masters__card-number">SL / MASTER {work.number}</div>
        <h3>{work.title}</h3><p>{work.technique}</p>
      </article>)}</div>
      <p className="masters__note">{foundingMastersExhibition.context} {foundingMastersProvenance.disclaimer}</p>
    </> : <div className="masters__awaiting">
      <div className="masters__awaiting-intro"><span className="masters__awaiting-icon" aria-hidden="true">◈</span>
        <span className="eyebrow">THE ARCHIVE IS BEING PREPARED</span>
        <h3>Six originals.<br/><em>One beginning.</em></h3>
        <p>The image-generated masters are being prepared for their exhibition walls. Until they arrive, explore the opening Gallery Walk.</p>
        <a href="#exhibition" className="text-link">VISIT EXHIBITION 001 →</a>
      </div>
      <ol className="masters__inventory">{foundingMasters.map((work) => <li key={work.id}>
        <span>{work.number}</span><span>{work.title}</span><small>AWAITING INSTALLATION</small>
      </li>)}</ol>
    </div>}
  </div>
  {selected && <MasterViewer artwork={selected} onClose={close} onPrevious={() => move(-1)} onNext={() => move(1)}/>}
  </section>;
}
