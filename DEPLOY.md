# Deploying Faham

The app is static: HTML, CSS, ES modules, a manifest and a service worker. There
is no build step and no dependencies, which is deliberate — the whole thing can
be read, edited and deployed by hand.

## Where the files go

Everything in this folder goes at the **root of the repository**, so the app is
served from `https://<user>.github.io/faham/`.

    index.html  app.js  styles.css  sw.js  manifest.webmanifest  privacy.html
    js/  data/  assets/  icon-*.png  apple-touch-icon.png

`REVIEW.md`, `DEPLOY.md` and `test/` are repository documentation and are not
required at runtime; they can be committed alongside without affecting the app.

## Before each deploy

1. Bump `VERSION` in `sw.js`. Nothing else triggers an update for installed
   users. The current value is `v20`.
2. If any file was added or removed under `js/` or `data/`, update the
   `CRITICAL` list in `sw.js` to match. A file missing from that list will not
   be available offline; a file listed but absent will now **fail the install**
   by design, leaving the previous worker serving.
3. If the inline theme script in `index.html` was edited, recompute its SHA-256
   and update the hash in the Content-Security-Policy meta tag, otherwise the
   first paint loses the theme.
4. Run the tests:

       node test/prayer-times.test.mjs
       node test/translation-parity.test.mjs
       node test/escaping.test.mjs

   Run the prayer-time fixtures under at least one foreign timezone as well,
   since that is where the city/zone bug lived:

       TZ=Asia/Seoul node test/prayer-times.test.mjs

5. Serve the folder locally and click through Today, Prayer, Times & Qibla,
   Duas, Questions, Read and Settings in all three languages:

       python3 -m http.server 8901

## Deploy

Upload the contents to the repository root — not into a subfolder — and let
GitHub Pages publish. The service worker's `activate` step deletes every cache
that is not its own, so the previous build's caches are cleaned up on the first
visit after the update.

## After deploying

Open the site, hard-refresh once, and check that:

* the language switch reads **EN / ID / 한국어** with a **+ID** button beside it;
* the Prayer tab shows unfoldable prayer cards, with the current prayer open;
* Settings → Prayer times names the method, the timezone and the precaution
  margin.

Installed users will see an **update bar** on their next visit rather than being
reloaded mid-page; the new version applies when they tap it.

## What GitHub Pages cannot do

GitHub Pages serves static files and does not let you set response headers, so
the following are either delivered as `<meta>` tags or unavailable:

| Control | Status here |
|---|---|
| Content-Security-Policy | Delivered as a meta tag. Works, with the exception below |
| `frame-ancestors` | **Ignored in meta form.** No clickjacking protection |
| `Referrer-Policy` | Approximated with `<meta name="referrer" content="no-referrer">` |
| `Permissions-Policy` | Not available |
| `X-Content-Type-Options` | Sent by GitHub Pages itself |
| HSTS | Sent by GitHub Pages itself on `*.github.io` |

If those matter later, a static host that supports headers (Netlify, Cloudflare
Pages, S3 + CloudFront) can serve the identical folder unchanged — the app has
no host-specific code. Keep the service worker at the site root so its scope
still covers the whole app.
