import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import ChecklistRow from '@/components/ChecklistRow';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CATEGORY_LABEL, OTHER_SOURCES } from '@/config';
import { isCategory } from '@/lib/guards';
import { byAddedOn, isCountable, progressOf } from '@/state/selectors';
import { useTracker } from '@/state/store';
import type { Category, Collectible, Section } from '@/types';

const bySourceName = (a: Collectible, b: Collectible): number => (a.source_name ?? '').localeCompare(b.source_name ?? '') || byAddedOn(a, b);

interface ChecklistProps {
  section: Exclude<Section, 'event'>;
  sec: string;
}

/**
 * Shared checklist over collectibles for /solo, /store and /other (spec section 8).
 * /other groups its items by source (Mission, Proficiency Test, Ranked, Duelist Points, Campaign Code).
 * Expired items are listed in their own group at the bottom and never counted.
 */
export default function Checklist({ section, sec }: ChecklistProps) {
  const { state } = useTracker();
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [showExpired, setShowExpired] = useState(false);
  const grouped = section === 'other';

  const all = state.items.filter((i) => i.section === section).sort(grouped ? bySourceName : byAddedOn);
  const progress = progressOf(all);
  const cats = [...new Set(all.map((i) => i.category))];
  const inCat = (i: Collectible) => cat === 'all' || i.category === cat;
  const current = all.filter((i) => isCountable(i) && inCat(i));
  const expired = all.filter((i) => !isCountable(i) && inCat(i));

  const groups = grouped
    ? OTHER_SOURCES.map((s) => ({ source: s, items: current.filter((i) => i.other_source === s.key) })).filter((g) => g.items.length)
    : [];
  const chips: readonly { key: Category | 'all'; label: string; n: number }[] = [
    { key: 'all', label: 'All', n: all.length },
    ...cats.map((k) => ({ key: k, label: CATEGORY_LABEL[k], n: all.filter((i) => i.category === k).length })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex-row flex-wrap items-center gap-6 p-4">
        <div className="flex flex-col">
          <span className="label-sm">Complete</span>
          <span className="font-mono text-[28px] leading-[34px] font-semibold">
            {progress.done}
            <span className="text-[15px] text-muted-foreground"> / {progress.total}</span>
          </span>
        </div>
        <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
          <Progress value={progress.pct} className="h-2" />
          <span className="label-sm">
            {progress.pct}% · {grouped ? 'grouped by source' : 'ordered oldest first by added date'}
            {progress.expired > 0 && ` · ${progress.expired} expired listed, not counted`}
          </span>
        </div>
      </Card>

      <ToggleGroup
        type="single"
        variant="chip"
        value={cat}
        onValueChange={(v) => {
          if (v === 'all' || isCategory(v)) setCat(v);
        }}
        aria-label="Category"
      >
        {chips.map(({ key, label, n }) => (
          <ToggleGroupItem key={key} value={key}>
            {label} <span className="opacity-60">{n}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {!grouped && (
        <Card>
          <CardHeader>
            <span className="label-md">{`// ${sec} : CHECKLIST · section = ${section}`}</span>
            <CardDescription>{current.length} items</CardDescription>
          </CardHeader>
          <div>
            {current.map((it) => (
              <ChecklistRow key={it.id} item={it} />
            ))}
            {current.length === 0 && <div className="label-md px-4 py-10 text-center">Nothing in this category yet</div>}
          </div>
        </Card>
      )}

      {grouped &&
        groups.map(({ source, items }) => {
          const p = progressOf(items);
          return (
            <Card key={source.key}>
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <CardTitle>{source.label}</CardTitle>
                  <span className="font-mono text-xs text-muted-foreground">
                    {p.done}/{p.total}
                  </span>
                </div>
                <CardDescription>by {source.name.toLowerCase()}</CardDescription>
              </CardHeader>
              <div className="border-b border-tactical/30 px-4 py-2.5">
                <Progress value={p.pct} />
              </div>
              <div>
                {items.map((it) => (
                  <ChecklistRow key={it.id} item={it} showSource showAdded={false} />
                ))}
              </div>
            </Card>
          );
        })}
      {grouped && groups.length === 0 && <Card className="label-md px-4 py-10 text-center">Nothing in this category yet</Card>}

      {expired.length > 0 && (
        <Card className="border-tactical/40 bg-black/40">
          <CardHeader>
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-muted-foreground">Expired · listed, not counted</CardTitle>
              <CardDescription>
                {expired.length} items · {expired.filter((i) => i.owned_count >= i.target_count).length} owned · use the archive button when one returns
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowExpired((v) => !v)} aria-expanded={showExpired}>
              {showExpired ? <ChevronDown /> : <ChevronRight />}
              {showExpired ? 'Hide' : 'Show'}
            </Button>
          </CardHeader>
          {showExpired && (
            <div>
              {expired.map((it) => (
                <ChecklistRow key={it.id} item={it} showSource={grouped} />
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
