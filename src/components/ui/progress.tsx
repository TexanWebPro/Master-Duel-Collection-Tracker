import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "../../lib/utils";

// Stat delta bar: #001703 track, neon fill capped with a 1px luminous edge.
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-[1px] bg-track",
        className,
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 border-r border-[#d9ffcf] bg-primary shadow-[0_0_10px_rgba(31,234,0,0.6)] transition-transform duration-300"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
