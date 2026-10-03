import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-display text-sm font-bold tracking-[0.01em] transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary: electric call-to-action
        default:
          "border border-primary bg-primary text-primary-foreground hover:shadow-glow-lg active:border-secondary active:bg-secondary",
        // Secondary: tactical wireframe
        secondary:
          "border border-secondary bg-transparent text-foreground hover:border-primary hover:bg-secondary/15",
        // Tertiary: ghost data button
        ghost:
          "border border-tactical/50 bg-transparent text-muted-foreground hover:border-secondary hover:text-foreground",
        destructive:
          "border border-destructive/50 bg-transparent text-error-text hover:border-destructive hover:bg-[#93000a]/35 hover:text-[#ffdad6]",
        link: "h-auto border-0 p-0 font-sans font-medium text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 gap-1.5 px-2.5 text-[13px]",
        icon: "size-9 hover:shadow-glow",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
