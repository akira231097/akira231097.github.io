# Sarath Gentela's portfolio

A static React, TypeScript, and Vite portfolio focused on agent harnesses, mobile on-device AI, multi-stage search and ranking, and asynchronous AI infrastructure. It includes production implementation summaries, interactive architecture diagrams, six source-linked engineering cases, and a separate evidence page with saved local runs for the original five cases. FinishOS evidence is linked from its public repository.

Public website: **[akira231097.github.io](https://akira231097.github.io/)**.

Source repository: [akira231097/akira231097.github.io](https://github.com/akira231097/akira231097.github.io). GitHub Pages builds and publishes the site automatically when changes are pushed to `main`.

## Run locally

Node.js and npm are required. Open a terminal in this folder:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To preview the production build:

```sh
npm run build
npm run preview -- --port 4174
```

Open [http://127.0.0.1:4174](http://127.0.0.1:4174). Use an HTTP server rather than opening `dist/index.html` directly so the JavaScript modules load correctly.

## Edit the site

| File                                      | What to change                                                                                     |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/main.tsx`                            | Application entry point; mounts `EngineeringPortfolio`                                             |
| `src/EngineeringPortfolio.tsx`            | Main page, navigation, production/project presentation, experience, contact, and case-study dialog |
| `src/productionData.ts`                   | Lucidream and AskSpice implementation areas, outcomes, stacks, and attribution                     |
| `src/architectureData.ts`                 | Agent-harness, search/ranking, and asynchronous-workflow diagrams                                  |
| `src/engineeringData.ts`                  | Public project architectures, mechanisms, tradeoffs, results, and source links                     |
| `src/components/ArchitectureExplorer.tsx` | Interactive diagram rendering and component details                                                |
| `src/engineering.css`                     | Dark technical visual design and responsive layouts                                                |
| `src/components/ArchitectureExplorer.css` | Architecture-diagram styling                                                                       |
| `public/evidence.html`                    | Public-project run record and saved-output replay page                                             |
| `public/evidence/`                        | Saved synthetic outputs, verification notes, and reproducibility wrappers                          |
| `public/assets/`                          | Silent product videos and posters, fictional FinishOS phone captures, and portrait                 |
| `public/sarath-ai-ml-engineer-resume.pdf` | Supplied résumé, linked from the page                                                              |
| `index.html`                              | Page metadata                                                                                      |

Contact details and professional links are based on the supplied résumé and the public LinkedIn profile. See [CONTENT_SOURCES.md](CONTENT_SOURCES.md) for provenance and content boundaries.

Production scale in the main page is explicitly attributed to the résumé. The evidence page contains separately scoped, reproduced public-project checks. Keep those categories distinct when updating content.

The Lucidream walkthrough and two AskSpice examples contain video only; source audio tracks were removed. The custom player starts the selected video when visible, pauses offscreen, and respects reduced-motion preference. Visitors can switch examples, play/pause, seek, and expand the video.

Run `npm run build` after changes. Files in `public/` are copied into the build, so keep that folder limited to material intended for visitors.

## Publishing updates

Push changes to `main`. The `Publish portfolio` GitHub Actions workflow installs locked dependencies, checks TypeScript, builds the site, and deploys only `dist/` to GitHub Pages. Deployment progress is available in the repository's Actions tab. The workflow can also be run manually.

The site can also be hosted elsewhere:

Upload the **contents of `dist/`** to a static host, or configure the host to run `npm ci` and `npm run build` with `dist` as its publish directory. Keep the generated asset and evidence directories together.

Vite uses a relative base (`./`), which supports deployment at a domain root or a GitHub Pages project subpath. No application server, private API keys, sign-in service, or database is required. Contact actions open email or copy the address; they do not submit a form.

## Visitor analytics

The site includes an optional Microsoft Clarity integration for the portfolio and evidence page. It is **inactive until a real project ID is configured** in `public/analytics-config.json`. Tracking starts only after a visitor selects **Allow analytics**. Local previews, visitors who decline, and browsers sending Global Privacy Control or Do Not Track signals do not load Clarity. Choices can be changed through **Privacy & analytics** in the footer.

To activate it:

1. Sign in at [Microsoft Clarity](https://clarity.microsoft.com/) and create a project for `https://akira231097.github.io/`.
2. Copy the project's public ID from **Settings → Setup** into `clarityProjectId` in `public/analytics-config.json`. This tracking ID is public; do not add passwords, access tokens, or dashboard API keys.
3. In Clarity's cookie settings, turn off setting cookies by default. This site explicitly grants analytics storage only after opt-in and denies advertising storage.
4. Push the configuration change to `main`, then visit the public site and allow analytics. Confirm the visit in Clarity's live recordings and dashboard.

The private Clarity dashboard shows distinct users for the selected date range, traffic sources, countries, devices, heatmaps, scroll behavior, and session replays. Counts are estimates of consenting browsers, not verified people. Different browsers/devices, cookie deletion, declined consent, ad blockers, and bots affect the count. Visits before activation cannot be reconstructed.

Custom events identify `resume_open` (opening the PDF, not proof of a saved download), `project_open_<id>`, `evidence_open`, `github_click`, `linkedin_click`, `contact_email_click`, and `email_copy_click` (not proof that an email was sent). These appear in Clarity's Smart events and can be used to filter sessions. No names, email addresses, or custom visitor identifiers are sent by this integration.

Canonical, social-image, robots, and sitemap URLs are configured for `https://akira231097.github.io/`. Update them together if a custom domain is added.

The handoff archive includes source and the built site. It excludes `node_modules`; `npm ci` recreates dependencies from the lockfile. The Git repository tracks source files and public assets; generated builds and dependencies are excluded.
