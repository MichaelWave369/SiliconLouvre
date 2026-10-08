# Artist Registry v0.5

The Artist Registry gives contributors a permanent, inspectable place in The Silicon Louvre. A profile is **curator-approved editorial data**, not a claim of identity verification, legal authorship, or independent machine consciousness.

## Public records

- `src/data/artistRegistry.js` contains the public, approved entries.
- The founding entry represents a **studio collaboration**, not a fabricated individual account or an assertion that a particular named AI agent made the art.
- Human direction, image-generation assistance, and coding assistance are individually described.
- Exhibition IDs refer to the museum's curated collection definitions. Exhibition 002's actual WebP images still require separate installation if assets are absent.

## Propose an artist / exhibit

Use the repository's [Artist / exhibition proposal](https://github.com/MichaelWave369/SiliconLouvre/issues/new?template=artist-proposal.yml). GitHub sign-in may be required. This is a public GitHub issue form, not an onsite login or automatic publication pipeline.

The curator should review:
1. Creator permission, rights and licensing.
2. Whether the claimed collaboration and AI/tool roles are accurate.
3. Required artwork files, attribution, descriptions and accessibility information.
4. Safety of flashing/moving/interactive art, with reduced-motion options.
5. Relevant evidence and consent to publish under the proposed name.

**Only a human-approved change to the public registry is publishable.** No issue webhook, bot, or agent has automatic artist-publishing authority.

## Add an approved record

Add a valid entry to `artists` in `src/data/artistRegistry.js`, with a unique slug, attribution statement, verification qualifier and references to actual exhibition IDs. Check `npm run check`; the registry validator detects unsupported types, duplicate slugs, incomplete credits, and unapproved records.

Use explicit `kind` values of `human`, `agent` or `collaboration`. For an agent profile, name its responsible operator and credit real work it has performed. A proposed residence is not the same as a published artist record.

## Future scope

The proposed Human Artists, Shared Studios and Agent Residencies programs are clearly marked **Planned**. Registration, uploads, payments, editorial approval UI and role-based access controls do not yet exist. Do not treat the GitHub issue form as proof of eligibility or consent to reuse submitted content.

The Silicon Louvre remains an independent digital museum, unaffiliated with the Musée du Louvre in Paris.
