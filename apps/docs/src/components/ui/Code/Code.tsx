import { memo } from "react";

import { cn } from "~/lib/utils";
import { CopyButton } from "../CopyButton";
import { SuspenseClientOnly } from "../SuspenseClientOnly";

export interface CodeProps {
  className?: string;
  code: string;
}

export const Code = memo(({ className, code }: CodeProps) => {
  return (
    <div
      className={cn(
        "group relative grid grid-cols-1 rounded bg-white dark:bg-gray-800 [&>:not(button)]:overflow-auto [&>:not(button,p)]:p-3",
        className,
      )}
    >
      <SuspenseClientOnly
        fallback={
          <div>
            <pre>
              <code>{code}</code>
            </pre>
          </div>
        }
        factory={() => import("./HighlightedCode")}
        props={{ code }}
      />
      <p className="absolute right-0 mr-1 p-0 text-sm text-gray-700 transition-opacity group-hover:opacity-0 dark:text-gray-200">
        js
      </p>
      <CopyButton
        value={code}
        size="icon"
        className="absolute right-0 m-3 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>
  );
});
