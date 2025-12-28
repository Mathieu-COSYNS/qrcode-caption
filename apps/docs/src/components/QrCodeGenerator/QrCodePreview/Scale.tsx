import { useEffect, useState } from "react";
import { ExpandIcon, ShrinkIcon } from "lucide-react";

import { ScaleLoading } from "./ScaleLoading";

export interface ScaleProps {
  compRef: React.RefObject<HTMLElement | null>;
  width: number;
}

export const Scale = ({ compRef: ref, width }: ScaleProps) => {
  const [scalingLevelPercent, setScalingLevelPercent] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current || width === -1) return;

    const el = ref.current;

    const computeScale = () => {
      const percent = Math.round((el.scrollWidth / width) * 100);
      setScalingLevelPercent(percent);
    };

    // Run initially
    computeScale();

    // Observe size changes
    const observer = new ResizeObserver(() => {
      computeScale();
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, width]);

  if (scalingLevelPercent === null) return <ScaleLoading />;

  return (
    <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
      {scalingLevelPercent <= 100 ? (
        <ShrinkIcon className="mr-1 mb-0.5 h-4 w-4 align-middle" aria-label="Scaled by" />
      ) : (
        <ExpandIcon className="mr-1 mb-0.5 h-4 w-4 align-middle" aria-label="Scaled by" />
      )}
      {scalingLevelPercent}%
    </p>
  );
};

export default Scale;
