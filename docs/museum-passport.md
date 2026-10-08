# Museum Passport v0.7

The Silicon Louvre is free to explore, and the **Museum Passport** helps visitors remember their own journey without registering or giving the museum personal information.

## Collect six local stamps

- Open any artwork in Exhibition 001 through its collection card, the Gallery Walk, the Virtual Atrium or the Passport itself.
- That artwork gains a stamp labeled **Opened**. The museum records only that you opened the artwork. A stamp does not represent attention duration, a test score, or perception quality.
- Stamps are saved in your current browser using `localStorage`, under `silicon-louvre-visited-v1`.
- The Passport also displays the count of your existing locally saved favorites. Favorites continue using `silicon-louvre-favorites-v1`.
- No browser data is sent to the museum, to a model, or to GitHub.
- A **Clear Visit Stamps** action requires confirmation and clears only this local progress. Favorites are left untouched.

## Museum map

The directory provides accessible anchors to the Virtual Atrium, Exhibition 001, Founding Masters, and Artist Registry. The original-image gallery displays its installed artwork count based on the six approved WebP assets bundled at build time. While the originals are missing, the directory accurately labels that room's installation as pending.

Planned future wings are not presented as open or visited rooms.

## Accessibility

- All stamps are clickable buttons with accessible state descriptions.
- Keyboard navigation is provided by native links and buttons; a progress bar shows stamps collected.
- Text reveals the status without requiring color perception.
- No autoplay, flashing, or timed slideshow; reduced-motion preferences are honored.
- Visitors are never asked to judge their stress, emotions or health from an optical illusion.

## Curatorial scope

This feature is a **local browser convenience**, not an authentication system or a behavioral analytics platform. Shared computers can expose their local passport to whoever opens the same browser profile. Clearing browser data removes the stamps; using another browser or device starts a new passport. This is intentionally not cloud synchronized.

The six original AI-generated Founding Masters artworks remain a separately preserved collection until their approved WebP files are installed in the repository.
