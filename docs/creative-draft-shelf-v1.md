# Creative Studio: private draft shelf and recipe reloading (v1.0)

The Optical Art Studio can now remember compositions *on your current device* without creating an account or publishing artwork.

## Visitor steps

1. Open **CREATE** in The Silicon Louvre.
2. Choose a composition mode and palette, then experiment with rings, motif count, and rotation.
3. In **Private Design Shelf**, name the design and select **Save Current Design to Shelf**. Up to 12 recipes can be kept in this browser profile; saving a 13th removes the oldest item.
4. Use **Load** to restore any saved design to the controls. You can then change it and save a new copy. Use **Remove**, followed by **Confirm Delete**, to clear a draft.
5. To restore a recipe you copied previously, paste the `silicon-louvre-studio/v1` JSON into **Import a Copied Design Recipe** and select **Load Recipe into Studio**.
6. You can still download a full SVG or explicitly transfer the current design into Domistika.

## Privacy and limits

- Local storage key: `silicon-louvre-studio-drafts-v1`.
- Drafts consist of titles, timestamps and bounded geometric configuration. Full SVG image bytes are regenerated from the recipe rather than stored.
- Saved drafts stay in this specific browser profile. Another browser/device will not see them.
- Clearing site data removes the shelf. Save SVG and copy recipes if you need durable external copies.
- No uploads, automatic publication, accounts, analytics or third-party storage.
- Pasted recipes must match the exact known format, composition mode, palette and integer bounds. Unsupported fields and versions are rejected.
- Browser storage may be disabled or full; in that case an SVG download remains the dependable way to preserve a design.
- Deleting a draft does not delete any downloaded SVGs.

## Curatorial boundary

This is a visitor workspace, **not a submission or public exhibition**. The museum's Artist Registry and any public art submissions still require curator approval, permission, provenance and accessibility review.

## QA checklist

- Save two different modes and confirm distinct entries.
- Reload the page and confirm the drafts remain.
- Load a draft and verify palette, rings, motifs and twist settings.
- Copy recipe, alter settings, paste recipe and confirm original settings return.
- Paste invalid JSON, unknown modes, unsupported versions and excessive values, and verify they are rejected.
- Delete a draft, cancel a deletion and verify only the confirmed removal persists.
- Save 13 drafts and verify the shelf stays bounded at 12.
- Confirm existing SVG exports and Domistika handoffs still work.
