import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

import ChecklistRow from '@/components/ChecklistRow';
import { StateBadge } from '@/components/tracker';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { isTimeState } from '@/lib/guards';
import { formatStamp, timeLeft, timeState, urgencyClass } from '@/lib/time';
import { cn } from '@/lib/utils';
import { byAddedOn, isCountable, progressOf } from '@/state/selectors';
import { useTracker } from '@/state/store';
import type { Collectible, TimeState, TrackerEvent } from '@/types';

type Tab = TimeState | 'all';

const TABS: readonly { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'UPCOMING', label: 'Upcoming' },
  { key: 'UNDATED', label: 'Undated' },
  { key: 'EXPIRED', label: 'Expired' },
];

interface EventGroup {
  /** null for items whose event was deleted or never set. */
  event: TrackerEvent | null;
  state: TimeState;
  items: Collectible[];
}

// Soonest end first, undated after, expired last.
function sortKey(g: EventGroup): number {
  const end = g.event?.ends_at;
  if (!end) return 2e15;
  return g.state === 'EXPIRED' ? 3e15 + end : end;
}

export default function Events() {
  const { state, openDialog, requestDeleteEvent } = useTracker();
  const [tab, setTab] = useState<Tab>('all');
  const eventItems = state.items.filter((i) => i.section === 'event');

  const groups: EventGroup[] = state.events.map((e) => ({
    event: e,
    state: timeState(e.starts_at, e.ends_at),
    items: eventItems.filter((i) => i.event_id === e.id).sort(byAddedOn),
  }));
  const known = new Set(state.events.map((e) => e.id));
  const orphans = eventItems.filter((i) => !i.event_id || !known.has(i.event_id));
  if (orphans.length) groups.push({ event: null, state: 'UNDATED', items: orphans });

  groups.sort((a, b) => sortKey(a) - sortKey(b));
  const shown = groups.filter((g) => tab === 'all' || g.state === tab);

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        type="single"
        variant="chip"
        value={tab}
        onValueChange={(v) => {
          if (v === 'all' || isTimeState(v)) setTab(v);
        }}
        aria-label="Event state"
      >
        {TABS.map(({ key, label }) => (
          <ToggleGroupItem key={key} value={key}>
            {label} <span className="opacity-60">{key === 'all' ? groups.length : groups.filter((g) => g.state === key).length}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {shown.map((g) => {
        const e = g.event;
        // Progress ignores expired items; they are listed after the current ones.
        const p = progressOf(g.items);
        const ordered = [...g.items.filter(isCountable), ...g.items.filter((i) => !isCountable(i))];
        return (
          <Card key={e?.id ?? 'orphans'}>
            <CardHeader className="items-start">
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <CardTitle>{e ? e.name : 'Unassigned items'}</CardTitle>
                  <StateBadge state={e ? g.state : 'DETACHED'} />
                </div>
                <span className="label-sm">
                  {e
                    ? `${e.starts_at ? formatStamp(e.starts_at) : 'NO START'}  →  ${e.ends_at ? formatStamp(e.ends_at) : 'NO END DATE'}`
                    : 'Items detached from a deleted event'}
                </span>
                {e?.note && <span className="text-[13px] leading-5 text-muted-foreground">{e.note}</span>}
              </div>
              {e && (
                <div className="flex items-center gap-2">
                  {e.ends_at && g.state !== 'EXPIRED' && (
                    <span className={cn('mr-1.5 hidden font-mono text-[13px] md:inline', urgencyClass(e.ends_at))}>{timeLeft(e.ends_at)}</span>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => openDialog({ kind: 'collectible', section: 'event', eventId: e.id })}>
                    <Plus />
                    Item
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDialog({ kind: 'event', event: e })} aria-label={`Edit event ${e.name}`}>
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:border-destructive hover:text-error-text hover:shadow-none"
                    onClick={() => requestDeleteEvent(e.id)}
                    aria-label={`Delete event ${e.name}`}
                  >
                    <Trash />
                  </Button>
                </div>
              )}
            </CardHeader>
            <div className="flex items-center gap-3 border-b border-tactical/30 px-4 py-2.5">
              <Progress value={p.pct} className="flex-1" />
              <span className="font-mono text-xs text-muted-foreground">
                {p.done}/{p.total}
                {p.expired > 0 && ` · ${p.expired} expired`}
              </span>
            </div>
            <div>
              {ordered.map((it) => (
                <ChecklistRow key={it.id} item={it} showAdded={false} />
              ))}
              {g.items.length === 0 && <div className="label-sm p-4">No items yet · add each bundle / reward item individually</div>}
            </div>
          </Card>
        );
      })}
      {shown.length === 0 && <Card className="label-md p-10 text-center">No events in this view</Card>}
    </div>
  );
}
