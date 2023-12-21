export function convertDataURLType(dataURL: string, type: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get the 2d context of a canvas');

  const img = new Image();
  const result = new Promise((resolve) => {
    img.onload = function () {
      const { width, height } = img;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL(type));
    };
  });

  img.src = dataURL;

  return result;
}

export function downloadDataURL(dataURL: string, fileName: string) {
  const downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  downloadLink.href = dataURL;
  downloadLink.click();
}
