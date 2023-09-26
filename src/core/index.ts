import svgToMiniDataURI from 'mini-svg-data-uri';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { create } from 'qrcode/lib/core/qrcode';

import { type QRCodeSvgRendererOptions } from './QRCodeSvgRendererOptions';
import { render } from './SvgRenderer';

export { type Percentage } from './Percentage';

export type QRCodeOptions = QRCodeSvgRendererOptions;

function getCaptionAndOptions(captionOrOptions?: string | QRCodeOptions, opts?: QRCodeOptions) {
  if (captionOrOptions && typeof captionOrOptions === 'object')
    return {
      caption: undefined,
      options: captionOrOptions,
    };
  return { caption: captionOrOptions, options: opts };
}

/**
 * Returns a SVG representation as a string of the QR Code
 *
 * @param text The QR Code content
 * @param caption The QR Code caption
 * @param options Optional configuration
 */
export function toSVG(text: string, caption?: string, options?: QRCodeOptions): string;
export function toSVG(text: string, options?: QRCodeOptions): string;

export function toSVG(text: string, captionOrOptions?: string | QRCodeOptions, opts?: QRCodeOptions) {
  const data = create(text, opts);
  const { caption, options } = getCaptionAndOptions(captionOrOptions, opts);

  return render(data, caption, options);
}

/**
 * Returns a Data URL of a SVG representation of the QR Code
 *
 * @param text The QR Code content
 * @param caption The QR Code caption
 * @param options Optional configuration
 */
export function toDataURL(text: string, caption?: string, options?: QRCodeOptions): string;
export function toDataURL(text: string, options?: QRCodeOptions): string;

export function toDataURL(text: string, captionOrOptions?: string | QRCodeOptions, opts?: QRCodeOptions) {
  const { caption, options } = getCaptionAndOptions(captionOrOptions, opts);
  const svg = toSVG(text, caption, options);

  return svgToMiniDataURI(svg)
    .replace(/font-family='/, 'font-family=%22')
    .replace(/serif'/, 'serif%22');
}
