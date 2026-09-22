# Technical portfolio review

Reviewed September 22, 2026. This record covers the technical redesign of the public portfolio.

## Content and source review

- Reviewed the supplied résumé, career reference, public LinkedIn profile and engineering walkthrough, Lucidream product page, and authorized repository history.
- Independently audited attribution: production contributions are specific implementation areas within team-built products; five public projects remain separate implementations.
- Focused positioning on agent harnesses, search, complex ranking, retrieval, and asynchronous infrastructure. No recommendation-system expertise is claimed.
- Kept the four production-scale figures attributed to the résumé. Public-project measurements retain their own test conditions, dataset size, and limitations.
- Verified 51 pinned public source paths against five reviewed repository revisions. Kept company code, private repository identifiers, credentials, and internal diagrams out of the site and source handoff.
- Corrected conditional paths, tool-result recording, and observation feedback in the diagrams. Classified boundaries by implementation responsibility rather than keyword inference.
- Preserved the recorded evidence dataset and execution scripts; this redesign did not rerun or change the original project measurements.

## Architecture and interaction review

- Three main architecture views and five public case diagrams: 72 routed connections checked for valid endpoints, node intersections, orthogonal segments, and canvas bounds; no failures found.
- Inspected desktop diagrams and mobile component views. Selected components expose responsibilities and inbound/outbound connections.
- Opened all five project cases; verified their headings, component counts, source links, and Escape closing.
- Verified closing returns focus to the initiating project button. Browser Back closes a case, Forward restores it, and reloading a case URL restores the case.
- Filtered to the two search/ranking projects and restored all five projects.
- Checked mobile navigation opening, initial focus, Escape dismissal, and dismissal after navigation.
- Verified the email-copy success state, résumé link, and local evidence/assets.
- Checked the recorded retrieval miss and the ambiguous broker-submission scenario; the latter shows UNKNOWN and rejection of a repeated submission.

## Responsive and build review

- Reviewed desktop at 1440px, tablet at 768px, and phones at 390px and 320px. Document width matches the viewport at all checked sizes; the 320px case dialog also has no horizontal overflow.
- Architecture tabs and project filters scroll within their own rows on narrow screens. Diagram cards preserve explicit connections on mobile.
- All images displayed during the initial redesign review loaded. The product-video update below replaces the public Lucidream editor preview.
- Reduced-motion emulation changes smooth scrolling to auto; temporary browser emulation was reset after review.
- Updated favicon, social artwork, metadata, evidence-page styling, and documentation to match the technical design.
- TypeScript and Vite production build pass. Final local production-browser review reports no warning/error logs.
- HTTP 200 checks passed for compiled JS/CSS, favicon, résumé PDF, evidence page and JSON, social image, and product image. Content types match.
- Résumé bytes retain SHA-256 `9806d265c48251d14619280b4db752d13ea2e18b9e913ed30b7c103f3ea58458`.
- Dependency audit reports zero known vulnerabilities. Built output contains no source maps.

Browser checks used Chromium in desktop and emulated responsive viewports, not a physical cross-browser device lab. GitHub Pages deployment is handled by the checked-in workflow; repository history records the published revision. Public-project reproduction instructions and limitations remain in `public/evidence.html`.

## FinishOS addition — September 22, 2026

- Added a sixth public engineering case for [FinishOS](https://github.com/akira231097/FinishOS/tree/3f76a57a80142910dcf7878aac03cba8c49ac701). The Android app derives from EdgeChat under the retained MIT notice; the case does not claim original authorship of the upstream iOS engine.
- Captured the reply screen and filled practice form from the connected Samsung S26 Ultra. Both show fictional data. The reply screen uses a deterministic test backend; real-model output and timing are documented separately. The protected form review screen blocked capture, so only the practice form after explicit reviewed application appears publicly.
- Linked six source/verification paths to the pinned FinishOS commit, including the signed-app result and form tests. The case gives its limits alongside recorded counts rather than treating individual latency observations as guarantees.
- `npm run build` passes after the change. The local desktop browser shows the featured project card, both images and its interactive seven-component diagram. At a 390px viewport, the dialog fits within 374px, the page has no horizontal overflow, and both screenshot assets load. The temporary viewport override was reset.

## Product video update

- Reviewed the two supplied product clips and placed them under Lucidream and AskSpice, respectively, in place of the Lucidream image.
- Removed both audio streams with FFmpeg while copying the original H.264 video streams. FFprobe confirms that each published MP4 contains one video stream and no audio stream.
- Added still frames as poster images and native playback controls. Both clips loop while visible; playback pauses offscreen and when reduced motion is requested.
- The captions identify the footage as team-built product walkthroughs and keep the engineering contribution claims separate from what the videos depict.
- Reviewed both clips in the browser at desktop width and the Lucidream clip at 390px phone width. The visible video played, the offscreen video paused, both were muted, and the phone page had no horizontal overflow.
