import { expect, it } from 'vitest';

import { colorToHex, parseHexColorString } from '../src/core/utils';

it.each([
  {
    input: '#123',
    expected: '#123',
  },
  {
    input: '#00ff00',
    expected: '#0f0',
  },
  {
    input: '#1234',
    expected: '#1234',
    transparent: true,
  },
  {
    input: '#112233',
    expected: '#123',
  },
  {
    input: '#11223344',
    expected: '#123',
    transparent: false,
  },
  {
    input: '#11223344',
    expected: '#1234',
    transparent: true,
  },
  {
    input: '#12345',
  },
  {
    input: '#112233z',
  },
  {
    input: '#something',
  },
] as const)(
  'should return a smaller hexadecimal color code $input => $expected',
  ({ input, expected, transparent }: { input: `#${string}`; expected?: string; transparent?: boolean }) => {
    if (typeof expected === 'undefined') {
      expect(() => {
        parseHexColorString(input, null);
      }).toThrowError();

      return;
    }

    const color = parseHexColorString(input, null);

    if (color) {
      expect(colorToHex(color, transparent)).toBe(expected);
    }
  },
);
