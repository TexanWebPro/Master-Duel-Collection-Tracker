import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// Chips & telemetry tags: 24px, mono uppercase, rounded-xl (12px).
const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl border px-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] transition-[color,box-shadow] [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-tactical/80 bg-muted text-muted-foreground",
        active: "border-secondary bg-muted text-foreground",
        live: "border-primary bg-muted text-foreground",
        red: "h-auto border-alert-strong/70 bg-[#93000a]/30 px-2 py-0.5 font-semibold text-alert",
        orange:
          "h-auto border-[#ffa24a]/60 bg-[#783700]/30 px-2 py-0.5 font-semibold text-warn",
        yellow:
          "h-auto border-[#ffd84d]/55 bg-[#645000]/25 px-2 py-0.5 font-semibold text-caution",
        green:
          "h-auto border-secondary bg-muted px-2 py-0.5 font-semibold text-[#c8f7b8]",
        faint:
          "h-auto border-tactical/40 bg-transparent px-2 py-0.5 font-semibold text-faint",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

/** Small pulsing "live" dot. */
function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] animate-blip motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export { Badge, badgeVariants, LiveDot };
