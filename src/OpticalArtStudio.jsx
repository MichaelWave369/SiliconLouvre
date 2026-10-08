import React, { useEffect, useMemo, useState } from 'react';
import SubmissionDesk from './SubmissionDesk.jsx';
import { makeStudioSvg, normalizeStudioConfig, studioFilename, PRESETS, PALETTES } from './lib/studio.js';
import './styles/studio.css';
import { DRAFTS_STORAGE_KEY, MAX_DRAFTS, asRecipe, normalizeDraftName, parseDrafts, parseRecipe, removeDraft, saveDraft } from './lib/studioDrafts.js';
import { DOMISTIKA_HANDOFF_KEY, DOMISTIKA_URL, bridgeSupported, buildDomistikaHandoff } from './lib/domistikaBridge.js';

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
  const [handoffBusy,setHandoffBusy]=useState(false);
  const [draftName,setDraftName]=useState('');
  const [recipeText,setRecipeText]=useState('');
  const [pendingDeleteId,setPendingDeleteId]=useState(null);
  const [drafts,setDrafts]=useState(()=>{
    try {return parseDrafts(localStorage.getItem(DRAFTS_STORAGE_KEY));}
    catch {return [];}
  });
  useEffect(()=>{
    try {localStorage.setItem(DRAFTS_STORAGE_KEY,JSON.stringify(drafts));}
    catch {/* storage unavailable or quota restricted */}
  },[drafts]);
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
    const recipe=asRecipe(config);
    try {
      if(!navigator.clipboard?.writeText) throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText(recipe);
      setFeedback('Design recipe copied. You can recreate this exact pattern later.');
    } catch {
      setFeedback('Clipboard unavailable. Download the SVG to keep your design.');
    }
  }

  function saveCurrentDraft() {
    const name=normalizeDraftName(draftName) || 'Untitled '+modeNames[config.mode];
    const draft={
      id:'draft-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9),
      name,savedAt:Date.now(),recipe:JSON.parse(asRecipe(config)),
    };
    setDrafts(current=>saveDraft(current,draft));
    setDraftName('');
    setPendingDeleteId(null);
    setFeedback('Saved "'+name+'" to this browser. The shelf keeps up to '+MAX_DRAFTS+' designs.');
  }
  function loadSavedDraft(draft) {
    const result=parseRecipe(JSON.stringify(draft.recipe));
    if(!result.ok){setFeedback(result.error);return;}
    setConfig(result.config);
    setDraftName(draft.name);
    setFeedback('Loaded "'+draft.name+'". You can edit and save it as a new draft.');
  }
  function loadPastedRecipe() {
    const parsed=parseRecipe(recipeText);
    if(!parsed.ok){setFeedback(parsed.error);return;}
    setConfig(parsed.config);
    setRecipeText('');
    setFeedback('Recipe loaded. You can edit, save or send it to Domistika.');
  }
  function deleteDraft(id) {
    setDrafts(current=>removeDraft(current,id));
    setPendingDeleteId(null);
    setFeedback('Draft removed from this browser. Exported SVG files are unaffected.');
  }

  async function sendToDomistika() {
    if (handoffBusy) return;
    if (!bridgeSupported(window.location.origin)) {
      setFeedback('Direct transfer requires both sites on the same GitHub Pages origin. Download SVG instead.');
      return;
    }
    setHandoffBusy(true);
    setFeedback('Preparing a five-minute, browser-local transfer…');
    try {
      const packageData = await buildDomistikaHandoff(config);
      localStorage.setItem(DOMISTIKA_HANDOFF_KEY, JSON.stringify(packageData));
      setFeedback('Transfer prepared. Opening Domistika for your review.');
      window.location.assign(DOMISTIKA_URL);
    } catch(error) {
      setFeedback('Could not prepare the transfer (' + (error?.name || 'browser error') + '). Save your SVG instead.');
    } finally { setHandoffBusy(false); }
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
            <button type="button" className="studio__bridge" onClick={sendToDomistika}
              disabled={handoffBusy} aria-describedby="studio-bridge-details">
              {handoffBusy ? 'PREPARING TRANSFER…' : 'CONTINUE IN DOMISTIKA ↗'}
            </button>
          </div>
          <section className="studio__drafts" aria-labelledby="studio-drafts-title">
            <div className="studio__drafts-header">
              <span className="eyebrow">04 / PRIVATE DESIGN SHELF</span>
              <h4 id="studio-drafts-title">Keep the <em>spark.</em></h4>
              <p>Save up to {MAX_DRAFTS} editable recipes in this browser, or reload a recipe copied earlier. Stored locally, never published.</p>
            </div>
            <div className="studio__draft-save">
              <label htmlFor="studio-draft-name">NAME THIS DESIGN</label>
              <input id="studio-draft-name" value={draftName} maxLength={60}
                onChange={event=>setDraftName(event.target.value)}
                placeholder="Untitled optical study"/>
              <button type="button" onClick={saveCurrentDraft}>SAVE CURRENT DESIGN TO SHELF +</button>
            </div>
            <div className="studio__saved-list" aria-label="Saved designs">
              {drafts.length===0
                ? <p className="studio__empty-shelf">No saved designs yet. Your next idea can live here.</p>
                : drafts.map(draft=><article key={draft.id} className="studio__saved-draft">
                  <div><strong>{draft.name}</strong><small>{draft.recipe.mode} · {draft.recipe.palette} · {draft.recipe.rings} rings</small></div>
                  {pendingDeleteId===draft.id
                    ? <div className="studio__draft-controls" role="group" aria-label={'Confirm delete '+draft.name}>
                      <button type="button" onClick={()=>deleteDraft(draft.id)}>CONFIRM DELETE</button>
                      <button type="button" onClick={()=>setPendingDeleteId(null)}>CANCEL</button>
                    </div>
                    : <div className="studio__draft-controls">
                      <button type="button" onClick={()=>loadSavedDraft(draft)}>LOAD</button>
                      <button type="button" onClick={()=>setPendingDeleteId(draft.id)}>REMOVE</button>
                    </div>}
                </article>)}
            </div>
            <div className="studio__import-recipe">
              <label htmlFor="studio-recipe-json">IMPORT A COPIED DESIGN RECIPE</label>
              <textarea id="studio-recipe-json" rows={3} value={recipeText} maxLength={2048}
                onChange={event=>setRecipeText(event.target.value)}
                placeholder="Paste your silicon-louvre-studio/v1 JSON recipe here"/>
              <button type="button" disabled={!recipeText.trim()} onClick={loadPastedRecipe}>LOAD RECIPE INTO STUDIO</button>
            </div>
          </section>
          <p className="studio__feedback" role="status" aria-live="polite">{feedback}</p>
          <p id="studio-bridge-details" className="studio__bridge-note">Explicit handoff only. Sends this SVG temporarily through shared-origin browser storage; Domistika shows a preview and asks you to back up your current project before you import. The import becomes a raster paint layer, not editable vector paths. Nothing is published.</p>
          <p className="studio__copyright-note">The image is yours to save and remix. This workshop does not submit designs to the museum's curated permanent collection. Publishing an exhibit requires review and permission.</p>
        </div>
      </div>
      <SubmissionDesk config={config}/>
      <div className="studio__afterword"><span className="studio__star" aria-hidden="true">✳</span>
        <p>Art doesn't have to end when the visitor leaves the room. These compositions are still images, even when their geometry creates the impression of movement. The studio makes no stress or medical claims.</p>
        <a href="#submission-desk">PREPARE AN EXHIBITION PROPOSAL →</a>
      </div>
    </div>
  </section>;
}
