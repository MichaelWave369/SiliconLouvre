import { makeStudioSvg, normalizeStudioConfig } from './studio.js';

export const SUBMISSION_SCHEMA = 'silicon-louvre.artist-proposal.v1';
export const SUBMISSION_CREDIT_TYPES = Object.freeze(['human','human-ai-assisted','agent-with-human-operator']);
export const SUBMISSION_LICENSES = Object.freeze(['rights-retained','cc-by-4.0','cc0-1.0']);

const scrub = (value, limit) => typeof value === 'string'
  ? value.trim().replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0,limit)
  : '';

export function normalizeSubmissionFields(input = {}) {
  return {
    title: scrub(input.title,80),
    displayName: scrub(input.displayName,60),
    description: scrub(input.description,650),
    alt: scrub(input.alt,280),
    process: scrub(input.process,900),
    collaborators: scrub(input.collaborators,450),
    creditType: SUBMISSION_CREDIT_TYPES.includes(input.creditType) ? input.creditType : '',
    license: SUBMISSION_LICENSES.includes(input.license) ? input.license : '',
    rightsConfirmed: input.rightsConfirmed === true,
    publicConfirmed: input.publicConfirmed === true,
  };
}

export function validateSubmissionFields(raw) {
  const value=normalizeSubmissionFields(raw);
  const errors=[];
  for(const [key,label,minimum] of [
    ['title','Artwork title',3],
    ['displayName','Public display name',2],
    ['description','Artwork story',20],
    ['alt','Artwork accessibility description',18],
    ['process','Creation process',20],
    ['collaborators','Contributor credits',12],
  ]) {
    if(value[key].length<minimum) errors.push(label+' is missing or too short.');
  }
  if(!value.creditType) errors.push('Choose how the artwork was created.');
  if(!value.license) errors.push('Choose a proposed license or retained-rights status.');
  if(!value.rightsConfirmed) errors.push('Confirm you have the right to propose this artwork.');
  if(!value.publicConfirmed) errors.push('Confirm you understand GitHub issues are public.');
  return {ok:errors.length===0,errors,value};
}

export function submissionRecord(raw, config, timestamp='') {
  const checked=validateSubmissionFields(raw);
  if(!checked.ok) return {ok:false,errors:checked.errors};
  const normalized=normalizeStudioConfig(config);
  const svg=makeStudioSvg(normalized);
  const {rightsConfirmed,publicConfirmed,...publicFields}=checked.value;
  return {ok:true,data:{
    schema:SUBMISSION_SCHEMA,
    createdAt:timestamp,
    exhibitionStatus:'proposal-only',
    publicationAuthority:'human-curator-review-required',
    artwork:{...publicFields},
    source:{kind:'silicon-louvre-studio',format:'image/svg+xml',width:800,height:800,
      recipe:{format:'silicon-louvre-studio/v1',...normalized}},
    files:[{name:'artwork.svg',format:'image/svg+xml',data:svg}],
    notes:'Preparing a kit does not submit, grant the museum a license, or publish artwork.',
  }};
}

export function submissionIssueText(record) {
  if(!record || record.schema!==SUBMISSION_SCHEMA) return '';
  const f=record.artwork;
  const plain=(s)=>String(s).replace(/[<>{}\\]/g,'').replace(/\r?\n/g,' ').trim();
  return [
    'PROPOSED EXHIBITION: '+plain(f.title),
    'PUBLIC ARTIST NAME: '+plain(f.displayName),
    'CREATIVE CREDIT TYPE: '+plain(f.creditType),
    'PROPOSED RIGHTS STATUS: '+plain(f.license),
    '',
    'ARTWORK STORY:',plain(f.description),'',
    'ACCESSIBILITY DESCRIPTION:',plain(f.alt),'',
    'CREATION PROCESS:',plain(f.process),'',
    'CONTRIBUTOR ROLES:',plain(f.collaborators),'',
    'SOURCE: Silicon Louvre Studio; static 800x800 SVG artwork.',
    'Art file must be provided separately for curator review. Not approved for publication.',
  ].join('\n');
}

export function submissionFilename(title) {
  const safe=scrub(title,80).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);
  return 'silicon-louvre-proposal-'+(safe||'artwork')+'.json';
}
