/**
 * Local, opt-in Quest field check. This is an observation recorder, not a
 * headset qualification service, GPU profiler, or network analytics client.
 * No cookies, storage, remote requests, device IDs, input paths, or user art.
 */
const EVENTS = Object.freeze([
  'xr-start', 'xr-end', 'xr-hidden', 'portal-enter', 'portal-return',
]);
const blankCounts = () => Object.fromEntries(EVENTS.map((event) => [event, 0]));
const safeCount = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value) : null;
const round = (value, places = 1) =>
  value === null || !Number.isFinite(value) ? null : Number(value.toFixed(places));

export function createQuestFieldCheck() {
  let running = false, stopped = false, lastFrame = null;
  let frames = 0, intervals = 0, intervalTotal = 0, slowest = 0, fastest = Infinity;
  let counts = blankCounts();
  let peak = { geometries: null, textures: null, drawCalls: null };
  let recent = { geometries: null, textures: null, drawCalls: null };
  let previousPortal = null;

  const snapshot = () => ({
    state: running ? 'recording' : stopped ? 'stopped' : 'idle',
    xrFramesObserved: frames,
    cadenceIntervals: intervals,
    // Frame *interval*, not guaranteed frames presented, GPU timing or headset refresh.
    avgFrameIntervalMs: intervals ? round(intervalTotal / intervals) : null,
    maxFrameIntervalMs: intervals ? round(slowest) : null,
    minFrameIntervalMs: intervals ? round(fastest) : null,
    events: { ...counts },
    lastCuratedRealm: previousPortal,
    webgl: { latest: { ...recent }, peak: { ...peak } },
  });

  const reset = () => {
    lastFrame = null;
    frames = intervals = intervalTotal = slowest = 0;
    fastest = Infinity;
    counts = blankCounts();
    peak = { geometries: null, textures: null, drawCalls: null };
    recent = { geometries: null, textures: null, drawCalls: null };
    previousPortal = null;
  };

  return Object.freeze({
    start() {
      reset();
      running = true;
      stopped = false;
      return snapshot();
    },
    stop() {
      if (running) {
        running = false;
        stopped = true;
      }
      lastFrame = null;
      return snapshot();
    },
    note(event, curatedRealmId = null) {
      if (!running || !EVENTS.includes(event)) return false;
      counts[event]++;
      if (event === 'xr-hidden' || event === 'xr-end') lastFrame = null;
      if (event === 'portal-enter') {
        // Only a bounded, reviewed museum ID, never arbitrary visitor text.
        if (typeof curatedRealmId === 'string' &&
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(curatedRealmId) &&
            curatedRealmId.length <= 64) previousPortal = curatedRealmId;
      }
      return true;
    },
    frame(timeMs, rendererInfo, immersive = false) {
      if (!running || !immersive || !Number.isFinite(timeMs)) {
        lastFrame = null;
        return false;
      }
      frames++;
      if (lastFrame !== null) {
        const elapsed = timeMs - lastFrame;
        // Ignore resumed/out-of-order frames, not classify pause time as lag.
        if (elapsed > 0 && elapsed <= 1000) {
          intervals++;
          intervalTotal += elapsed;
          slowest = Math.max(slowest, elapsed);
          fastest = Math.min(fastest, elapsed);
        }
      }
      lastFrame = timeMs;
      const measures = {
        geometries: safeCount(rendererInfo?.memory?.geometries),
        textures: safeCount(rendererInfo?.memory?.textures),
        drawCalls: safeCount(rendererInfo?.render?.calls),
      };
      for (const key of Object.keys(measures)) {
        recent[key] = measures[key];
        if (measures[key] !== null) peak[key] = Math.max(peak[key] ?? 0, measures[key]);
      }
      return true;
    },
    snapshot,
  });
}

export function formatQuestFieldReport(stats) {
  const fmt = (value) => value === null || value === undefined ? 'N/A' : String(value);
  const lines = [
    'SILICON LOUVRE XR / QUEST FIELD CHECK',
    'Local opt-in diagnostics. No device certification, GPU frame timing or telemetry.',
    'State: ' + stats.state,
    'Immersive renderer callbacks observed: ' + stats.xrFramesObserved,
    'Measured callback intervals: ' + stats.cadenceIntervals,
    'Frame callback interval avg/max (ms): ' +
      fmt(stats.avgFrameIntervalMs) + ' / ' + fmt(stats.maxFrameIntervalMs),
    'XR session starts/ends/hidden: ' +
      stats.events['xr-start'] + ' / ' + stats.events['xr-end'] + ' / ' + stats.events['xr-hidden'],
    'Portal enters/returns: ' + stats.events['portal-enter'] + ' / ' + stats.events['portal-return'],
    'Last reviewed realm: ' + fmt(stats.lastCuratedRealm),
    'WebGL geometries latest/peak: ' +
      fmt(stats.webgl.latest.geometries) + ' / ' + fmt(stats.webgl.peak.geometries),
    'WebGL textures latest/peak: ' +
      fmt(stats.webgl.latest.textures) + ' / ' + fmt(stats.webgl.peak.textures),
    'WebGL draw calls latest/peak: ' +
      fmt(stats.webgl.latest.drawCalls) + ' / ' + fmt(stats.webgl.peak.drawCalls),
    'Manual Quest 3 checks still required: legibility, targeting, comfort, pause/resume, memory stability.',
  ];
  return lines.join('\n');
}
