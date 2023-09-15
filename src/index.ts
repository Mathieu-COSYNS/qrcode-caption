import { type QRCodeRenderersOptions } from 'qrcode';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { create } from 'qrcode/lib/core/qrcode';

import { render } from './SvgRenderer';

/**
 * Returns a SVG representation as a string of the QR Code
 *
 * @param text The QR Code content
 * @param caption The QR Code caption
 * @param options Optional configuration
 */
export function toSVG(text: string, caption?: string, options?: QRCodeRenderersOptions): string;
export function toSVG(text: string, options?: QRCodeRenderersOptions): string;

export function toSVG(text: string, captionOrOptions?: string | QRCodeRenderersOptions, opts?: QRCodeRenderersOptions) {
  const data = create(text, opts);

  const { caption, options } =
    captionOrOptions && typeof captionOrOptions === 'object'
      ? {
          caption: undefined,
          options: captionOrOptions,
        }
      : { caption: captionOrOptions, options: opts };

  return render(data, caption, options);
}
