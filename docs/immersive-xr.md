# Silicon Louvre XR · Painting Portals v1 (experimental)

An additional WebGL museum wing at the built site's xr.html entrance, backed by the existing approved Domistika Dialogues exhibition. It does not replace the existing CSS Virtual Atrium, any curated artwork, the museum passport, or the site's accessible pages.

## Shipping in this rung

- Four approved Domistika dialogue stations. Every station exhibits the original human drawing and the separately credited inspired response as separate, unchanged artworks.
- Distinct procedurally themed 3D environments. Selecting a painting intentionally moves the visitor into a themed realm, with an in-world return panel.
- Desktop operation with clicking, keyboard movement, keyboard focusable controls, and an optional immersive-VR mode on supported secure-origin browsers, including compatible Quest browsers. Controller rays select paintings and the return panel.
- Repository-local curated images only. No uploads, microphones, cameras, accounts, public publishing, or remotely hosted textures.
- Reduced-motion preferences pause ambient rotational motion. VR has no artificial locomotion.

Not yet implemented: deriving real 3D meshes from Domistika vector data or arbitrary pixels, physics, multiuser rooms, Gen.E.Wrist WorldAdapter registration, controller-thumbstick walking, or publishing the most recent uncurated artwork. The portal transition and procedural scenery are not a claim to have converted the source image into 3D.

## Navigation

Desktop: click a framed painting, use arrow keys to choose and E to enter. WASD moves. Esc returns; R resets view. The visible buttons duplicate the primary actions. The existing museum pages remain the accessible, non-WebGL option.

Quest 3 / WebXR: use the opt-in ENTER VR control, point a tracked controller at a painting, and press select/trigger. Inside the generated realm, point at the RETURN TO ATRIUM panel to go back. This is an intentional teleport, not automatic collision-based movement, and artificial locomotion is disabled for comfort.

## Curatorial and technical contract

Source data come exclusively from src/data/domistikaDialogues.js. The portalModel gate rejects unapproved pairs and unexpected local filenames. There are no external art asset URLs, remote scripts, or publication operations. Existing human and AI authorship is displayed in the desktop plaque and the in-world attribution labels. Vite builds xr.html as a separate entry; its Three.js bundle does not load on the original React museum page.

GitHub Pages target: https://michaelwave369.github.io/SiliconLouvre/xr.html over HTTPS.

## Acceptance

1. Run npm install and npm run check. Confirm both dist/index.html and dist/xr.html exist.
2. In desktop mode, verify four portal stations, eight distinct still images, attribution text, enter/return, arrow navigation and keyboard controls.
3. With a Quest headset, verify the WebXR entry, controller painting selection, in-world return, readable artwork, acceptable frame rate and comfort. CI does not prove this physical test.
4. Confirm the classic museum and its CSS Virtual Atrium are unchanged, with a visible opt-in link to XR.


## Four curated procedural worlds (second visual rung)

The initial four portals used an identical tunnel/gear arrangement with palette swaps. The second rung introduces distinct, reviewed **procedural sculptures**, derived from the curatorial notes and approved artwork identities, not by decoding or editing paintings:

| Curated work | Independent realm | Spatial motifs |
| --- | --- | --- |
| Chromatic Gear Cathedral | The Gear Cathedral | Clockwork chapel towers, 24- and 48-fold teeth, jewel-like geometric rings |
| The Ninefold Trickster | The Trickster Chorus | Nine principal geometric masks, secondary theatrical mask patterns, pointed ears and glowing eyes |
| Orbit of a Thousand Hinges | The Hinge Observatory | Nested orbital pathways, articulated bars, sphere joints and measured intervals |
| The Eye That Blooms | The Blooming Iris | Concentric cone petals, repeated flower rings, large floating iris elements |

- Plans are generated as deterministic, bounded **instanced meshes** and a handful of hoops, rather than spawning individual draw calls for every motif. The blueprint test caps each realm at 400 instances across at most six batches and five hoops.
- Colors and geometry are authored locally in source, with no new licenses or remote assets. Artwork textures and the curatorial captions stay unchanged. The wrist World Mode status includes the current realm name.
- Each realm's quiet rotation respects the browser's reduced-motion preference. Hardware headset performance remains a separate acceptance gate.
- Unknown, uncurated artwork IDs have no procedural realm. Adding a new portal requires independent curation and an explicit author-designed blueprint.

Validate each distinct world on desktop and Quest 3, including entering, returning, and reentering to identify memory or texture leaks. This work is not an automatic reconstruction of the artist's original vector paths.
