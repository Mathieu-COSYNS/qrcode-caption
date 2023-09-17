import { QRCodeRenderersOptions } from 'qrcode';

import { type Percentage } from './Percentage';

export interface QRCodeSvgRendererOptions extends Omit<QRCodeRenderersOptions, 'margin'> {
  fontSize?: Percentage | number;
  margin?: Percentage | number;
}
