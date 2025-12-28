# qrcode-caption

## 0.4.0

### Minor Changes

- d7626fb: feat: draw svg with shapes + fill color instead of lines and strokes
- b2b2d60: feat: add new browser utils: supportsCanvasFormat
- b2b2d60: feat: add blob as a possible format returned by convertDataURLType browser utils
- d6225f5: feat: add rounding because most decimal places are irrelevant in the case of generating a QRCode

### Patch Changes

- b2b2d60: docs: add readme to start documenting how qrcode-caption works
- b2b2d60: test: add test to compare png images pixels per pixels
- b2b2d60: refactor: change QRCodeOptions from type alias to import alias for future doc gen with typedoc

## 0.3.0

### Minor Changes

- 52244d8: fix: underscore does not escape `
- 52244d8: fix: underscore taking half of the bundle size for one function
- 12cc5ee: Invalid render options will throw errors. Previously they were silently replaced by default value which cause confusion.

### Patch Changes

- a51ca47: fix: Cannot find module '/home/mc/workspace/test/node_modules/qrcode/lib/core/qrcode' imported from /home/mc/workspace/test/node_modules/qrcode-caption/dist/index.js
- cb1025e: Shorten hex code in rendered SVGs

## 0.2.0

### Minor Changes

- eaf95b0: build!: Change build system to tsup for cjs and esm, cleanup package.json and change bundle system

  BREAKING-CHANGE: Change bundles from bundle.umd.min.js and bundle.esm.min.js to a single bundle.min.js. bundle.min.js is now iife format and should be the bundle to use in script tags in browsers.
  If you import qrcode-caption using a cdn like jsdelivr: `<script src="https://cdn.jsdelivr.net/npm/qrcode-caption/dist/bundle.umd.min.js"></script>` or `<script src="https://cdn.jsdelivr.net/npm/qrcode-caption/dist/bundle.esm.min.js"></script>` you must change it to `<script src="https://cdn.jsdelivr.net/npm/qrcode-caption/dist/bundle.min.js"></script>`

## 0.1.1

### Patch Changes

- c8089df: fix options not recognized when caption is not provided in toSVG
- f32d387: docs(examples): Improve examples
- d1aceda: build(dev-deps): bump dev dependencies

## 0.1.0

### Minor Changes

- 8bab82f: Accept margin and fontSize number as string

### Patch Changes

- 50bbc43: Fix: caption not rendered in correct color
- 824df2f: Add example with a complex form
- 7eac8be: Fix: inputs not escaped correctly
- 7c32bc5: Add example with pnpm
- b992e52: build(deps): upgrade package dependencies
- f0f7ffa: Fix overflow in form example

## 0.0.2

### Patch Changes

- 95a003e: Test changeset

  This is a small patch to test changeset and its capabilities
