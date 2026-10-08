import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const historical='src/data/curatorialEvents.json';
const onBranch=JSON.parse(readFileSync(historical,'utf8'));
if(!Array.isArray(onBranch)) {
  console.error('Curatorial events must be an array.');
  process.exit(1);
}
let baseline;
try {
  // Verify the base branch exists before classifying a missing path as first-installation.
  execFileSync('git',['rev-parse','--verify','origin/main^{commit}'],{stdio:'pipe'});
  try {
    execFileSync('git',['cat-file','-e','origin/main:'+historical],{stdio:'pipe'});
    baseline=JSON.parse(execFileSync('git',['show','origin/main:'+historical],{encoding:'utf8'}));
  } catch {
    // This PR is the first introduction of the ledger; main has no older events.
    baseline=[];
  }
} catch {
  console.error('Cannot verify base branch. Full Git history must be available in CI.');
  process.exit(1);
}
if(!Array.isArray(baseline) || onBranch.length<baseline.length) {
  console.error('Public decision history must retain all prior events.');
  process.exit(1);
}
for(let i=0;i<baseline.length;i++) {
  if(JSON.stringify(baseline[i]) !== JSON.stringify(onBranch[i])) {
    console.error('Public decision history was edited or reordered at event index '+i+'. Append a new correction event instead.');
    process.exit(1);
  }
}
console.log('Public curatorial history prefix unchanged: '+baseline.length+' earlier decision(s); '+(onBranch.length-baseline.length)+' new event(s).');
