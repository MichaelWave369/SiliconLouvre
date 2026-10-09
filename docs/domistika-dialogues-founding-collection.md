# Domistika Dialogues · Founding Collection (Exhibition 004)

**Four authentic creative dialogues · Eight original source and generated image roles · Curator-approved gallery metadata**

The human artist identified all four pairs, confirmed the pairings, and delegated editorial titles to the museum. Original drawings were made in Domistika. Inspired counterpart images were created using ChatGPT in Sol 5.6 sessions, as reported by the artist. We credit the human-made drawings separately from the AI-generated responses.

The museum should display each pair **original on the left**, **inspired response on the right**, with both accessible descriptions and separate art credits. This release prepares four pairs for display, but **requires the eight actual WebP assets in this same PR**. Until all are installed, CI correctly rejects the release.

## Exhibited pairings

| Exhibition title | Original source PNG | Inspired counterpart source PNG |
|---|---|---|
| Chromatic Gear Cathedral | `untitled-domistika (6).png` | `ChatGPT Image Sep 20, 2026, 09_48_23 PM.png` |
| The Ninefold Trickster | `untitled-domistika (11).png` | `ChatGPT Image Sep 21, 2026, 11_45_58 AM.png` |
| Orbit of a Thousand Hinges | `untitled-domistika (22).png` | `ChatGPT Image Sep 27, 2026, 05_28_17 PM.png` |
| The Eye That Blooms | `untitled-domistika (32).png` | `Hypnotic Kaleidoscopic Eye Mandala.png` |

The titles are new editorial names approved for use by the original creator; they do not suggest a change to the original art or an independent AI artist identity.

## Preservation of original source images

All source images came from `domistika images.zip`, provided by the artist. The eight original PNGs have not been altered in their source archive. Gallery-facing WebP files are optimized display derivatives, preserving each image's essential design and color; originals are not renamed in the artist's own archive.

For traceability, the SHA-256 of each **source PNG** (before WebP export) was:

| Original source filename | Original source SHA-256 |
|---|---|
| `untitled-domistika (6).png` | `d89302bf3cc70d62f8cac9c1dde5edd31d163adff177f955c2d610df34030bb6` |
| `ChatGPT Image Sep 20, 2026, 09_48_23 PM.png` | `3de2d1f3e5031f4cb9fb86f25743686fc38b5768c6dcfa7c553b4566299bbf0c` |
| `untitled-domistika (11).png` | `59bed8ee45b95fd27c458761f1aa238dbce577bb1c644b4c75bd7222c6665169` |
| `ChatGPT Image Sep 21, 2026, 11_45_58 AM.png` | `6794b57d1123e2886ef8160ceff23d61227aa060bed54b840f06ce0bfa2fda5a` |
| `untitled-domistika (22).png` | `3ecc58aafd506abd61c8d1696b684f7b36b928a889e5b23a162db41a23df87a2` |
| `ChatGPT Image Sep 27, 2026, 05_28_17 PM.png` | `019a2a21a1ba3c7e508cb9c3ef7c5f882e2a8a8e166fbb8acce395906d181967` |
| `untitled-domistika (32).png` | `b7935cb41e2581d5dba25c68d5395c1c4f057053ac5cbc706d68aa5286ea9be1` |
| `Hypnotic Kaleidoscopic Eye Mandala.png` | `36d56dc2481c3366e57ed7c9eeb448fa918fcc5a73dfff1a7f5ddffd2f35da01` |

These source hashes document which image originals were used. They are *not* cryptographic proofs of artistic authorship or copyright ownership.

## Publishing the gallery derivatives

A standalone upload-only pack named `SiliconLouvre_Domistika_Dialogues_PR17_8WebP.zip` was created for this release. It contains exactly eight `.webp` files. **The user must extract the ZIP** and upload the eight WebP files to:

`src/assets/dialogues/`

**Upload to feature branch `feat/domistika-dialogues-founding-collection`, not `main`.** The code and matching hashes are already committed on that feature branch. The PR should remain in draft while the image assets are absent. All eight must be committed to the same PR.

The original Domistika PNG drawings were resized to a maximum of 1800×1800 pixels for lightweight gallery WebPs; inspired PNGs were exported at their existing 1254×1254 size. WebP encoding quality was 92 with alpha preservation where present. The binary image integrity hashes of the **exact WebPs** are committed in `src/data/domistikaDialogues.js`.

Once the artwork files are installed, run:

```bash
npm run verify:dialogues
npm run check
```

The gate must report exactly **4 authorized pairs, 8 verified images**, and every other museum check must remain green.

## Human approval and exhibition acceptance

The original creator approved the matchings and expressly delegated the titles for this release. The exported files reflect the images supplied by that creator, and the AI-inspired response credit uses their reported tool/session identification. This is a curator-mediated release with owner-approved originals, not a user-generated-content upload endpoint.

Before publishing, visually inspect the live page and confirm:
- Four pairs display in the correct order, with the actual uploaded images and no placeholders.
- The first image of every pair is labeled **Original / Domistika** and the second **Inspired / AI Response**.
- Mobile layouts put the original first and the response second.
- The detail viewer opens with accurate alt descriptions, credits, process and curatorial notes.
- Next/previous controls and Escape work; no external image URLs are requested.
- Image hashes match exactly, and the Founding Masters 6/6 collection still passes its verification.

No artwork should be marked on view or PR merged if any of the eight images are missing, incorrect or unapproved.
