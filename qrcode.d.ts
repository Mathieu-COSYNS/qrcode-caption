import * as QRCodeLib from 'qrcode';

declare module 'qrcode/lib/browser' {
  const create: typeof QRCodeLib.create;
  const toCanvas: typeof QRCodeLib.toCanvas;
  const toDataURL: typeof QRCodeLib.toDataURL;
  const toString: typeof QRCodeLib.toString;
}
