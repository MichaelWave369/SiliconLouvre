# Exhibition 004 · Domistika Dialogues

**Original Drawings & Inspired Transformations**

This museum wing places a human-created Domistika drawing beside the AI-inspired artwork that responded to it, so visitors can see the original creative gesture, the transformation, and the correct separate contributions. It is a **dialogue, not a replacement**.

## Current release

PR #16 builds the public wing: museum navigation and Passport integration, elegant two-frame waiting wall, mobile-friendly paired cards, full-size modal viewer, original-vs-inspired attribution, alt text, curatorial notes, optional art navigation, and release validation.

**PR #16 deliberately began with no artwork pairs.** PR #17 contains four creator-approved matched artwork records. The actual image files must be committed on the same PR branch before the release gate will pass; see [Founding Collection source and upload guide](domistika-dialogues-founding-collection.md). The earlier architectural concept render is **not** the source art; it must not appear as an actual original drawing. The empty-state frames are decorative CSS shapes and are visibly marked as awaiting the real works.

## Prepare the first artwork pairs

Each **pair** needs:
1. **The actual Domistika original**: exported still image of the artist's real sketch or drawing.
2. **The inspired response**: the actual AI-created image generated as a response to that exact drawing.
3. A title, a short story about the connection between the two works, the creative process, the human's preferred public credit and a separate honest credit for the AI tool or model.
4. Accessible descriptions of **each image**, independently.
5. Explicit publication permission for each image, including permission from the owner of the original drawing and authority to exhibit the AI-assisted response.
6. Date and any relevant descriptive tags.

The person submitting should verify each pair is the real historical original plus its actual inspired transformation. Do not regenerate arbitrary lookalikes and call them originals; do not silently replace earlier artworks.

## Where to place image files

Upload both approved files to:

`src/assets/dialogues/`

Use filenames matching the artwork's unique slug:

- `<slug>-original.webp`
- `<slug>-inspired.webp`

Other accepted still image formats: PNG and JPEG, up to **8 MB per file**. Optimize copies for public delivery, but keep personal preservation originals separately. Do not upload a ZIP as the website asset. When the pair is ready, copy actual SHA-256 hex digests of the **exact uploaded files**.

Add a record to `domistikaDialoguePairs` in `src/data/domistikaDialogues.js`, for example:

```js
{
  id: 'example-slug',
  status: 'approved',
  title: 'Artwork title',
  year: '2026',
  curatorialNote: 'A grounded statement about what the original and response share or transform.',
  process: 'How the actual drawing and the actual inspired response were created.',
  originalCredit: 'Public credit requested by the human creator',
  inspiredCredit: 'AI-inspired image created with the verified image-generation tool',
  provenance: {
    originalTool: 'Domistika',
    inspiredTool: 'Verified actual model/tool used',
    humanDirection: 'What decisions the human made across the dialogue.',
    originalOwnerApproved: true,
    inspiredImageApproved: true,
  },
  tags: ['human-AI dialogue'],
  original: {
    file: 'example-slug-original.webp',
    mime: 'image/webp',
    sha256: '<actual SHA-256 of original WebP>',
    alt: 'Accessible description of the visible original drawing.',
  },
  inspired: {
    file: 'example-slug-inspired.webp',
    mime: 'image/webp',
    sha256: '<actual SHA-256 of inspired WebP>',
    alt: 'Accessible description of the inspired image.',
  },
}
```

**This is schema documentation only, NOT a ready-to-publish artwork.** Replace every example, digest and credit with verified material.

## How publication is governed

- A real human curator authorizes each original/response pair for display and verifies publication permission. A JSON boolean is **documentary metadata**, not independent proof of actual permission.
- The proposed PR must include **both** image files and the exact matching data entry; no partial pairs are accepted.
- `npm run verify:dialogues` validates data fields, filenames and images, rejects uncatalogued files, verifies image headers, file-size bounds, and exact SHA-256.
- `npm run check` also runs the rest of the museum's tests and production build.
- A GitHub review and green checks must precede merging. As with the Community Gallery, repository branch protection must be configured in GitHub Settings if curator review is to be technically enforced.
- Build-time Vite asset discovery only displays pairs whose two files are actually installed. The visitor is never sent to an untrusted remote image URL.
- Pair images are treated as still images. Do not claim these art experiments reveal a visitor's stress or psychological condition.

## Visitor interaction

Each installed pair has **Original / Domistika** on the left and **Inspired / AI Response** on the right, each with separate credit text and image-specific alt descriptions. Click **View the Creative Dialogue** to open a modal with both images and their curatorial labels.

Modal interaction: Escape closes, Tab cycles through focusable controls, Left/Right arrow keys move between available pairs, and the address hash supports links such as `#dialogue-<slug>`. On dismissal the previous focus target is restored when present.

At narrow phone widths, image pairs stack **original first, response second**, retaining the original as the start of the conversation.

## Later enhancements

Possible independent rungs: import the artist's first 3–6 real pairs and verify them live; a before/after slider with a side-by-side option; narrated curatorial tours with optional audio; and a separate reviewed submission format for external artists. These are not part of the PR #16 initial gallery shell.

This exhibition is part of an independent Silicon Louvre museum and is not associated with Musée du Louvre or Domestika.
