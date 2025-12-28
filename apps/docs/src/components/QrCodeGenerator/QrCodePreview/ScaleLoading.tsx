import { ExpandIcon } from "lucide-react";

export const ScaleLoading = () => {
  return (
    <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
      <ExpandIcon className="mr-1 mb-0.5 h-4 w-4 align-middle" aria-label="Scaled by" /> Loading
    </p>
  );
};
