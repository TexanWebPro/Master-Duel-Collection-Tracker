import {
  Archive,
  ArchiveRestore,
  Minus,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { CATEGORY_LABEL } from "../config";
import { cn } from "../lib/utils";
import type { Collectible } from "../types";

interface CounterProps {
  value: number;
  target: number;
  onChange: (value: number) => void;
  label: string;
}

/** Structure Decks etc.: owned / target with − and + (target_count > 1). */
function Counter({ value, target, onChange, label }: CounterProps) {
  const done = value >= target;
  const btn =
    "flex size-[30px] cursor-pointer items-center justify-center bg-well text-muted-foreground transition-colors hover:bg-primary hover:text-black disabled:cursor-not-allowed disabled:text-faint disabled:hover:bg-well [&_svg]:size-3.5";
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center overflow-hidden rounded-md border",
        done ? "border-primary" : "border-tactical",
      )}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= 0}
        aria-label={`Decrease ${label}`}
      >
        <Minus />
      </button>
      <span className="h-7.5 min-w-12 border-x border-tactical text-center font-mono text-[13px] leading-7.5 font-semibold">
        {value}/{target}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= target}
        aria-label={`Increase ${label}`}
      >
        <Plus />
      </button>
    </div>
  );
}

interface ChecklistRowProps {
  item: Collectible;
  showAdded?: boolean;
  showSource?: boolean;
}

/**
 * One collectible row, shared by /solo, /store, /events and /other.
 * Expired items stay listed (dimmed, tagged) and can still be ticked owned,
 * but progress ignores them. The archive button flips is_expired when an item returns.
 */
export default function ChecklistRow({
  item,
  showAdded = true,
  showSource = false,
}: ChecklistRowProps) {
  // const { dispatch, openDialog, notify } = useTracker();
  // const done = isComplete(item);
  const expired = item.is_expired;
  // const card = getCard(item.card_id);
  // const setCount = (count: number) => {
  //   dispatch({ type: "item/setCount", id: item.id, count });
  //   notify("Saved");
  // };
  // const toggleExpired = () => {
  //   dispatch({ type: "item/setExpired", id: item.id, value: !expired });
  //   notify(
  //     expired ? "Saved · marked available again" : "Saved · marked expired",
  //   );
  // };

  return (
    <div
      className={cn(
        "flex min-h-14.5 items-center gap-3.5 border-b border-l-2 border-b-tactical/30 border-l-transparent px-4 py-2.5 transition-all last:border-b-0 hover:border-l-primary hover:bg-card",
        expired && "bg-black/30 [&_.row-main]:opacity-60",
      )}
    >
      {item.target_count > 1 ? (
        <Counter
          value={item.owned_count}
          target={item.target_count}
          // onChange={setCount}
          onChange={() => {}}
          label={item.name}
        />
      ) : (
        <Checkbox
          // checked={done}
          // onCheckedChange={(c) => setCount(c === true ? 1 : 0)}
          aria-label={`Acquired: ${item.name}`}
        />
      )}
      <div className="row-main flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "font-medium",
              // done &&
              "text-muted-foreground line-through decoration-primary/50",
            )}
          >
            {item.name}
          </span>
          <Badge>{CATEGORY_LABEL[item.category]}</Badge>
          {expired && <Badge variant="faint">Expired · not counted</Badge>}
          {showSource && item.source_name && (
            <Badge variant="active" className="normal-case tracking-normal">
              {item.source_name}
            </Badge>
          )}
          {true && (
            // card
            <Badge asChild variant="active">
              <button
                type="button"
                className="cursor-pointer hover:border-primary"
                // onClick={() => navigate(`/cards/${card.id}`)}
              >
                {/* ↳ {card.name} */}↳ "card.name"
              </button>
            </Badge>
          )}
        </div>
        {item.note && (
          <span className="text-[13px] leading-5 text-muted-foreground">
            {item.note}
          </span>
        )}
      </div>
      {showAdded && (
        <span className="hidden font-mono text-[11px] whitespace-nowrap text-faint md:inline">
          ADDED {item.added_on}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        // onClick={toggleExpired}
        aria-label={
          expired
            ? `Mark ${item.name} available again`
            : `Mark ${item.name} expired`
        }
        title={expired ? "Mark available again" : "Mark expired"}
      >
        {expired ? <ArchiveRestore /> : <Archive />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        // onClick={() => openDialog({ kind: "collectible", item })}
        aria-label={`Edit ${item.name}`}
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:border-destructive hover:text-error-text hover:shadow-none"
        // onClick={() => {
        //   dispatch({ type: "item/delete", id: item.id });
        //   notify("Item deleted");
        // }}
        aria-label={`Delete ${item.name}`}
      >
        <Trash />
      </Button>
    </div>
  );
}
