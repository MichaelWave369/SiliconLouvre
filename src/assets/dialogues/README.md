# Exhibition 004: Domistika Dialogues · Founding Collection

This feature branch introduces four owner-approved original / inspired artwork pairs, each from the artist's real `domistika images.zip` source archive.

**Artwork binary files are required before merging.** This directory must contain these eight files, alongside this README:

- `chromatic-gear-cathedral-original.webp`
- `chromatic-gear-cathedral-inspired.webp`
- `the-ninefold-trickster-original.webp`
- `the-ninefold-trickster-inspired.webp`
- `orbit-of-a-thousand-hinges-original.webp`
- `orbit-of-a-thousand-hinges-inspired.webp`
- `the-eye-that-blooms-original.webp`
- `the-eye-that-blooms-inspired.webp`

Upload **only the extracted WebP images**, not the ZIP or the original high-resolution PNGs. GitHub Actions checks presence, size, image headers and exact binary SHA-256 hashes recorded in `src/data/domistikaDialogues.js`. An absent/mismatched file must block merge.

Full titles, curatorial notes, creative roles, original-source filename mappings, preservation hashes and visitor acceptance checklist are in `docs/domistika-dialogues-founding-collection.md`.
