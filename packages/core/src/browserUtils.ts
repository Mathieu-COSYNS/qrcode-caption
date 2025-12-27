export function supportsCanvasFormat(type: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;

  const dataURL = canvas.toDataURL(type);
  return dataURL.startsWith(`data:${type}`);
}

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

export function downloadDataURL(dataURL: string, fileName: string) {
  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.href = dataURL;
  downloadLink.click();
}
