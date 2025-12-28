import { Button as ButtonPrimitive, type ButtonProps as ButtonPrimitiveProps } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 no-underline cursor-pointer border print:text-black! print:bg-white!",
  {
    variants: {
      variant: {
        default:
          "border-gray-900 bg-gray-900 text-gray-50 hover:border-gray-800 hover:bg-gray-800 dark:border-gray-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:border-gray-200 dark:hover:bg-gray-200",
        "primary-outline":
          "border-accent-600 bg-white text-gray-900 hover:text-white hover:border-accent-500 hover:bg-accent-500 dark:border-accent-200 dark:bg-gray-900 dark:text-gray-50 dark:hover:border-accent-300 dark:hover:bg-accent-300 dark:hover:text-gray-900",
        primary:
          "border-accent-600 bg-accent-600 text-white hover:border-accent-500 hover:bg-accent-500 dark:border-accent-200 dark:bg-accent-200 dark:text-gray-900 dark:hover:border-accent-300 dark:hover:bg-accent-300",
        secondary:
          "border-gray-200 hover:border-gray-300 bg-gray-200 text-gray-900 hover:bg-gray-300 dark:border-gray-800 dark:hover:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700",
        card: "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonPrimitiveProps & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
