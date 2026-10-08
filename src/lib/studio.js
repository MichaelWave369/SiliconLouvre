/**
 * An intentionally deterministic, code-generated optical-art sandbox.
 * Safe values and preset palettes only. No uploaded data or remote API.
 */
export const PALETTES = Object.freeze({
  gilded: Object.freeze(['#d8b878','#f8e7bc','#56347c','#14122c','#2a9db6']),
  neon: Object.freeze(['#f6d14a','#ed4da8','#3d40d1','#a6f3e7','#12122e']),
  aurora: Object.freeze(['#8beddc','#1f9dba','#d3e9a8','#f2b868','#122449']),
  ember: Object.freeze(['#f5d7a2','#eb8a52','#ad3964','#54225c','#181427']),
});

export const MODES = Object.freeze(['bloom','clockwork','iris']);
export const PRESETS = Object.freeze({
  bloom: Object.freeze({ mode:'bloom', palette:'gilded', rings:6, segments:24, twist:30 }),
  clockwork: Object.freeze({ mode:'clockwork', palette:'aurora', rings:7, segments:18, twist:-24 }),
  iris: Object.freeze({ mode:'iris', palette:'neon', rings:5, segments:16, twist:18 }),
});

const clamp = (value, low, high, defaultValue) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(low, Math.min(high, Math.round(number))) : defaultValue;
};

export function normalizeStudioConfig(value = {}) {
  return {
    mode: MODES.includes(value.mode) ? value.mode : 'bloom',
    palette: Object.hasOwn(PALETTES, value.palette) ? value.palette : 'gilded',
    rings: clamp(value.rings, 2, 9, 6),
    segments: clamp(value.segments, 6, 36, 24),
    twist: clamp(value.twist, -90, 90, 30),
  };
}

const round = (n) => Number(n.toFixed(3));
const degrees = (a) => a * Math.PI / 180;
const polar = (r, a) => {
  const radians = degrees(a);
  return [round(400 + r * Math.cos(radians)), round(400 + r * Math.sin(radians))];
};

function petal(cx, cy, length, width, color, stroke) {
  return '<path data-motif="yes" d="M0 '+round(length/2)+' C'+round(-width)+' '+round(length*.13)+' '+round(-width*.75)+' '+round(-length*.32)+' 0 '+round(-length/2)+' C'+round(width*.75)+' '+round(-length*.32)+' '+round(width)+' '+round(length*.13)+' 0 '+round(length/2)+' Z" transform="translate('+cx+' '+cy+')" fill="'+color+'" stroke="'+stroke+'" stroke-width="3"/>';
}

function motif({ mode, r, angle, color, accent, i, ring }) {
  const [cx, cy] = polar(r, angle - 90);
  if (mode === 'iris') {
    const size = 15 + ring * 2.1;
    return '<g data-motif="yes" transform="translate('+cx+' '+cy+') rotate('+round(angle)+')">'+
      '<path d="M'+round(-size*1.55)+' 0 Q0 '+round(-size*1.55)+' '+round(size*1.55)+' 0 Q0 '+round(size*1.55)+' '+round(-size*1.55)+' 0Z" fill="'+accent+'" stroke="'+color+'" stroke-width="4"/>'+
      '<circle r="'+round(size*.71)+'" fill="'+color+'" stroke="#110f28" stroke-width="4"/>'+
      '<circle r="'+round(size*.31)+'" fill="#0e0b1d"/><circle cx="'+round(-size*.2)+'" cy="'+round(-size*.22)+'" r="'+round(size*.13)+'" fill="#ffffff"/></g>';
  }
  if (mode === 'clockwork') {
    const d = (360 / (12 + ring * 2)) * .31;
    const inner = r - 18;
    const outer = r + 19;
    const p1 = polar(inner, angle-d-90), p2 = polar(outer, angle-d*.64-90);
    const p3 = polar(outer, angle+d*.64-90), p4 = polar(inner, angle+d-90);
    return '<polygon data-motif="yes" points="'+[p1,p2,p3,p4].map(p=>p.join(',')).join(' ')+'" fill="'+color+'" stroke="'+accent+'" stroke-width="3.2" stroke-linejoin="round"/>';
  }
  return '<g transform="rotate('+round(angle)+' 400 400)">'+
    petal(400,round(400-r),23+ring*4,17+ring*3,color,accent)+'</g>';
}

export function makeStudioSvg(input = {}) {
  const config = normalizeStudioConfig(input);
  const colors = PALETTES[config.palette];
  const dark = '#0b0a19';
  const base = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="Static generative optical art">',
    '<title>Silicon Louvre - '+config.mode+' optical composition</title>',
    '<desc>Static '+config.mode+' composition, '+config.rings+' concentric rings and '+config.segments+' repeated motifs per ring. No animation.</desc>',
    '<defs><radialGradient id="studio-bg"><stop offset="0%" stop-color="'+colors[2]+'"/><stop offset="54%" stop-color="'+dark+'"/><stop offset="100%" stop-color="'+colors[4]+'"/></radialGradient>',
    '<radialGradient id="studio-core"><stop stop-color="'+colors[1]+'"/><stop offset="60%" stop-color="'+colors[0]+'"/><stop offset="100%" stop-color="'+colors[3]+'"/></radialGradient></defs>',
    '<rect width="800" height="800" fill="url(#studio-bg)"/>',
    '<circle cx="400" cy="400" r="377" fill="none" stroke="'+colors[0]+'" stroke-width="4" opacity=".8"/>',
  ];
  for (let ring = config.rings - 1; ring >= 0; ring--) {
    const r = 62 + ring * (293 / Math.max(1, config.rings - 1));
    const count = config.segments;
    const ringColor = colors[(ring+2)%colors.length];
    base.push('<circle cx="400" cy="400" r="'+round(r)+'" fill="none" stroke="'+ringColor+'" stroke-width="'+(config.mode==='clockwork'?9:2)+'" opacity="'+(config.mode==='clockwork'?.75:.55)+'"/>');
    if (config.mode === 'clockwork') {
      base.push('<circle cx="400" cy="400" r="'+round(r-10)+'" fill="none" stroke="'+colors[(ring+1)%colors.length]+'" stroke-width="2" stroke-dasharray="6 11"/>');
    }
    for (let i = 0; i < count; i++) {
      const angle = 360 * i / count + ring * config.twist / 4;
      base.push(motif({ mode:config.mode, r, angle, color:colors[(i+ring)%colors.length], accent:colors[(i+ring+1)%colors.length], i, ring }));
    }
  }
  base.push('<circle cx="400" cy="400" r="42" fill="url(#studio-core)" stroke="'+colors[1]+'" stroke-width="8"/>');
  base.push('<circle cx="400" cy="400" r="18" fill="'+dark+'" stroke="'+colors[1]+'" stroke-width="4"/>');
  base.push('<circle cx="392" cy="391" r="6" fill="#ffffff" opacity=".9"/>');
  base.push('</svg>');
  return base.join('');
}

export function studioFilename(value = {}) {
  const c = normalizeStudioConfig(value);
  return 'silicon-louvre-'+c.mode+'-'+c.palette+'-'+c.rings+'x'+c.segments+'.svg';
}
