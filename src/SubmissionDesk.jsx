import React, { useState } from 'react';
import { submissionFilename, submissionIssueText, submissionRecord, validateSubmissionFields } from './lib/submissions.js';
import './styles/submissions.css';

const ISSUE_URL='https://github.com/MichaelWave369/SiliconLouvre/issues/new?template=artist-proposal.yml';
const initialForm={
 title:'',displayName:'',description:'',alt:'',process:'',collaborators:'',
 creditType:'human-ai-assisted',license:'rights-retained',
 rightsConfirmed:false,publicConfirmed:false,
};

const fields=[
 {name:'title',label:'ARTWORK TITLE',type:'input',placeholder:'Give your artwork a name',max:80},
 {name:'displayName',label:'PUBLIC ARTIST OR STUDIO NAME',type:'input',placeholder:'Your public name or chosen alias',max:60},
 {name:'description',label:'THE STORY BEHIND THE WORK',type:'textarea',placeholder:'What were you exploring? What should a visitor notice?',max:650},
 {name:'alt',label:'ACCESSIBILITY DESCRIPTION',type:'textarea',placeholder:'Describe the actual shapes, colors and arrangement for someone who cannot see the artwork.',max:280},
 {name:'process',label:'HOW THIS ARTWORK WAS CREATED',type:'textarea',placeholder:'Explain creative direction, tools and your choices.',max:900},
 {name:'collaborators',label:'CONTRIBUTORS AND THEIR ROLES',type:'textarea',placeholder:'List human, AI-tool or agent contributions accurately. Do not invent collaborators.',max:450},
];

function downloadText(text,filename,mime) {
  const blob=new Blob([text],{type:mime});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.download=filename;
  link.href=url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1500);
}

export default function SubmissionDesk({config}) {
  const [form,setForm]=useState(initialForm);
  const [feedback,setFeedback]=useState('');
  const [errors,setErrors]=useState([]);

  function change(field,value) {
    setForm(current=>({...current,[field]:value}));
    setErrors([]);
    setFeedback('');
  }
  function prepare() {
    const result=submissionRecord(form,config,new Date().toISOString());
    if(!result.ok){
      setErrors(result.errors);
      setFeedback('Please complete the missing information before preparing a review kit.');
      return null;
    }
    setErrors([]);
    return result.data;
  }
  function exportKit() {
    const data=prepare();
    if(!data)return;
    try{
      downloadText(JSON.stringify(data,null,2),submissionFilename(data.artwork.title),'application/json;charset=utf-8');
      setFeedback('Review kit prepared for download. No artwork was submitted or published.');
    }catch{
      setFeedback('Your browser could not download the kit. Save your SVG and try again.');
    }
  }
  function exportSvg() {
    const data=prepare();
    if(!data)return;
    try{
      downloadText(data.files[0].data,'silicon-louvre-proposed-artwork.svg','image/svg+xml;charset=utf-8');
      setFeedback('The separate SVG artwork is ready to save. No submission has been sent.');
    }catch{
      setFeedback('Your browser could not download the artwork. Use Save SVG in the Creative Studio above.');
    }
  }
  async function copyIssue() {
    const data=prepare();
    if(!data)return;
    try{
      if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');
      await navigator.clipboard.writeText(submissionIssueText(data));
      setFeedback('Public proposal text copied. Review it before pasting into the GitHub form.');
    }catch{
      setFeedback('Clipboard unavailable. Download the review kit and use its details in the GitHub proposal form.');
    }
  }

  return <section className="submission-desk" id="submission-desk" aria-labelledby="submission-desk-title">
    <div className="submission-desk__heading">
      <div>
        <span className="eyebrow">05 / THE EXHIBITION SUBMISSION DESK</span>
        <h3 id="submission-desk-title">Every artwork<br/><em>has a story to tell.</em></h3>
      </div>
      <div>
        <p>Want to propose your creation for a future exhibition? Prepare a curator-ready record containing the SVG, your chosen public credit, its story, and an accessibility description.</p>
        <span>STAGE: PROPOSAL PREPARATION · NOT AN APPROVED EXHIBITION</span>
      </div>
    </div>
    <div className="submission-desk__layout">
      <div className="submission-desk__instructions">
        <span className="submission-desk__symbol" aria-hidden="true">◇</span>
        <h4>A place for<br/><em>every kind of maker.</em></h4>
        <p>We welcome ideas from human artists and human-directed collaborations using creative software or AI. Agent contributions must identify their actual role and responsible operator.</p>
        <div className="submission-desk__stages">
          <div><strong>01</strong><span>PREPARE YOUR ART</span><p>Shape your creation above, then describe its meaning and authorship here.</p></div>
          <div><strong>02</strong><span>KEEP YOUR FILES</span><p>Download the artwork and curator kit. These are yours; the museum doesn't upload them.</p></div>
          <div><strong>03</strong><span>PROPOSE FOR REVIEW</span><p>Open a public GitHub proposal, paste your summary, and follow curator instructions for sharing the artwork securely.</p></div>
          <div><strong>04</strong><span>HUMAN CURATOR DECISION</span><p>Review of rights, credits, accessibility and suitability is required before any publication.</p></div>
        </div>
        <p className="submission-desk__safety">Don't put a private email address, phone number, legal identity, or other sensitive information in the public issue. You can use an artist alias.</p>
      </div>
      <div className="submission-desk__form">
        <div className="submission-desk__form-header">
          <span className="eyebrow">CREATE AN ARTWORK PROPOSAL</span>
          <p>All fields below describe the current static SVG composition. Nothing is uploaded automatically.</p>
        </div>
        <div className="submission-desk__fields">
          {fields.map(field=><div key={field.name} className="submission-desk__field">
            <label htmlFor={'submission-'+field.name}>{field.label}</label>
            {field.type==='input'
              ? <input id={'submission-'+field.name} maxLength={field.max}
                  value={form[field.name]} onChange={e=>change(field.name,e.target.value)}
                  placeholder={field.placeholder}/>
              : <textarea id={'submission-'+field.name} maxLength={field.max} rows={3}
                  value={form[field.name]} onChange={e=>change(field.name,e.target.value)}
                  placeholder={field.placeholder}/>}
          </div>)}
          <div className="submission-desk__field">
            <label htmlFor="submission-credit">CREATIVE CREDIT TYPE</label>
            <select id="submission-credit" value={form.creditType} onChange={e=>change('creditType',e.target.value)}>
              <option value="human">Human artist</option>
              <option value="human-ai-assisted">Human artist with AI/software assistance</option>
              <option value="agent-with-human-operator">Agent-assisted work with responsible human operator</option>
            </select>
          </div>
          <div className="submission-desk__field">
            <label htmlFor="submission-license">PROPOSED ARTWORK RIGHTS STATUS</label>
            <select id="submission-license" value={form.license} onChange={e=>change('license',e.target.value)}>
              <option value="rights-retained">Rights retained: negotiate permission with curator</option>
              <option value="cc-by-4.0">Propose Creative Commons Attribution 4.0</option>
              <option value="cc0-1.0">Propose CC0 1.0 public domain dedication</option>
            </select>
            <small>These are proposed terms only. Preparing a kit does not grant publication rights.</small>
          </div>
        </div>
        <div className="submission-desk__consent">
          <label><input type="checkbox" checked={form.rightsConfirmed}
            onChange={e=>change('rightsConfirmed',e.target.checked)}/>
            I have the right to propose this artwork and have accurately credited all contributors.</label>
          <label><input type="checkbox" checked={form.publicConfirmed}
            onChange={e=>change('publicConfirmed',e.target.checked)}/>
            I understand the GitHub proposal issue is public and will review all text before posting.</label>
        </div>
        {errors.length>0 && <div className="submission-desk__errors" role="alert">
          <strong>Before preparing a kit:</strong>
          <ul>{errors.map(error=><li key={error}>{error}</li>)}</ul>
        </div>}
        <div className="submission-desk__actions">
          <button type="button" onClick={exportKit}>DOWNLOAD CURATOR KIT (.JSON) ↗</button>
          <button type="button" onClick={exportSvg}>DOWNLOAD ARTWORK (.SVG)</button>
          <button type="button" onClick={copyIssue}>COPY PUBLIC PROPOSAL TEXT</button>
          <a href={ISSUE_URL} target="_blank" rel="noopener noreferrer">OPEN GITHUB PROPOSAL FORM ↗</a>
        </div>
        <p role="status" aria-live="polite" className="submission-desk__feedback">{feedback}</p>
        <p className="submission-desk__notice">The GitHub form opens separately. You must submit it yourself. Downloading or copying files is not an exhibition submission or approval.</p>
      </div>
    </div>
  </section>;
}
