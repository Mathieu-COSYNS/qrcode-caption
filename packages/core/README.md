# qrcode-caption

**qrcode-caption** is a Node.js library that extends the functionality of the
[qrcode](https://www.npmjs.com/package/qrcode) package, enabling users to
generate QR codes with customizable captions.

## Features

- Generate QR codes with embedded captions.
- Customize caption text, and font size.
- Support for various output formats (SVG, PNG, JPEG, WEBP)

## Installation

You can include `qrcode-caption` in your project using one of the following
methods:

### Install via npm

To use `qrcode-caption` with Node.js or as part of your frontend code, install
it via npm:

```sh
npm install qrcode-caption
```

### Include via a `<script>` tag

To use `qrcode-caption` directly in a browser, include the bundled version via a
`<script>` tag from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/qrcode-caption@latest/dist/bundle.min.js"></script>
```

This makes the library available globally as `QRCodeCaption`, allowing you to
generate QR codes with captions in browser environments.

## Usage

### In Node.js / bundled environment

```js
import { toDataURL, toSVG } from "qrcode-caption";

// or const { toSVG, toDataURL } = require("qrcode-caption");

// Generate a QR code SVG with caption
const qrCode = toSVG("https://example.com", "Scan to visit example.com");

// Generate a QR code as Data URL
const dataUrl = toDataURL("https://example.com", "Scan to visit example.com");
```

### In browser with script tag

```html
<div id="qrcode"></div>
<img id="qrcode-img" />
<script>
  // Generate QR code SVG and insert into page
  document.getElementById("qrcode").innerHTML = QRCodeCaption.toSVG("https://example.com", "Scan to visit example.com");

  // Generate QR code as Data URL and set as image source
  document.getElementById("qrcode-img").src = QRCodeCaption.toDataURL(
    "https://example.com",
    "Scan to visit example.com",
  );
</script>
```

## Options

### `version?: number`

Specifies the QR Code version (1–40).
If omitted, the library automatically selects the smallest version that fits the encoded data.

### `errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'`

Defines the error-correction level. Higher levels allow more damage correction but reduce capacity.

| Level | Error Correction | Typical Use        |
| ----- | ---------------- | ------------------ |
| **L** | ~7%              | Max capacity       |
| **M** | ~15% (default)   | Standard           |
| **Q** | ~25%             | Higher reliability |
| **H** | ~30%             | Harsh conditions   |

**Default:** `'M'`

### `maskPattern?: number`

Forces the mask pattern (0–7).
If omitted, the best-performing mask is chosen automatically.

### `toSJISFunc?: QRCodeToSJISFunc`

A function that converts Kanji characters to their Shift-JIS values.
Provide this if you need **Kanji encoding mode** support.
If not using Kanji mode, this option can be ignored.

### `margin?: Percentage | number | null`

SVG-specific override of the quiet zone.
Accepts:

- pixel values (`20`)
- percentages (`"10%"`)
- `null` to remove or rely on defaults.

**Default:** `4`

### `scale?: number`

Scales the output.
A value of `1` renders each QR module as **1 pixel**.

**Default:** `4`

### `width?: number`

Forces an explicit output width (in pixels). This option **overrides** `scale`.

### `color?: { foreground?: string; background?: string }`

Defines QR code colors in **8-digit hex RGBA** format.

- **foreground** — Color of the dark modules
  **Default:** `'#000000ff'`
- **background** — Color of the light modules
  **Default:** `'#ffffffff'`

### `fontSize?: Percentage | number | null`

Font size for embedded SVG text or labels.
Supports:

- numeric pixels (`12`)
- percentage strings (`"150%"`)
- `null` to omit font sizing.

### Accessibility Attributes

These optional **ARIA** attributes can help your SVG QR code be screen-reader friendly.

#### `"aria-label"?: string`

Provides a readable text description (e.g., the encoded URL or a human-friendly message).

#### `"aria-labelledby"?: string`

References the `id` of another element whose text serves as the label.

#### `"aria-hidden"?: boolean`

If `true`, hides the QR code from assistive technologies.
Useful when the QR code is purely decorative.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
For major changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE)
file for details.
