# Content and visual sources

Sources were reviewed in September 2026. The portfolio distinguishes production contributions, independent public projects, saved test outputs, and explanatory simulations.

## Professional background

The supplied résumé and shareable career summary provide role dates, education, technical background, and contribution descriptions. The supplied résumé is included as `public/sarath-ai-ml-engineer-resume.pdf`. Professional links and contact details were checked against [Sarath's public LinkedIn profile](https://www.linkedin.com/in/sarathgentela/).

The website presents a focused selection of demonstrated work. It does not convert résumé scale claims into independently measured portfolio metrics.

## Production work and screenshots

**Lucidream / Spice** is a team-built product. The case study describes Sarath's contributions to action evidence and review, guided workflows, precision clip editing, and recovery across the backend and interface. It does not attribute the entire product to one engineer.

- [Lucidream's public product page](https://lucidream.io/) provides product context.
- [Sarath's public engineering walkthrough](https://www.linkedin.com/feed/update/urn:li:activity:7506398595475124224/) describes his action ledger and review work, including collaboration on recovery.
- `public/assets/lucidream-public-editor.jpg` was captured through the browser from Lucidream's public landing-page editor feature. It shows the product's **public marketing presentation**, not a recorded authenticated editing session.
- `public/assets/lucidream-social-planner.png` is additional public product imagery. Its inclusion does not establish individual authorship of the pictured feature.
- `public/assets/sarath-profile.jpg` is Sarath's portrait from his public LinkedIn profile.

The AskSpice case study summarizes earlier team-based conversational retrieval and media-processing work. [EchoFind](https://github.com/akira231097/echofind) is a separate personal implementation used to make related retrieval ideas inspectable; it is not the AskSpice production codebase.

The company case-study diagrams explain user-facing workflows at a high level. Company source code and internal architecture are not included in the public site or handoff.

## Independent project evidence

| Public repository | What the portfolio demonstrates |
| --- | --- |
| [EchoFind](https://github.com/akira231097/echofind) | Conversational retrieval and memory; offline verification covers memory behavior and evaluation scaffolding |
| [Clipopedia](https://github.com/akira231097/clipopedia) | Testable retrieval stages and saved runs using a small fictional corpus with deterministic service substitutes |
| [Artha Council](https://github.com/akira231097/artha-council) | Research-to-action boundaries and recorded execution checks using a fake broker; public defaults disable live trading |
| [Commitment Decay Engine](https://github.com/akira231097/commitment-decay-engine) | Local transcript extraction, ledger updates, and evidence matching with fictional fixtures |
| [ReelForge](https://github.com/akira231097/reelforge) | Local media-workflow source and tests covering ingest, transcript parsing, captions, and data models |

`public/evidence.html` contains source links pinned to the reviewed public revisions, commands, saved results, and relevant verification limits. `public/evidence/project-runs.json` holds the replay data. The accompanying wrappers make the documented Windows cleanup and isolated-memory checks reproducible.

These replays show **saved outputs from local checks**. They do not contact a live model, broker, media service, or workplace account. Synthetic retrieval scores describe the stated fictional dataset; they do not measure production search quality. No generated-video quality benchmark or investment-return claim is presented.

## Interactive explainers

The three “Inside the systems” experiences in `SystemsLab.tsx` are custom local simulations:

- Action review changes sample state in the browser.
- Retrieval combines token overlap with a small concept dictionary; it does not run embeddings or a language model.
- Recovery uses a local timer and React state to illustrate checkpoints; refreshing resets it.

These explanations are separate from the source-derived saved replays on the evidence page. Their labels should remain visible when the site is edited.

## Design reference

[Rishikesh Aluguvelli's portfolio](https://rishikeshaluguvelli.github.io/) was the user's reference for visual clarity and presentation quality. This portfolio's layout, visual identity, project illustrations, and interactions were created for Sarath; the reference site's design was not copied.

## Maintaining the evidence

Keep public-product imagery attributed to the team product. When updating a project result, rerun the relevant check and update its source revision, data, and scope together. Keep personal projects distinct from production work, and preserve the difference between a working implementation, a measured result, and an illustrative interaction.
