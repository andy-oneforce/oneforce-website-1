# oneforce-website-eleventy

OneForce marketing site, rebuilt with [Eleventy](https://www.11ty.dev/) — a shared Nunjucks
layout + one template per page — the successor build for `od-oneforce-noir-2` (an
OpenDesign-generated site) per the full-conversion decision (`RE01`=`b`) in BrainCore's Website
Design activity `260826-003`.

## Status (2026-08-29)

Content migrated from `od-oneforce-noir-2`'s exported HTML (`index.html`, `contact.html`), shared
by the User directly (the source GitHub repo was not reachable from this account):

- `src/index.njk` / `src/contact.njk` — the two pages, full copy and structure preserved.
- `src/assets/style.css` — the real brand tokens + component styles extracted from the export
  (color palette, Instrument Serif / Inter typography, spacing, glass/blur treatment).
- `src/assets/site.js` — the shared page behavior (word-reveal animation, hero particle canvas,
  contact-form submission), one file serving both pages.
- `src/assets/favicon.svg`, `src/assets/og-image.png` — carried over from the export.
- `scripts/apps-script.gs` — the Google Apps Script backend the contact form posts to (a Sheet +
  email notification Web App, already deployed; not part of the Eleventy build). See the script's
  own header comment for the redeploy steps if it needs to change.

**Still placeholder / open:**
- No real logo file — the nav uses the wordmark text as the export did.
- Design questionnaire §1 (Visual Identity) is otherwise unanswered beyond what the export itself
  fixed (colors, type). Photography/imagery (§2) is unaddressed — the export has none either.

## Development

```
npm install
npm start   # serve locally
npm run build
```
