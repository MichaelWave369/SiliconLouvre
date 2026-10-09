# Dialogue Comparison Station · Exhibition 004 · PR #18

This interactive museum station allows visitors to investigate the visual conversation between an **original Domistika drawing** and its distinct, **AI-inspired response**. It is embedded in the detail viewer of **each** approved artwork pair in Exhibition 004.

## Three viewing modes

1. **Side by Side / Two Voices** (default). Both complete works remain independently framed, with the original Domistika drawing on the left and the inspired response on the right. This preserves the museum's existing presentation.
2. **Drag to Reveal / The Reveal**. Two images occupy an identically sized square. Drag the divider horizontally, or use the native range slider, to expose the **original on the left** and **AI-inspired response on the right**. At 0% only the response is visible; at 100% only the original is visible.
3. **Blend the Images / The Superposition**. The original forms the lower image and the inspired response is composited above with a variable opacity (0% = original only, 100% = inspired only). A native keyboard-operable slider controls the blend.

The mode can be switched using clearly labeled buttons. It persists as you navigate to another pair. The reveal/blend sliders reset to 50% on navigation, avoiding surprising settings from an earlier artwork. A **Reset to 50%** button returns the slider to midpoint.

## Interaction and accessibility

- The reveal image itself carries a native, transparent range slider so you can drag the vertical divider directly with mouse or touch.
- The same divider can be adjusted by the visible range slider below the image, using mouse, touch, or **Left / Right arrow keys**. The modal's arrow-key artwork navigation deliberately ignores slider input while a slider is focused.
- Side-by-side mode preserves full original/inspired image alt text. Overlay modes provide both descriptive text alternatives and full separate credits **outside** the overlaid visual; their images are marked decorative to avoid duplicate screen-reader narration.
- Tab keys move through mode buttons, sliders, reset and the existing viewer buttons. Escape closes the existing modal.
- The station contains no timers, transitions, autoplay or animation. User-set reduced-motion preferences remain respected.
- The original and inspired files stay unaltered. No pixels are saved, exported, uploaded, tracked or changed. The comparison is purely a visual display in the visitor's browser.

## Attribution and interpretation

The original Domistika drawing remains a complete artistic work; the inspired result is a separate work with separate credit. The reveal and blend tools are **interpretive aids**, not transformations of the source artwork or objective proof of what an AI model "understood".

This display uses alignment by square image frame. Different motifs in the two works may not register pixel-for-pixel, and a blend may show patterns that do not appear as such in either work alone.

The collection's media integrity guard still enforces the eight approved Founding Collection WebPs and their hashes. No new images or remote visual services are required for this feature.

## Manual release acceptance

On desktop and mobile, open the four founding pairs:

- **Chromatic Gear Cathedral**
- **The Ninefold Trickster**
- **Orbit of a Thousand Hinges**
- **The Eye That Blooms**

For each pair, confirm the same verified images are displayed in all modes.

- Check side-by-side original left, inspired right.
- Drag the wipe divider from 0% through 50% to 100%; confirm original is revealed on the left, inspired on the right.
- Tab to the divider and press arrow keys; confirm the divider changes and the current pair does **not** change.
- Switch to blend; confirm 0% shows only the original, 100% shows only the inspired image, and 50% shows both superposed.
- Confirm mode switching, Reset to 50%, and pair Next/Previous controls.
- Verify alt descriptions and attribution remain readable.
- Use narrow mobile layout and reduced-motion preferences.
- Confirm `npm run check` reports the original six Masters images and eight Domistika Dialogue files still verified, all tests pass, and production build succeeds.

No curator submission, automated publishing, or artist metadata changes are involved.
