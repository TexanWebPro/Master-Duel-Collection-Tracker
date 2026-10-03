import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "../../lib/utils";

/**
 * Square tactical switch. variant="use" is the In use flag:
 * the track stays dark and the thumb glows instead of the track filling.
 */
function Switch({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  variant?: "default" | "use";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5.5 w-10 shrink-0 cursor-pointer items-center rounded-md border border-tactical bg-black/80 p-0.75 outline-none transition-all",
        "hover:shadow-glow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none",
        variant === "default" &&
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        variant === "use" && "data-[state=checked]:border-primary",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-3.5 rounded-xs bg-faint transition-transform data-[state=checked]:translate-x-4.5",
          variant === "default" && "data-[state=checked]:bg-black",
          variant === "use" &&
            "data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_8px_var(--color-primary)]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
