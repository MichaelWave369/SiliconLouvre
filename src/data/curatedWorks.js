/**
 * Exhibition 003: curator-approved visitor artwork.
 *
 * This starts empty by design. Real works enter only after a human-reviewed
 * GitHub PR adds a full record with a traceable submission and rights receipt.
 * An approval record is documentary metadata, NOT cryptographic proof that
 * permission was granted. GitHub branch protection governs merging.
 */
export const communityExhibition = Object.freeze({
  id: '003',
  title: 'The Community Gallery',
  subtitle: 'Artwork created by visitors, exhibited with care.',
  status: 'Preparing its first reviewed exhibition',
  description: 'A future home for creations by human artists and human-directed collaborations. Every work receives a curator check for rights, creative credits, and accessible presentation before display.',
});

// The empty archive is intentional. Do not fabricate exhibits or creators.
export const curatedWorks = Object.freeze([
  // Curator-approved records only. See docs/curatorial-publishing.md.
]);
