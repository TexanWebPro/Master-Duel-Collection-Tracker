import { CalendarDays, Pencil, Trash } from 'lucide-react';

import { Tag } from '@/components/tracker';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { TZ_LABEL } from '@/config';
import { bucketOf, formatStamp, timeLeft, urgencyClass } from '@/lib/time';
import { cn } from '@/lib/utils';
import { useTracker } from '@/state/store';
import type { Bucket, Deadline, TrackerEvent } from '@/types';

const BUCKETS: readonly { key: Bucket; label: string; dot: string; hint: string }[] = [
  { key: 'today', label: 'Expires today', dot: 'bg-alert-strong shadow-[0_0_8px_var(--color-alert-strong)]', hint: `Ends before midnight ${TZ_LABEL}` },
  { key: 'd3', label: 'Within 3 days', dot: 'bg-alert shadow-[0_0_8px_var(--color-alert)]', hint: 'Threshold · 3D' },
  { key: 'd7', label: 'Within 7 days', dot: 'bg-warn shadow-[0_0_8px_var(--color-warn)]', hint: 'Threshold · 7D' },
  { key: 'active', label: 'Active', dot: 'bg-primary shadow-[0_0_8px_var(--color-primary)]', hint: 'Running · ends later' },
  { key: 'upcoming', label: 'Upcoming', dot: 'bg-secondary', hint: 'Not started' },
  { key: 'history', label: 'History', dot: 'bg-faint', hint: 'Expired or done · kept' },
];

type Row = { kind: 'deadline'; ref: Deadline; sort: number } | { kind: 'event'; ref: TrackerEvent; sort: number };

const rowClass =
  'flex min-h-[60px] items-center gap-3.5 border-b border-l-2 border-b-tactical/30 border-l-transparent px-4 py-2.5 transition-all last:border-b-0 hover:border-l-primary hover:bg-card';

/** /deadlines — deadlines rows plus every event that has an end date. */
export default function Deadlines() {
  const { state } = useTracker();
  const rows: Record<Bucket, Row[]> = { today: [], d3: [], d7: [], active: [], upcoming: [], history: [] };
  for (const d of state.deadlines) {
    rows[d.done_at ? 'history' : bucketOf(d.starts_at, d.ends_at)].push({ kind: 'deadline', ref: d, sort: d.ends_at });
  }
  for (const e of state.events) {
    if (e.ends_at == null) continue;
    rows[bucketOf(e.starts_at, e.ends_at)].push({ kind: 'event', ref: e, sort: e.ends_at });
  }

  return (
    <div className="flex flex-col gap-4">
      {BUCKETS.map(({ key, label, dot, hint }) => {
        const list = rows[key].sort((a, b) => (key === 'history' ? b.sort - a.sort : a.sort - b.sort));
        return (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <span className={cn('size-2 rounded-[1px]', dot)} />
                <CardTitle>{label}</CardTitle>
                <span className="font-mono text-xs text-muted-foreground">{list.length}</span>
              </div>
              <CardDescription>{hint}</CardDescription>
            </CardHeader>
            <div>
              {list.map((r) => (r.kind === 'deadline' ? <DeadlineRow key={r.ref.id} d={r.ref} /> : <EventRow key={r.ref.id} e={r.ref} ends={r.sort} />))}
              {list.length === 0 && <div className="label-sm px-4 py-3.5 text-faint">Nothing in this window</div>}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function When({ ms, done = false }: { ms: number; done?: boolean }) {
  return (
    <div className="hidden flex-col items-end md:flex">
      <span className={cn('font-mono text-[13px] font-semibold', done ? 'text-primary' : urgencyClass(ms))}>{done ? 'DONE' : timeLeft(ms)}</span>
      <span className="label-sm text-faint">{formatStamp(ms)}</span>
    </div>
  );
}

function DeadlineRow({ d }: { d: Deadline }) {
  const { dispatch, openDialog, notify } = useTracker();
  const done = !!d.done_at;
  return (
    <div className={rowClass}>
      <Checkbox
        checked={done}
        onCheckedChange={() => {
          dispatch({ type: 'deadline/toggleDone', id: d.id });
          notify('Saved');
        }}
        aria-label={`Done: ${d.title}`}
      />
      <Tag priority={d.priority} className="w-[68px]" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className={cn('font-medium', done && 'text-muted-foreground line-through decoration-primary/50')}>{d.title}</span>
        <span className="label-sm">
          Deadline{d.note ? ` · ${d.note}` : ''}
          {done ? ` · done ${formatStamp(d.done_at)}` : ''}
        </span>
      </div>
      <When ms={d.ends_at} done={done} />
      <Button variant="ghost" size="icon" onClick={() => openDialog({ kind: 'deadline', deadline: d })} aria-label={`Edit ${d.title}`}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:border-destructive hover:text-error-text hover:shadow-none"
        onClick={() => {
          dispatch({ type: 'deadline/delete', id: d.id });
          notify('Deadline deleted');
        }}
        aria-label={`Delete ${d.title}`}
      >
        <Trash />
      </Button>
    </div>
  );
}

function EventRow({ e, ends }: { e: TrackerEvent; ends: number }) {
  const { openDialog } = useTracker();
  return (
    <div className={rowClass}>
      <span className="flex w-6 justify-center text-secondary">
        <CalendarDays className="size-4" />
      </span>
      <Tag className="w-[68px]">EVENT</Tag>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium">{e.name}</span>
        <span className="label-sm">Event · managed on /events</span>
      </div>
      <When ms={ends} />
      <Button variant="ghost" size="icon" onClick={() => openDialog({ kind: 'event', event: e })} aria-label={`Edit ${e.name}`}>
        <Pencil />
      </Button>
    </div>
  );
}
