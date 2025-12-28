import type { RefObject } from "react";
import { DownloadIcon, PrinterIcon } from "lucide-react";
import { convertDataURLType, downloadDataURL, supportsCanvasFormat } from "qrcode-caption";

import { Button } from "~/components/ui/Button";
import { canCopyImagesToClipboard, CopyButton } from "~/components/ui/CopyButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/DropdownMenu";
import { cn } from "~/lib/utils";

export const SaveButtons = ({
  qrcodeSvgDataURL,
  imageRef,
}: {
  qrcodeSvgDataURL?: string | null;
  imageRef: RefObject<HTMLImageElement | null>;
}) => {
  const handlePrint = () => {
    if (!imageRef.current) return;

    const printContainer = document.createElement("div");
    printContainer.style.position = "fixed";
    printContainer.style.inset = "0";
    printContainer.style.background = "white";

    const clone = imageRef.current.cloneNode(true);
    printContainer.appendChild(clone);

    document.body.appendChild(printContainer);
    window.print();
    document.body.removeChild(printContainer);
  };

  const downloadImage = async (format: "image/svg" | "image/png" | "image/jpeg" | "image/webp") => {
    console.log("download");
    if (!qrcodeSvgDataURL) return;

    const formattedDataURL =
      format === "image/svg" ? qrcodeSvgDataURL : await convertDataURLType(qrcodeSvgDataURL, format);
    const fileExtension = format === "image/jpeg" ? "jpg" : format.split("/")[1];
    downloadDataURL(formattedDataURL, `qrcode.${fileExtension}`);
  };

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <Button
        variant="primary-outline"
        className={cn("col-span-2 w-full", canCopyImagesToClipboard() && "col-span-1")}
        onClick={handlePrint}
        disabled={!qrcodeSvgDataURL}
      >
        <PrinterIcon className="mr-2 h-4 w-4" /> Print
      </Button>
      {canCopyImagesToClipboard() && (
        <CopyButton
          variant="primary-outline"
          value={qrcodeSvgDataURL ?? ""}
          convertToImage={true}
          disabled={!qrcodeSvgDataURL}
        />
      )}
      <div className="col-span-2">
        <DropdownMenu>
          <DropdownMenuTrigger disabled={!qrcodeSvgDataURL} render={<Button variant="primary" className="w-full" />}>
            <DownloadIcon className="mr-2 h-4 w-4" /> Download
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 max-w-[calc(100vw-2rem)]">
            <DropdownMenuItem onClick={() => downloadImage("image/svg")}>
              <DownloadIcon className="mr-2 h-4 w-4" /> Download as SVG
            </DropdownMenuItem>
            {supportsCanvasFormat("image/png") && (
              <DropdownMenuItem onClick={() => downloadImage("image/png")}>
                <DownloadIcon className="mr-2 h-4 w-4" /> Download as PNG
              </DropdownMenuItem>
            )}
            {supportsCanvasFormat("image/jpeg") && (
              <DropdownMenuItem onClick={() => downloadImage("image/jpeg")}>
                <DownloadIcon className="mr-2 h-4 w-4" /> Download as JPG
              </DropdownMenuItem>
            )}
            {supportsCanvasFormat("image/webp") && (
              <DropdownMenuItem onClick={() => downloadImage("image/webp")}>
                <DownloadIcon className="mr-2 h-4 w-4" /> Download as WEBP
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SaveButtons;
