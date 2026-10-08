import { PALETTES, MODES, normalizeStudioConfig } from './studio.js';

export const DRAFTS_STORAGE_KEY = 'silicon-louvre-studio-drafts-v1';
export const MAX_DRAFTS = 12;
export const RECIPE_FORMAT = 'silicon-louvre-studio/v1';

const validPlainObject = (value) => value !== null &&
  typeof value === 'object' && !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;

export function validateRecipe(value) {
  if (!validPlainObject(value)) return {ok:false,error:'Recipe must be a JSON object.'};
  if (value.format !== RECIPE_FORMAT) return {ok:false,error:'Unsupported recipe version.'};
  if (!MODES.includes(value.mode) || !Object.hasOwn(PALETTES,value.palette)) {
    return {ok:false,error:'Unknown composition mode or palette.'};
  }
  for(const [key,min,max] of [['rings',2,9],['segments',6,36],['twist',-90,90]]) {
    if (!Number.isInteger(value[key]) || value[key]<min || value[key]>max) {
      return {ok:false,error:'Invalid '+key+' setting.'};
    }
  }
  const expected=new Set(['format','mode','palette','rings','segments','twist']);
  if (Object.keys(value).some(k=>!expected.has(k))) {
    return {ok:false,error:'Recipe includes unsupported fields.'};
  }
  return {ok:true,config:normalizeStudioConfig(value)};
}

export function parseRecipe(text) {
  if (typeof text !== 'string' || text.length > 2048) {
    return {ok:false,error:'Recipe text is missing or too large.'};
  }
  let parsed;
  try {parsed=JSON.parse(text);} catch {return {ok:false,error:'Recipe is not valid JSON.'};}
  return validateRecipe(parsed);
}

export function asRecipe(config) {
  return JSON.stringify({format:RECIPE_FORMAT,...normalizeStudioConfig(config)},null,2);
}

export function normalizeDraftName(name) {
  return String(name ?? '').trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,60);
}

export function parseDrafts(raw) {
  if (typeof raw!=='string' || raw.length > 50_000) return [];
  let candidate;
  try {candidate=JSON.parse(raw);} catch {return [];}
  if(!Array.isArray(candidate)) return [];
  const dedup=new Set();
  const result=[];
  for(const d of candidate) {
    if(!validPlainObject(d) || typeof d.id!=='string' ||
      !/^[a-z0-9-]{1,70}$/.test(d.id) || dedup.has(d.id)) continue;
    if(!Number.isFinite(d.savedAt) || d.savedAt<0 ||
      typeof d.name!=='string' || !normalizeDraftName(d.name)) continue;
    const test=validateRecipe(d.recipe);
    if(!test.ok) continue;
    dedup.add(d.id);
    result.push({
      id:d.id,
      name:normalizeDraftName(d.name),
      savedAt:d.savedAt,
      recipe:{format:RECIPE_FORMAT,...test.config},
    });
    if(result.length>=MAX_DRAFTS) break;
  }
  return result;
}

export function saveDraft(current, entry) {
  const normalized=parseDrafts(JSON.stringify([entry]));
  if(!normalized.length) return current;
  return [normalized[0],...current.filter(d=>d.id!==normalized[0].id)].slice(0,MAX_DRAFTS);
}

export function removeDraft(current,id) {
  return current.filter(d=>d.id!==id);
}
