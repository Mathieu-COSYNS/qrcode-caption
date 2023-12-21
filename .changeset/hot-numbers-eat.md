---
'qrcode-caption': minor
---

build!: Change build system to tsup for cjs and esm, cleanup package.json and change bundle system

BREAKING-CHANGE: Change bundles from bundle.umd.min.js and bundle.esm.min.js to a single bundle.min.js. bundle.min.js is now iife format and should be the bundle to use in script tags in browsers.
If you import qrcode-caption using a cdn like jsdelivr: `<script src="https://cdn.jsdelivr.net/npm/qrcode-caption/dist/bundle.umd.min.js"></script>` or `<script src="https://cdn.jsdelivr.net/npm/qrcode-caption/dist/bundle.esm.min.js"></script>` you must change it to `<script src="https://cdn.jsdelivr.net/npm/qrcode-caption/dist/bundle.min.js"></script>`
