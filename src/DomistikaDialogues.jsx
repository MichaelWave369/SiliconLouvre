import React, { useEffect, useRef, useState } from 'react';
import { domistikaDialoguesExhibition, domistikaDialoguePairs } from './data/domistikaDialogues.js';
import { dialogueFromHash, installedDialoguePairs, nextDialogueId } from './lib/dialogues.js';
import './styles/dialogues.css';

// All media remains local to the repository. No user URLs, remote images,
// runtime fetches or fabricated AI images can enter the exhibition.
const installedImages = import.meta.glob('./assets/dialogues/*.{png,jpg,jpeg,webp}', {
  eager: true, query: '?url', import: 'default',
});
const onView = installedDialoguePairs(domistikaDialoguePairs,installedImages);
const imageUrl = filename => installedImages['./assets/dialogues/'+filename];

function PairedArt({pair,large=false}) {
  return <div className={'dialogues__pair'+(large?' dialogues__pair--large':'')}>
    <figure className="dialogues__art dialogues__art--original">
      <div className="dialogues__picture">
        <img src={imageUrl(pair.original.file)} alt={pair.original.alt}
          loading={large?'eager':'lazy'} decoding="async"/>
      </div>
      <figcaption><span className="dialogues__side-index">01 / THE STARTING POINT</span>
        <strong>Original / Domistika</strong>
        <span>{pair.originalCredit}</span>
      </figcaption>
    </figure>
    <div className="dialogues__connector" aria-hidden="true"><span>↔</span></div>
    <figure className="dialogues__art dialogues__art--inspired">
      <div className="dialogues__picture">
        <img src={imageUrl(pair.inspired.file)} alt={pair.inspired.alt}
          loading={large?'eager':'lazy'} decoding="async"/>
      </div>
      <figcaption><span className="dialogues__side-index">02 / THE CREATIVE RESPONSE</span>
        <strong>Inspired / AI Response</strong>
        <span>{pair.inspiredCredit}</span>
      </figcaption>
    </figure>
  </div>;
}

function DialogueViewer({pair,onClose,onNext,onPrevious}) {
  const dialogRef=useRef(null);
  const closeRef=useRef(null);
  const callbacks=useRef({onClose,onNext,onPrevious});
  callbacks.current={onClose,onNext,onPrevious};
  useEffect(()=>{
    const prior=document.activeElement;
    const prevOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    closeRef.current?.focus();
    function onKey(event) {
      if(event.key==='Escape'){
        event.preventDefault();callbacks.current.onClose();return;
      }
      if(event.key==='ArrowLeft' && !event.repeat)callbacks.current.onPrevious();
      if(event.key==='ArrowRight' && !event.repeat)callbacks.current.onNext();
      if(event.key==='Tab') {
        const links=[...dialogRef.current.querySelectorAll('button:not([disabled]),a[href]')]
          .filter(node=>node.getClientRects().length>0);
        if(!links.length)return;
        if(!dialogRef.current.contains(document.activeElement)) {
          event.preventDefault();links[0].focus();
        } else if(event.shiftKey && document.activeElement===links[0]) {
          event.preventDefault();links.at(-1).focus();
        } else if(!event.shiftKey && document.activeElement===links.at(-1)) {
          event.preventDefault();links[0].focus();
        }
      }
    }
    window.addEventListener('keydown',onKey);
    return ()=>{
      window.removeEventListener('keydown',onKey);
      document.body.style.overflow=prevOverflow;
      if(prior?.isConnected)prior.focus();
    };
  },[]);
  return <div className="dialogues__backdrop" onMouseDown={event=>{
    if(event.target===event.currentTarget)onClose();
  }}>
    <section className="dialogues__viewer" ref={dialogRef}
      role="dialog" aria-modal="true" aria-label={'Domistika Dialogues: '+pair.title}>
      <div className="dialogues__viewer-header"><span>THE SILICON LOUVRE / EXHIBITION 004 / PAIRED WORKS</span>
        <button type="button" ref={closeRef} onClick={onClose} aria-label="Close artwork pair">×</button>
      </div>
      <div className="dialogues__viewer-body">
        <header className="dialogues__viewer-intro">
          <span className="eyebrow">A CREATIVE CONVERSATION / {pair.year}</span>
          <h2>{pair.title}</h2>
          <p>{pair.curatorialNote}</p>
        </header>
        <PairedArt pair={pair} large/>
        <div className="dialogues__plaque-grid">
          <div><span>THE FIRST VOICE</span><p>{pair.originalCredit} · {pair.provenance.originalTool}</p></div>
          <div><span>THE INSPIRED RESPONSE</span><p>{pair.inspiredCredit} · {pair.provenance.inspiredTool}</p></div>
          <div><span>ARTISTIC DIRECTION</span><p>{pair.provenance.humanDirection}</p></div>
          <div><span>THE CONVERSATION</span><p>{pair.process}</p></div>
        </div>
      </div>
      <div className="dialogues__viewer-nav">
        <button type="button" onClick={onPrevious}>← PREVIOUS PAIR</button>
        <span>TWO WORKS · TWO CREATIVE ROLES · ONE DIALOGUE</span>
        <button type="button" onClick={onNext}>NEXT PAIR →</button>
      </div>
    </section>
  </div>;
}

function WaitingWall() {
  return <div className="dialogues__waiting">
    <div className="dialogues__empty-gallery" aria-label="Frames awaiting verified original and inspired artworks">
      <div className="dialogues__empty-frame">
        <div className="dialogues__empty-canvas" aria-hidden="true">
          <span className="dialogues__sketch-ring"/><span className="dialogues__sketch-axis"/>
        </div>
        <span>01 / ORIGINAL</span>
        <strong>THE FIRST GESTURE</strong>
      </div>
      <div className="dialogues__empty-bond" aria-hidden="true">✳</div>
      <div className="dialogues__empty-frame dialogues__empty-frame--response">
        <div className="dialogues__empty-canvas" aria-hidden="true">
          <span className="dialogues__sketch-ring"/><span className="dialogues__sketch-axis"/>
        </div>
        <span>02 / INSPIRED</span>
        <strong>THE RESPONSE</strong>
      </div>
    </div>
    <div className="dialogues__awaiting-copy">
      <span className="eyebrow">THE FIRST PAIRS ARE BEING PREPARED</span>
      <h3>Two images.<br/><em>One conversation.</em></h3>
      <p>This wing is ready for genuine Domistika drawings and the AI-inspired images that responded to them. We won't substitute concept art or pretend any artwork belongs to an artist who hasn't approved its display.</p>
      <p>Once the original and its inspired counterpart are installed and verified, both works will appear side by side with their separate credits and creative story.</p>
      <a href="https://michaelwave369.github.io/Domistika/" target="_blank" rel="noopener noreferrer">
        EXPLORE DOMISTIKA ↗
      </a>
    </div>
  </div>;
}

export default function DomistikaDialogues() {
  const [selectedId,setSelectedId]=useState(()=>dialogueFromHash(onView,window.location.hash)?.id ?? null);
  const selected=onView.find(pair=>pair.id===selectedId);
  const originRef=useRef(null);
  const selectedIdRef=useRef(selectedId);
  selectedIdRef.current=selectedId;

  useEffect(()=>{
    const onHash=()=>setSelectedId(dialogueFromHash(onView,window.location.hash)?.id ?? null);
    window.addEventListener('hashchange',onHash);
    return ()=>window.removeEventListener('hashchange',onHash);
  },[]);

  function open(pairId) {
    if(!onView.some(pair=>pair.id===pairId))return;
    originRef.current=document.activeElement;
    setSelectedId(pairId);
    window.history.replaceState(null,'','#dialogue-'+pairId);
  }
  function close() {
    setSelectedId(null);
    window.history.replaceState(null,'','#domistika-dialogues');
    // Focus is restored by the modal's effect cleanup.
  }
  function move(delta) {
    const next=nextDialogueId(onView,selectedIdRef.current,delta);
    if(next){
      setSelectedId(next);
      window.history.replaceState(null,'','#dialogue-'+next);
    }
  }

  return <section className="dialogues" id="domistika-dialogues"
    aria-labelledby="dialogues-title">
    <div className="container">
      <div className="dialogues__topline">
        <span className="eyebrow"><span className="gold-dot"/> EXHIBITION 004 / THE HUMAN–AI CONVERSATION</span>
        <span className="eyebrow">{String(onView.length).padStart(2,'0')} PAIRED WORKS ON VIEW</span>
      </div>
      <div className="dialogues__heading">
        <div><span className="display-index">SAME IMAGINATION / DIFFERENT INTERPRETATIONS</span>
          <h2 id="dialogues-title">Domistika<br/><em>Dialogues.</em></h2>
          <p className="dialogues__subtitle">{domistikaDialoguesExhibition.subtitle}</p>
        </div>
        <div className="dialogues__statement">
          <span className="dialogues__star" aria-hidden="true">✳</span>
          <p>{domistikaDialoguesExhibition.statement}</p>
          <span>RESPONSE, NOT REPLACEMENT</span>
        </div>
      </div>
      {onView.length===0 ? <WaitingWall/> :
        <div className="dialogues__cards">
          {onView.map((pair,index)=><article className="dialogues__card" key={pair.id}>
            <div className="dialogues__card-head">
              <span>CREATIVE EXCHANGE / {String(index+1).padStart(2,'0')}</span>
              <span>{pair.year}</span>
            </div>
            <button type="button" className="dialogues__open" onClick={()=>open(pair.id)}
              aria-label={'Explore original and inspired pair: '+pair.title}>
              <PairedArt pair={pair}/>
              <span className="dialogues__open-label">VIEW THE CREATIVE DIALOGUE ↗</span>
            </button>
            <div className="dialogues__card-caption">
              <h3>{pair.title}</h3><p>{pair.curatorialNote}</p>
            </div>
          </article>)}
        </div>}
      <div className="dialogues__manifesto">
        <span aria-hidden="true">◇</span>
        <p>Every original stands on its own. Every inspired response is identified as a new interpretation. The museum preserves the distinction, the dialogue, and the credit.</p>
        <a href="#community-gallery">VISIT THE COMMUNITY GALLERY ↗</a>
      </div>
    </div>
    {selected && <DialogueViewer pair={selected} onClose={close}
      onNext={()=>move(1)} onPrevious={()=>move(-1)}/>}
  </section>;
}
