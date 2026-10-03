import * as React from "react";

import { cn } from "../../lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content min-h-18 w-full rounded-md border border-input bg-well px-3 py-2 text-[15px] text-foreground outline-none transition-[color,box-shadow,border-color] placeholder:text-faint",
        "focus-visible:border-primary focus-visible:shadow-[0_0_8px_rgba(31,234,0,0.25)]",
        "aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
