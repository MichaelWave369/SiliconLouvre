import React, { useId } from 'react';

const range = (n) => Array.from({ length: n }, (_, i) => i);
const point = (cx, cy, r, angle) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
const vertices = (cx, cy, r, sides = 6, angle = -Math.PI / 6) =>
  range(sides).map((i) => point(cx, cy, r, angle + (i * Math.PI * 2) / sides).map((n) => n.toFixed(2)).join(',')).join(' ');

function Honeycomb({ id }) {
  const cells = range(22).flatMap((row) => range(21).map((col) => {
    const x = (col - 1) * 31 + (row % 2) * 15.5;
    const y = (row - 1) * 27.5;
    const dx = (x - 304) / 310;
    const dy = (y - 300) / 300;
    return {
      x: 300 + dx * 300 * (0.67 + 0.33 * Math.abs(dy)) + 29 * Math.sin(dy * Math.PI) * Math.exp(-dx * dx * 3),
      y: 300 + dy * 300 * (0.72 + 0.28 * Math.abs(dx)),
      row, col,
    };
  }));
  return <>
    <defs>
      <radialGradient id={id + '-bg'}><stop stopColor="#59329c"/><stop offset=".65" stopColor="#141c64"/><stop offset="1" stopColor="#080e30"/></radialGradient>
      <radialGradient id={id + '-orb'} cx=".31" cy=".28" r=".8"><stop stopColor="#fff4a7"/><stop offset=".36" stopColor="#d8a641"/><stop offset=".78" stopColor="#814e30"/><stop offset="1" stopColor="#22132f"/></radialGradient>
      <radialGradient id={id + '-edge'}><stop offset=".33" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".55"/></radialGradient>
      <clipPath id={id + '-circle'}><circle cx="208" cy="293" r="150"/></clipPath>
    </defs>
    <rect width="600" height="600" fill={'url(#' + id + '-bg)'}/>
    <g>{cells.map((c) => <polygon key={c.row + '-' + c.col}
      points={vertices(c.x, c.y, 19)}
      fill={(c.col + c.row) % 5 === 0 ? '#483692' : '#1a2675'}
      stroke="#d6ab59" strokeWidth="5" strokeLinejoin="round" />)}</g>
    <circle cx="215" cy="302" r="155" fill="#050723" opacity=".8"/>
    <circle cx="208" cy="293" r="152" fill={'url(#' + id + '-orb)'} stroke="#f2d68a" strokeWidth="4"/>
    <g clipPath={'url(#' + id + '-circle)'}>
      {range(13).flatMap((row) => range(13).map((col) => {
        const x = 25 + col * 32 + (row % 2) * 16;
        const y = 100 + row * 29;
        return <polygon key={row + '-' + col} points={vertices(x, y, 20)}
          fill={(col + row) % 4 === 0 ? '#a46a32' : '#bd863c'}
          fillOpacity=".52" stroke="#f7dc84" strokeWidth="5" strokeLinejoin="round"/>;
      }))}
      <circle cx="208" cy="293" r="151" fill={'url(#' + id + '-edge)'}/>
    </g>
    <rect width="600" height="600" fill={'url(#' + id + '-edge)'}/>
  </>;
}

function Mandala({ id }) {
  const colors = ['#ffc641', '#f07b24', '#fbf7eb', '#080914'];
  return <>
    <defs>
      <radialGradient id={id + '-v'}><stop stopColor="#3728aa"/><stop offset="1" stopColor="#0a0829"/></radialGradient>
    </defs>
    <rect width="600" height="600" fill={'url(#' + id + '-v)'}/>
    {range(7).map((ring) => {
      const count = 18 + ring * 12, radius = 22 + ring * 46, len = 35 + ring * 12;
      return <g key={ring}>
        {range(count).map((i) => {
          const a = i * 360 / count + (ring % 2 ? 10 : 0);
          const fill = colors[(i + ring) % colors.length];
          return <g key={i} transform={`translate(300 300) rotate(${a}) translate(0 ${-radius})`}>
            <path d={`M0 0 C${-7 - ring * 1.1} ${-len * .2} ${-15 - ring * 2.8} ${-len * .72} 0 ${-len} C${15 + ring * 2.8} ${-len * .72} ${7 + ring * 1.1} ${-len * .2} 0 0Z`}
              fill={fill} stroke="#080619" strokeWidth="2.7"/>
            <path d={`M-3 ${-len * .25} Q${-11 - ring} ${-len * .67} 0 ${-len * .91}`} fill="none" stroke="#fff4d7" strokeWidth="2.6" opacity=".94"/>
          </g>;
        })}
      </g>;
    })}
    <circle cx="300" cy="300" r="25" fill="#f0a62c" stroke="#160b35" strokeWidth="6"/>
    <circle cx="300" cy="300" r="12" fill="#161162"/>
  </>;
}

function Checker({ id }) {
  const warped = (x, y) => {
    const dx = (x - 300) / 300, dy = (y - 300) / 300;
    const nx = 300 + (x - 300) * (.5 + .5 * Math.abs(dy)) + Math.sin(dy * Math.PI) * 30 * (1 - Math.abs(dx));
    const ny = 300 + (y - 300) * (.48 + .52 * Math.abs(dx));
    return [nx, ny].map((v) => v.toFixed(1)).join(',');
  };
  const shades = ['#f6eeda', '#e3ab38', '#28227d', '#d633be', '#060814', '#1f51c0'];
  return <>
    <defs>
      <radialGradient id={id + '-shade'}><stop stopColor="#090719" stopOpacity=".53"/><stop offset=".4" stopColor="#050718" stopOpacity="0"/><stop offset="1" stopColor="#05020e" stopOpacity=".37"/></radialGradient>
    </defs>
    <rect width="600" height="600" fill="#080911"/>
    {range(20).flatMap((row) => range(20).map((col) => {
      const x = col * 34 - 40, y = row * 34 - 40, s = 35;
      return <polygon key={row + '-' + col}
        points={[warped(x, y), warped(x + s, y), warped(x + s, y + s), warped(x, y + s)].join(' ')}
        fill={shades[((row % 4) + (col % 6) * 2) % shades.length]} stroke="#08060e" strokeWidth="1.7"/>;
    }))}
    <rect width="600" height="600" fill={'url(#' + id + '-shade)'}/>
  </>;
}

function EyeVault({ id }) {
  return <>
    <defs>
      <radialGradient id={id + '-iris'}><stop stopColor="#27104d"/><stop offset=".48" stopColor="#7b38c4"/><stop offset=".8" stopColor="#eac468"/><stop offset="1" stopColor="#270d48"/></radialGradient>
      <radialGradient id={id + '-bg'}><stop stopColor="#3e1861"/><stop offset="1" stopColor="#14071e"/></radialGradient>
    </defs>
    <rect width="600" height="600" fill={'url(#' + id + '-bg)'}/>
    {range(6).map((ring) => {
      const n = 12 + ring * 9, r = 60 + ring * 49, scale = .40 + ring * .15;
      return <g key={ring}>{range(n).map((i) => {
        const angle = (i * Math.PI * 2 / n) + (ring % 2 ? .12 : 0);
        const [x,y] = point(300,300,r,angle);
        return <g key={i} transform={`translate(${x} ${y}) rotate(${angle * 180 / Math.PI + 90}) scale(${scale})`}>
          <path d="M-31 0 Q0 -28 31 0 Q0 28 -31 0Z" fill="#f8edd4" stroke="#c69648" strokeWidth="9"/>
          <circle r="14" fill="#6e34bd" stroke="#1c092f" strokeWidth="4"/>
          <circle r="6.8" fill="#0f0924"/>
          <circle cx="-4" cy="-5" r="3.4" fill="#fff"/>
        </g>;
      })}</g>;
    })}
    <circle cx="300" cy="300" r="49" fill={'url(#' + id + '-iris)'} stroke="#f7c76a" strokeWidth="7"/>
    {range(28).map((i) => <path key={i} d="M300 260 Q293 247 300 241" stroke="#fbd985" strokeWidth="1.8"
      transform={`rotate(${i * 360 / 28} 300 300)`}/>)}
    <circle cx="300" cy="300" r="20" fill="#080714"/>
    <circle cx="293" cy="290" r="7" fill="#fff"/>
  </>;
}

function Tides({ id }) {
  const colors = ['#f1df89', '#f9b92c', '#163bbd', '#faf3de', '#06091e'];
  return <>
    <defs>
      <radialGradient id={id + '-shade'}><stop stopColor="#040a39" stopOpacity="0"/><stop offset="1" stopColor="#030714" stopOpacity=".6"/></radialGradient>
    </defs>
    <rect width="600" height="600" fill="#060c44"/>
    {range(48).map((i) => {
      const y = i * 20 - 140, shift = (i % 6) * 7;
      return <path key={i} d={`M-110 ${y} C100 ${y - 170 + shift} 230 ${y + 180 - shift} 410 ${y - 15} S650 ${y - 190} 730 ${y - 30}`}
        fill="none" stroke={colors[i % colors.length]} strokeWidth={13 + (i % 3) * 3} />;
    })}
    {range(6).flatMap((row) => range(7).map((col) => {
      const x = col * 105 - 10 + (row % 2) * 52;
      const y = row * 110 + 25 + Math.sin(col * 1.8 + row) * 31;
      const r = 19 + (col + row) % 3 * 5;
      return <g key={row + '-' + col}>
        <circle cx={x + 4} cy={y + 7} r={r + 3} fill="#04051a"/>
        <circle cx={x} cy={y} r={r} fill="#f5eaa6" stroke="#112ec9" strokeWidth="7"/>
        <path d={`M${x-r*.84} ${y-r*.52} Q${x+r*.6} ${y-r*.24} ${x+r*.82} ${y+r*.52}`}
          fill="none" stroke="#edaa27" strokeWidth={r * .44}/>
        <circle cx={x - r * .32} cy={y - r * .35} r={r * .15} fill="#fff"/>
      </g>;
    }))}
    <rect width="600" height="600" fill={'url(#' + id + '-shade)'}/>
  </>;
}

function Funnel({ id }) {
  const tiles = range(19).flatMap((row) => range(19).map((col) => {
    const x = (col - 9) * 43, y = (row - 9) * 43;
    const depth = Math.max(.25, Math.sqrt(x * x + y * y) / 500);
    const curve = .38 + .62 * depth;
    return { x: 300 + x * curve + 28 * Math.sin(y / 95) * Math.exp(-Math.abs(x) / 145),
      y: 300 + y * curve, radius: 12 + 13 * depth, row, col };
  }));
  return <>
    <defs>
      <radialGradient id={id + '-dark'}><stop stopColor="#040b20"/><stop offset=".4" stopColor="#0c3463"/><stop offset="1" stopColor="#0a1437"/></radialGradient>
      <radialGradient id={id + '-shade'}><stop stopColor="#000" stopOpacity=".65"/><stop offset=".4" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".45"/></radialGradient>
    </defs>
    <rect width="600" height="600" fill={'url(#' + id + '-dark)'}/>
    {tiles.map((tile) => <g key={tile.row + '-' + tile.col}>
      <polygon points={vertices(tile.x,tile.y,tile.radius * 1.55,4,0)} fill="#d6ad56" stroke="#120f36" strokeWidth="4"/>
      <polygon points={vertices(tile.x,tile.y,tile.radius,4,0)}
        fill={(tile.row + tile.col) % 3 === 0 ? '#2ec6d8' : '#165cc4'} stroke="#f6e5b8" strokeWidth="2.5"/>
      <polygon points={vertices(tile.x,tile.y,tile.radius * .50,4,0)}
        fill="#06366f" stroke="#12337b" strokeWidth="1.5"/>
    </g>)}
    <rect width="600" height="600" fill={'url(#' + id + '-shade)'}/>
  </>;
}

const scenes = {
  honeycomb: Honeycomb,
  mandala: Mandala,
  checker: Checker,
  eyes: EyeVault,
  tides: Tides,
  funnel: Funnel,
};

export default function IllusionArt({ variant, title, className = '' }) {
  const id = useId().replaceAll(':', 'i');
  const Scene = scenes[variant] ?? Honeycomb;
  return <svg className={className} viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"
    role="img" aria-label={title || 'A static optical illusion'}>
    <Scene id={id}/>
  </svg>;
}
