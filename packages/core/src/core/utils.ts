/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */

export interface CheckNumberOptions {
  min?: number;
  max?: number;
}

export function checkNumber<T>(value: unknown, nullishValue: T, options?: CheckNumberOptions) {
  if (value === null || value === undefined) {
    return nullishValue;
  }

  const nb = Number(value);

  if (isNaN(nb)) {
    throw Error(`Can not convert ${value} to number`);
  }

  if (options?.min && nb < options.min) {
    throw Error(`${value} is below the minium allowed (${options.min})`);
  }

  if (options?.max && nb > options.max) {
    throw Error(`${value} is above the maximum allowed (${options.max})`);
  }

  return nb;
}

export function parsePercentage<T>(value: T, size: number) {
  if (typeof value === "string" && value.endsWith("%")) {
    try {
      const nb = checkNumber(value.slice(0, -1), 0);
      return size * (nb / 100);
    } catch {
      throw Error(`Can not convert ${value} to a percentage value`);
    }
  }
  return value;
}

type NumericRange<
  start extends number,
  end extends number,
  arr extends unknown[] = [],
  acc extends number = never,
> = arr["length"] extends end
  ? acc | start | end
  : NumericRange<start, end, [...arr, 1], arr[start] extends undefined ? acc : acc | arr["length"]>;

export interface Color {
  r: NumericRange<0, 255>;
  g: NumericRange<0, 255>;
  b: NumericRange<0, 255>;
  a: NumericRange<0, 255>;
}

export function parseHexColorString<T>(value: unknown, nullishValue: T) {
  if (value === null || value === undefined) {
    return nullishValue;
  }

  if (typeof value !== "string") {
    throw Error(`Can not convert ${value} to Color. (should be defined as hex string)`);
  }

  const match = /^#([\da-fA-F]{3,4}|[\da-fA-F]{6}|[\da-fA-F]{8})$/.exec(value);

  if (!match) {
    throw Error(`Can not convert ${value} to Color. (should be defined as hex string)`);
  }

  let hexCode = match[1];

  // Convert from short to long form (fff -> ffffff)
  if (hexCode.length <= 4) {
    hexCode = hexCode.replace(/./g, "$&$&");
  }

  // Add default alpha value
  if (hexCode.length === 6) {
    hexCode = `${hexCode}FF`;
  }

  const hexValue = parseInt(hexCode, 16);

  return {
    r: (hexValue >> 24) & 255,
    g: (hexValue >> 16) & 255,
    b: (hexValue >> 8) & 255,
    a: hexValue & 255,
  } as Color;
}

export function colorToHex(color: Color, transparency = false) {
  let rgbStrMap = [color.r.toString(16), color.g.toString(16), color.b.toString(16)];
  if (transparency) rgbStrMap.push(color.a.toString(16));

  rgbStrMap = rgbStrMap.map((v) => (v.length === 1 ? `0${v}` : v));

  const hexStr = `#${rgbStrMap.join("")}`;

  const shortRgbStrMap = rgbStrMap.map((v) => v[0]);

  if (`#${shortRgbStrMap.map((v) => v + v).join("")}` === hexStr) {
    return `#${shortRgbStrMap.join("")}`;
  }

  return hexStr;
}

export function escape(string: string) {
  const entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
  };

  return String(string).replace(/[&<>"'`]/g, (s) => {
    return entityMap[s as "&" | "<" | ">" | '"' | "'" | "`"];
  });
}

/**
 * Rounds a number to a specified decimal precision.
 *
 * NOTE: this is not a perfect solution read the debate:
 * https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
 *
 * @param {number} value - The numeric value to round.
 * @param {number} [precision=0] - The number of decimal places to round to.
 *   Positive values round to the right of the decimal, negative values round to
 *   the left.
 * @returns {number} The rounded number.
 *
 * @example
 * round(3.14159);       // 3
 * round(3.14159, 2);    // 3.14
 * round(1234.56, -2);   // 1200
 */
export function round(value: number, precision = 0) {
  const roundingFactor = Math.pow(10, precision);
  const EPSILON_CORRECTION = value >= 0 ? Number.EPSILON : -Number.EPSILON;
  const roundedValue = Math.round(value * (1 + EPSILON_CORRECTION) * roundingFactor) / roundingFactor;
  return roundedValue;
}

/**
 * Converts a number or a list of numbers into a compact string suitable for SVG path definitions.
 *
 * @param value - A numeric value or an array of numeric values to convert.
 * @param precision - Maximum number of decimal places (default is 5).
 * @returns A compact string representation of the number(s) for SVG paths.
 */
export function numberToSvgString(value: number | number[], precision = 5): string {
  const convert = (val: number): string => {
    if (!Number.isFinite(val)) {
      throw new Error("Inputs must be finite numbers");
    }

    return round(val, precision)
      .toString()
      .replace(/^(-?)0+\./, "$1.");
  };

  const values = Array.isArray(value) ? value : [value];
  const result: string[] = [];

  for (let i = 0; i < values.length; i++) {
    const str = convert(values[i]);

    if (i === 0) {
      result.push(str);
      continue;
    }

    const prev = result[result.length - 1];
    const isPositive = !str.startsWith("-");
    const startsWithDot = str.startsWith(".");
    const prevHasDot = prev.includes(".");

    if (isPositive && (!startsWithDot || !prevHasDot)) {
      result.push(" " + str);
    } else {
      result.push(str);
    }
  }

  return result.join("");
}
