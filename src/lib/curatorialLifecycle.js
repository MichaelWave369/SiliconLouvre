/**
 * Static, public curatorial decision history.
 * A structured receipt cannot prove real consent or ownership; protected PR
 * review and independent permissions evidence still determine authorization.
 */
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISSUE = /^https:\/\/github\.com\/MichaelWave369\/SiliconLouvre\/issues\/[1-9][0-9]*$/;
const CURATOR = 'MichaelWave369';
const ALLOWED = new Set(['publish','revise','withdraw']);

export function isCalendarDate(date) {
  if(typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const result = new Date(date+'T00:00:00Z');
  return Number.isFinite(result.getTime()) && result.toISOString().slice(0,10) === date;
}

export function makeCuratorialEvent(work, action, revision, date, note) {
  return {
    id:work.id+'-'+action+'-r'+revision,
    workId:work.id,
    action,
    revision,
    date,
    curator:CURATOR,
    sourceIssue:work.sourceIssue,
    note,
  };
}

export function validateCuratorialLifecycle(works,events) {
  const errors=[];
  if(!Array.isArray(works)) return ['Curated catalog must be an array.'];
  if(!Array.isArray(events) || events.length>2000)
    return ['Curatorial history must be a bounded array.'];
  const seen=new Set();
  const state=new Map();
  for(const event of events) {
    if(!event || typeof event !== 'object' || Array.isArray(event)) {
      errors.push('Invalid decision event object.');continue;
    }
    const {id,workId,action,revision,date,curator,sourceIssue,note}=event;
    if(typeof workId !== 'string' || workId.length>72 || !ID.test(workId))
      errors.push('Invalid event artwork id: '+String(workId));
    if(!ALLOWED.has(action)) errors.push('Invalid decision action for '+String(workId));
    if(!Number.isInteger(revision) || revision<1 || revision>1000)
      errors.push('Invalid decision revision for '+String(workId));
    if(id !== workId+'-'+action+'-r'+revision || !ID.test(id||'')) {
      errors.push('Incorrect decision event identifier: '+String(id));
    }
    if(seen.has(id)) errors.push('Duplicate decision event id: '+String(id));
    seen.add(id);
    if(!isCalendarDate(date)) errors.push('Invalid decision calendar date: '+String(workId));
    if(curator!==CURATOR) errors.push('Unknown public curator: '+String(workId));
    if(typeof sourceIssue !== 'string' || !ISSUE.test(sourceIssue))
      errors.push('Missing provenance issue reference: '+String(workId));
    if(typeof note !== 'string' || note.trim().length<20 || note.length>400)
      errors.push('Invalid public decision note: '+String(workId));

    const previous=state.get(workId);
    if(!previous) {
      if(action!=='publish' || revision!==1)
        errors.push('First decision must publish revision 1: '+String(workId));
    } else {
      if(previous.status==='withdrawn')
        errors.push('Withdrawn work cannot be silently reinstated: '+String(workId));
      if(action==='publish')
        errors.push('Duplicate publication instead of revision: '+String(workId));
      if(revision!==previous.revision+1)
        errors.push('Revision sequence gap: '+String(workId));
      if(isCalendarDate(date) && date < previous.date)
        errors.push('Decision date moves backward: '+String(workId));
      if(sourceIssue!==previous.sourceIssue)
        errors.push('Source provenance issue changed: '+String(workId));
    }
    if(typeof workId==='string' && ID.test(workId)) {
      state.set(workId,{
        status:action==='withdraw'?'withdrawn':'published',
        revision,
        date,
        sourceIssue,
      });
    }
  }
  const current=new Set();
  for(const work of works) {
    if(!work || typeof work !== 'object') {
      errors.push('Invalid public artwork record.');continue;
    }
    if(current.has(work.id)) errors.push('Duplicate public artwork id: '+String(work.id));
    current.add(work.id);
    const latest=state.get(work.id);
    if(!latest || latest.status!=='published')
      errors.push('Public artwork lacks active publication history: '+String(work.id));
    else {
      if(latest.revision!==work.revision)
        errors.push('Public artwork revision does not match decision history: '+String(work.id));
      if(latest.sourceIssue!==work.sourceIssue)
        errors.push('Public artwork source issue changed: '+String(work.id));
    }
  }
  for(const [id,entry] of state) {
    if(entry.status==='published' && !current.has(id))
      errors.push('Published artwork missing from public catalog: '+id);
    if(entry.status==='withdrawn' && current.has(id))
      errors.push('Withdrawn artwork still appears publicly: '+id);
  }
  return errors;
}

export function recentPublicDecisions(events,limit=6) {
  if(!Array.isArray(events)) return [];
  return events.slice(-Math.max(0,Math.min(20,limit))).reverse();
}
