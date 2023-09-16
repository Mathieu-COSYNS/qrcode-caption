import { expect, it } from 'vitest';

import * as QRCodeCaption from '../src/index';
import { QRCodeSvgRendererOptions } from '../src/QRCodeSvgRendererOptions';

it.each([
  { text: 'new', snapshot: 1 },
  { text: 'new', options: { color: { dark: '#f00' } }, snapshot: 2 },
  { text: 'new', options: { color: { light: '#f00' } }, snapshot: 3 },
  { text: 'new', options: { color: { dark: '#f00', light: '#0f0' } }, snapshot: 4 },
  { text: 'new', options: { color: { light: '#00000000' } }, snapshot: 5 },
  { text: 'new', options: { width: 100 }, snapshot: 6 },
  { text: 'http://www.google.com', options: { errorCorrectionLevel: 'H' as const, scale: 1 }, snapshot: 7 },
  { text: 'http://www.google.com', options: { errorCorrectionLevel: 'H' as const, scale: 2 }, snapshot: 8 },
  { text: 'new', caption: '', options: { width: 100 }, snapshot: 9 },
  { text: 'new', caption: 'Test', options: { width: 100 }, snapshot: 10 },
  { text: 'new', caption: 'Test', options: { width: 450 }, snapshot: 11 },
  { text: 'http://www.google.com', caption: 'Value: P12', options: { margin: 2 }, snapshot: 12 },
  { text: 'http://www.google.com', caption: 'Value: P12', options: { margin: 0 }, snapshot: 13 },
  {
    text: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dominant-baseline',
    caption: 'Value: P12',
    options: { margin: 20 },
    snapshot: 14,
  },
  {
    text: 'http://www.google.com',
    caption: 'A long caption for the test',
    options: { width: 450, margin: 2, fontSizeFactor: 0.09 },
    snapshot: 15,
  },
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
    options?: QRCodeSvgRendererOptions;
    snapshot: number;
  }) => {
    const result = QRCodeCaption.toSVG(text, caption, options);
    expect(result).toMatchFileSnapshot(`__snapshots__/${snapshot}.svg`);
  },
);
