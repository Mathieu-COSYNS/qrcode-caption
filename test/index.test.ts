import { type QRCodeRenderersOptions } from 'qrcode';
import { expect, it } from 'vitest';

import * as QRCodeCaption from '../src/index';

it.each([
  { text: 'new', snapshot: 1 },
  { text: 'new', options: { color: { dark: '#f00' } }, snapshot: 2 },
  { text: 'new', options: { color: { light: '#f00' } }, snapshot: 3 },
  { text: 'new', options: { color: { dark: '#f00', light: '#0f0' } }, snapshot: 4 },
  { text: 'new', options: { color: { light: '#00000000' } }, snapshot: 5 },
  { text: 'new', options: { width: 100 }, snapshot: 6 },
  { text: 'http://www.google.com', options: { errorCorrectionLevel: 'H' as const, scale: 1 }, snapshot: 7 },
  { text: 'http://www.google.com', options: { errorCorrectionLevel: 'H' as const, scale: 2 }, snapshot: 8 },
])(
  'should render SVG $snapshot',
  ({
    text,
    caption,
    options,
    snapshot,
  }: {
    text: string;
    caption?: string;
    options?: QRCodeRenderersOptions;
    snapshot: number;
  }) => {
    const result = QRCodeCaption.toSVG(text, caption, options);
    expect(result).toMatchFileSnapshot(`__snapshots__/${snapshot}.svg`);
  },
);
