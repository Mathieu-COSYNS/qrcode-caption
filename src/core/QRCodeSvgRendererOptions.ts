/* v8 ignore next 11 */
import { type QRCodeRenderersOptions } from 'qrcode';

import { type Percentage } from './Percentage';

export interface QRCodeSvgRendererOptions extends Omit<QRCodeRenderersOptions, 'margin'> {
  fontSize?: Percentage | number;
  margin?: Percentage | number;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-hidden'?: boolean;
}
