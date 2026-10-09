import React, { useEffect, useId, useState } from 'react';
import { COMPARISON_MODES, clampComparisonValue, comparisonStatus,
  blendOpacityStyle, revealClipStyle } from './lib/comparison.js';
import './styles/dialogueComparison.css';

const MODE_INFO={
  'side-by-side':{
    title:'Two Voices',
    label:'SIDE BY SIDE',
    help:'Study the complete original and the complete response as two separate artworks.',
  },
  reveal:{
    title:'The Reveal',
    label:'DRAG TO REVEAL',
    help:'Drag the divider to compare the original on the left with the AI-inspired response on the right.',
  },
  blend:{
    title:'The Superposition',
    label:'BLEND THE IMAGES',
    help:'Change the transparency of the AI-inspired response above the original drawing.',
  },
};

export default function DialogueComparisonStation({pair,originalUrl,inspiredUrl,sideBySide}) {
  const [mode,setMode]=useState('side-by-side');
  const [reveal,setReveal]=useState(50);
  const [blend,setBlend]=useState(50);
  const headingId=useId();
  const descriptionId=useId();
  const controlsId=useId();

  // Keep the chosen inspection method while navigating artwork pairs, but
  // reset any fine-adjustment so each new work starts at a neutral midpoint.
  useEffect(()=>{
    setReveal(50);
    setBlend(50);
  },[pair.id]);

  const activeValue=mode==='reveal'?reveal:blend;
  const setActiveValue=mode==='reveal'?setReveal:setBlend;

  return <section className="dialogue-compare" aria-labelledby={headingId}>
    <div className="dialogue-compare__heading">
      <div><span className="eyebrow">INTERACTIVE COMPARISON STATION / EXHIBITION 004</span>
        <h3 id={headingId}>Look closer.<br/><em>See the conversation.</em></h3>
      </div>
      <p id={descriptionId}>These are the actual approved exhibition images, displayed without generating, changing, or uploading artwork. Choose how you want to compare them.</p>
    </div>

    <div className="dialogue-compare__modes" role="group" aria-label="Comparison view">
      {COMPARISON_MODES.map(choice=><button type="button" key={choice}
        className={mode===choice?'is-active':''} aria-pressed={mode===choice}
        onClick={()=>setMode(choice)}>
        <span className="dialogue-compare__mode-index">{choice==='side-by-side'?'01':choice==='reveal'?'02':'03'}</span>
        {MODE_INFO[choice].label}
      </button>)}
    </div>

    <div className="dialogue-compare__artworks" aria-label={MODE_INFO[mode].title}>
      {mode==='side-by-side' ? sideBySide :
        <div className={'dialogue-compare__layered'+(mode==='blend'?' dialogue-compare__layered--blend':' dialogue-compare__layered--reveal')}>
          <img className="dialogue-compare__layered-original" src={originalUrl}
            alt="" aria-hidden="true" decoding="async"
            style={mode==='reveal'?revealClipStyle(reveal):undefined}/>
          <img className="dialogue-compare__layered-inspired" src={inspiredUrl}
            alt="" aria-hidden="true" decoding="async"
            style={mode==='blend'?blendOpacityStyle(blend):undefined}/>
          {mode==='reveal' && <>
            <div className="dialogue-compare__split" style={{left:reveal+'%'}} aria-hidden="true">
              <span>↔</span>
            </div>
            <input type="range" className="dialogue-compare__image-range"
              aria-label={'Adjust original-versus-inspired divider for '+pair.title}
              aria-describedby={controlsId} min="0" max="100" step="1" value={reveal}
              aria-valuetext={comparisonStatus('reveal',reveal)}
              onChange={event=>setReveal(clampComparisonValue(event.target.value))}/>
          </>}
          <span className="dialogue-compare__corner-label dialogue-compare__corner-label--left">ORIGINAL · DOMISTIKA</span>
          <span className="dialogue-compare__corner-label dialogue-compare__corner-label--right">INSPIRED · AI RESPONSE</span>
        </div>}
    </div>

    <div className="dialogue-compare__readout">
      <div className="dialogue-compare__explanation">
        <strong>{MODE_INFO[mode].title}</strong>
        <p id={controlsId}>{MODE_INFO[mode].help}</p>
      </div>
      {mode!=='side-by-side' &&
        <div className="dialogue-compare__control">
          <label htmlFor="dialogue-compare-percent">
            <span>{mode==='reveal'?'REVEAL DIVIDER · ORIGINAL LEFT':'INSPIRED IMAGE OPACITY'}</span>
            <output htmlFor="dialogue-compare-percent">{activeValue}%</output>
          </label>
          <input id="dialogue-compare-percent" type="range"
            min="0" max="100" step="1" value={activeValue}
            aria-valuetext={comparisonStatus(mode,activeValue)}
            onChange={event=>setActiveValue(clampComparisonValue(event.target.value))}/>
          <div className="dialogue-compare__range-ends" aria-hidden="true">
            <span>{mode==='reveal'?'INSPIRED':'ORIGINAL'}</span><span>{mode==='reveal'?'ORIGINAL':'INSPIRED'}</span>
          </div>
          <button type="button" className="dialogue-compare__reset"
            onClick={()=>setActiveValue(50)}>RESET TO 50%</button>
        </div>}
    </div>

    <div className="dialogue-compare__credits">
      <div><span className="eyebrow">THE FIRST VOICE / ORIGINAL</span>
        <strong>{pair.originalCredit}</strong>
        <p>{pair.original.alt}</p>
      </div>
      <div><span className="eyebrow">THE RESPONSE / INSPIRED</span>
        <strong>{pair.inspiredCredit}</strong>
        <p>{pair.inspired.alt}</p>
      </div>
    </div>
    <p className="dialogue-compare__footnote">The reveal aligns these two square images for exploration, not for a scientific pixel-by-pixel match. Their forms may have changed between the original drawing and the response.</p>
  </section>;
}
