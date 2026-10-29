import { createWorldAdapter } from '@phi369/genewrist/src/world-adapter.js';

/**
 * Real Silicon Louvre host; no simulated data, no external scripts.
 * Gen.E.Wrist owns manifest validation, navigation and capability grants.
 * The museum retains authority over every scene mutation.
 */
export function createLouvreWorldAdapter({
  readScene,
  subscribeScene,
  commands,
  onCapture = () => {},
  onDisconnect = () => {},
} = {}) {
  if (typeof readScene !== 'function' || typeof subscribeScene !== 'function'
      || !commands || ['previous', 'next', 'enter', 'return', 'recenter'].some((k) => typeof commands[k] !== 'function')) {
    throw new TypeError('Louvre WorldAdapter needs real host state, subscription and commands');
  }
  const readState = () => {
    const scene = readScene();
    return {
      contextId: scene.inside ? 'artwork' : 'atrium',
      status: {
        title: String(scene.title || 'No selected artwork'),
        station: Number(scene.index) + 1,
        total: Number(scene.total),
        space: scene.inside ? 'Inside painting' : 'Museum atrium',
      },
    };
  };
  // A portal changes WorldAdapter context. Defer the mutation until the wrist
  // completes its permission/context post-check; never relax that check in core.
  // The queued task rechecks the current scene and abort signal before acting.
  let portalQueued = false;
  const call = (name) => ({ signal }) => {
    if (signal?.aborted) return false;
    if (name === 'enter' || name === 'return') {
      if (portalQueued) return false;
      portalQueued = true;
      const wasInside = Boolean(readScene().inside);
      setTimeout(() => {
        portalQueued = false;
        if (signal?.aborted || Boolean(readScene().inside) !== wasInside) return;
        if ((name === 'enter' && !wasInside) || (name === 'return' && wasInside)) {
          commands[name]({ signal });
        }
      }, 0);
      return true;
    }
    return commands[name]({ signal });
  };
  const fields = [
    { id: 'title', label: 'Artwork', type: 'text' },
    { id: 'station', label: 'Station', type: 'number', min: 1, max: 12 },
    { id: 'total', label: 'Curated works', type: 'number', min: 1, max: 12 },
    { id: 'space', label: 'Location', type: 'text' },
  ];
  return createWorldAdapter({
    manifest: {
      apiVersion: 1,
      id: 'silicon-louvre',
      title: 'The Silicon Louvre',
      description: 'Visitor-controlled painting portals. Human originals and inspired responses stay distinct.',
      kind: 'host',
      icon: 'spark',
      initialContext: 'atrium',
      theme: { accent: '#f1cb95' },
      capabilities: ['navigate-paintings', 'enter-portals', 'view-position'],
      actions: [
        { id: 'previous-painting', label: 'Previous painting', capability: 'navigate-paintings' },
        { id: 'next-painting', label: 'Next painting', capability: 'navigate-paintings' },
        { id: 'enter-portal', label: 'Enter selected artwork', capability: 'enter-portals' },
        { id: 'return-to-atrium', label: 'Return to museum', capability: 'enter-portals' },
        { id: 'recenter-view', label: 'Recenter view', capability: 'view-position' },
      ],
      contexts: [
        {
          id: 'atrium', title: 'Museum Atrium', layout: 'explorer', icon: 'compass',
          description: 'Select a curated pair before deliberately entering its themed interpretation.',
          fields,
          controls: [
            { action: 'previous-painting', label: 'PREVIOUS ARTWORK', icon: 'compass' },
            { action: 'next-painting', label: 'NEXT ARTWORK', icon: 'compass' },
            { action: 'enter-portal', label: 'ENTER PAINTING', icon: 'spark' },
            { action: 'recenter-view', label: 'RECENTER', icon: 'crosshair' },
          ],
          views: [{ type: 'note', title: 'Curatorial distinction', items: [
            'The left image is the original drawing; the right is a separately credited inspired response.',
            'The 3D world is a procedural interpretation, not a conversion of the original pixels or vector layers.',
          ] }],
        },
        {
          id: 'artwork', title: 'Inside the Artwork', layout: 'explorer', icon: 'spark',
          description: 'Explore the procedural geometry and return without changing either source image.',
          fields,
          controls: [
            { action: 'return-to-atrium', label: 'RETURN TO ATRIUM', icon: 'home' },
            { action: 'recenter-view', label: 'RECENTER', icon: 'crosshair' },
          ],
          views: [{ type: 'note', title: 'Interpretation', items: [
            'This space is inspired by the chosen painting. The source artwork remains unmodified.',
            'Your museum controller owns all portal, camera and interaction behavior.',
          ] }],
        },
      ],
    },
    readState,
    subscribe: (notify) => subscribeScene(() => notify(readState())),
    actions: {
      'previous-painting': call('previous'),
      'next-painting': call('next'),
      'enter-portal': call('enter'),
      'return-to-atrium': call('return'),
      'recenter-view': call('recenter'),
    },
    onCapture,
    onDisconnect,
  });
}
