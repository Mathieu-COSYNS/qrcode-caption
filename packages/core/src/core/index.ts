import svgToMiniDataURI from "mini-svg-data-uri";
import type { QRCode } from "qrcode";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { create } from "qrcode/lib/core/qrcode.js";

import type { QRCodeSvgRendererOptions as QRCodeOptions } from "./QRCodeSvgRendererOptions";
import { render } from "./SvgRenderer";

export { type Percentage } from "./Percentage";
export { type QRCodeOptions };

function getCaptionAndOptions(captionOrOptions?: string | QRCodeOptions, opts?: QRCodeOptions) {
  if (captionOrOptions && typeof captionOrOptions === "object")
    return {
      caption: undefined,
      options: captionOrOptions,
    };
  return { caption: captionOrOptions, options: opts };
}

/**
 * Builds an SVG string representing a QR code with an optional caption below
 * the QR code.
 *
 * @param text - The content to be encoded in the QR code.
 * @param caption - Label rendered under the QR code.
 * @param options - Rendering and QR generation options.
 * @returns SVG markup as a string.
 */
export function toSVG(text: string, caption?: string, options?: QRCodeOptions): string;
/**
 * Builds an SVG string representing a QR code without a caption.
 *
 * @param text - The content to be encoded in the QR code.
 * @param options - Rendering and QR generation options.
 * @returns SVG markup as a string.
 */
export function toSVG(text: string, options?: QRCodeOptions): string;

export function toSVG(text: string, captionOrOptions?: string | QRCodeOptions, opts?: QRCodeOptions) {
  const { caption, options } = getCaptionAndOptions(captionOrOptions, opts);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const data: QRCode = create(text, options);

  return render(data, caption, options);
}

/**
 * Like {@link toSVG}, but returns a compact `data:image/svg+xml,...` URL for
 * `<img src>` or downloads.
 *
 * @param text - The content to be encoded in the QR code.
 * @param caption - Label rendered under the QR modules.
 * @param options - Rendering and QR generation options.
 * @returns A data URL containing the SVG.
 */
export function toDataURL(text: string, caption?: string, options?: QRCodeOptions): string;
/**
 * Like {@link toSVG}, but returns a compact `data:image/svg+xml,...` URL
 * without a caption.
 *
 * @param text - The content to be encoded in the QR code.
 * @param options - Rendering and QR generation options.
 * @returns A data URL containing the SVG.
 */
export function toDataURL(text: string, options?: QRCodeOptions): string;

export function toDataURL(text: string, captionOrOptions?: string | QRCodeOptions, opts?: QRCodeOptions) {
  const { caption, options } = getCaptionAndOptions(captionOrOptions, opts);
  const svg = toSVG(text, caption, options);

  return svgToMiniDataURI(svg)
    .replace(/font-family='/, "font-family=%22")
    .replace(/serif'/, "serif%22");
}
