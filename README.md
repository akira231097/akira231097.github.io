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

The portfolio and evidence page use Microsoft Clarity in **cookieless mode**, with both analytics and advertising storage explicitly denied through its Consent V2 API. The script adds no popups, footer controls, visitor counts, or dashboard to the public website. Local previews and browsers sending Global Privacy Control or Do Not Track signals do not load Clarity. Any decline saved by the earlier opt-in version is also respected. The integration never grants visitor consent, sends custom visitor identifiers, or writes its own tracking identifiers to browser storage.

Project configuration:

1. The owner-provided project ID is `yqptxl35d6`, configured in `public/analytics-config.json`. The `cookielessClarityProjectId` field is intentionally different from the old opt-in configuration, so cached copies of the old script cannot display a popup after activation. An empty ID disables analytics completely. This tracking ID is public; do not add passwords, access tokens, or dashboard API keys.
2. Reports are available only after signing in to [Microsoft Clarity](https://clarity.microsoft.com/) as a project member.
3. In the project's cookie settings, turn off setting cookies by default as an additional safeguard. The site also explicitly denies both storage types on every page visit.
4. Publish changes by pushing to `main`. Confirm incoming visits in Clarity's live recordings and dashboard.

The private Clarity dashboard provides page activity, device/country summaries, heatmaps, scroll behavior, and page-level recordings. **Its unique-user count is not a reliable count of distinct visitors in cookieless mode**: each page view receives a fresh ID, repeat visitors are counted again, and visits across pages are not joined. Returning-user metrics, funnels, attribution, and session duration also have limitations. See Microsoft's [reporting limitations without cookie consent](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-without-cookie-consent). No real names or email addresses are inferred, and visits before activation cannot be reconstructed.

Custom events identify `resume_open` (opening the PDF, not proof of a saved download), `project_open_<id>`, `evidence_open`, `github_click`, `linkedin_click`, `contact_email_click`, and `email_copy_click` (not proof that an email was sent). These appear in Clarity's Smart events and can be used to filter sessions. No names, email addresses, or custom visitor identifiers are sent by this integration.

Canonical, social-image, robots, and sitemap URLs are configured for `https://akira231097.github.io/`. Update them together if a custom domain is added.

The handoff archive includes source and the built site. It excludes `node_modules`; `npm ci` recreates dependencies from the lockfile. The Git repository tracks source files and public assets; generated builds and dependencies are excluded.
