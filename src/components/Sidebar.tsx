import {
  Award,
  CalendarDays,
  Layers,
  LayoutDashboard,
  ScrollText,
  Store,
  Swords,
  Timer,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../lib/utils";
import type { RouteKey } from "../types";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

const ICONS: Record<RouteKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  cards: Layers,
  solo: Swords,
  store: Store,
  events: CalendarDays,
  other: Award,
  deadlines: Timer,
};

interface SidebarProps {
  /** Badge count per route; routes without a count show no badge. */
  counts: Partial<Record<RouteKey, number>>;
}

/** Left rail on desktop; sticky bottom HUD nav under 768px. */
export default function Sidebar({ counts }: SidebarProps) {
  const savedBadgeNumber = 6;
  const [badgeNumber, setBadgeNumber] = useState(savedBadgeNumber);
  const badges = [
    "rookie",
    "bronze",
    "silver",
    "gold",
    "platinum",
    "diamond",
    "master",
    "legend",
  ];

  const ROUTES: { key: RouteKey; label: string; path: string }[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/",
    },
    {
      key: "cards",
      label: "Cards",
      path: "/cards",
    },
    {
      key: "solo",
      label: "Solo",
      path: "/solo",
    },
    {
      key: "store",
      label: "Store",
      path: "/store",
    },
    {
      key: "events",
      label: "Events",
      path: "/events",
    },
    {
      key: "other",
      label: "Other",
      path: "/other",
    },
    {
      key: "deadlines",
      label: "Deadlines",
      path: "/deadlines",
    },
  ];

  function handleClick() {
    if (badgeNumber === badges.length - 1) {
      return setBadgeNumber(0);
    }
    setBadgeNumber(badgeNumber + 1);
  }

  return (
    <aside
      className={cn(
        "z-30 border-tactical/45 bg-[rgba(0,20,3,0.6)] backdrop-blur-lg",
        "fixed inset-x-0 bottom-0 flex border-t border-t-primary px-2 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_-8px_rgba(31,234,0,0.25)]",
        "md:sticky md:inset-x-auto md:top-0 md:bottom-auto md:h-screen md:flex-col md:gap-6 md:border-t-0 md:border-r md:px-3 md:py-5 md:shadow-none",
      )}
    >
      <div className="hidden flex-col gap-1.5 px-2 pt-1 md:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md border border-primary text-primary shadow-glow">
            <ScrollText className="size-4" />
          </div>
          <div className="font-display text-base leading-4.5 font-bold tracking-[-0.01em]">
            MD//COMPLETE
          </div>
        </div>
        <img
          src={`/images/md-icons/${badges[badgeNumber]}.png`}
          alt="Current Master Duel Rank"
          className="hover:cursor-pointer"
          onClick={handleClick}
        />
      </div>

      <nav aria-label="Primary" className="flex w-full gap-0.5 md:flex-col">
        {ROUTES.map((r) => {
          const Icon = ICONS[r.key];
          const count = counts[r.key];
          return (
            <Link
              to={r.path}
              key={r.key}
              type="button"
              className={cn(
                "flex min-h-13 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border border-transparent px-0.5 text-muted-foreground transition-all",
                "md:min-h-11 md:flex-none md:flex-row md:justify-start md:gap-2.5 md:border-l-2 md:px-3 md:text-left",
                "hover:bg-[rgba(0,47,6,0.35)] hover:text-foreground md:hover:border-l-secondary",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              )}
              activeProps={{
                style: {
                  borderColor:
                    "color-mix(in oklab, var(--secondary) 80%, transparent)",
                },
                className:
                  "border-secondary/70 bg-[rgba(0,47,6,0.6)] text-foreground shadow-panel max-md:border-t-2 max-md:border-t-primary md:border-l-primary",
              }}
            >
              {({ isActive }) => {
                return (
                  <>
                    <Icon
                      className={cn("size-4", isActive && "text-primary")}
                    />
                    <span
                      className={cn(
                        "hidden font-mono text-[10px] tracking-widest md:inline",
                        isActive ? "text-primary" : "text-faint",
                      )}
                    ></span>
                    <span className="font-display text-[11px] font-semibold md:flex-1 md:text-[15px]">
                      {r.label}
                    </span>
                    {count != null && (
                      <span
                        className={cn(
                          "hidden px-1.5 font-mono text-[10px] tracking-[0.06em] md:inline",
                          r.key === "deadlines"
                            ? "border-alert-strong/70 text-alert"
                            : "border-tactical/80 text-muted-foreground",
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </>
                );
              }}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
