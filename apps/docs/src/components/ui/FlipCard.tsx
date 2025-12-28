import * as React from "react";

import { Card } from "~/components/ui/Card";
import { cn } from "~/lib/utils";
import { Button, type ButtonProps } from "./Button";

export interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  front: React.ReactNode;
  back: React.ReactNode;
  goToFront: React.ReactNode;
  goToBack: React.ReactNode;
}

const FlipCard = React.forwardRef<HTMLDivElement, FlipCardProps>(
  ({ front, back, goToFront, goToBack, className }, ref) => {
    const [showBack, setShowBack] = React.useState(false);

    const handleFlip = () => {
      setShowBack((showBack) => !showBack);
    };

    return (
      <div ref={ref} className={cn("relative isolate", className)}>
        <FlipCardButton
          className="absolute -top-2 right-6 z-10"
          goToFront={goToFront}
          goToBack={goToBack}
          showBack={showBack}
          onClick={handleFlip}
        />
        <FlipCardContent front={front} back={back} showBack={showBack} />
      </div>
    );
  },
);

export interface FlipCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  front: React.ReactNode;
  frontClassName?: string;
  back: React.ReactNode;
  backClassName?: string;
  showBack: boolean;
}

const FlipCardContent = React.forwardRef<HTMLDivElement, FlipCardContentProps>(
  ({ front, frontClassName, back, backClassName, showBack, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-full [transition:transform_0.5s_ease] transform-3d",
        showBack && "transform-[rotateY(180deg)] print:transform-[rotateY(0deg)]",
        className,
      )}
    >
      <Card className={cn("h-full w-full backface-hidden", frontClassName)} inert={showBack}>
        {front}
      </Card>
      <Card
        className={cn(
          "absolute top-0 bottom-0 h-full w-full transform-[rotateY(180deg)] overflow-auto backface-hidden print:hidden",
          backClassName,
        )}
        inert={!showBack}
      >
        {back}
      </Card>
    </div>
  ),
);

export interface FlipCardButtonProps extends Omit<ButtonProps, "children"> {
  goToFront: React.ReactNode;
  goToBack: React.ReactNode;
  showBack: boolean;
}

const FlipCardButton = React.forwardRef<HTMLButtonElement, FlipCardButtonProps>(
  ({ goToFront, goToBack, showBack, className, ...props }, ref) => (
    <Button ref={ref} className={cn("h-6", className)} variant="card" size="sm" {...props}>
      {showBack ? goToFront : goToBack}
    </Button>
  ),
);

export { FlipCard, FlipCardContent, FlipCardButton };
