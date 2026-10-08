import test from 'node:test';
import assert from 'node:assert/strict';
import { makeCuratorialEvent, validateCuratorialLifecycle, isCalendarDate, recentPublicDecisions } from './curatorialLifecycle.js';
import { curatedWorks } from '../data/curatedWorks.js';
import events from '../data/curatorialEvents.json' with {type:'json'};

const sourceIssue='https://github.com/MichaelWave369/SiliconLouvre/issues/101';
const item={id:'arc-of-daylight',sourceIssue,revision:1};
const event=(action,revision,date='2026-10-08',note='Curator reviewed this change and its permissions.')=>
 makeCuratorialEvent(item,action,revision,date,note);

test('current empty museum does not pretend a curatorial history exists',()=>{
  assert.deepEqual(curatedWorks,[]);
  assert.deepEqual(events,[]);
  assert.deepEqual(validateCuratorialLifecycle(curatedWorks,events),[]);
  assert.deepEqual(recentPublicDecisions(events),[]);
});

test('publication, revision and final withdrawal follow sequential approved history',()=>{
  const published=event('publish',1);
  const revised=event('revise',2,'2026-10-09');
  const withdrawn=event('withdraw',3,'2026-10-10','Creator-approved removal from the public gallery.');
  assert.deepEqual(validateCuratorialLifecycle([item],[published]),[]);
  assert.deepEqual(validateCuratorialLifecycle([{...item,revision:2}],[published,revised]),[]);
  assert.deepEqual(validateCuratorialLifecycle([], [published,revised,withdrawn]),[]);
  assert.deepEqual(recentPublicDecisions([published,revised,withdrawn],2),[withdrawn,revised]);
});

test('rejects orphaned public art, silent changes, restoration and forged review receipts',()=>{
  const published=event('publish',1);
  const revised=event('revise',2,'2026-10-09');
  const withdrawn=event('withdraw',3,'2026-10-10');
  const wrong=[
    {works:[item],events:[]},
    {works:[],events:[published]},
    {works:[{...item,revision:2}],events:[published]},
    {works:[item],events:[published,withdrawn]},
    {works:[{...item,revision:4}],events:[published,revised]},
    {works:[],events:[published,withdrawn,event('publish',4,'2026-10-11')]},
    {works:[item],events:[{...published,curator:'UnverifiedBot'}]},
    {works:[item],events:[{...published,sourceIssue:'https://wrong.example/issue/1'}]},
    {works:[item],events:[published,published]},
    {works:[],events:[event('withdraw',1)]},
    {works:[item],events:[{...published,date:'2026-02-30'}]},
  ];
  for(const sample of wrong)
    assert.ok(validateCuratorialLifecycle(sample.works,sample.events).length>0);
});

test('calendar dates require actual days, not just numbers',()=>{
  assert.equal(isCalendarDate('2026-10-08'),true);
  assert.equal(isCalendarDate('2026-02-30'),false);
  assert.equal(isCalendarDate('2026-13-01'),false);
  assert.equal(isCalendarDate('not a date'),false);
});
