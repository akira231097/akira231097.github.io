# Content and visual sources

Sources were reviewed in September 2026. This technical portfolio distinguishes production contributions, independent public implementations, recorded verification results, and explanatory architecture diagrams. The active application is `src/EngineeringPortfolio.tsx`.

## Professional background

The supplied résumé and shareable career summary provide role dates, education, technical background, and contribution descriptions. The supplied résumé is included as `public/sarath-ai-ml-engineer-resume.pdf`. Professional links and contact details were checked against [Sarath's public LinkedIn profile](https://www.linkedin.com/in/sarathgentela/).

The production-scale figures—**1M+ searchable chunks, 10,000+ processed episodes, 16 concurrent workers, and approximately 20 bulk-processing episodes per minute**—are attributed to the supplied résumé in the interface. They are résumé-reported production context, not independent measurements made while building this portfolio. Public-project tests and synthetic evaluation results are presented separately with their own scope.

## Production engineering and ownership

**Lucidream / Spice** is a team-built product. The production section describes Sarath's implementation areas within the agent harness: action evidence and contracts, review and confirmation, context and run lifecycle, precision editing, asynchronous recovery, and the corresponding React interface. It does not attribute the entire runtime or product to one engineer.

- [Lucidream's public product page](https://lucidream.io/) provides product context.
- [Sarath's public engineering walkthrough](https://www.linkedin.com/feed/update/urn:li:activity:7506398595475124224/) describes his action ledger and review work, including collaboration on recovery.

**AskSpice** describes team-based conversational search, multi-stage ranking, source hydration, conversation memory, and media ingestion work. The technical emphasis is search and retrieval: query routing, weighted HyDE, hybrid candidates, reciprocal-rank fusion, reranking, metadata signals, and source-backed selection. [EchoFind](https://github.com/akira231097/echofind) and [Clipopedia](https://github.com/akira231097/clipopedia) are separate public implementations; neither is presented as the AskSpice production codebase.

Private repository review informed the contribution audit. The public site and handoff exclude company source code, private repository identifiers and paths, credentials, account data, internal logs, and deployment configuration. The company-related diagrams are simplified component-level explanations, not exported internal diagrams or a complete production topology. Production references point to public product and professional pages.

## Visual asset provenance

- `public/assets/finishos-reply-review.png` and `public/assets/finishos-form-applied.png` were captured directly from the connected Samsung SM-S948U using the FinishOS Android test build. Both use fictional people and form answers. The reply screen uses a deterministic backend to display a repeatable draft; it is a real UI capture, not a real-model quality example. The form screenshot shows the fictional Android practice form after explicit reviewed application. Its password/payment fields remain blank and nothing was submitted. The private form review activity blocks screenshots, and no attempt was made to bypass that control.

- `public/assets/sarath-profile.jpg`, used in the technical portfolio, is Sarath's portrait from his public LinkedIn profile.
- `public/assets/lucidream-product-silent.mp4` and `public/assets/askspice-product-silent.mp4` are derived from two product walkthrough videos supplied by Sarath for this portfolio. Their audio tracks were removed before publication; each published file has one H.264 video stream and no audio stream. The matching poster images are frames extracted from those clips. The footage shows team-built product interfaces and does not by itself establish individual authorship of a pictured feature or verify the full architecture described on the page.
- Social preview artwork and the interactive diagrams were authored for this portfolio. They are presentation assets, not screenshots of private systems.

## Independent project evidence

[FinishOS](https://github.com/akira231097/FinishOS/tree/3f76a57a80142910dcf7878aac03cba8c49ac701) is an Android implementation built on [EdgeChat](https://github.com/RishikeshAluguvelli/EdgeChat) under its retained MIT license. It is a public source case alongside the five independent cases below; it is not presented as an original implementation of the upstream iOS inference engine. Its pinned repository contains the two fictional phone screenshots, current Android code, device checks and scoped evidence. Recorded results include 82 JVM tests and exact signed-app workflows on a Samsung S26 Ultra. The reported 4.470-second fresh reply and 119-millisecond cached return are individual observations, not latency guarantees.

| Public repository                                                                                                                                   | What the portfolio demonstrates                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [EchoFind · reviewed revision](https://github.com/akira231097/echofind/tree/8b5a3ab9ecbc491ca290979eeeb2112c2de8c62f)                               | Three levels of rank fusion, temporal search, deterministic memory, and streamed results; offline verification covers memory and evaluation scaffolding |
| [Clipopedia · reviewed revision](https://github.com/akira231097/clipopedia/tree/b2cc9d85c38117f5787dc364446f3d6bd500ce71)                           | Protocol-based adapters, hybrid search, double rank fusion, reranking, and recorded evaluation on 14 fictional clips                                    |
| [Artha Council · reviewed revision](https://github.com/akira231097/artha-council/tree/bc3ef17b4ebc4a56004fc098209caa39919500f5)                     | Independent research roles, broker-proof gates, SQLite receipt claims, and reconciliation; recorded execution checks use a fake broker                  |
| [Commitment Decay Engine · reviewed revision](https://github.com/akira231097/commitment-decay-engine/tree/6068ad45bddbe777261a030b0d7618018d629fe7) | Deterministic extraction, markdown persistence, lexical evidence matching, and bounded nudge policy using fictional fixtures                            |
| [ReelForge · reviewed revision](https://github.com/akira231097/reelforge/tree/c0d08c8de046901ba429b183e5c849335a25aa34)                             | Typed media stages, model-assisted planning, asset routing, timing corrections, and component tests; no complete video render was measured              |

`src/engineeringData.ts` supplies six public technical cases: stack boundaries, ordered stages, conditional paths, engineering decisions and tradeoffs, scoped results, limitations, and code links pinned to the reviewed commits. Source-code links describe those specific revisions rather than an unverified moving branch.

`public/evidence.html` contains pinned source links, reproduction commands, captured results, and verification limits. `public/evidence/project-runs.json` holds the saved output data. The accompanying wrappers reproduce the documented Windows cleanup and isolated-memory checks.

These replays show **saved outputs from local checks**. They do not contact a live model, broker, media service, or workplace account. Direct original test counts are 34 for Clipopedia, 5 for Commitment Decay Engine, and 15 for ReelForge. Artha's 29 focused execution tests require the disclosed Windows garbage-collection cleanup wrapper. EchoFind verification is memory-only plus a retrieval skeleton; its sample scripts are not counted as assertion-based tests.

Synthetic retrieval scores describe the stated fictional dataset and deterministic model substitutes; they do not measure production search quality. The recorded pricing-query miss remains visible. No generated-video quality benchmark, verified provider-cost saving, investment-return claim, or real broker transaction is presented.

## Interactive architecture diagrams

The active technical portfolio contains **three interactive architecture views** in `src/architectureData.ts`:

- **Agent harness:** context, model/tool iteration, action policy, durable evidence, and asynchronous work within a team-built application.
- **Search and ranking:** source-grounded reference architecture using the separate EchoFind and Clipopedia implementations, with query planning, candidate generation, fusion, hydration, reranking, and selection.
- **Durable AI workflows:** a simplified system-design pattern separating request lifetime, persistent job state, workers, artifacts, events, and client reconnection.

Each of the **six public project cases** also has an interactive implementation diagram generated from its source-linked flow and conditional branches. `src/components/ArchitectureExplorer.tsx` lets visitors inspect responsibilities, technologies, failure boundaries, and connections. Selecting a component changes the explanation; it does not invoke that component or execute a provider workflow.

The current diagrams do not claim to execute embeddings, model inference, broker operations, media processing, or recovery jobs. They remain distinct from the captured repository outputs on the evidence page.

## Design reference

[Rishikesh Aluguvelli's portfolio](https://rishikeshaluguvelli.github.io/) was the user's reference for visual clarity and presentation quality. The technical presentation was subsequently focused on Sarath's agent harnesses, complex search and ranking, retrieval, and asynchronous infrastructure. Its layout, visual identity, diagrams, and interactions were created for this portfolio; the reference site's design was not copied.

## Maintaining the evidence

Keep public-product imagery attributed to the team product and keep résumé-reported production scale labeled as reported context. When changing a public-project result, rerun the relevant check and update the source revision, recorded data, diagram, and scope together. Keep public builds distinct from production work, retain the documented failure and verification limits, and preserve the difference between implemented code, measured output, and an explanatory architecture.
