import * as React from "react";

import { cn } from "../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-md border border-input bg-well px-3 text-[15px] text-foreground outline-none transition-[color,box-shadow,border-color] scheme-dark placeholder:text-faint",
        "focus-visible:border-primary focus-visible:shadow-[0_0_8px_rgba(31,234,0,0.25)]",
        "aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
