# Founding Masters asset directory

Only the six curated, provenance-verified `.webp` derivatives listed in `src/data/foundingMasters.js` belong here.

To import, extract `SiliconLouvre_Founding_Masters_Import_v0.1.zip` provided in the project's founding conversation and upload the six files under `src/assets/masters/`. The website automatically discovers each approved file at build time.

The `npm run verify:masters` integrity check enforces the approved SHA-256 hashes. **Never** add the sample third-party internet illusion with its watermark, or publish unreviewed contributions in this directory.

The full-resolution PNG originals are in the standalone archive; they are *not* bundled into the deployed website, to keep browsing fast.
