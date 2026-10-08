import { curatedWorks } from '../src/data/curatedWorks.js';
import events from '../src/data/curatorialEvents.json' with {type:'json'};
import { makeCuratorialEvent, validateCuratorialLifecycle } from '../src/lib/curatorialLifecycle.js';

const usage='Usage: npm run stage:curatorial-change -- <artwork-id> <revise|withdraw> <YYYY-MM-DD> <public-curator-note> --ack-human-review';
const [id,action,date,note,ack,...other]=process.argv.slice(2);
if(!id || !['revise','withdraw'].includes(action) || !date || !note ||
  ack!=='--ack-human-review' || other.length) {
  console.error(usage);
  process.exit(2);
}
const work=curatedWorks.find(item=>item.id===id);
if(!work) {
  console.error('Artwork not currently published. No revision or withdrawal staged.');
  process.exit(1);
}
const newRevision=work.revision+1;
const proposedEvent=makeCuratorialEvent(work,action,newRevision,date,note);
const proposedWorks=action==='withdraw'
  ? curatedWorks.filter(item=>item.id!==id)
  : curatedWorks.map(item=>item.id===id?{...item,revision:newRevision}:item);
const result=validateCuratorialLifecycle(proposedWorks,[...events,proposedEvent]);
if(result.length) {
  console.error('Invalid proposed curatorial change:');
  result.forEach(error=>console.error(' - '+error));
  process.exit(1);
}
console.log('AFTER INDEPENDENT HUMAN REVIEW, APPEND THIS EVENT TO src/data/curatorialEvents.json:');
console.log(JSON.stringify(proposedEvent,null,2));
console.log('');
if(action==='withdraw') {
  console.log('In the SAME curator-reviewed PR, remove work '+id+' from src/data/curatedWorks.js.');
  console.log('Its SVG will no longer render in Exhibition 003. Git history may still retain older data.');
} else {
  console.log('In the SAME curator-reviewed PR, update work '+id+' to revision '+newRevision+'.');
  console.log('Modify only the approved fields and verify rights/alt text for any new visuals or credits.');
}
console.log('No files changed, no artwork withdrawn/revised, and no approval granted by this helper.');
