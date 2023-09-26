import { type QRCode } from 'qrcode';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getOptions as getLibOptions } from 'qrcode/lib/renderer/utils';
import { escape } from 'underscore';

import { type Percentage } from './Percentage';
import { type QRCodeSvgRendererOptions } from './QRCodeSvgRendererOptions';

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
  hex: `#${number}`;
};

function parseNumber<T>(value: unknown, defaultValue: T, options: { min?: number; max?: number }) {
  if (value === null || value === undefined) return defaultValue;
  const result = Number(value);
  if (isNaN(result)) return defaultValue;
  if (options.min && result < options.min) return defaultValue;
  if (options.max && result > options.max) return defaultValue;
  return result;
}

function parsePercentageOrNumber(value: Percentage | number | undefined, size: number, defaultValue: number) {
  if (typeof value === 'string' && value.endsWith('%')) {
    return size * (Number(value.slice(0, -1)) / 100);
  }
  return parseNumber(value, defaultValue, { min: 0 });
}

function getOptions(options: QRCodeSvgRendererOptions | undefined, size: number) {
  if (options?.['aria-label'] && options?.['aria-hidden'])
    throw new Error('Both aria-label and aria-hidden can not be set');
  if (options?.['aria-labelledby'] && options?.['aria-hidden'])
    throw new Error('Both aria-labelledby and aria-hidden can not be set');
  return {
    width: parseNumber(options?.width, undefined, { min: 1 }),
    scale: parseNumber(options?.scale, 4, { min: 1 }),
    margin: parsePercentageOrNumber(options?.margin, size, 4),
    color: getLibOptions(options).color as { light: Color; dark: Color },
    fontSize: parsePercentageOrNumber(options?.fontSize, size, 4),
    'aria-label': options?.['aria-label'] ? escape(options['aria-label']) : undefined,
    'aria-labelledby': options?.['aria-labelledby'] ? escape(options['aria-labelledby']) : undefined,
    'aria-hidden': options?.['aria-hidden'] === true,
  };
}

function getColorAttrib(color: Color, attrib: string) {
  const alpha = color.a / 255;
  const str = `${attrib}="${color.hex}"`;

  return str + (alpha < 1 ? ` ${attrib}-opacity="${alpha.toFixed(2).slice(1)}"` : '');
}

function qrToPath(data: Uint8Array, size: number, margin: number) {
  let path = '';
  let moveBy = 0;
  let newRow = false;
  let lineLength = 0;

  for (let i = 0; i < data.length; i++) {
    const col = Math.floor(i % size);
    const row = Math.floor(i / size);

    if (!col && !newRow) newRow = true;

    if (data[i]) {
      lineLength++;

      if (!(i > 0 && col > 0 && data[i - 1])) {
        path += newRow ? `M${col + margin} ${0.5 + row + margin}` : `m${moveBy} 0`;

        moveBy = 0;
        newRow = false;
      }

      if (!(col + 1 < size && data[i + 1])) {
        path += `h${lineLength}`;
        lineLength = 0;
      }
    } else {
      moveBy++;
    }
  }

  return path;
}

export function render(qrData: QRCode, caption?: string, options?: QRCodeSvgRendererOptions) {
  const size = qrData.modules.size;
  const data = qrData.modules.data;
  const opts = getOptions(options, size);

  const qrcodeWidth = size + opts.margin * 2;
  const captionHeight = opts.fontSize * 1.1;
  const captionEstimatedBaseline = captionHeight * (3 / 4);
  const qrcodeHeight = qrcodeWidth + (caption ? captionHeight : 0);

  const bg = !opts.color.light.a
    ? ''
    : `<rect ${getColorAttrib(opts.color.light, 'fill')} width="${qrcodeWidth}" height="${qrcodeHeight}"/>`;

  const fg = `<path ${getColorAttrib(opts.color.dark, 'stroke')} d="${qrToPath(data, size, opts.margin)}"/>`;

  const text = caption
    ? `<text y="${
        qrcodeWidth - opts.margin / 2 + captionEstimatedBaseline
      }" x="50%" text-anchor="middle" font-family="Verdana, 'Bitstream Vera Sans', 'DejaVu Sans', Tahoma, Geneva, Arial, Sans-serif" font-size="${
        opts.fontSize
      }" ${getColorAttrib(opts.color.dark, 'fill')}>${escape(caption)}</text>`
    : '';

  const width = !opts.width ? qrcodeWidth * opts.scale : opts.width;
  const height = width * (qrcodeHeight / qrcodeWidth);

  const attributes = [];

  attributes.push(`width="${width}"`);
  attributes.push(`height="${height}"`);
  attributes.push(`viewBox="0 0 ${qrcodeWidth} ${qrcodeHeight}"`);
  attributes.push('shape-rendering="crispEdges"');

  if (opts['aria-label']) attributes.push(`aria-label="${opts['aria-label']}"`);
  if (opts['aria-labelledby']) attributes.push(`aria-labelledby="${opts['aria-labelledby']}"`);
  if (opts['aria-hidden']) attributes.push('aria-hidden="true"');

  const svgTag = `<svg xmlns="http://www.w3.org/2000/svg" ${attributes.join(' ')}>${bg}${fg}${text}</svg>`;

  return svgTag;
}
