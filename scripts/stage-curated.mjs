import { readFile } from 'node:fs/promises';
import { stageCurationRecord } from '../src/lib/curation.js';
import { makeCuratorialEvent } from '../src/lib/curatorialLifecycle.js';

const usage='Usage: npm run stage:curated -- <proposal.json> <issue-url> <YYYY-MM-DD> <review-note> --ack-human-review';
const [file,issueUrl,reviewDate,notes,ack,...additional]=process.argv.slice(2);
if(!file || !issueUrl || !reviewDate || !notes || ack!=='--ack-human-review' || additional.length) {
  console.error(usage);
  process.exit(2);
}
try {
  const source=await readFile(file,'utf8');
  if(source.length>500_000) throw Error('Proposal file exceeds 500 KB.');
  const packet=JSON.parse(source);
  const result=stageCurationRecord(packet,{issueUrl,reviewDate,notes});
  if(!result.ok){
    console.error('Refusing to stage curated record:');
    result.errors.forEach(error=>console.error(' - '+error));
    process.exitCode=1;
  } else {
    console.log('COPY THIS RECORD INTO src/data/curatedWorks.js USING A HUMAN-REVIEWED PR:');
    console.log(JSON.stringify(result.work,null,2));
    console.log('');
    console.log('ALSO APPEND THIS EVENT TO src/data/curatorialEvents.json IN THE SAME REVIEWED PR:');
    console.log(JSON.stringify(makeCuratorialEvent(result.work,'publish',1,reviewDate,notes),null,2));
    console.log('');
    console.log('The release gate requires both the public work and its publication event together.');
    console.log('This program does NOT verify real identity, ownership or permissions.');
    console.log('No files were edited and no publication or approval was performed.');
  }
}catch(error){
  console.error('Unable to stage proposal: '+(error?.message||'Unknown error'));
  process.exitCode=1;
}
