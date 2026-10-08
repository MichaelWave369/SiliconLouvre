import React, { useEffect, useRef, useState } from 'react';
import { communityExhibition, curatedWorks } from './data/curatedWorks.js';
import { makeStudioSvg } from './lib/studio.js';
import './styles/community.css';
import CuratorialLedger from './CuratorialLedger.jsx';

const ISSUE_URL='https://github.com/MichaelWave369/SiliconLouvre/issues/new?template=artist-proposal.yml';

function CuratedArt({ work, asPreview=false }) {
  const image='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(makeStudioSvg(work.recipe));
  return <img src={image} alt={work.alt} loading={asPreview?'lazy':'eager'} decoding="async"/>;
}

function ArtworkPlaque({ work }) {
  return <div className="community__plaque">
    <span className="eyebrow">CURATED ARTWORK / {communityExhibition.id}</span>
    <h3>{work.title}</h3>
    <p className="community__credit">By {work.displayName}</p>
    <p className="community__story">{work.description}</p>
    <dl>
      <div><dt>THE CREATIVE PROCESS</dt><dd>{work.process}</dd></div>
      <div><dt>CONTRIBUTORS & ROLES</dt><dd>{work.collaborators}</dd></div>
      <div><dt>PROPOSED RIGHTS STATUS</dt><dd>{work.license === 'rights-retained'?'Rights retained, permission confirmed by curator':work.license==='cc-by-4.0'?'Creative Commons Attribution 4.0 (subject to confirmed grant)':'CC0 1.0 dedication (subject to confirmed grant)'}</dd></div>
      <div><dt>CURATORIAL REVIEW</dt><dd>{work.review.curator} · {work.review.date}<span>{work.review.notes}</span></dd></div>
      <div><dt>PROPOSAL RECORD</dt><dd><a href={work.sourceIssue} target="_blank" rel="noopener noreferrer">View reviewed proposal ↗</a></dd></div>
    </dl>
    <p className="community__alt-note">Artwork description: {work.alt}</p>
  </div>;
}

function CuratedViewer({work,onClose,onNext,onPrevious}) {
  const closeButton=useRef(null);
  const dialog=useRef(null);
  const callbacks=useRef({onClose,onNext,onPrevious});
  callbacks.current={onClose,onNext,onPrevious};
  useEffect(()=>{
    const beforeFocus=document.activeElement;
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    closeButton.current?.focus();
    function onKey(event) {
      if(event.key==='Escape') {event.preventDefault();callbacks.current.onClose();}
      if(event.key==='ArrowRight' && !event.repeat) callbacks.current.onNext();
      if(event.key==='ArrowLeft' && !event.repeat) callbacks.current.onPrevious();
      if(event.key==='Tab') {
        const focusable=[...dialog.current.querySelectorAll('button:not([disabled]),a[href]')].filter(el=>el.getClientRects().length>0);
        if(!focusable.length)return;
        if(!dialog.current.contains(document.activeElement)){event.preventDefault();focusable[0].focus();}
        else if(event.shiftKey && document.activeElement===focusable[0]){event.preventDefault();focusable.at(-1).focus();}
        else if(!event.shiftKey && document.activeElement===focusable.at(-1)){event.preventDefault();focusable[0].focus();}
      }
    }
    window.addEventListener('keydown',onKey);
    return ()=>{
      window.removeEventListener('keydown',onKey);
      document.body.style.overflow=oldOverflow;
      if(beforeFocus?.isConnected) beforeFocus.focus();
    };
  },[]);
  return <div className="community__overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <section className="community__viewer" role="dialog" aria-modal="true"
      aria-label={'Curated artwork: '+work.title} ref={dialog}>
      <div className="community__viewer-bar"><span>THE SILICON LOUVRE / COMMUNITY GALLERY 003</span>
        <button type="button" onClick={onClose} ref={closeButton} aria-label="Close curated artwork">×</button>
      </div>
      <div className="community__viewer-body">
        <div className="community__viewer-art"><CuratedArt work={work}/><span>STATIC SVG · CURATOR-APPROVED EXHIBITION</span></div>
        <ArtworkPlaque work={work}/>
      </div>
      <div className="community__viewer-nav">
        <button type="button" onClick={onPrevious}>← PREVIOUS ARTWORK</button>
        <span>COMMUNITY EXHIBITION / HUMAN REVIEWED</span>
        <button type="button" onClick={onNext}>NEXT ARTWORK →</button>
      </div>
    </section>
  </div>;
}

export default function CommunityGallery() {
  const [selectedId,setSelectedId]=useState(null);
  const focusWork=curatedWorks.find(work=>work.id===selectedId);
  const selectedIndex=curatedWorks.findIndex(work=>work.id===selectedId);
  function navigate(delta) {
    if(!curatedWorks.length)return;
    setSelectedId(curatedWorks[((selectedIndex+delta)%curatedWorks.length+curatedWorks.length)%curatedWorks.length].id);
  }
  return <section className="community" id="community-gallery" aria-labelledby="community-title">
    <div className="container">
      <div className="community__eyebrow">
        <span className="eyebrow"><span className="gold-dot"/> EXHIBITION 003 / A COMMUNITY COLLECTION</span>
        <span className="eyebrow">HUMAN-CURATED · FREE TO VISIT</span>
      </div>
      <div className="community__intro">
        <div>
          <span className="display-index">EVERY MASTERPIECE BEGINS AS SOMEBODY'S IDEA</span>
          <h2 id="community-title">The next artist<br/><em>could be anyone.</em></h2>
        </div>
        <p>{communityExhibition.description}</p>
      </div>
      {curatedWorks.length===0
        ? <div className="community__awaiting">
          <div className="community__seal" aria-hidden="true">✳</div>
          <div><span className="eyebrow">CURATORIAL WALL / WAITING FOR OUR FIRST ARTIST</span>
            <h3>Nothing invented.<br/><em>Everything possible.</em></h3>
            <p>This exhibition is waiting for its first reviewed contribution. We won't invent artists, reviews, or publication permissions to fill an empty wall.</p>
            <a href="#submission-desk" className="community__cta">PREPARE AN ARTWORK PROPOSAL ↗</a>
          </div>
          <div className="community__awaiting-record">
            <div><span>01</span> ARTIST SUBMITS A PROPOSAL</div>
            <div><span>02</span> CURATOR CHECKS RIGHTS, CREDITS & ACCESS</div>
            <div><span>03</span> REVIEWED PR BUILDS & DEPLOYS</div>
            <div><span>04</span> THE ART APPEARS ON THE WALL</div>
          </div>
        </div>
        : <div className="community__grid">
          {curatedWorks.map(work=><article className="community__card" key={work.id}>
            <button type="button" onClick={()=>setSelectedId(work.id)} aria-label={'View curated artwork: '+work.title}>
              <CuratedArt work={work} asPreview/>
              <span>EXPLORE ARTWORK ↗</span>
            </button>
            <div className="community__card-details">
              <span>CURATOR-APPROVED / EXHIBITION 003</span>
              <h3>{work.title}</h3><p>By {work.displayName}</p>
            </div>
          </article>)}
        </div>}
      <p className="community__note">The Community Gallery only displays contributions that have passed a human-controlled publication review. Proposal submissions and downloadable curator kits do not appear here automatically. The artwork remains static and accessible by text description.</p>
      <CuratorialLedger/>
    </div>
    {focusWork && <CuratedViewer work={focusWork} onClose={()=>setSelectedId(null)}
      onNext={()=>navigate(1)} onPrevious={()=>navigate(-1)}/>}
  </section>;
}
