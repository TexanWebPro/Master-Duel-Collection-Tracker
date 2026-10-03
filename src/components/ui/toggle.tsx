import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const toggleVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap font-mono uppercase outline-none transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        // Filter chip: pill-ish tag that fills neon when on
        chip: "h-8 rounded-xl border border-tactical/80 bg-muted px-3 text-[11px] tracking-[0.08em] text-muted-foreground hover:border-secondary hover:text-foreground hover:shadow-[0_0_12px_rgba(31,234,0,0.3)] data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-black data-[state=on]:shadow-glow-sm",
        // Segment inside a ToggleGroup
        segment:
          "h-[38px] border-r border-tactical/50 px-3 text-[11px] tracking-[0.08em] text-muted-foreground last:border-r-0 hover:text-foreground data-[state=on]:bg-secondary/25 data-[state=on]:text-foreground data-[state=on]:shadow-[inset_0_-2px_0_var(--color-primary)]",
      },
    },
    defaultVariants: { variant: "chip" },
  },
);

function Toggle({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
