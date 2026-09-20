# Tech.Care — Patient Dashboard

A single-page healthcare dashboard built for the Coalition Technologies front-end skills
test. It converts the supplied Adobe XD screen into HTML/CSS and populates it from the
Coalition Technologies Patient Data API, showing the detailed record for **Jessica Taylor**.

This is a purely static front end: HTML, CSS and JavaScript ES modules. There is no build
step, no bundler, no framework and no `package.json` — the files in this folder are the
application.

## Running it

The page must be served over HTTP. Opening `index.html` straight from the file system
gives the page a `null` origin, and the browser then blocks the API request.

```
cd tech-care-dashboard && python3 -m http.server 8000
```

or

```
npx serve tech-care-dashboard
```

Then open the address the server prints.

## API

- **Endpoint:** `GET https://fedskillstest.coalitiontechnologies.workers.dev`
- **Authentication:** HTTP Basic. The username and password live in `js/api.js` and the
  credential is encoded **at request time** with `btoa()`; no pre-encoded Base64 string is
  stored anywhere in the project.
- The response is an array of patient records. `findPatientByName()` selects Jessica Taylor
  by exact name; every value on screen is derived from that record at runtime.

Because this is a client-side application, the credentials are visible to anyone who opens
the page — that is inherent to the exercise, which specifies browser-side Basic Auth.

`fetchPatients()` handles network failure, HTTP 401, other HTTP errors, malformed JSON and
an unexpected response shape, and each case surfaces a plain-language message in the UI
instead of a blank page.

## Project structure

```
index.html            Page shell, inline SVG icons, <template> elements for repeated rows
css/styles.css        Design tokens from the XD spec panel, base styles, components
css/responsive.css    Breakpoints at 1439 / 1279 / 1199 / 899 / 599 px
js/main.js            Entry point: fetch -> find Jessica -> render -> error states
js/api.js             API request, runtime Basic Auth, error handling
js/format.js          Pure helpers: dates, level indicators, chart data derivation
js/render.js          DOM rendering for each section
js/chart.js           Chart.js configuration for the blood pressure chart
vendor/chart.umd.js   Chart.js 4.5.1 (MIT), vendored so there is no runtime CDN dependency
```

## Notes and limitations

- **Chart.js 4.5.1** is vendored locally. The only other external resource is the
  **Manrope** webfont from Google Fonts; if it cannot load, the page falls back to a system
  sans-serif and everything else still works.
- The sidebar lists every patient the API returns, with Jessica Taylor marked active.
  Patient switching is deliberately not implemented, and the search, settings and ellipsis
  controls are presentational, as the assessment specifies.
- The blood pressure chart uses the six most recent entries from Jessica's
  `diagnosis_history`, reversed into chronological order. The real data differs from the
  mockup — the API documentation notes this — so the two lines cross in places.
- The chart canvas is mirrored by a visually hidden data table, which is what screen
  readers read and what is shown if the charting library ever fails to load.
- Patient photographs come from the API at 96×96 and are displayed larger, so the profile
  image is softer than the mockup. The XD artwork (vital-card illustrations, the doctor's
  photograph and the Tech.Care logo) could not be exported from the shared prototype, so
  those are hand-built SVG approximations.
- Layout geometry matches the XD spec panel at 1600px (columns 367 / 766 / 367, 32px gaps,
  18px page margin), but the result is a close match rather than a pixel-perfect one.
