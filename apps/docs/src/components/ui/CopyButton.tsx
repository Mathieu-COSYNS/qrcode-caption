import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { convertDataURLType } from "qrcode-caption";

import { cn } from "~/lib/utils";
import { Button, type ButtonProps } from "./Button";

export type CopyValue = string | { "image/png": Blob };

export interface CopyButtonProps extends Omit<ButtonProps, "value"> {
  value: CopyValue;
  convertToImage?: boolean;
}

export function canCopyImagesToClipboard(): boolean {
  if (typeof window === "undefined") return false;
  const hasClipboardItem = typeof ClipboardItem !== "undefined";
  const hasNavigatorClipboardWriteFunction = !!navigator?.clipboard?.write;
  return hasClipboardItem && hasNavigatorClipboardWriteFunction;
}

export async function copyToClipboard(value: CopyValue, convertToImage: boolean) {
  if (typeof value === "string" && !convertToImage) {
    await navigator.clipboard.writeText(value);
  } else {
    if (canCopyImagesToClipboard()) {
      if (typeof value === "string") {
        const blob = await convertDataURLType(value, "blob");
        if (!blob) {
          console.error("Impossible to created a image to copy to the clipboard");
        } else {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        }
      } else {
        await navigator.clipboard.write([new ClipboardItem(value)]);
      }
    } else {
      console.error("Unsupported Browser: can not copy images to clipboard in your browser");
    }
  }
}

export function CopyButton({ value, size, convertToImage = false, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState<null | NodeJS.Timeout>(null);

  const handleCopy = async () => {
    try {
      await copyToClipboard(value, convertToImage);
      setCopied((timeoutId) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        return setTimeout(() => setCopied(null), 2000);
      });
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Button size={size} onClick={handleCopy} {...props}>
      {copied !== null ? (
        <CheckIcon className={cn("h-4 w-4", size !== "icon" && "mr-2")} />
      ) : (
        <CopyIcon className={cn("h-4 w-4", size !== "icon" && "mr-2")} />
      )}
      <span className={cn(size === "icon" && "sr-only")}>Copy</span>
    </Button>
  );
}
