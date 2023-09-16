import { type QRCode } from 'qrcode';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getOptions } from 'qrcode/lib/renderer/utils';

import { QRCodeSvgRendererOptions } from './QRCodeSvgRendererOptions';

function getColorAttrib(color: { a: number; hex: string }, attrib: string) {
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
  const opts = getOptions(options);
  const fontSizeFactor = options?.fontSizeFactor || 0.2;
  const size = qrData.modules.size;
  const data = qrData.modules.data;

  const qrcodeWidth = size + opts.margin * 2;
  const captionFontSize = size * fontSizeFactor;
  const captionHeight = Math.ceil(captionFontSize);
  const qrcodeHeight = qrcodeWidth + (caption ? captionHeight : 0);

  const bg = !opts.color.light.a
    ? ''
    : `<rect ${getColorAttrib(opts.color.light, 'fill')} width="${qrcodeWidth}" height="${qrcodeHeight}"/>`;

  const fg = `<path ${getColorAttrib(opts.color.dark, 'stroke')} d="${qrToPath(data, size, opts.margin)}"/>`;

  const text = caption
    ? `<text y="${
        qrcodeHeight - opts.margin
      }" x="50%" text-anchor="middle" font-size="${captionFontSize}">${caption}</text>`
    : '';

  const width = !opts.width ? qrcodeWidth * opts.scale : opts.width;
  const height = width * (qrcodeHeight / qrcodeWidth);

  const svgTag = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${qrcodeWidth} ${qrcodeHeight}" shape-rendering="crispEdges">${bg}${fg}${text}</svg>`;

  return svgTag;
}
