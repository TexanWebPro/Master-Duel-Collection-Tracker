import { Plus } from "lucide-react";
import { RouteHeaderMeta } from "../config";
import { DialogRequest } from "../types";
import { Button } from "./ui/button";
import { Badge, LiveDot } from "./ui/badge";
import { useState } from "react";

export function PageHeader({ meta }: { meta: RouteHeaderMeta }) {
  const [dialog, setDialog] = useState<DialogRequest | null>(null);
  const { key } = meta;
  return (
    <header className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="text-[26px] leading-8.5 font-semibold tracking-[-0.02em] md:text-4xl md:leading-11">
          {meta.title}
        </h1>
        <p className="max-w-180 text-sm leading-5 text-muted-foreground">
          {meta.sub}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(key === "solo" || key === "store" || key === "other") && (
          <Button
            onClick={() => setDialog({ kind: "collectible", section: key })}
          >
            <Plus strokeWidth={2.5} />
            Add item
          </Button>
        )}
        {key === "events" && (
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setDialog({ kind: "collectible", section: "event" })
              }
            >
              Add item
            </Button>
            <Button onClick={() => setDialog({ kind: "event" })}>
              <Plus strokeWidth={2.5} />
              Add event
            </Button>
          </>
        )}
        {key === "deadlines" && (
          <Button onClick={() => setDialog({ kind: "deadline" })}>
            <Plus strokeWidth={2.5} />
            Add deadline
          </Button>
        )}
        {key === "cards" && (
          <Badge variant="default">
            <LiveDot />
            Toggles save instantly
          </Badge>
        )}
      </div>
    </header>
  );
}
