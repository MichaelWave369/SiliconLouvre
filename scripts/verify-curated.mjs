import { readFile } from 'node:fs/promises';
import { curatedWorks } from '../src/data/curatedWorks.js';
import { validateCuratedWorks } from '../src/lib/curation.js';
import events from '../src/data/curatorialEvents.json' with {type:'json'};
import { validateCuratorialLifecycle } from '../src/lib/curatorialLifecycle.js';
import { inspectSubmissionPacket } from '../src/lib/submissions.js';

const errors=[...validateCuratedWorks(curatedWorks), ...validateCuratorialLifecycle(curatedWorks,events)];
if(errors.length){
  console.error('Curated collection release gate FAILED:');
  errors.forEach(error=>console.error(' - '+error));
  process.exitCode=1;
}else{
  console.log('Curated gallery: '+curatedWorks.length+' active exhibit(s), '+events.length+' review event(s), release gate PASS.');
  if(curatedWorks.length===0) console.log('The new community gallery is awaiting its first curator-approved submission.');
}

// Optional local packet check, separate from approvals.
// Usage: node scripts/verify-curated.mjs <artist-kit.json>
if(process.argv[2]){
  try{
    const raw=await readFile(process.argv[2],'utf8');
    if(raw.length>500_000) throw Error('Submitted kit is too large.');
    const check=inspectSubmissionPacket(JSON.parse(raw));
    if(!check.ok){
      check.errors.forEach(error=>console.error(' - '+error));
      process.exitCode=1;
    }else console.log('Local proposal kit matches the current generator. Human curation is still required.');
  }catch(error){
    console.error('Unable to verify artist kit: '+(error?.message||'Unknown error'));
    process.exitCode=1;
  }
}
