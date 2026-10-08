import { MODES, PALETTES, normalizeStudioConfig } from './studio.js';
import { SUBMISSION_CREDIT_TYPES, SUBMISSION_SCHEMA, inspectSubmissionPacket } from './submissions.js';

export const CURATION_REVIEWER = 'MichaelWave369';
const LICENSES = new Set(['rights-retained','cc-by-4.0','cc0-1.0']);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REPO_ISSUE = /^https:\/\/github\.com\/MichaelWave369\/SiliconLouvre\/issues\/([1-9][0-9]*)$/;

export function curatedWorkById(works, id) {
  return works.find(work => work.id === id) ?? null;
}

export function validateCuratedWorks(works) {
  const errors=[];
  if(!Array.isArray(works)) return ['Curated works catalog must be an array.'];
  const seen=new Set();
  for(const work of works) {
    if(!work || typeof work!=='object' || Array.isArray(work)) {
      errors.push('Invalid curated record object.'); continue;
    }
    const id=work.id;
    if(typeof id!=='string' || !SLUG.test(id) || id.length>72)
      errors.push('Invalid curated work id: '+String(id));
    if(seen.has(id)) errors.push('Duplicate curated work id: '+id);
    seen.add(id);
    if(work.status!=='approved') errors.push('Unapproved work in public catalog: '+id);
    if(!Number.isInteger(work.revision) || work.revision<1 || work.revision>1000)
      errors.push('Invalid catalog revision for '+id);
    for(const [field,min,max] of [
      ['title',3,80],['displayName',2,60],['description',20,650],
      ['alt',18,280],['process',20,900],['collaborators',12,450],
    ]) {
      if(typeof work[field]!=='string' || work[field].trim().length<min ||
         work[field].length>max) errors.push('Invalid '+field+' for '+id);
    }
    if(!SUBMISSION_CREDIT_TYPES.includes(work.creditType))
      errors.push('Unknown creative credit type: '+id);
    if(!LICENSES.has(work.license)) errors.push('Unsupported proposed rights status: '+id);
    if(typeof work.sourceIssue!=='string' || !REPO_ISSUE.test(work.sourceIssue))
      errors.push('Missing GitHub proposal issue URL: '+id);
    if(work.sourceSchema!==SUBMISSION_SCHEMA)
      errors.push('Unknown proposal schema: '+id);
    const recipe=work.recipe;
    if(!recipe || recipe.format!=='silicon-louvre-studio/v1' ||
       !MODES.includes(recipe.mode) || !Object.hasOwn(PALETTES,recipe.palette)) {
      errors.push('Invalid recipe type: '+id);
    } else {
      const normalized=normalizeStudioConfig(recipe);
      if(Object.entries(normalized).some(([key,value])=>recipe[key]!==value))
        errors.push('Out-of-range creative recipe: '+id);
    }
    const review=work.review;
    if(!review || typeof review!=='object' ||
       review.decision!=='approved' ||
       review.curator!==CURATION_REVIEWER ||
       !/^\d{4}-\d{2}-\d{2}$/.test(review.date||'') ||
       !Number.isFinite(Date.parse(review.date+'T00:00:00Z')) ||
       !review.checks || Object.values({
         rights:review.checks.rights,
         provenance:review.checks.provenance,
         accessibility:review.checks.accessibility,
         imageIntegrity:review.checks.imageIntegrity,
       }).some(checked=>checked!==true)) {
      errors.push('Missing explicit curator review receipt and four required checks: '+id);
    }
    if(review && (typeof review.notes!=='string' || review.notes.trim().length<20))
      errors.push('Missing curator decision notes: '+id);
  }
  return errors;
}

/**
 * Human-authorized staging helper: structural integrity is verified locally,
 * but no function can establish identity, legal rights or genuine approval.
 */
export function stageCurationRecord(packet, {issueUrl,reviewDate,notes} = {}) {
  const integrity=inspectSubmissionPacket(packet);
  if(!integrity.ok) return {ok:false,errors:integrity.errors};
  const id=String(packet.artwork.title||'').toLowerCase()
    .normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,62);
  const work={
    id,
    status:'approved',
    revision:1,
    sourceSchema:SUBMISSION_SCHEMA,
    sourceIssue:issueUrl,
    title:packet.artwork.title,
    displayName:packet.artwork.displayName,
    description:packet.artwork.description,
    alt:packet.artwork.alt,
    process:packet.artwork.process,
    collaborators:packet.artwork.collaborators,
    creditType:packet.artwork.creditType,
    license:packet.artwork.license,
    recipe:{...packet.source.recipe},
    review:{
      decision:'approved',curator:CURATION_REVIEWER,date:reviewDate,
      notes,
      checks:{rights:true,provenance:true,accessibility:true,imageIntegrity:true},
    },
  };
  const errors=validateCuratedWorks([work]);
  return errors.length ? {ok:false,errors} : {ok:true,work};
}
