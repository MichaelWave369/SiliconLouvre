import { readFile } from 'node:fs/promises';
import { inspectSubmissionPacket } from '../src/lib/submissions.js';

const file=process.argv[2];
if(!file){
  console.error('Usage: npm run inspect:submission -- /path/to/proposal.json');
  process.exit(2);
}
try{
  const raw=await readFile(file,'utf8');
  if(raw.length>500_000) throw Error('Proposal exceeds the supported size.');
  const packet=JSON.parse(raw);
  const result=inspectSubmissionPacket(packet);
  if(!result.ok){
    console.error('Submission triage FAILED:');
    result.errors.forEach(error=>console.error(' - '+error));
    process.exitCode=1;
  }else{
    console.log('Submission packet structural integrity: PASS');
    console.log('Proposed work: '+packet.artwork.title);
    console.log('Proposed artist credit: '+packet.artwork.displayName);
    console.log('STATUS: Proposal only. Human curator rights, attribution and accessibility review still required.');
  }
}catch(error){
  console.error('Could not inspect the proposal: '+(error?.message||'Unknown error'));
  process.exitCode=1;
}
