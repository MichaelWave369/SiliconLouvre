import test from 'node:test';
import assert from 'node:assert/strict';
import { communityExhibition, curatedWorks } from '../data/curatedWorks.js';
import { CURATION_REVIEWER, curatedWorkById, validateCuratedWorks, stageCurationRecord } from './curation.js';
import { submissionRecord } from './submissions.js';
import { PRESETS } from './studio.js';

const packetForm={
 title:'Arc of Daylight',displayName:'Public Artist Alias',
 description:'A radial study exploring nested shapes and bright light against a dark background.',
 alt:'Many gold and dark concentric petals surround a central small circle.',
 process:'Chosen and refined with the static SVG generator using a human-selected palette and twist.',
 collaborators:'Human-led visual direction and rule-based SVG generator, with no named agent authorship.',
 creditType:'human-ai-assisted',license:'rights-retained',
 rightsConfirmed:true,publicConfirmed:true,
};
const proposal=submissionRecord(packetForm,PRESETS.iris,'2026-10-08T20:00:00Z').data;
const approvalOptions={
 issueUrl:'https://github.com/MichaelWave369/SiliconLouvre/issues/101',
 reviewDate:'2026-10-08',
 notes:'Curator independently reviewed ownership documentation and creative process.',
};

test('new community gallery begins without pretending proposals were approved',()=>{
  assert.equal(communityExhibition.id,'003');
  assert.deepEqual(curatedWorks,[]);
  assert.deepEqual(validateCuratedWorks(curatedWorks),[]);
  assert.equal(curatedWorkById([], 'fictional-artwork'),null);
});

test('an explicit record can be staged for human PR review',()=>{
  const r=stageCurationRecord(proposal,approvalOptions);
  assert.equal(r.ok,true);
  assert.equal(r.work.id,'arc-of-daylight');
  assert.equal(r.work.review.curator,CURATION_REVIEWER);
  assert.equal(r.work.status,'approved');
  assert.deepEqual(validateCuratedWorks([r.work]),[]);
  assert.equal(curatedWorkById([r.work],r.work.id),r.work);
});

test('invalid recipes, missing credit or review receipts fail the release gate',()=>{
  const good=stageCurationRecord(proposal,approvalOptions).work;
  const bad=[
    {...good,status:'proposed'},
    {...good,alt:''},
    {...good,sourceIssue:'https://evil.example/issues/1'},
    {...good,review:{...good.review,curator:'RandomBot'}},
    {...good,review:{...good.review,checks:{...good.review.checks,rights:false}}},
    {...good,review:{...good.review,notes:'ok'}},
    {...good,recipe:{...good.recipe,rings:900}},
  ];
  for(const item of bad) assert.ok(validateCuratedWorks([item]).length>0);
  assert.ok(validateCuratedWorks([good,good]).some(e=>e.includes('Duplicate')));
  assert.equal(stageCurationRecord({...proposal,exhibitionStatus:'approved'},approvalOptions).ok,false);
  assert.equal(stageCurationRecord(proposal,{...approvalOptions,issueUrl:'no'}).ok,false);
});
