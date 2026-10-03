import * as React from "react";

import { cn } from "../../lib/utils";

// Glassmorphic module: hairline frame, dark green glass, 8px radius.
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex min-w-0 flex-col rounded-lg border bg-card text-card-foreground backdrop-blur-md",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-tactical/30 px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

type CardTitleTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "div"
  | "span"
  | "p";

/** Renders an h2 by default; pass `as` for another heading level or element. */
function CardTitle({
  className,
  as: Comp = "h2",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: CardTitleTag }) {
  return (
    <Comp
      data-slot="card-title"
      className={cn(
        "font-display text-lg leading-6.5 font-semibold",
        className,
      )}
      {...props}
    />
  );
}

/** Monospace module ID, e.g. "// SEC-04 : LIVE MATCH". */
function CardDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="card-description"
      className={cn("label-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("p-4", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("border-t border-tactical/30 px-4 py-2.5", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
};
