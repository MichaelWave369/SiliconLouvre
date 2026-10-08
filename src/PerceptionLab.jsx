import React, { useState } from 'react';
import IllusionArt from './art/IllusionArt.jsx';
import { contrastExperiment, perspectiveCrossbars } from './lib/perception.js';
import './styles/perception.css';

const bars = perspectiveCrossbars();

function SameShadeStudy() {
  const [contrast, setContrast] = useState(78);
  const [showProof, setShowProof] = useState(false);
  const colors = contrastExperiment(contrast);
  return <article className="perception__station" aria-labelledby="shade-title">
    <header className="perception__station-heading">
      <span className="perception__station-index">01 / CONTEXT</span>
      <h3 id="shade-title">One shade.<br/><em>Two surroundings.</em></h3>
      <p>Both squares are exactly the same gray. Changing the surrounding lightness may make them look different.</p>
    </header>
    <div className="perception__comparison" role="img"
      aria-label={'Two identical gray squares, each RGB 146 146 146, on backgrounds of different gray values. The background contrast is set to ' + colors.intensity + ' percent.'}>
      <div className="perception__context perception__context--dark" style={{background:colors.darkContext}}>
        <span className="perception__sample" style={{background:colors.target}} />
      </div>
      <div className="perception__context perception__context--light" style={{background:colors.lightContext}}>
        <span className="perception__sample" style={{background:colors.target}} />
      </div>
      {showProof && <span className="perception__proof" aria-hidden="true" style={{background:colors.target}}/>}
    </div>
    <div className="perception__controls">
      <label htmlFor="perception-contrast-slider">SURROUNDING CONTRAST <output htmlFor="perception-contrast-slider">{colors.intensity}%</output></label>
      <input id="perception-contrast-slider" type="range" min="0" max="100" step="1"
        value={colors.intensity} onChange={(e) => setContrast(Number(e.target.value))}/>
      <button type="button" aria-pressed={showProof} onClick={() => setShowProof((shown) => !shown)}>
        {showProof ? 'HIDE MATCHING GRAY BRIDGE −' : 'REVEAL MATCHING GRAY BRIDGE +'}
      </button>
    </div>
    <div className="perception__interpretation">
      <span>THE PRINCIPLE</span>
      <p>Simultaneous lightness contrast: the background can influence how light or dark an unchanged center appears. The two square fills are always <code>#929292</code>.</p>
    </div>
  </article>;
}

function PerspectiveStudy() {
  const [showConstruction, setShowConstruction] = useState(false);
  const xLines = [20, 100, 180, 260, 340, 420, 500, 580];
  return <article className="perception__station" aria-labelledby="depth-title">
    <header className="perception__station-heading">
      <span className="perception__station-index">02 / GEOMETRY</span>
      <h3 id="depth-title">Depth on<br/><em>a flat screen.</em></h3>
      <p>Lines that approach a single vanishing point can suggest distance even though every mark is two-dimensional.</p>
    </header>
    <div className="perception__depth">
      <svg viewBox="0 0 600 420" role="img" aria-label="Straight lines converge on a vanishing point near the upper middle, crossed by perspective ground lines. The entire image is flat.">
        <defs>
          <linearGradient id="perception-depth-sky" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#1a1b38"/>
            <stop offset="1" stopColor="#65445a"/>
          </linearGradient>
        </defs>
        <rect width="600" height="420" fill="url(#perception-depth-sky)"/>
        <path d="M0 105 H600 V420 H0Z" fill="#292232"/>
        <path d="M0 105 H600" stroke="#d0ac74" strokeWidth="2"/>
        {xLines.map((x) => <path key={x} d={`M300 104 L${x} 420`} stroke="#b99b75" strokeWidth="2" opacity=".9"/>)}
        {bars.map((bar,i) => <path key={i} d={`M${bar.left} ${bar.y} H${bar.right}`}
          stroke="#c1b2a7" strokeWidth="2" opacity=".9"/>)}
        {showConstruction && <>
          <line x1="300" y1="25" x2="300" y2="420" stroke="#f2d8ac" strokeDasharray="7 7" strokeWidth="2"/>
          <circle cx="300" cy="104" r="12" fill="#e5bd7c" stroke="#1b1525" strokeWidth="4"/>
          <circle cx="300" cy="104" r="25" fill="none" stroke="#e5bd7c" strokeDasharray="4 5"/>
          <text x="315" y="75" fill="#fff0d2" fontSize="17">Vanishing point</text>
          <text x="25" y="387" fill="#ffe8c1" fontSize="17">Flat SVG geometry</text>
        </>}
      </svg>
    </div>
    <div className="perception__controls perception__controls--single">
      <button type="button" aria-pressed={showConstruction} onClick={() => setShowConstruction((shown) => !shown)}>
        {showConstruction ? 'HIDE CONSTRUCTION GUIDES −' : 'REVEAL THE VANISHING POINT +'}
      </button>
    </div>
    <div className="perception__interpretation">
      <span>THE PRINCIPLE</span>
      <p>Linear perspective is one cue for depth. A flat image can imply a receding floor when lines converge and spacing changes with distance.</p>
    </div>
  </article>;
}

function MotionStudy() {
  const [focus, setFocus] = useState(false);
  return <article className="perception__station" aria-labelledby="motion-title">
    <header className="perception__station-heading">
      <span className="perception__station-index">03 / ATTENTION</span>
      <h3 id="motion-title">Stillness,<br/><em>felt differently.</em></h3>
      <p>Repeated edges and contrast may create a sense of movement for some observers. Others see a completely still picture.</p>
    </header>
    <div className="perception__motion">
      <IllusionArt variant="mandala" title="Peripheral Bloom, a stationary optical artwork of repeated colored petals"/>
      {focus && <div className="perception__focus" aria-hidden="true"/>}
      <span className="perception__still-label">STATIC SVG · NO FRAMES OR ANIMATION</span>
    </div>
    <div className="perception__controls perception__controls--single">
      <button type="button" aria-pressed={focus} onClick={() => setFocus((shown) => !shown)}>
        {focus ? 'REMOVE FIXED FOCUS POINT −' : 'ADD A FIXED FOCUS POINT +'}
      </button>
    </div>
    <div className="perception__interpretation">
      <span>THE PRINCIPLE</span>
      <p>Apparent motion is a perceptual experience, not movement of the pixels. This illustration may or may not produce an illusion for you. It cannot measure stress or health.</p>
    </div>
  </article>;
}

export default function PerceptionLab() {
  return <section className="perception" id="perception-lab" aria-labelledby="perception-title">
    <div className="container">
      <div className="perception__topline">
        <span className="eyebrow"><span className="gold-dot"/> THE PERCEPTION LAB · EDUCATION WING</span>
        <span className="eyebrow">THREE EXPERIMENTS / NO ADMISSION REQUIRED</span>
      </div>
      <div className="perception__intro">
        <div><span className="display-index">THE SCIENCE BESIDE THE ART</span>
          <h2 id="perception-title">Your eyes see.<br/><em>Your brain interprets.</em></h2>
        </div>
        <div><p>Art becomes even more interesting when you discover the visual mechanisms behind it. Try these three self-paced explorations and compare what you observe.</p>
        <a className="text-link" href="#collection">RETURN TO THE COLLECTION →</a></div>
      </div>
      <div className="perception__stations">
        <SameShadeStudy/>
        <PerspectiveStudy/>
        <MotionStudy/>
      </div>
      <p className="perception__note">
        <span aria-hidden="true">✳</span> These are demonstrations, not diagnostic or medical assessments. There is no correct personal response, no measured vision or stress score, and no data is collected. Stop viewing if a high-contrast image feels uncomfortable.
      </p>
    </div>
  </section>;
}
