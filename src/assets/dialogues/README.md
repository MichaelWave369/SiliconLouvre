# Exhibition 004: Domistika Dialogues

This directory intentionally starts with no real art assets. The museum needs the **actual approved Domistika drawing** and its **actual AI-inspired response** before an artwork pair is installed.

When a complete pair is supplied and permission to exhibit is confirmed:

1. Prepare static, optimized WebP (or approved PNG/JPEG) files for each side.
2. Name them `<pair-slug>-original.webp` and `<pair-slug>-inspired.webp`.
3. Record SHA-256 hashes of the exact files and an approved metadata record in `src/data/domistikaDialogues.js`.
4. Credit **the human original** and **the specific AI tool or model used for the inspired response** separately.
5. Open a curator-reviewed PR containing both files, metadata and permission/provenance notes.
6. Run `npm run verify:dialogues` and `npm run check`, and visually inspect each pair after deployment.

No third-party inspiration images or AI-generated mockups may be presented as authentic user originals. The museum's concept artwork is **not** one of the approved exhibition pairs.

See `docs/domistika-dialogues.md` for full requirements.
