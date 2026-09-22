# Sarath Gentela's portfolio

A static React, TypeScript, and Vite portfolio with production case studies, five independent projects, interactive engineering explainers, and a separate evidence page.

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

| File | What to change |
| --- | --- |
| `src/App.tsx` | Main page, navigation, experience, education, contact details, project-card visuals |
| `src/projects.ts` | Case-study descriptions, workflow steps, technology tags, evidence links |
| `src/components/SystemsLab.tsx` | Interactive action, retrieval, and recovery explainers |
| `src/styles.css`, `src/readability.css` | Main visual design and responsive styles |
| `src/components/SystemsLab.css` | Interactive explainer styles |
| `public/evidence.html` | Public-project run record and saved-output replay page |
| `public/evidence/` | Saved synthetic outputs, verification notes, and reproducibility wrappers |
| `public/assets/` | Product screenshots and portrait |
| `public/sarath-ai-ml-engineer-resume.pdf` | Supplied résumé, linked from the page |
| `index.html` | Page metadata |

Contact details and professional links are based on the supplied résumé and the public LinkedIn profile. See [CONTENT_SOURCES.md](CONTENT_SOURCES.md) for provenance and content boundaries.

Run `npm run build` after changes. Files in `public/` are copied into the build, so keep that folder limited to material intended for visitors.

## Publishing updates

Push changes to `main`. The `Publish portfolio` GitHub Actions workflow installs locked dependencies, checks TypeScript, builds the site, and deploys only `dist/` to GitHub Pages. Deployment progress is available in the repository's Actions tab. The workflow can also be run manually.

The site can also be hosted elsewhere:

Upload the **contents of `dist/`** to a static host, or configure the host to run `npm ci` and `npm run build` with `dist` as its publish directory. Keep the generated asset and evidence directories together.

Vite uses a relative base (`./`), which supports deployment at a domain root or a GitHub Pages project subpath. No application server, API keys, sign-in service, analytics integration, or database is required. Contact actions open email or copy the address; they do not submit a form.

Canonical, social-image, robots, and sitemap URLs are configured for `https://akira231097.github.io/`. Update them together if a custom domain is added.

The handoff archive includes source and the built site. It excludes `node_modules`; `npm ci` recreates dependencies from the lockfile. The Git repository tracks source files and public assets; generated builds and dependencies are excluded.
