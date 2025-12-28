---
editUrl: false
next: false
prev: false
title: "QRCodeOptions"
---

Defined in: [packages/core/src/core/QRCodeSvgRendererOptions.ts:6](https://github.com/Mathieu-COSYNS/qrcode-caption/blob/3cd34d0191a6755511f4210731fa281f49744fc8/packages/core/src/core/QRCodeSvgRendererOptions.ts#L6)

## Extends

- `Omit`\<`QRCodeRenderersOptions`, `"margin"`\>

## Properties

### aria-hidden?

> `optional` **aria-hidden**: `boolean`

Defined in: [packages/core/src/core/QRCodeSvgRendererOptions.ts:11](https://github.com/Mathieu-COSYNS/qrcode-caption/blob/3cd34d0191a6755511f4210731fa281f49744fc8/packages/core/src/core/QRCodeSvgRendererOptions.ts#L11)

***

### aria-label?

> `optional` **aria-label**: `string`

Defined in: [packages/core/src/core/QRCodeSvgRendererOptions.ts:9](https://github.com/Mathieu-COSYNS/qrcode-caption/blob/3cd34d0191a6755511f4210731fa281f49744fc8/packages/core/src/core/QRCodeSvgRendererOptions.ts#L9)

***

### aria-labelledby?

> `optional` **aria-labelledby**: `string`

Defined in: [packages/core/src/core/QRCodeSvgRendererOptions.ts:10](https://github.com/Mathieu-COSYNS/qrcode-caption/blob/3cd34d0191a6755511f4210731fa281f49744fc8/packages/core/src/core/QRCodeSvgRendererOptions.ts#L10)

***

### color?

> `optional` **color**: `object`

Defined in: node\_modules/.pnpm/@types+qrcode@1.5.6/node\_modules/@types/qrcode/index.d.ts:172

#### dark?

> `optional` **dark**: `string`

Color of dark module. Value must be in hex format (RGBA).
Note: dark color should always be darker than `color.light`.

##### Default

```ts
'#000000ff'
```

#### light?

> `optional` **light**: `string`

Color of light module. Value must be in hex format (RGBA).

##### Default

```ts
'#ffffffff'
```

#### Inherited from

`Omit.color`

***

### errorCorrectionLevel?

> `optional` **errorCorrectionLevel**: `QRCodeErrorCorrectionLevel`

Defined in: node\_modules/.pnpm/@types+qrcode@1.5.6/node\_modules/@types/qrcode/index.d.ts:18

Error correction level.

#### Default

```ts
'M'
```

#### Inherited from

`Omit.errorCorrectionLevel`

***

### fontSize?

> `optional` **fontSize**: `number` \| `` `${number}%` `` \| `null`

Defined in: [packages/core/src/core/QRCodeSvgRendererOptions.ts:7](https://github.com/Mathieu-COSYNS/qrcode-caption/blob/3cd34d0191a6755511f4210731fa281f49744fc8/packages/core/src/core/QRCodeSvgRendererOptions.ts#L7)

***

### margin?

> `optional` **margin**: `number` \| `` `${number}%` `` \| `null`

Defined in: [packages/core/src/core/QRCodeSvgRendererOptions.ts:8](https://github.com/Mathieu-COSYNS/qrcode-caption/blob/3cd34d0191a6755511f4210731fa281f49744fc8/packages/core/src/core/QRCodeSvgRendererOptions.ts#L8)

***

### maskPattern?

> `optional` **maskPattern**: `QRCodeMaskPattern`

Defined in: node\_modules/.pnpm/@types+qrcode@1.5.6/node\_modules/@types/qrcode/index.d.ts:24

Mask pattern used to mask the symbol.

If not specified the more suitable value will be calculated.

#### Inherited from

`Omit.maskPattern`

***

### scale?

> `optional` **scale**: `number`

Defined in: node\_modules/.pnpm/@types+qrcode@1.5.6/node\_modules/@types/qrcode/index.d.ts:165

Scale factor. A value of `1` means 1px per modules (black dots).

#### Default

```ts
4
```

#### Inherited from

`Omit.scale`

***

### toSJISFunc?

> `optional` **toSJISFunc**: `QRCodeToSJISFunc`

Defined in: node\_modules/.pnpm/@types+qrcode@1.5.6/node\_modules/@types/qrcode/index.d.ts:29

Helper function used internally to convert a kanji to its Shift JIS value.
Provide this function if you need support for Kanji mode.

#### Inherited from

`Omit.toSJISFunc`

***

### version?

> `optional` **version**: `number`

Defined in: node\_modules/.pnpm/@types+qrcode@1.5.6/node\_modules/@types/qrcode/index.d.ts:13

QR Code version. If not specified the more suitable value will be calculated.

#### Inherited from

`Omit.version`

***

### width?

> `optional` **width**: `number`

Defined in: node\_modules/.pnpm/@types+qrcode@1.5.6/node\_modules/@types/qrcode/index.d.ts:171

Forces a specific width for the output image.
If width is too small to contain the qr symbol, this option will be ignored.
Takes precedence over `scale`.

#### Inherited from

`Omit.width`
