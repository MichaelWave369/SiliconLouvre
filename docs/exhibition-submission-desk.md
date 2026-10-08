# Exhibition Submission Desk v1.0

The Silicon Louvre is building a bridge from art creation to human-curated exhibitions. This release provides a **proposal preparation desk**, not an upload portal or automatic publication system.

## For artists

1. Open the museum's **CREATE** room and design your static 800×800 SVG composition in the Optical Art Studio. A work can be loaded from your private draft shelf.
2. Scroll to **The Exhibition Submission Desk**. Supply a public artist name or alias, artwork title, story, accessibility description, creation process, actual collaborator roles, and proposed rights status.
3. Confirm that you have permission to propose the work and understand that GitHub issues are public.
4. Select **Download Curator Kit (.JSON)**. This generates a local, readable file containing your metadata, full standalone SVG artwork, creative recipe and explicit proposal-only status.
5. Separately download the **Artwork SVG**, if useful for archiving or sharing.
6. Select **Copy Public Proposal Text** and review it. It includes your chosen public credits and story but not the full SVG.
7. Open the public [Artist / exhibition proposal](https://github.com/MichaelWave369/SiliconLouvre/issues/new?template=artist-proposal.yml) form and decide what information to submit. Publication is not automatic, and your browser does not send any content to GitHub until *you* submit the form.

**Important:** Public GitHub issues may be indexed by search engines. Do not include home addresses, private phone numbers, personal email addresses, unapproved legal names, medical information or other private data. Use a public artist alias if preferred. A proposed work file can be shared later through a curator-approved channel; there is no automatic file upload.

## What happens after a proposal?

The curator should review:

- **Rights and permission:** Confirm submitter authority, intended publication rights, tool terms, collaborator consent and any legal restrictions. A proposed CC license is not an automatic grant to the museum.
- **Attribution:** Distinguish human creative direction, software assistance, specific agent actions and the responsible human operator where applicable.
- **Authenticity and provenance:** Inspect the actual files; compare the source recipe and SVG, and document how the work was produced.
- **Accessibility and safety:** Check the text alternative, flashing/movement/audio content and visitor comfort.
- **Exhibition suitability:** Consider curatorial purpose and avoid overstating scientific effects or AI-agent authorship.

Only a curator-reviewed change to the museum's approved collections and public Artist Registry should publish the artwork.

## Local kit verification

The museum repository contains a helper for checking the structure of a packet downloaded from the studio:

```sh
npm run inspect:submission -- /path/to/silicon-louvre-proposal-example.json
```

The script verifies the expected `silicon-louvre.artist-proposal.v1` schema, source recipe, generated SVG equivalence, metadata completeness, dimensions, and unapproved status. It **does not** confirm the submitting artist's identity or legal rights, run a malware scanner on arbitrary third-party files, or approve the work for publication. It reads a local file and makes no network requests.

A kit includes:

- `schema`, `createdAt` and explicit proposal-only governance status;
- `artwork`: public title, display name, story, text alternative, process, contributor roles and proposed rights status;
- `source`: known `silicon-louvre-studio/v1` parameters;
- `files`: the deterministic generated SVG.

The two consent checkboxes are **not** carried into the generated public metadata. A curator must separately confirm permission and publication terms with the creator. The proposed SVG is generated entirely from known numerical values and fixed color palettes, not embedded text supplied by the artist.

## Privacy, availability and limitations

- Nothing in the Exhibition Submission Desk is stored or posted until the visitor explicitly downloads files or copies text. The Creative Studio's separate private draft shelf continues to use browser-local storage.
- The kit is a portable local export, not an application, a signed certificate, a proof of identity, or a transfer to a server.
- This first desk prepares proposals only for works made using the museum's existing SVG Creative Studio. Other art media may be proposed with the existing GitHub issue template without using this tool.
- There is no upload backend, submission inbox, guaranteed response time, approval panel or automated publication pipeline in this release.
- Existing Domistika handoff and SVG export remain available and independent from curation.

## Acceptance checklist

- [ ] Enter complete metadata, choose human/AI credit type, and confirm both notices.
- [ ] Download a JSON kit; check that it includes exactly one SVG matching the current settings.
- [ ] Save the separate SVG and open it in a browser.
- [ ] Copy the public proposal summary and confirm it contains no artwork bytes or unwanted personal data.
- [ ] Try empty titles, missing accessibility descriptions, withheld rights and withheld public-data consent; confirm validation blocks exporting.
- [ ] Run `npm run inspect:submission -- path/to/packet.json` on a valid kit. Tamper with the SVG and verify rejection.
- [ ] Check phone layout and keyboard navigation.
- [ ] Confirm no submission reaches GitHub automatically and the current museum galleries remain unchanged.

The Silicon Louvre is independent of and not affiliated with the Musée du Louvre.
