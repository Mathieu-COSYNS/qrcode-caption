import type { QRCode } from "qrcode";

import type { QRCodeSvgRendererOptions } from "./QRCodeSvgRendererOptions";
import { checkNumber, colorToHex, escape, parseHexColorString, parsePercentage, type Color } from "./utils";

function getOptions(options: QRCodeSvgRendererOptions | undefined, size: number) {
  if (options?.["aria-label"] && options["aria-hidden"])
    throw new Error("Both aria-label and aria-hidden can not be set");
  if (options?.["aria-labelledby"] && options["aria-hidden"])
    throw new Error("Both aria-labelledby and aria-hidden can not be set");

  const BLACK: Color = { r: 0, g: 0, b: 0, a: 255 };
  const WHITE: Color = { r: 255, g: 255, b: 255, a: 255 };

  return {
    width: checkNumber(options?.width, null, { min: 1 }),
    scale: checkNumber(options?.scale, 4, { min: 1 }),
    margin: checkNumber(parsePercentage(options?.margin, size), 4, { min: 0 }),
    color: {
      foreground: parseHexColorString(options?.color?.dark, BLACK),
      background: parseHexColorString(options?.color?.light, WHITE),
    },
    fontSize: checkNumber(parsePercentage(options?.fontSize, size), 4, { min: 0 }),
    "aria-label": options?.["aria-label"] ? escape(options["aria-label"]) : undefined,
    "aria-labelledby": options?.["aria-labelledby"] ? escape(options["aria-labelledby"]) : undefined,
    "aria-hidden": options?.["aria-hidden"] === true,
  };
}

function getColorAttrib(color: Color, attrib: string) {
  const alpha = color.a / 255;
  const str = `${attrib}="${colorToHex(color)}"`;

  return str + (alpha < 1 ? ` ${attrib}-opacity="${alpha.toFixed(2).slice(1)}"` : "");
}

function qrToPath(data: Uint8Array, size: number, margin: number) {
  let path = "";
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

  const bg = !opts.color.background.a
    ? ""
    : `<rect ${getColorAttrib(opts.color.background, "fill")} width="${qrcodeWidth}" height="${qrcodeHeight}"/>`;

  const fg = `<path ${getColorAttrib(opts.color.foreground, "stroke")} d="${qrToPath(data, size, opts.margin)}"/>`;

  const text = caption
    ? `<text y="${
        qrcodeWidth - opts.margin / 2 + captionEstimatedBaseline
      }" x="50%" text-anchor="middle" font-family="Verdana, 'Bitstream Vera Sans', 'DejaVu Sans', Tahoma, Geneva, Arial, Sans-serif" font-size="${
        opts.fontSize
      }" ${getColorAttrib(opts.color.foreground, "fill")}>${escape(caption)}</text>`
    : "";

  const width = opts.width ?? qrcodeWidth * opts.scale;
  const height = width * (qrcodeHeight / qrcodeWidth);

  const attributes = [];

  attributes.push(`width="${width}"`);
  attributes.push(`height="${height}"`);
  attributes.push(`viewBox="0 0 ${qrcodeWidth} ${qrcodeHeight}"`);
  attributes.push('shape-rendering="crispEdges"');

  if (opts["aria-label"]) attributes.push(`aria-label="${opts["aria-label"]}"`);
  if (opts["aria-labelledby"]) attributes.push(`aria-labelledby="${opts["aria-labelledby"]}"`);
  if (opts["aria-hidden"]) attributes.push('aria-hidden="true"');

  const svgTag = `<svg xmlns="http://www.w3.org/2000/svg" ${attributes.join(" ")}>${bg}${fg}${text}</svg>`;

  return svgTag;
}
