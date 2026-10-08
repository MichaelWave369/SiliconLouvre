import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS } from './studio.js';
import {normalizeSubmissionFields,validateSubmissionFields,submissionRecord,submissionIssueText,submissionFilename,SUBMISSION_SCHEMA} from './submissions.js';

const form={
 title:'Chromatic Observatory',
 displayName:'Studio Aurora',
 description:'A calm study of repeated geometric forms and perceived depth.',
 alt:'Concentric colorful petals surround a smaller circle on a dark background.',
 process:'Directed the palette, ring count and twist with the Silicon Louvre creative tools.',
 collaborators:'Human creative director: Studio Aurora. Software: rule-based SVG generator.',
 creditType:'human-ai-assisted',
 license:'rights-retained',
 rightsConfirmed:true,
 publicConfirmed:true,
};

test('full submission record is complete and expressly unapproved',()=>{
 const r=submissionRecord(form,PRESETS.bloom,'2026-10-08T20:00:00Z');
 assert.equal(r.ok,true);
 assert.equal(r.data.schema,SUBMISSION_SCHEMA);
 assert.equal(r.data.exhibitionStatus,'proposal-only');
 assert.equal(r.data.publicationAuthority,'human-curator-review-required');
 assert.equal(r.data.artwork.displayName,'Studio Aurora');
 assert.equal(r.data.source.recipe.rings,6);
 assert.equal(r.data.files.length,1);
 assert.match(r.data.files[0].data,/^<svg /);
 assert.doesNotMatch(JSON.stringify(r.data),/rightsConfirmed|publicConfirmed/);
 assert.match(submissionIssueText(r.data),/NOT APPROVED/i);
 assert.equal(submissionFilename(form.title),'silicon-louvre-proposal-chromatic-observatory.json');
});

test('submissions must contain artistic explanation, text alternative, provenance and consent',()=>{
 assert.equal(validateSubmissionFields(form).ok,true);
 const failures=[
  {...form,title:'a'}, {...form,alt:''},{...form,process:''},{...form,collaborators:''},
  {...form,license:'unknown'},{...form,creditType:'unknown'},
  {...form,rightsConfirmed:false},{...form,publicConfirmed:false},
 ];
 for(const value of failures) assert.equal(validateSubmissionFields(value).ok,false);
 assert.equal(submissionRecord({...form,publicConfirmed:false},PRESETS.iris).ok,false);
});

test('metadata is bounded, labels are scrubbed and generated artwork is independent of metadata',()=>{
 const unsafe={...form,title:'<script>alert(1)</script>'+'x'.repeat(200),
 displayName:'\u0000Some Artist\n',description:'Y'.repeat(900)};
 const clean=normalizeSubmissionFields(unsafe);
 assert.equal(clean.title.length,80);
 assert.ok(clean.description.length<=650);
 assert.equal(clean.displayName,'Some Artist');
 const r=submissionRecord(unsafe,PRESETS.iris,'test');
 assert.equal(r.ok,true);
 assert.doesNotMatch(r.data.files[0].data,/alert\(1\)/);
 assert.doesNotMatch(submissionIssueText(r.data),/<script>/);
 assert.equal(submissionFilename('<script>'),'silicon-louvre-proposal-script.json');
});
