# Install the Founding Masters (Exhibition 002)

The Silicon Louvre has **two distinct collections**:

- **Exhibition 001, The Stillness That Moves:** six code-generated, deterministic SVG studies included directly in the repository.
- **Exhibition 002, The Founding Masters:** six original AI-generated still images from the museum's creative founding session. These are *not* the same renderings as Exhibition 001.

## Where are the images?

The museum's founding conversation provides a ZIP archive named **SiliconLouvre_Founding_Masters_Import_v0.1.zip**.

Inside that ZIP:

- `src/assets/masters/`: six optimized WebP exhibition editions intended for the website.
- `original_png_masters/`: the six full-size original PNGs for preservation, not needed for deploying the site.
- `master_manifest.json`: original PNG and WebP filenames, dimensions and cryptographic hashes.
- `IMPORT_INSTRUCTIONS.txt`: short import procedure.

## Publish the six artworks

1. Download and unzip the **Founding Masters import pack** supplied in the founding conversation.
2. Visit `https://github.com/MichaelWave369/SiliconLouvre/tree/main/src/assets/masters`.
3. Use **Add file → Upload files** and select **only the six .webp files** extracted from `src/assets/masters/`. GitHub's web UI will not unpack a ZIP for you.
4. Commit the six files to `main` (or open a PR, then merge it).
5. GitHub Actions will run `npm run verify:masters`, the test suite and production build.
6. Once the GitHub Pages deployment finishes, Exhibit 002 will automatically display the installed originals. No source edits are required.

**Integrity policy:** the repository stores approved hashes in `src/data/foundingMasters.js`. If the files were accidentally renamed, recompressed or changed, the check will fail. Use the six files directly from the supplied package to maintain provenance.

## Why separate the full-size masters from the site images?

The archived PNGs preserve the original generated files. The curated WebP copies are smaller, so the public museum is faster to load, while retaining the original images' visual content. The PNG files should be kept in a separate backup or archival release after reviewing publication permissions.

## Credits

- Creative direction: the human founder of The Silicon Louvre.
- Image generation: OpenAI image generation during the collaborative founding conversation in 2026.
- Exhibit processing: WebP exhibition copies derived from those original PNG outputs.
- Editorial copy, site implementation, and exhibit automation: human-led collaboration with AI assistance.

This archive does not include the third-party illusion image that inspired the idea. The Founding Masters are independently generated images.

## Accessibility & scientific accuracy

All six original files are **still images**, not animated files. Some people may perceive motion or depth from repetition and contrast; others may see no illusory motion. Do not claim that the effects measure stress or mental health. The museum provides text descriptions and no autoplay sound, flashing or timed transitions.

The website and art archive are an independent project, not affiliated with or endorsed by the Musée du Louvre in Paris.

## Contributing future artworks

New contributions must not be inserted into the Founding Masters directory without provenance, license information, creator consent and human curatorial review. This importer is deliberately not an unauthenticated public image-upload system. Later collection ingestion should be staged, validated and approved before publication.
