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

test('Exhibition 004 contains four approved founding pairs, each with original and response provenance',()=>{
  assert.equal(domistikaDialoguesExhibition.id,'004');
  assert.equal(domistikaDialoguePairs.length,4);
  assert.deepEqual(domistikaDialoguePairs.map(x=>x.id),[
    'chromatic-gear-cathedral',
    'the-ninefold-trickster',
    'orbit-of-a-thousand-hinges',
    'the-eye-that-blooms',
  ]);
  assert.deepEqual(validateDialoguePairs(domistikaDialoguePairs),[]);
  for(const artwork of domistikaDialoguePairs) {
    assert.equal(artwork.status,'approved');
    assert.equal(artwork.provenance.originalTool,'Domistika');
    assert.match(artwork.inspiredCredit,/ChatGPT.*Sol 5\.6/);
    assert.notEqual(artwork.original.sha256,artwork.inspired.sha256);
    assert.match(artwork.original.file,/\-original\.webp$/);
    assert.match(artwork.inspired.file,/\-inspired\.webp$/);
  }
  // Build-time lookup must refuse to display incomplete pairs.
  assert.deepEqual(installedDialoguePairs(domistikaDialoguePairs,{}),[]);
  const onlyOriginals=Object.fromEntries(domistikaDialoguePairs.map(x=>
    ['./assets/dialogues/'+x.original.file,'/original.webp']));
  assert.deepEqual(installedDialoguePairs(domistikaDialoguePairs,onlyOriginals),[]);
  const complete=Object.fromEntries(domistikaDialoguePairs.flatMap(x=>[
    ['./assets/dialogues/'+x.original.file,'/original.webp'],
    ['./assets/dialogues/'+x.inspired.file,'/inspired.webp'],
  ]));
  assert.deepEqual(installedDialoguePairs(domistikaDialoguePairs,complete),domistikaDialoguePairs);
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
