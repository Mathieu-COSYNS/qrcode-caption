import { describe, expect, it } from "vitest";

import { colorToHex, escape, numberToSvgString, parseHexColorString, round } from "../src/core/utils";

it.each([
  {
    input: "#123",
    expected: "#123",
  },
  {
    input: "#00ff00",
    expected: "#0f0",
  },
  {
    input: "#1234",
    expected: "#1234",
    transparent: true,
  },
  {
    input: "#112233",
    expected: "#123",
  },
  {
    input: "#11223344",
    expected: "#123",
    transparent: false,
  },
  {
    input: "#11223344",
    expected: "#1234",
    transparent: true,
  },
  {
    input: "#12345",
  },
  {
    input: "#112233z",
  },
  {
    input: "#something",
  },
] as const)(
  "should return a smaller hexadecimal color code $input => $expected",
  ({ input, expected, transparent }: { input: `#${string}`; expected?: string; transparent?: boolean }) => {
    if (typeof expected === "undefined") {
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

it.each([
  {
    input: "&",
    expected: "&amp;",
  },
  {
    input: "<",
    expected: "&lt;",
  },
  {
    input: ">",
    expected: "&gt;",
  },
  {
    input: '"',
    expected: "&quot;",
  },
  {
    input: "'",
    expected: "&#x27;",
  },
  {
    input: "`",
    expected: "&#x60;",
  },
] as const)(
  "should return an html representation of $input",
  ({ input, expected }: { input: string; expected: string }) => {
    expect(escape(input)).toBe(expected);
  },
);

describe("round", () => {
  it.each([
    [3.14159, 5, 3.14159],
    [3.1415926, 3, 3.142],
    [-3.1415926, 5, -3.14159],
    [1234.56, -2, 1200],
    [1.005, 2, 1.01],
    [224.98499999, 2, 224.98],
    [224.98499999, 3, 224.985],
    [10.075, 2, 10.08],
    [-10.075, 2, -10.07],
  ])("rounds %s with precision %s to %s", (input, precision, expected) => {
    expect(round(input, precision)).toBe(expected);
  });
});

describe("numberToSvgString", () => {
  it.each([
    [3.1415926, 5, "3.14159"],
    [3.1415926, 3, "3.142"],
    [-3.1415926, 5, "-3.14159"],
    [-3.1415926, 3, "-3.142"],
    [1.0, 5, "1"],
    [0.000001, 5, "0"],
    [-0.1, 2, "-.1"],
    [0.000009, 5, ".00001"],
    [2.5, 5, "2.5"],
    [10.0, 2, "10"],
    [-2.0, 2, "-2"],
    [0, 5, "0"],
    [1.23, 2, "1.23"],
    [1.999999, 3, "2"],
    [1.23456789, 0, "1"],
  ])('converts %s with precision %s and spacing %s to "%s"', (input, precision, expected) => {
    expect(numberToSvgString(input, precision)).toBe(expected);
  });

  it("throws on non-finite numbers", () => {
    expect(() => numberToSvgString(NaN)).toThrow();
    expect(() => numberToSvgString(Infinity)).toThrow();
    expect(() => numberToSvgString(-Infinity)).toThrow();
  });

  describe("joining logic for arrays", () => {
    it.each([
      [[1, 2], 2, "1 2"],
      [[1, 0.5], 2, "1 .5"],
      [[1.1, 2], 2, "1.1 2"],
      [[1, -2], 2, "1-2"],
      [[-1, 2], 2, "-1 2"],
      [[0.1, 0.2], 1, ".1.2"],
      [[0.1, -0.2], 1, ".1-.2"],
      [[0, 1], 2, "0 1"],
      [[-0, 1], 2, "0 1"],
      [[0, 1.5], 2, "0 1.5"],
      [[1.23, 4.56, 7.89], 2, "1.23 4.56 7.89"],
      [[1, 2.3, 4], 2, "1 2.3 4"],
      [[1, 2, 3], 2, "1 2 3"],
    ])("converts %j with precision %d to '%s'", (input, precision, expected) => {
      expect(numberToSvgString(input, precision)).toBe(expected);
    });
  });
});
