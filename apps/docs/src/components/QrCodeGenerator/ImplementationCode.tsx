import { useMemo } from "react";
import type { QRCodeOptions } from "qrcode-caption";

import { Code, type CodeProps } from "~/components/ui/Code";

export interface ImplementationCodeProps extends Omit<CodeProps, "code"> {
  qrcodeCaption: { data: string; caption?: string | undefined; options?: QRCodeOptions };
  update: boolean;
}

let CACHE = "";

const generateCode = (qrcodeCaption: { data: string; caption?: string | undefined; options?: QRCodeOptions }) => {
  return `import { toSVG } from 'qrcode-caption'

const data = "${qrcodeCaption.data}";
const caption = "${qrcodeCaption.caption}";
const options = ${JSON.stringify(qrcodeCaption.options || {}, null, 2)};

toSVG(data, caption, options);`;
};

export const ImplementationCode = ({ qrcodeCaption, update, ...props }: ImplementationCodeProps) => {
  const code = useMemo(() => {
    if (update) {
      CACHE = generateCode(qrcodeCaption);
    }
    return CACHE;
  }, [qrcodeCaption, update]);

  return <Code code={code} {...props} />;
};
