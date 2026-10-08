import React, { useMemo, useState } from 'react';
import { makeStudioSvg, normalizeStudioConfig, studioFilename, PRESETS, PALETTES } from './lib/studio.js';
import './styles/studio.css';

const modeNames = {
  bloom: 'Radial Bloom',
  clockwork: 'Nested Gears',
  iris: 'Iris Cathedral',
};
const paletteNames = {
  gilded: 'Gilded Nocturne',
  neon: 'Electric Garden',
  aurora: 'Aurora Glass',
  ember: 'Ember Cathedral',
};
function Slider({ id, label, value, min, max, step=1, onChange, suffix='' }) {
  return <div className="studio__slider">
    <label htmlFor={id}><span>{label}</span><output htmlFor={id}>{value}{suffix}</output></label>
    <input id={id} type="range" min={min} max={max} step={step} value={value}
      onChange={event=>onChange(Number(event.target.value))}/>
  </div>;
}

export default function OpticalArtStudio() {
  const [config,setConfig]=useState({...PRESETS.bloom});
  const [feedback,setFeedback]=useState('');
  const svg=useMemo(()=>makeStudioSvg(config),[config]);
  const preview=useMemo(()=> 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),[svg]);

  function update(field,value) {
    setConfig(prev => normalizeStudioConfig({...prev,[field]:value}));
    setFeedback('');
  }
  function usePreset(key) {
    setConfig({...PRESETS[key]});
    setFeedback(modeNames[key]+' preset loaded.');
  }
  function exportSvg() {
    const blob=new Blob([svg], {type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=studioFilename(config);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url), 1500);
    setFeedback('SVG prepared for download. Your design remains in this browser.');
  }
  async function copyRecipe() {
    const recipe=JSON.stringify({format:'silicon-louvre-studio/v1',...normalizeStudioConfig(config)},null,2);
    try {
      if(!navigator.clipboard?.writeText) throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText(recipe);
      setFeedback('Design recipe copied. You can recreate this exact pattern later.');
    } catch {
      setFeedback('Clipboard unavailable. Download the SVG to keep your design.');
    }
  }

  return <section className="studio" id="creative-studio" aria-labelledby="studio-title">
    <div className="container">
      <div className="studio__eyebrow">
        <span className="eyebrow"><span className="gold-dot"/> THE CREATIVE STUDIO / OPEN WORKSHOP</span>
        <span className="eyebrow">NO ACCOUNT · NO UPLOAD · FREE TO CREATE</span>
      </div>
      <div className="studio__intro">
        <div><span className="display-index">FROM THE GALLERY INTO YOUR HANDS</span>
          <h2 id="studio-title">Now it's your turn<br/><em>to make wonder.</em></h2>
        </div>
        <p>Compose original optical patterns with repeating geometry, color, and rotation. What you create stays yours to keep, with no account and no server involved.</p>
      </div>
      <div className="studio__workspace">
        <div className="studio__canvas">
          <div className="studio__canvas-top"><span>LIVE COMPOSITION / 001</span><span>STATIC SVG · 800 × 800</span></div>
          <div className="studio__artframe">
            <img src={preview} alt={'Static generative '+modeNames[config.mode]+' composition with '+config.rings+' rings of '+config.segments+' motifs per ring in the '+paletteNames[config.palette]+' palette.'}/>
            <div className="studio__artcorner studio__artcorner--tl"/>
            <div className="studio__artcorner studio__artcorner--br"/>
          </div>
          <div className="studio__canvas-footer"><span>THE SILICON LOUVRE / VISITOR ORIGINAL</span><span>GENERATED LOCALLY</span></div>
        </div>
        <div className="studio__control-panel">
          <div className="studio__panel-heading"><span className="eyebrow">YOUR CREATIVE WORKBENCH</span><h3>Shape the <em>impossible.</em></h3>
            <p>Every adjustment redraws the static artwork. Nothing is uploaded, tracked, or automatically published to the museum.</p>
          </div>
          <fieldset className="studio__fieldset">
            <legend>01 / CHOOSE A COMPOSITION</legend>
            <div className="studio__preset-options">
              {Object.keys(PRESETS).map(mode=><button type="button" key={mode} onClick={()=>usePreset(mode)}
                aria-pressed={config.mode===mode}>{modeNames[mode]}</button>)}
            </div>
          </fieldset>
          <fieldset className="studio__fieldset">
            <legend>02 / EXPLORE A PALETTE</legend>
            <div className="studio__palette-grid">
              {Object.entries(PALETTES).map(([key, colors])=><button type="button" key={key}
                className={config.palette===key ? 'is-chosen':''} onClick={()=>update('palette',key)}
                aria-pressed={config.palette===key} aria-label={paletteNames[key]+' palette'}>
                <span className="studio__swatch-row" aria-hidden="true">{colors.map((hex,i)=><span key={i} style={{background:hex}}/>)}</span>
                <span>{paletteNames[key]}</span>
              </button>)}
            </div>
          </fieldset>
          <fieldset className="studio__fieldset studio__fieldset--sliders">
            <legend>03 / ADJUST YOUR GEOMETRY</legend>
            <Slider id="studio-rings" label="CONCENTRIC RINGS" min={2} max={9} value={config.rings} onChange={value=>update('rings',value)}/>
            <Slider id="studio-segments" label="MOTIFS PER RING" min={6} max={36} value={config.segments} onChange={value=>update('segments',value)}/>
            <Slider id="studio-twist" label="ROTATIONAL OFFSET" min={-90} max={90} value={config.twist} suffix="°" onChange={value=>update('twist',value)}/>
          </fieldset>
          <div className="studio__actions">
            <button type="button" className="studio__export" onClick={exportSvg}>SAVE YOUR SVG ARTWORK ↗</button>
            <button type="button" className="studio__recipe" onClick={copyRecipe}>COPY DESIGN RECIPE</button>
          </div>
          <p className="studio__feedback" role="status" aria-live="polite">{feedback}</p>
          <p className="studio__copyright-note">The image is yours to save and remix. This workshop does not submit designs to the museum's curated permanent collection. Publishing an exhibit requires review and permission.</p>
        </div>
      </div>
      <div className="studio__afterword"><span className="studio__star" aria-hidden="true">✳</span>
        <p>Art doesn't have to end when the visitor leaves the room. These compositions are still images, even when their geometry creates the impression of movement. The studio makes no stress or medical claims.</p>
        <a href="#artists">EXPLORE THE ARTIST REGISTRY →</a>
      </div>
    </div>
  </section>;
}
