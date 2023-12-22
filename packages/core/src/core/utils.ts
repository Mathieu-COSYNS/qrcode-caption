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
  if (typeof value === 'string' && value.endsWith('%')) {
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
> = arr['length'] extends end
  ? acc | start | end
  : NumericRange<start, end, [...arr, 1], arr[start] extends undefined ? acc : acc | arr['length']>;

export interface Color {
  r: NumericRange<0, 255>;
  g: NumericRange<0, 255>;
  b: NumericRange<0, 255>;
  a: NumericRange<0, 255>;
}

export const BLACK: Color = { r: 0, g: 0, b: 0, a: 255 };
export const WHITE: Color = { r: 255, g: 255, b: 255, a: 255 };

export function parseHexColorString<T>(value: unknown, nullishValue: T) {
  if (value === null || value === undefined) {
    return nullishValue;
  }

  if (typeof value !== 'string') {
    throw Error(`Can not convert ${value} to Color. (should be defined as hex string)`);
  }

  const match = /^#([\da-fA-F]{3,4}|[\da-fA-F]{6}|[\da-fA-F]{8})$/.exec(value);

  if (!match) {
    throw Error(`Can not convert ${value} to Color. (should be defined as hex string)`);
  }

  let hexCode = match[1];

  // Convert from short to long form (fff -> ffffff)
  if (hexCode.length <= 4) {
    hexCode = hexCode.replace(/./g, '$&$&');
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

  const hexStr = `#${rgbStrMap.join('')}`;

  const shortRgbStrMap = rgbStrMap.map((v) => v[0]!);

  if (`#${shortRgbStrMap.map((v) => v + v).join('')}` === hexStr) {
    return `#${shortRgbStrMap.join('')}`;
  }

  return hexStr;
}
