# oneforce-website-eleventy

OneForce marketing site, rebuilt with [Eleventy](https://www.11ty.dev/) as plain Markdown pages +
a shared Nunjucks layout — the successor build for `od-oneforce-noir-2` (an OpenDesign-generated
site published to GitHub Pages), per the full-conversion decision (`RE01`=`b`) in BrainCore's
Website Design activity `260826-003`.

## Status (2026-08-29)

This is an initial scaffold only:

- Layout + build config are in place (`.eleventy.js`, `src/_includes/layout.njk`).
- **Content migration from `od-oneforce-noir-2` has not happened** — that repository was not
  found under the `andy-oneforce` GitHub account this was built from, so no source HTML/content
  was available to convert. Locate/share that repo (or its exported HTML) to unblock migration.
- **Brand styling is a placeholder** — the design questionnaire's Visual Identity section
  (logo, brand colors, typography) is not yet answered, so `src/assets/style.css` carries no
  real brand tokens.

## Development

```
npm install
npm start   # serve locally
npm run build
```
