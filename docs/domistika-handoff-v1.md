# Silicon Louvre → Domistika · Creative Handoff v1

This is the first explicit cross-app workflow between the museum's **Creative Studio** and the **Domistika** drawing environment. The integration has a sender in the Silicon Louvre and a separately reviewed receiver in Domistika. **Both releases must be merged and deployed before direct handoff works.**

## How it works

1. Create a composition in the museum's **CREATE** room. The SVG can still be saved independently.
2. Choose **Continue in Domistika**. The button generates an 800×800 SVG and a SHA-256 digest of the file.
3. If the two apps are deployed under the same `https://michaelwave369.github.io` origin, the museum writes a short-lived message to that browser's `localStorage` and navigates to Domistika's `#silicon-louvre-import` entry point.
4. Domistika verifies the message's shape, expiration, digest and allowed SVG tags/attributes, then shows an artwork preview.
5. The visitor chooses **Download Current Project Backup**, confirms the backup has been saved, and explicitly requests **Import to New Canvas**.
6. Domistika rasterizes the art into an 800×800 PNG paint layer in a new project. This import replaces the currently active canvas, so the backup and visitor acknowledgement are required. The receiver attempts to restore the original project if import fails.
7. A successful import or an explicit decline clears the transfer from browser storage.

## Privacy and authority

- No server upload, login, model invocation, tracking, agent publishing, or public submission.
- Transfer is same-origin, browser-local, short-lived (five minutes), and requires the visitor to click.
- The source code does **not** claim a cryptographic identity proof: SHA-256 checks transfer integrity, not that the sender has independent authority.
- The receiver never processes arbitrary web-hosted SVGs. Its allowlist excludes scripts, event handlers, external images and active content.
- Direct handoff is available only when the museum and Domistika are under the documented shared GitHub Pages origin. Other deployments retain the existing **Save Your SVG Artwork** button and show a fallback message.

## Image fidelity / editability

The original SVG stays fully scalable when saved locally. The Domistika import is **rasterized** to an 800×800 PNG layer: brush tools can edit the pixels, but the SVG's vector paths, rings and motifs are not individually editable after import. A future vector-schema bridge could improve this without misrepresenting the current feature.

## Technical contract

- Storage key: `silicon-louvre-to-domistika-v1`
- Schema: `silicon-louvre.domistika-handoff.v1`
- Source/target: `silicon-louvre` → `domistika`
- Required fields: `createdAt`, `expiresAt`, `name`, `width`, `height`, `recipe`, `svg`, `svgSha256`
- Bound: 350,000 SVG characters, 5-minute expiry, dimension 800×800
- Checksum: SHA-256 over the SVG string's UTF-8 bytes
- Receiving route: `https://michaelwave369.github.io/Domistika/#silicon-louvre-import`

## Visitor acceptance test

With both apps deployed and the two URLs sharing an origin:

1. Select each of the three studio composition modes, then click **Continue in Domistika**.
2. Verify the preview displays the expected artwork and no change happens until consent.
3. Decline a transfer and confirm the original Domistika project remains untouched.
4. Re-initiate transfer, back up the current project, confirm backup and import. Check the new project has one raster paint layer and dimensions of 800×800.
5. Reload and verify that no stale transfer is imported twice. Expired messages should not open.
6. If `localStorage` is blocked or full, the sender should fail safely with a clear fallback to SVG download.

This is a creative interchange, not an exhibition publication channel.
