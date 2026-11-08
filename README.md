# [BUSINESS NAME] — Onyx Collection shower site

A static marketing prototype for a Louisiana bathroom remodeler that installs Onyx Collection showers. It is not deployed, and the review form does not submit or save anything.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317). The project review is at [http://127.0.0.1:4317/estimate](http://127.0.0.1:4317/estimate).

A static export does not need a server:

```bash
npm run build
```

That writes the site to `out/`. Pages are `out/index.html` and `out/estimate.html`. Search engines are asked not to index it.

```bash
npm test
npm run lint
```

## Placeholders

The site shows `[BUSINESS NAME]`, `[PHONE]`, `[EMAIL]`, and `[PRICE RANGE]` until those details are approved. There are no dollar amounts. The range on the review page is a placeholder, not a calculated price.

## Theme

The default palette is Bayou. Marigold and Indigo are in the header palette control. To change colors, edit the `data-theme` blocks in `app/globals.css`. The default is set with `data-theme` on `<html>` in `app/layout.tsx`.

## Copy boundaries

Page wording follows the November 8 website and estimate copy. Product facts stay inside those manufacturer statements. Coverage is described as a manufacturer product warranty, separate from installation, with no labor promise. The site does not compare other companies. Prairieville and Gonzales are outside the planned towns, and the I-10 list stops at Baton Rouge.

The assistant in the corner is labeled AI. It is not a person, and the chat is not submitted or saved.
