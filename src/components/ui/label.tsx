import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "../../lib/utils";

// Monospaced helper labels sit top-aligned above inputs.
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "label-sm flex select-none items-center gap-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
