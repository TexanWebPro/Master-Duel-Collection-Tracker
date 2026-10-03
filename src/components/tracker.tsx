// Small domain components shared across screens, built on the shadcn primitives.

import type { ReactNode } from "react";

import { Badge, LiveDot } from "./ui/badge";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";
import type {
  Card,
  Frame,
  Priority,
  Rarity as RarityValue,
  TimeState,
} from "../types";

const FRAME_BG: Record<Frame, string> = {
  normal: "bg-[linear-gradient(160deg,#b89a5c,#7d6436)]",
  effect: "bg-[linear-gradient(160deg,#b7612c,#6e3312)]",
  fusion: "bg-[linear-gradient(160deg,#8a5aa6,#4b2a63)]",
  synchro: "bg-[linear-gradient(160deg,#c9ccd1,#6f7479)]",
  xyz: "bg-[linear-gradient(160deg,#2f2f33,#0b0b0d)]",
  link: "bg-[linear-gradient(160deg,#2c5fa3,#14305a)]",
  spell: "bg-[linear-gradient(160deg,#1c8a7b,#0c4a42)]",
  trap: "bg-[linear-gradient(160deg,#a33b77,#5a1c41)]",
};

const initials = (name: string): string =>
  name
    .replace(/[^A-Za-z0-9 -]/g, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");

interface CardArtProps {
  card: Card;
  inUse: boolean;
  size?: "sm" | "md" | "lg";
  className?: string | undefined;
}

/**
 * Placeholder for the cached YGOPRODeck image.
 * A card with any version in use gets the neon frame (spec: table and grid).
 */
export function CardArt({ card, inUse, size = "md", className }: CardArtProps) {
  const attr = card.attr ?? (card.frame === "spell" ? "SPELL" : "TRAP");
  const tiny = size === "sm";
  return (
    <div
      className={cn(
        "relative flex aspect-59/86 max-w-full shrink-0 flex-col justify-between overflow-hidden rounded-sm border border-tactical/60 p-[6%]",
        FRAME_BG[card.frame],
        inUse && "border-2 border-primary shadow-inuse",
        size === "sm" && "w-10",
        size === "md" && "w-full",
        size === "lg" && "w-37.5",
        className,
      )}
    >
      <span
        className={cn(
          "relative font-display leading-none font-bold text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]",
          tiny ? "text-[11px]" : size === "lg" ? "text-3xl" : "text-[22px]",
        )}
      >
        {initials(card.name)}
      </span>
      {!tiny && (
        <span className="absolute inset-x-[10%] top-[18%] bottom-[30%] border border-black/35 bg-black/30" />
      )}
      <span className="relative text-right font-mono text-[8px] tracking-[0.08em] text-white/75">
        {attr}
      </span>
    </div>
  );
}

const RARITY_CLASS: Record<RarityValue, string> = {
  UR: "border-primary bg-primary/15 text-foreground",
  SR: "border-secondary text-[#c8f7b8]",
  R: "border-tactical text-muted-foreground",
  N: "border-tactical/50 text-muted-foreground",
};

export function Rarity({ value }: { value: RarityValue | null }) {
  return (
    <span
      className={cn(
        "rounded-xs border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.08em]",
        value ? RARITY_CLASS[value] : "border-tactical/30 text-faint",
      )}
    >
      {value ?? "N/A"}
    </span>
  );
}

const PRIORITY_VARIANT = {
  RED: "red",
  ORANGE: "orange",
  YELLOW: "yellow",
} as const satisfies Record<Priority, string>;

interface TagProps {
  priority?: Priority | undefined;
  children?: ReactNode;
  className?: string;
}

/** Priority / source tag used in lists (RED, ORANGE, YELLOW, or a green label). */
export function Tag({ priority, children, className }: TagProps) {
  return (
    <Badge
      variant={priority ? PRIORITY_VARIANT[priority] : "green"}
      className={cn("justify-center", className)}
    >
      {children ?? priority}
    </Badge>
  );
}

/** Event time state: ACTIVE (live dot) / UPCOMING / EXPIRED / UNDATED / DETACHED. */
export function StateBadge({ state }: { state: TimeState | "DETACHED" }) {
  const variant =
    state === "ACTIVE" ? "live" : state === "UPCOMING" ? "default" : "faint";
  return (
    <Badge variant={variant} className="h-auto py-0.5 font-semibold">
      {state === "ACTIVE" && <LiveDot />}
      {state}
    </Badge>
  );
}

export function InUseBadge() {
  return (
    <Badge variant="live">
      <LiveDot />
      In use
    </Badge>
  );
}

export function Dash() {
  return <span className="font-mono text-faint">—</span>;
}

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string | undefined;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/** Label + control + error / hint, stacked. */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {htmlFor ? (
        <Label htmlFor={htmlFor}>{label}</Label>
      ) : (
        <span className="label-sm">{label}</span>
      )}
      {children}
      {error && (
        <span className="font-mono text-[11px] tracking-[0.04em] text-error-text">
          {error}
        </span>
      )}
      {hint && <span className="label-sm text-faint">{hint}</span>}
    </div>
  );
}
