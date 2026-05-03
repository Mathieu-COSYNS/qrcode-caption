/**
 * Whether the current browser can save or export canvas-backed images as the
 * given type (for example PNG or WebP). Use this to enable or hide
 * format-specific options.
 *
 * @param type - Image MIME type to check, e.g. `"image/png"` or `"image/webp"`.
 * @returns Whether that format is supported for canvas export here.
 */
export function supportsCanvasFormat(type: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;

  const dataURL = canvas.toDataURL(type);
  return dataURL.startsWith(`data:${type}`);
}

/**
 * Converts a data URL image to another format using an HTML canvas. Exports the
 * image as either a data URL for raster MIME types (e.g. PNG, JPEG, WEBP), or a
 * {@link Blob} when `type` is `"blob"`. Uses device pixel ratio for sharper
 * output when scaling is involved.
 *
 * @typeParam TType - Target format; use literal `"blob"` to get `Blob | null`.
 * @param dataURL - Source image as a data URL.
 * @param type - Target MIME type for {@link HTMLCanvasElement.toDataURL}, or
 * `"blob"` for {@link HTMLCanvasElement.toBlob}.
 * @returns A promise resolving to the new data URL string, or `Blob | null`
 * when `type` is `"blob"`.
 * @throws {Error} If a 2D canvas context cannot be created.
 */
export function convertDataURLType<TType extends string = string>(dataURL: string, type: TType) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get the 2d context of a canvas");

  const img = new Image();
  const result = new Promise<TType extends "blob" ? Blob | null : string>((resolve) => {
    img.onload = function () {
      const { width, height } = img;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingQuality = "high";
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(img, 0, 0, width, height);

      if (type === "blob") {
        canvas.toBlob((blob) => {
          //@ts-expect-error already typed above and typescript does not understand this narrowing
          resolve(blob);
        });
      } else {
        //@ts-expect-error already typed above and typescript does not understand this narrowing
        resolve(canvas.toDataURL(type));
      }
    };
  });

  img.src = dataURL;

  return result;
}

/**
 * Triggers a file download in the user's browser with the suggested file name.
 * Accepts both data URLs and object URLs (`blob:` URLs from
 * {@link URL.createObjectURL}).
 *
 * @param dataURL - Location of the file contents to download.
 * @param filename - Suggested download name; browsers may adjust it per OS or
 * policy.
 */
export function downloadDataURL(dataURL: string, filename: string) {
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = dataURL;
  downloadLink.click();
}
