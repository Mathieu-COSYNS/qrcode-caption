import { expect, it } from 'vitest';

import { toSVG, type QRCodeOptions } from '../src/core';

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
    options: { width: 450, margin: 2, fontSize: 2 },
    snapshot: 15,
  },
  {
    text: 'x',
    caption: 'Caption', // 'Version 1',
    options: { errorCorrectionLevel: 'H' as const, color: { light: '#f00' }, width: 500 },
    snapshot: 16,
  },
  {
    text: 'xxxxxxxxxx',
    caption: 'Caption', // 'Version 2',
    options: { errorCorrectionLevel: 'H' as const, color: { light: '#f00' }, width: 500 },
    snapshot: 17,
  },
  {
    text: 'xxxxxxxxxxxxxxxxxxxxxx',
    caption: 'Caption', // 'Version 3',
    options: { errorCorrectionLevel: 'H' as const, color: { light: '#f00' }, width: 500 },
    snapshot: 18,
  },
  {
    text: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    caption: 'Caption', // 'Version 4',
    options: { errorCorrectionLevel: 'H' as const, color: { light: '#f00' }, width: 500 },
    snapshot: 19,
  },
  {
    text: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    caption: 'Caption', // 'Version 10',
    options: { errorCorrectionLevel: 'H' as const, color: { light: '#f00' }, width: 500 },
    snapshot: 20,
  },
  {
    text: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    caption: 'Caption', // 'Version 25',
    options: { errorCorrectionLevel: 'H' as const, color: { light: '#f00' }, width: 500 },
    snapshot: 21,
  },
  {
    text: 'x',
    caption: 'Caption', // 'Version 1',
    options: {
      errorCorrectionLevel: 'H' as const,
      color: { light: '#0f0' },
      width: 500,
      fontSize: '10%' as const,
      margin: '10%' as const,
    },
    snapshot: 22,
  },
  {
    text: 'xxxxxxxxxx',
    caption: 'Caption', // 'Version 2',
    options: {
      errorCorrectionLevel: 'H' as const,
      color: { light: '#0f0' },
      width: 500,
      fontSize: '10%' as const,
      margin: '10%' as const,
    },
    snapshot: 23,
  },
  {
    text: 'xxxxxxxxxxxxxxxxxxxxxx',
    caption: 'Caption', // 'Version 3',
    options: {
      errorCorrectionLevel: 'H' as const,
      color: { light: '#0f0' },
      width: 500,
      fontSize: '10%' as const,
      margin: '10%' as const,
    },
    snapshot: 24,
  },
  {
    text: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    caption: 'Caption', // 'Version 4',
    options: {
      errorCorrectionLevel: 'H' as const,
      color: { light: '#0f0' },
      width: 500,
      fontSize: '10%' as const,
      margin: '10%' as const,
    },
    snapshot: 25,
  },
  {
    text: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    caption: 'Caption', // 'Version 10',
    options: {
      errorCorrectionLevel: 'H' as const,
      color: { light: '#0f0' },
      width: 500,
      fontSize: '10%' as const,
      margin: '10%' as const,
    },
    snapshot: 26,
  },
  {
    text: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    caption: 'Caption', // 'Version 25',
    options: {
      errorCorrectionLevel: 'H' as const,
      color: { light: '#0f0' },
      width: 500,
      fontSize: '10%' as const,
      margin: '10%' as const,
    },
    snapshot: 27,
  },
  { text: 'new', options: { 'aria-hidden': true }, snapshot: 28 },
  { text: 'new', options: { 'aria-label': 'QR Code new' }, snapshot: 29 },
  { text: 'new', options: { 'aria-labelledby': '#test' }, snapshot: 30 },
  { text: 'new', caption: 'caption', options: { color: { dark: '#0000007f' } }, snapshot: 31 },
  { text: 'new', caption: 'caption', options: { margin: '10' as unknown as number }, snapshot: 32 },
  { text: 'new', caption: 'caption', options: { fontSize: '14' as unknown as number }, snapshot: 33 },
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
    options?: QRCodeOptions;
    snapshot: number;
  }) => {
    const result = toSVG(text, caption, options);
    expect(result).toMatchFileSnapshot(`__snapshots__/${snapshot}.svg`);
  },
);

it.each([
  {
    text: 'new',
    options: { 'aria-hidden': true, 'aria-label': 'QR Code new' },
    error: 'Both aria-label and aria-hidden can not be set',
  },
  {
    text: 'new',
    options: { 'aria-hidden': true, 'aria-labelledby': '#test' },
    error: 'Both aria-labelledby and aria-hidden can not be set',
  },
])(
  'should not render SVG and throw $error',
  ({ text, caption, options, error }: { text: string; caption?: string; options?: QRCodeOptions; error: string }) => {
    expect(() => toSVG(text, caption, options)).toThrowError(error);
  },
);
