import test from 'node:test';
import assert from 'node:assert/strict';
import { domistikaDialoguesExhibition,domistikaDialoguePairs } from '../data/domistikaDialogues.js';
import { validateDialoguePairs,installedDialoguePairs,dialogueFromHash,nextDialogueId } from './dialogues.js';

const fakeSha='f'.repeat(64);
const pair=(id='chromatic-cathedral')=>({
  id,title:'Chromatic Cathedral',year:'2026',status:'approved',
  originalCredit:'Human artist using Domistika',
  inspiredCredit:'ChatGPT-assisted inspired reinterpretation',
  curatorialNote:'Two linked works explore repeated eye-like geometry and the limits of perspective.',
  process:'The artist drew the original using radial symmetry. An inspired image was created in a separate response.',
  provenance:{
    originalTool:'Domistika',inspiredTool:'OpenAI image generation',
    humanDirection:'Human created the original and directed the AI-inspired response.',
    originalOwnerApproved:true,inspiredImageApproved:true,
  },
  tags:['geometry','human-AI dialogue'],
  original:{file:id+'-original.webp',mime:'image/webp',sha256:fakeSha,alt:'Nested concentric forms sketched in warm colors on a flat dark surface.'},
  inspired:{file:id+'-inspired.webp',mime:'image/webp',sha256:fakeSha,alt:'Expanded luminous geometric architecture with nested concentric forms and depth.'},
});

test('opening Exhibition 004 has a real empty state, not fictional artwork',()=>{
  assert.equal(domistikaDialoguesExhibition.id,'004');
  assert.deepEqual(domistikaDialoguePairs,[]);
  assert.deepEqual(validateDialoguePairs(domistikaDialoguePairs),[]);
  assert.deepEqual(installedDialoguePairs(domistikaDialoguePairs,{}),[]);
});

test('approved paired-art records pass schema and only display when both images exist',()=>{
  const approved=pair();
  assert.deepEqual(validateDialoguePairs([approved]),[]);
  const one={'./assets/dialogues/chromatic-cathedral-original.webp':'/one.webp'};
  const both={...one,'./assets/dialogues/chromatic-cathedral-inspired.webp':'/two.webp'};
  assert.deepEqual(installedDialoguePairs([approved],one),[]);
  assert.deepEqual(installedDialoguePairs([approved],both),[approved]);
  assert.equal(dialogueFromHash([approved],'#dialogue-chromatic-cathedral')?.id,approved.id);
  assert.equal(dialogueFromHash([approved],'#dialogue-unknown'),null);
  assert.equal(nextDialogueId([approved],approved.id,1),approved.id);
  assert.equal(nextDialogueId([],approved.id,-1),null);
});

test('unapproved, uncredited, duplicate or unsafe exhibit records are rejected',()=>{
  const good=pair();
  for(const bad of [
    {...good,status:'pending'},
    {...good,originalCredit:''},
    {...good,inspiredCredit:''},
    {...good,curatorialNote:'too short'},
    {...good,provenance:{...good.provenance,originalOwnerApproved:false}},
    {...good,original:{...good.original,alt:''}},
    {...good,inspired:{...good.inspired,file:'../../private.png'}},
    {...good,inspired:{...good.inspired,sha256:'0'}},
    {...good,inspired:{...good.inspired,file:good.original.file}},
  ]) assert.ok(validateDialoguePairs([bad]).length>0);
  assert.ok(validateDialoguePairs([good,good]).some(error=>error.includes('Duplicate')));
  assert.ok(validateDialoguePairs(null).length>0);
});
