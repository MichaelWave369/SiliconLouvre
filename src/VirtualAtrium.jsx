import React, { useMemo, useState } from 'react';
import { artworks } from './data/artworks.js';
import { atriumNeighbors, atriumWorkAt, wrapAtriumIndex } from './lib/atrium.js';
import IllusionArt from './art/IllusionArt.jsx';
import './styles/atrium.css';

function GalleryPainting({ work, position, onView, onFocus }) {
  const isCenter = position === 'center';
  return <button type="button" className={'atrium__painting atrium__painting--' + position}
    onClick={() => isCenter ? onView(work.id) : onFocus(work.id)}
    aria-label={isCenter
      ? 'Enter Gallery Walk for ' + work.title
      : 'Focus on ' + work.title + ' in the virtual atrium'}>
    <span className="atrium__painting-inner">
      <span className="atrium__painting-art"><IllusionArt variant={work.variant}
        title={work.title + ', stationary optical artwork'}/></span>
      <span className="atrium__painting-label">
        <span>SL / {work.number.padStart(3, '0')}</span>
        <strong>{work.title}</strong>
        <small>{isCenter ? 'OPEN ARTWORK ↗' : 'FOCUS THIS ARTWORK →'}</small>
      </span>
    </span>
  </button>;
}

export default function VirtualAtrium({ onEnterWork }) {
  const [index, setIndex] = useState(0);
  const [showDirections, setShowDirections] = useState(false);
  const selected = atriumWorkAt(artworks, index);
  const neighbors = useMemo(() => atriumNeighbors(artworks, index), [index]);
  const count = artworks.length;

  function move(delta) {
    setIndex((current) => wrapAtriumIndex(count, current + delta));
  }
  function focus(id) {
    const at = artworks.findIndex((work) => work.id === id);
    if (at >= 0) setIndex(at);
  }
  function onKeyboard(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat ||
        event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  }

  return <section className="atrium" id="atrium" aria-labelledby="atrium-title">
    <div className="container">
      <div className="atrium__header">
        <div>
          <span className="eyebrow"><span className="gold-dot"/> THE VIRTUAL ATRIUM · ROOM 001</span>
          <h2 id="atrium-title">Step inside <em>the art.</em></h2>
        </div>
        <div className="atrium__header-aside">
          <span className="atrium__mode">INTERACTIVE / SELF-PACED</span>
          <p>A navigable, 3D-inspired exhibition room. Choose a painting to explore it in the existing Gallery Walk.</p>
        </div>
      </div>
      <div className="atrium__gallery" role="region" tabIndex={0} onKeyDown={onKeyboard}
        aria-label={'Virtual atrium. Focused artwork: ' + selected.title + '. Use left and right arrow keys while in this region to change the focused painting.'}>
        <div className="atrium__architecture" aria-hidden="true">
          <div className="atrium__ceiling"/>
          <div className="atrium__wall atrium__wall--left"/>
          <div className="atrium__wall atrium__wall--right"/>
          <div className="atrium__rear-wall"/>
          <div className="atrium__arch"/>
          <div className="atrium__floor"/>
          <div className="atrium__floor-sheen"/>
          <div className="atrium__sconce atrium__sconce--left"/>
          <div className="atrium__sconce atrium__sconce--right"/>
        </div>
        <div className="atrium__painting-stage">
          {neighbors.map(({ work, position }) => <GalleryPainting key={work.id}
            work={work} position={position} onView={onEnterWork} onFocus={focus}/>)}
        </div>
        <div className="atrium__room-watermark" aria-hidden="true">THE SILICON LOUVRE<br/><span>GALLERY OF PERCEPTION</span></div>
      </div>
      <div className="atrium__control-bar">
        <div className="atrium__selection" aria-live="polite" aria-atomic="true">
          <span className="eyebrow">NOW IN FOCUS / {selected.number} OF {String(count).padStart(2, '0')}</span>
          <h3>{selected.title}</h3>
          <span>{selected.category} · {selected.medium}</span>
        </div>
        <div className="atrium__controls" role="group" aria-label="Navigate virtual atrium">
          <button type="button" className="atrium__nav-button" onClick={() => move(-1)} aria-label="Previous painting">←</button>
          <button type="button" className="atrium__enter" onClick={() => onEnterWork(selected.id)}>ENTER ARTWORK ↗</button>
          <button type="button" className="atrium__nav-button" onClick={() => move(1)} aria-label="Next painting">→</button>
        </div>
      </div>
      <div className="atrium__stops" role="group" aria-label="Choose a painting to focus">
        {artworks.map((art, i) => <button type="button" key={art.id}
          onClick={() => setIndex(i)} aria-pressed={index === i}
          className={index === i ? 'is-active' : ''} aria-label={'Focus on room painting ' + art.number + ': ' + art.title}>
          <span>{art.number}</span><span>{art.title}</span></button>)}
      </div>
      <div className="atrium__footnote">
        <div><span className="atrium__star" aria-hidden="true">✳</span><p>All six paintings are still images. This room uses optional perspective and focus changes for navigation, not continuous animation.</p></div>
        <button onClick={() => setShowDirections((show) => !show)} aria-expanded={showDirections}
          aria-controls="atrium-directions">{showDirections ? 'HIDE GUIDE −' : 'HOW TO VISIT + '}</button>
      </div>
      {showDirections && <div id="atrium-directions" className="atrium__directions">
        <p><strong>Take a closer look.</strong> Use the previous and next buttons, select a numbered painting, or focus this room and use your left/right arrow keys. Click the center painting or choose Enter Artwork to open the self-paced Gallery Walk. On mobile, the same controls work by touch. All artwork has text descriptions in its detailed viewer.</p>
        <p><strong>Accessibility.</strong> The exhibit is usable entirely with keyboard controls, and respects reduced-motion preferences. This is a 3D-inspired perspective display, not a free-roaming VR environment.</p>
      </div>}
    </div>
  </section>;
}
