/**
 * Pure, browser-safe contracts for Exhibition 004.
 * Image hashes and existence are checked separately by scripts/verify-dialogues.mjs.
 */
export const DIALOGUE_MEDIUMS = Object.freeze(['image/webp','image/png','image/jpeg']);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FILE = /^[a-z0-9][a-z0-9-]{0,75}\.(webp|png|jpg|jpeg)$/;
const SHA = /^[a-f0-9]{64}$/;

const validText = (value,min,max) =>
  typeof value==='string' && value.trim().length>=min && value.length<=max;

export function validateDialoguePairs(pairs) {
  if(!Array.isArray(pairs))return ['Dialogue catalog must be an array.'];
  const errors=[];
  const ids=new Set();
  const filenames=new Set();
  for(const pair of pairs) {
    if(!pair || typeof pair!=='object' || Array.isArray(pair)) {
      errors.push('Invalid pair record.');continue;
    }
    const id=pair.id;
    if(typeof id!=='string' || !SLUG.test(id) || id.length>70)
      errors.push('Invalid pair id: '+String(id));
    if(ids.has(id))errors.push('Duplicate pair id: '+String(id));
    ids.add(id);
    for(const [field,min,max] of [
      ['title',3,90], ['curatorialNote',22,700],['process',25,1000],
      ['originalCredit',2,150], ['inspiredCredit',8,170],
      ['year',4,4],
    ]) {
      if(!validText(pair[field],min,max))errors.push('Invalid '+field+' for '+String(id));
    }
    if(typeof pair.year==='string' && !/^20\d{2}$/.test(pair.year))
      errors.push('Invalid year for '+String(id));
    if(pair.status!=='approved')errors.push('Unapproved dialogue pair: '+String(id));
    if(pair.provenance?.originalTool!=='Domistika' ||
       !validText(pair.provenance?.inspiredTool,3,140) ||
       !validText(pair.provenance?.humanDirection,12,350) ||
       pair.provenance?.originalOwnerApproved!==true ||
       pair.provenance?.inspiredImageApproved!==true) {
      errors.push('Missing independent creative provenance and image permission: '+String(id));
    }
    if(!Array.isArray(pair.tags) || pair.tags.length>8 ||
       pair.tags.some(tag=>!validText(tag,2,32))) {
      errors.push('Invalid artwork tags: '+String(id));
    }
    for(const role of ['original','inspired']) {
      const media=pair[role];
      if(!media || typeof media!=='object' || Array.isArray(media) ||
         typeof media.file!=='string' || !FILE.test(media.file) ||
         !SHA.test(media.sha256||'') ||
         !validText(media.alt,22,340) ||
         !DIALOGUE_MEDIUMS.includes(media.mime)) {
        errors.push('Invalid '+role+' artwork media: '+String(id));continue;
      }
      const extension=media.file.split('.').pop();
      const inferred=extension==='webp'?'image/webp':extension==='png'?'image/png':'image/jpeg';
      if(media.mime!==inferred)errors.push('MIME and extension mismatch: '+media.file);
      if(filenames.has(media.file))errors.push('Duplicate artwork filename: '+media.file);
      filenames.add(media.file);
      if(!media.file.startsWith(id+'-'))errors.push('Artwork filename must start with its pair id: '+media.file);
    }
    if(pair.original?.file && pair.original.file===pair.inspired?.file)
      errors.push('Original and inspired images must be distinct: '+String(id));
  }
  return errors;
}

export function installedDialoguePairs(pairs,assetUrls) {
  return pairs.filter(pair=>Boolean(
    assetUrls['./assets/dialogues/'+pair.original?.file] &&
    assetUrls['./assets/dialogues/'+pair.inspired?.file]
  ));
}

export function dialogueFromHash(pairs,hash) {
  if(typeof hash!=='string' || !hash.startsWith('#dialogue-'))return null;
  const id=hash.slice('#dialogue-'.length);
  return pairs.find(pair=>pair.id===id) || null;
}

export function nextDialogueId(pairs,currentId,delta) {
  if(!pairs.length)return null;
  const index=pairs.findIndex(pair=>pair.id===currentId);
  if(index<0)return pairs[0].id;
  return pairs[((index+delta)%pairs.length+pairs.length)%pairs.length].id;
}
