import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { Tag } from "../tracker";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import {
  CARD_TARGET,
  CATEGORY_LABEL,
  OTHER_SOURCE_BY_KEY,
  POOLS,
} from "../../config";
import { cn } from "../../lib/utils";
import type { Bucket, Priority } from "../../types";

const NEXT_LIMIT = 9;

const RADAR: readonly { bucket: Bucket; label: string; color: string }[] = [
  { bucket: "today", label: "Today", color: "text-alert-strong" },
  { bucket: "d3", label: "≤ 3 days", color: "text-alert" },
  { bucket: "d7", label: "≤ 7 days", color: "text-warn" },
];

interface KpiProps {
  label: string;
  value: ReactNode;
  unit?: string;
  alert?: boolean;
  children?: ReactNode;
}

function Kpi({ label, value, unit, alert, children }: KpiProps) {
  return (
    <Card className="gap-2.5 p-4">
      <span className="label-sm">{label}</span>
      <div
        className={cn(
          "font-mono text-[26px] leading-8 font-semibold tracking-[-0.02em] md:text-[34px] md:leading-10",
          alert && "text-alert",
        )}
      >
        {value}
        {unit && (
          <small className="text-[15px] font-medium tracking-normal text-muted-foreground">
            {unit}
          </small>
        )}
      </div>
      {children}
    </Card>
  );
}

export default function Dashboard() {
  // const { state, col, setLedgerFilters } = useTracker();
  // const cards = cardStats(col);
  // const solo = sectionProgress(state.items, "solo");
  // const store = sectionProgress(state.items, "store");
  // const ev = sectionProgress(state.items, "event");
  // const other = sectionProgress(state.items, "other");
  // const expiredListed = state.items.filter((i) => i.is_expired).length;
  // const dl = openDeadlines(state.deadlines);
  // const evOpen = openEvents(state.events);
  // const soonest = [
  //   ...dl.map((d) => d.ends_at),
  //   ...evOpen.map((e) => e.ends_at),
  // ].sort((a, b) => a - b)[0];
  // const buckets = bucketCounts(state.deadlines, state.events);
  // const actions = nextActions(state);

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-label="Key metrics"
        className="grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-3 2xl:grid-cols-6"
      >
        <Kpi
          label="Card completion"
          value={1}
          // value={cards.completion.toFixed(1)}
          unit="%"
        >
          <Progress
            // value={cards.completion}
            value={2}
          />
          <span className="label-sm">
            <span className="text-foreground">cards.owned</span> / cards.total
            cards · target {CARD_TARGET} copy
          </span>
        </Kpi>
        <Kpi
          label="In use"
          // value={cards.inUse}
          value={50}
          unit=" cards"
        >
          <span className="label-sm flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs border-2 border-primary shadow-glow-sm" />
            Do not dismantle
          </span>
          <button
            type="button"
            className="label-sm w-fit cursor-pointer text-left text-primary underline-offset-4 hover:underline"
            // onClick={() => {
            //   setLedgerFilters((f) => ({ ...f, inUse: true }));
            //   navigate("/cards");
            // }}
          >
            View in ledger →
          </button>
        </Kpi>
        <Kpi
          label="Time-sensitive"
          // value={dl.length + evOpen.length}
          value={12}
          unit=" open"
          alert
        >
          <span className="label-sm">
            {true ? `Next: ...` : "Nothing open"}
            {/* {soonest ? `Next: ${timeLeft(soonest)}` : "Nothing open"} */}
          </span>
          <button
            type="button"
            className="label-sm w-fit cursor-pointer text-left text-primary underline-offset-4 hover:underline"
            // onClick={() => navigate("/deadlines")}
          >
            Open /deadlines →
          </button>
        </Kpi>
        <Kpi
          label="Solo progress"
          // value={solo.done}
          value={12}
          // unit={` / ${solo.total}`}>
          unit={` / 34`}
        >
          <Progress
            // value={solo.pct}
            value={12}
          />
          <span className="label-sm">solo.pct% acquired</span>
        </Kpi>
        {/* <Kpi
          label="Store progress"
          value={store.done}
          unit={` / ${store.total}`}
        >
          <Progress value={store.pct} />
          <span className="label-sm">{store.pct}% complete</span>
        </Kpi>
        <Kpi
          label="Other progress"
          value={other.done}
          unit={` / ${other.total}`}
        >
          <Progress value={other.pct} />
          <span className="label-sm">
            {other.pct}% · missions, tests, ranked
          </span>
        </Kpi> */}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card aria-labelledby="next-h">
          <CardHeader>
            <CardTitle id="next-h">What should I do next?</CardTitle>
            <CardDescription>
              {"// Deadlines → Solo → Store → Events → Other"}
            </CardDescription>
          </CardHeader>
          {/* <div>
            {actions.slice(0, NEXT_LIMIT).map((a, i) => (
              <NextRow key={a.key} n={i + 1} action={a} />
            ))}
            {actions.length === 0 && (
              <div className="label-md p-10 text-center">All caught up</div>
            )}
          </div> */}
          <CardFooter className="label-sm">
            {/* Showing {Math.min(NEXT_LIMIT, actions.length)} of {actions.length}{" "} */}
            Showing 12 of 111 open actions
            {/* {expiredListed > 0 &&
              ` · ${expiredListed} expired items listed, not counted`} */}
          </CardFooter>
        </Card>

        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Deadline radar</CardTitle>
              <CardDescription>{"// SEC-06"}</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-3 gap-px bg-tactical/30">
              {RADAR.map(({ bucket, label, color }) => (
                <div
                  key={bucket}
                  className="flex flex-col gap-1 bg-black px-3 py-3.5"
                >
                  <span
                    className={cn(
                      "font-mono text-[26px] leading-7.5 font-semibold",
                      // buckets[bucket] ? color : "text-faint",
                    )}
                  >
                    {`buckets[bucket]`}
                  </span>
                  <span className="label-sm">{label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pool reference</CardTitle>
              <CardDescription>config.ts · POOLS</CardDescription>
            </CardHeader>
            {POOLS.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between border-b border-tactical/30 px-4 py-3 last:border-b-0"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{p.name}</span>
                  <span className="label-sm">{p.note}</span>
                </div>
                <span className="font-mono text-xl font-semibold">
                  {p.count}
                </span>
              </div>
            ))}
            <CardFooter className="label-sm text-faint">
              Static reference counts · not tracked
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Events progress</CardTitle>
              <CardDescription>ev.done / ev.total items</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Progress
                // value={pct(ev.done, ev.total)}
                value={90}
              />
              <span className="label-sm">
                evOpen.length active events with an end date
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface NextRowView {
  tag: string;
  priority: Priority | undefined;
  title: string;
  meta: string;
  when: string;
  color: string;
}

// function describe(action: NextAction): NextRowView {
//   if (action.kind === "deadline") {
//     const d = action.ref;
//     return {
//       tag: d.priority,
//       priority: d.priority,
//       title: d.title,
//       meta: `Deadline · ends ${formatStamp(d.ends_at)}`,
//       when: timeLeft(d.ends_at),
//       color: urgencyClass(d.ends_at),
//     };
//   }
//   const { kind, ref, event } = action;
//   const view: NextRowView = {
//     tag: kind.toUpperCase(),
//     priority: undefined,
//     title: ref.name,
//     meta: "",
//     when: "",
//     color: "text-muted-foreground",
//   };
//   const category = CATEGORY_LABEL[ref.category];
//   if (kind === "solo") view.meta = `${category} · added ${ref.added_on}`;
//   if (kind === "store")
//     view.meta = `${category} · ${ref.owned_count}/${ref.target_count} owned`;
//   if (kind === "other") {
//     const source = ref.other_source
//       ? OTHER_SOURCE_BY_KEY[ref.other_source].label
//       : "Other";
//     view.meta = `${source}${ref.source_name ? ` · ${ref.source_name}` : ""} · ${category}`;
//   }
//   if (kind === "event") {
//     view.meta = `${event ? event.name : "Unassigned"} · ${category}`;
//     if (event?.ends_at) {
//       view.when = timeLeft(event.ends_at);
//       view.color = urgencyClass(event.ends_at);
//     }
//   }
//   return view;
// }

// function NextRow({ n, action }: { n: number; action: NextAction }) {
//   const { tag, priority, title, meta, when, color } = describe(action);
//   return (
//     <div className="flex items-center gap-3.5 border-b border-l-2 border-b-tactical/30 border-l-transparent px-4 py-3 transition-all last:border-b-0 hover:border-l-primary hover:bg-card">
//       <span className="w-5 font-mono text-xs text-faint">
//         {String(n).padStart(2, "0")}
//       </span>
//       <Tag priority={priority} className="w-[76px]">
//         {tag}
//       </Tag>
//       <div className="flex min-w-0 flex-1 flex-col">
//         <span className="truncate font-medium">{title}</span>
//         <span className="label-sm">{meta}</span>
//       </div>
//       {when && (
//         <span
//           className={cn(
//             "hidden font-mono text-xs whitespace-nowrap md:inline",
//             color,
//           )}
//         >
//           {when}
//         </span>
//       )}
//       <Button
//         variant="ghost"
//         size="icon"
//         onClick={() => navigate(action.route)}
//         aria-label={`Open ${title}`}
//       >
//         <ChevronRight />
//       </Button>
//     </div>
//   );
// }
