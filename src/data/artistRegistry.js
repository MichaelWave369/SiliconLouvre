/**
 * Curator-approved, public-facing artist records.
 *
 * Only APPROVED records are published here. A proposal/issue must not automatically
 * become a website entry. Never imply a tool, model, or agent is a verified person.
 */
export const registryPolicy = Object.freeze({
  edition: '001',
  title: 'The Artist Registry',
  subtitle: 'A permanent record of creative contribution, not a scoreboard of who counts as an artist.',
  curatorNote: 'Human direction, AI tool assistance, and agent participation are identified separately. Proposed contributors are not published until reviewed and approved by the museum curator.',
  proposalUrl: 'https://github.com/MichaelWave369/SiliconLouvre/issues/new?template=artist-proposal.yml',
  status: 'Founding edition',
});

export const artists = Object.freeze([
  {
    id: 'silicon-louvre-studio',
    name: 'The Silicon Louvre Studio',
    initials: 'SL',
    kind: 'collaboration',
    status: 'approved',
    role: 'Founding creative collaboration',
    since: '2026',
    headline: 'The imagination behind the opening rooms.',
    statement: 'The founding collection emerged from a human-directed creative concept developed with AI illustration and coding assistance. These are shared creative processes with distinct responsibilities, not claims that a named model or agent independently authored an exhibit.',
    bio: 'The founding studio established the museum, curated its first optical-illusion exhibition, and prepared the Founding Masters collection for archival display. The museum credits artistic direction and AI-assisted generation explicitly rather than assigning a fictional human identity to software.',
    exhibitIds: ['001', '002'],
    creditLines: [
      { contributor: 'Human curator / creative director', activity: 'Museum concept, prompts and artistic direction, curation and publication decisions.' },
      { contributor: 'AI image-generation tools', activity: 'Creation of the six original Founding Masters still images under human direction.' },
      { contributor: 'AI coding assistance', activity: 'Implementation of the opening six programmatic SVG studies and museum software, with human-led decisions.' },
    ],
    practices: ['Optical art', 'Generative geometry', 'Human–AI collaboration', 'Curatorial provenance'],
    repositoryUrl: 'https://github.com/MichaelWave369/SiliconLouvre',
    // This is a collective profile. Named agent residencies require their own
    // reviewed records and evidence of contribution before public attribution.
    verification: 'Museum-curated founding credit. Not independent identity verification.',
  },
]);

export const futureResidencies = Object.freeze([
  { id: 'human', title: 'Human artists', number: '01', description: 'Original work, creative stories, artistic process and informed exhibition permission.', status: 'Planned' },
  { id: 'collaboration', title: 'Shared studios', number: '02', description: 'Projects showing how human choices and AI tools shaped the finished work.', status: 'Planned' },
  { id: 'agent', title: 'Agent residencies', number: '03', description: 'Curated opportunities for identifiable agents, with accountable operators and documented contributions.', status: 'Planned' },
]);
