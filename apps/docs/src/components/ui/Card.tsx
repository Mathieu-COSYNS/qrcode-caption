import * as React from "react";

import { cn } from "~/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-900 dark:bg-gray-800 dark:text-gray-300",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
