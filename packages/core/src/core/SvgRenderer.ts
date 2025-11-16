import type { QRCode } from "qrcode";

import type { QRCodeSvgRendererOptions } from "./QRCodeSvgRendererOptions";
import {
  checkNumber,
  colorToHex,
  escape,
  numberToSvgString,
  parseHexColorString,
  parsePercentage,
  round,
  type Color,
} from "./utils";

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

interface Coordinates {
  column: number;
  row: number;
}

function getCoordinates(index: number, size: number): Coordinates {
  const column = Math.floor(index % size);
  const row = Math.floor(index / size);

  return { column, row };
}

function getIndex(coordinates: Coordinates, size: number) {
  return coordinates.row * size + coordinates.column;
}

function isEdgeCoordinates(coordinates: Coordinates, size: number) {
  return (
    coordinates.column === 0 || coordinates.row === 0 || coordinates.column === size - 1 || coordinates.row === size - 1
  );
}

function isValidCoordinates(coordinates: Coordinates, size: number) {
  return coordinates.column >= 0 && coordinates.row >= 0 && coordinates.column < size && coordinates.row < size;
}

function getNeighbors(index: number, size: number, mode: "8-way" | "cross" = "cross") {
  const coordinates = getCoordinates(index, size);

  const neighbors = [
    { column: coordinates.column, row: coordinates.row - 1 }, // up
    ...(mode === "8-way" ? [{ column: coordinates.column + 1, row: coordinates.row - 1 }] : []), // right-up
    { column: coordinates.column + 1, row: coordinates.row }, // right
    ...(mode === "8-way" ? [{ column: coordinates.column + 1, row: coordinates.row + 1 }] : []), // right-down
    { column: coordinates.column, row: coordinates.row + 1 }, // down
    ...(mode === "8-way" ? [{ column: coordinates.column - 1, row: coordinates.row + 1 }] : []), // left-down
    { column: coordinates.column - 1, row: coordinates.row }, // left
    ...(mode === "8-way" ? [{ column: coordinates.column - 1, row: coordinates.row - 1 }] : []), // left-up
  ]
    .filter((c) => isValidCoordinates(c, size))
    .map((c) => getIndex(c, size));

  return neighbors;
}

function visitCells(
  visited: Uint8Array,
  size: number,
  startingIndex: number,
  mode: "8-way" | "cross" = "cross",
  filterNeighbors: (i: number) => boolean,
) {
  const nodes = [startingIndex];

  while (nodes.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const node = nodes.pop()!;
    visited[node] = 1;
    const neighbors = getNeighbors(node, size, mode);
    nodes.push(...neighbors.filter((i) => filterNeighbors(i) && !visited[i]));
  }
}

function radialSweepContourTracing(size: number, starting: number, isValidPixel: (i: number) => boolean) {
  const contour = [starting];
  let startingNeighbors = getNeighbors(starting, size).filter(isValidPixel);

  do {
    let neighbors;
    if (contour[contour.length - 1] === starting) {
      neighbors = startingNeighbors;
    } else {
      neighbors = getNeighbors(contour[contour.length - 1], size);
    }
    let previousIndex = -1;

    if (contour.length > 1) {
      previousIndex = neighbors.findIndex((n) => n === contour[contour.length - 2]);
    }

    const shift = previousIndex + 1;

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[(i + shift) % neighbors.length];

      if (isValidPixel(neighbor)) {
        contour.push(neighbor);
        startingNeighbors = startingNeighbors.filter((startingNeighbor) => startingNeighbor !== neighbor);
        break;
      }
    }
  } while (contour[contour.length - 1] !== starting || startingNeighbors.length !== 0);

  return contour;
}

function drawPath(
  size: number,
  starting: number,
  isValidPixel: (i: number) => boolean,
  margin: number,
  clockwise = true,
) {
  const contour = radialSweepContourTracing(size, starting, isValidPixel);

  return toPath(contour, size, margin, clockwise);
}

type Location = "top-left" | "top-right" | "bottom-right" | "bottom-left";
type Direction = "left" | "right" | "up" | "down";

abstract class Command {
  abstract toString(): string;
}

class LineCommand extends Command {
  private _dx: number;
  private _dy: number;
  private _length: number;

  constructor(dx: number, dy: number) {
    super();
    this._dx = dx;
    this._dy = dy;
    this._length = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }

  get dx() {
    return this._dx;
  }

  get dy() {
    return this._dy;
  }

  get length() {
    return this._length;
  }

  merge(other: LineCommand) {
    if (this.dx + other.dx === 0 && this.dy + other.dy === 0) return [];
    if ((this.dy === 0 && other.dy === 0) || (this.dx === 0 && other.dx === 0))
      return [new LineCommand(this.dx + other.dx, this.dy + other.dy)];
    return [this, other];
  }

  invert() {
    return new LineCommand(-this._dx, -this._dy);
  }

  override toString() {
    if (this.dx === 0 && this.dy === 0) return "";
    if (this.dy === 0) return `h${numberToSvgString(this.dx)}`;
    if (this.dx === 0) return `v${numberToSvgString(this.dy)}`;
    return `l${numberToSvgString([this.dx, this.dy])}`;
  }
}

const commandsConfig = {
  locations: ["top-left", "top-right", "bottom-right", "bottom-left"],
  newLocationMap: {
    right: "top-left",
    down: "top-right",
    left: "bottom-right",
    up: "bottom-left",
  },
  commands: [new LineCommand(1, 0), new LineCommand(0, 1), new LineCommand(-1, 0), new LineCommand(0, -1)],
} as const;

function getNumberOfCommand(arr: readonly Location[], a: Location, b: Location) {
  const indexA = arr.indexOf(a);
  const indexB = arr.indexOf(b);

  if (indexA > indexB) {
    return (arr.length - indexA + indexB + 1) % arr.length;
  } else {
    return (indexB - indexA + 1) % arr.length;
  }
}

function getCommands(cursorLocation: Location, direction: Direction): [Location, LineCommand[]] {
  const newCursorLocation = commandsConfig.newLocationMap[direction];

  const nbOfCommand = getNumberOfCommand(commandsConfig.locations, cursorLocation, newCursorLocation);
  const shift = commandsConfig.locations.indexOf(cursorLocation);

  const cmds = [];
  for (let i = 0; i < nbOfCommand; i++) {
    cmds.push(commandsConfig.commands[(i + shift) % commandsConfig.commands.length]);
  }

  return [newCursorLocation, cmds];
}

function toPath(contour: number[], size: number, margin: number, clockwise: boolean) {
  if (contour.length <= 0) {
    return "";
  }

  // 1) turn 1D array → to coordinates
  const pts = contour.map((i) => getCoordinates(i, size));

  // 2) build h/v commands and insert extra bars on backtrack in one pass
  let cmds: LineCommand[] = [];

  if (pts.length === 1) {
    cmds.push(new LineCommand(1, 0), new LineCommand(0, 1), new LineCommand(-1, 0), new LineCommand(0, -1));
  } else {
    let { column: x, row: y } = pts[0];
    let cursorLocation: Location = "top-left";

    for (let i = 1; i < pts.length; i++) {
      const { column: nx, row: ny } = pts[i % pts.length];
      const dx = nx - x;
      const dy = ny - y;
      x = nx;
      y = ny;

      let direction: Direction = "right";

      if (dx < 0) {
        direction = "left";
      }
      if (dy > 0) {
        direction = "down";
      }
      if (dy < 0) {
        direction = "up";
      }

      const [nextCursorLocation, commands] = getCommands(cursorLocation, direction);
      cmds.push(...commands);
      cursorLocation = nextCursorLocation;
    }

    const [_, commands] = getCommands(cursorLocation, "up");
    cmds.push(...commands);
  }

  // 3) invert if drawing counter clockwise
  if (!clockwise) {
    cmds = cmds.map((cmd) => cmd.invert());
    cmds.reverse();
  }

  return (
    cmds
      // 4) merge consecutive same-letter commands
      .reduce<LineCommand[]>((acc, cmd) => {
        const last = acc.pop();

        // first item in the list
        if (!last) {
          acc.push(cmd);
          return acc;
        }

        acc.push(...last.merge(cmd));
        return acc;
      }, [])

      // 5) build final path string
      .reduce((acc, cmd, index, cmds) => {
        if (index === cmds.length - 1) return acc + "z";
        if (index === 0) {
          const x = pts[0].column + margin;
          const y = pts[0].row + margin;
          acc = `M${numberToSvgString([x, y])}`;
        }
        return acc + cmd.toString();
      }, "")
  );
}

function qrToPath(data: Uint8Array, size: number, margin: number) {
  let path = "";
  const arrayLength = size * size;
  const visited = new Uint8Array(arrayLength);

  // draw the "black" pixels
  for (let i = 0; i < arrayLength; i++) {
    if (visited[i]) {
      // skip if already explored
      continue;
    }
    if (!data[i]) {
      if (isEdgeCoordinates(getCoordinates(i, size), size)) {
        // visit the "white" pixels that touch a edge of the qrcode and their neighbors
        // -> they don't need to be carved out of the "black" pixel shapes.
        visitCells(visited, size, i, "8-way", (i) => !data[i]);
      }
      continue;
    }

    // draw a svg path using a contour tracing algorithm
    path += drawPath(size, i, (i) => !!data[i], margin);
    // mark all the "black" pixels included in the contour as visited
    visitCells(visited, size, i, "cross", (i) => !!data[i]);
  }

  // carved out the white pixels that are in a "black" shape
  for (let i = 0; i < arrayLength; i++) {
    if (visited[i]) {
      // skip if already explored
      continue;
    }

    // draw a svg path using a contour tracing algorithm
    // drawing in reverse remove the enclosed area from the "black" areas previously drawn
    path += drawPath(size, i, (i) => !data[i], margin, false);
    // mark all the "white" pixels carved out as visited
    visitCells(visited, size, i, "cross", (i) => !data[i]);
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
    : `<rect ${getColorAttrib(opts.color.background, "fill")} width="${round(qrcodeWidth, 5)}" height="${round(qrcodeHeight, 5)}"/>`;

  const fg = `<path ${getColorAttrib(opts.color.foreground, "fill")} d="${qrToPath(data, size, opts.margin)}"/>`;

  const textY = round(qrcodeWidth - opts.margin / 2 + captionEstimatedBaseline, 5);
  const text = caption
    ? `<text y="${textY}" x="50%" text-anchor="middle" font-family="Verdana, 'Bitstream Vera Sans', 'DejaVu Sans', Tahoma, Geneva, Arial, Sans-serif" font-size="${
        opts.fontSize
      }" ${getColorAttrib(opts.color.foreground, "fill")}>${escape(caption)}</text>`
    : "";

  const width = opts.width ?? qrcodeWidth * opts.scale;
  const height = width * (qrcodeHeight / qrcodeWidth);

  const attributes = [];

  attributes.push(`width="${round(width, 5)}"`);
  attributes.push(`height="${round(height, 5)}"`);
  attributes.push(`viewBox="0 0 ${round(qrcodeWidth, 5)} ${round(qrcodeHeight, 5)}"`);
  attributes.push('shape-rendering="crispEdges"');

  if (opts["aria-label"]) attributes.push(`aria-label="${opts["aria-label"]}"`);
  if (opts["aria-labelledby"]) attributes.push(`aria-labelledby="${opts["aria-labelledby"]}"`);
  if (opts["aria-hidden"]) attributes.push('aria-hidden="true"');

  const svgTag = `<svg xmlns="http://www.w3.org/2000/svg" ${attributes.join(" ")}>${bg}${fg}${text}</svg>`;

  return svgTag;
}
