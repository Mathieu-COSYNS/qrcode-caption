import { useRef, type RefObject } from "react";

import { Card } from "~/components/ui/Card";
import { SuspenseClientOnly } from "~/components/ui/SuspenseClientOnly";
import { ScaleLoading } from "./ScaleLoading";

export const QrCodePreview = ({
  qrcodeSvgDataURL,
  error,
  ref,
}: {
  qrcodeSvgDataURL?: string | null;
  error?: string;
  ref?: RefObject<HTMLImageElement | null>;
}) => {
  const qrcodeContainerRef = useRef<HTMLDivElement>(null);
  const width = Number(qrcodeSvgDataURL?.match(/width=('|")(\d+)('|")/)?.at(2) || -1);

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative flex w-full items-center justify-center overflow-auto before:float-left before:block before:pt-[100%] before:content-['']">
          <div ref={qrcodeContainerRef} className="w-full *:m-auto *:h-auto *:w-full *:align-middle">
            {qrcodeSvgDataURL && <img ref={ref} src={qrcodeSvgDataURL} alt="Generated QR Code" />}
            {error && <p className="p-2 text-center text-red-600 dark:text-red-400">{error}</p>}
          </div>
        </div>
      </Card>
      <SuspenseClientOnly
        fallback={<ScaleLoading />}
        factory={() => import("./Scale")}
        props={{ width, compRef: qrcodeContainerRef }}
      />
    </>
  );
};
