import { readdir,readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname,join,resolve } from 'node:path';
import { domistikaDialoguePairs } from '../src/data/domistikaDialogues.js';
import { validateDialoguePairs } from '../src/lib/dialogues.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const directory=join(root,'src/assets/dialogues');
const errors=validateDialoguePairs(domistikaDialoguePairs);
const expected=new Map();
for(const pair of domistikaDialoguePairs){
  for(const role of ['original','inspired']){
    if(pair[role]?.file)expected.set(pair[role].file,{...pair[role],pairId:pair.id,role});
  }
}
let found=[];
try {
  found=(await readdir(directory)).filter(name=>/\.(png|jpg|jpeg|webp)$/i.test(name));
}catch(error) {
  if(error.code!=='ENOENT')throw error;
}
for(const name of found) {
  if(!expected.has(name)) errors.push('Uncataloged image in Exhibition 004: '+name);
}
for(const [name,record] of expected){
  if(!found.includes(name)){
    errors.push('Missing '+record.role+' image for '+record.pairId+': '+name);
    continue;
  }
  const bytes=await readFile(join(directory,name));
  if(bytes.length<1024 || bytes.length>8_000_000){
    errors.push('Invalid artwork file size: '+name);continue;
  }
  const extension=name.split('.').pop().toLowerCase();
  const validHeader=extension==='webp'
    ? bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP'
    : extension==='png'
      ? bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
      : bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff;
  if(!validHeader){
    errors.push('Invalid image header: '+name);continue;
  }
  const hash=createHash('sha256').update(bytes).digest('hex');
  if(hash!==record.sha256)errors.push('SHA-256 mismatch for '+name);
}
if(errors.length){
  console.error('Domistika Dialogues verification FAILED:');
  for(const error of errors)console.error(' - '+error);
  process.exitCode=1;
}else {
  console.log('Domistika Dialogues: '+domistikaDialoguePairs.length+' authorized pair(s), '+found.length+' image(s) verified.');
  if(!domistikaDialoguePairs.length)
    console.log('Exhibition 004 is ready; awaiting real owner-approved original/response artwork pairs.');
}
