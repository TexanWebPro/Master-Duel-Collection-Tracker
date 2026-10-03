import { LayoutGrid, List } from 'lucide-react';
import { useMemo } from 'react';

import { CardArt, Dash, FormField, InUseBadge, Rarity } from '@/components/tracker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CARDS } from '@/data/cards';
import { isLedgerView, isOwnFilter } from '@/lib/guards';
import { EMPTY_FILTERS, hasActiveFilters } from '@/lib/ledger';
import { navigate } from '@/lib/router';
import { cn } from '@/lib/utils';
import { useTracker } from '@/state/store';
import type { Art, Card as CardRow, CardVersion, LedgerFilters, OwnFilter } from '@/types';

type SelectKey = 'archetype' | 'type' | 'attr' | 'rarity';
type FlagKey = 'inUse' | 'alt' | 'ext' | 'royal' | 'glossy';

const uniq = (xs: readonly string[]): string[] => [...new Set(xs)].sort();
const notNull = <T,>(x: T | null): x is T => x !== null;

const SELECTS: readonly { key: SelectKey; label: string; options: string[] }[] = [
  { key: 'archetype', label: 'Archetype', options: uniq(CARDS.map((c) => c.archetype).filter(notNull)) },
  { key: 'type', label: 'Type', options: uniq(CARDS.map((c) => c.type)) },
  { key: 'attr', label: 'Attribute', options: uniq(CARDS.map((c) => c.attr ?? 'None')) },
  { key: 'rarity', label: 'Rarity', options: ['UR', 'SR', 'R', 'N', 'Unknown'] },
];
const FLAGS: readonly { key: FlagKey; label: string }[] = [
  { key: 'inUse', label: 'In use' },
  { key: 'alt', label: 'Alt art' },
  { key: 'ext', label: 'Extended' },
  { key: 'royal', label: 'Royal' },
  { key: 'glossy', label: 'Glossy' },
];
const ART_SHORT: Record<Art, string> = { standard: '', alternate: 'ALT', extended: 'EXT' };

/** Badges for owned non-regular versions, e.g. "ALT·ROYAL", "GLOSSY". */
function versionBadges(versions: readonly CardVersion[]): string[] {
  return versions
    .filter((v) => !(v.art === 'standard' && v.finish === 'normal'))
    .map((v) => [ART_SHORT[v.art], v.finish !== 'normal' ? v.finish.toUpperCase() : ''].filter(Boolean).join('·'));
}

export default function Cards() {
  const { col, ledgerFilters: f, setLedgerFilters, ledgerView: view, setLedgerView, toggleOwned } = useTracker();
  const set = <K extends keyof LedgerFilters>(k: K, v: LedgerFilters[K]) => setLedgerFilters((prev) => ({ ...prev, [k]: v }));
  const anyFilter = hasActiveFilters(f);
  const clear = () => setLedgerFilters(EMPTY_FILTERS);

  const rows = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const is = (k: SelectKey, v: string | null) => f[k] === 'all' || f[k] === v;
    return CARDS.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (!is('archetype', c.archetype) || !is('type', c.type)) return false;
      if (!is('attr', c.attr ?? 'None') || !is('rarity', c.rarity ?? 'Unknown')) return false;
      if (f.own === 'owned' && !col.isOwned(c.id)) return false;
      if (f.own === 'missing' && col.isOwned(c.id)) return false;
      if (f.inUse && !col.isInUse(c.id)) return false;
      if (f.alt && !col.hasArt(c.id, 'alternate')) return false;
      if (f.ext && !col.hasArt(c.id, 'extended')) return false;
      if (f.royal && !col.hasFinish(c.id, 'royal')) return false;
      if (f.glossy && !col.hasFinish(c.id, 'glossy')) return false;
      return true;
    });
  }, [f, col]);

  const owned = CARDS.filter((c) => col.isOwned(c.id)).length;
  const open = (c: CardRow) => navigate(`/cards/${c.id}`);
  const ownership: readonly { key: OwnFilter; label: string; n: number }[] = [
    { key: 'all', label: 'All', n: CARDS.length },
    { key: 'owned', label: 'Owned', n: owned },
    { key: 'missing', label: 'Missing', n: CARDS.length - owned },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card aria-label="Filters" className="gap-3 p-3.5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-[minmax(200px,1.4fr)_repeat(4,minmax(120px,1fr))]">
          <FormField label="Name search" htmlFor="f-q">
            <Input id="f-q" type="search" placeholder="e.g. Dark Magician" value={f.q} onChange={(e) => set('q', e.target.value)} />
          </FormField>
          {SELECTS.map(({ key, label, options }) => (
            <FormField key={key} label={label} htmlFor={`f-${key}`}>
              <Select value={f[key]} onValueChange={(v) => set(key, v)}>
                <SelectTrigger id={`f-${key}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {options.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            type="single"
            value={f.own}
            onValueChange={(v) => {
              if (isOwnFilter(v)) set('own', v);
            }}
            aria-label="Ownership"
          >
            {ownership.map(({ key, label, n }) => (
              <ToggleGroupItem key={key} value={key}>
                {label}
                <span className="text-faint">{n}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Separator orientation="vertical" className="hidden md:block" />
          {FLAGS.map(({ key, label }) => (
            <Toggle key={key} pressed={f[key]} onPressedChange={(p) => set(key, p)}>
              {label}
            </Toggle>
          ))}
          {anyFilter && (
            <Button variant="ghost" size="sm" onClick={clear}>
              Clear filters
            </Button>
          )}
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => {
              if (isLedgerView(v)) setLedgerView(v);
            }}
            aria-label="View"
            className="ml-auto"
          >
            <ToggleGroupItem value="table">
              <List />
              Table
            </ToggleGroupItem>
            <ToggleGroupItem value="grid">
              <LayoutGrid />
              Grid
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <span className="label-md">
            {'// SEC-02 : CARD LEDGER · '}
            <span className="text-foreground">{rows.length}</span> of {CARDS.length} cards
          </span>
          <CardDescription>Source: YGOPRODeck · format=master duel</CardDescription>
        </CardHeader>

        {rows.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <span className="label-md">No cards match these filters</span>
            <Button variant="secondary" size="sm" onClick={clear}>
              Clear filters
            </Button>
          </div>
        )}

        {rows.length > 0 && view === 'table' && (
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Attribute</TableHead>
                <TableHead>Rarity</TableHead>
                <TableHead>Owned</TableHead>
                <TableHead>Versions</TableHead>
                <TableHead>In use</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => {
                const isOwned = col.isOwned(c.id);
                const inUse = col.isInUse(c.id);
                const badges = versionBadges(col.versions(c.id));
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <button type="button" className="block cursor-pointer" onClick={() => open(c)} aria-label={`Open ${c.name}`}>
                        <CardArt card={c} inUse={inUse} size="sm" />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          className="w-fit cursor-pointer text-left text-[15px] font-medium hover:text-primary hover:underline hover:underline-offset-3"
                          onClick={() => open(c)}
                        >
                          {c.name}
                        </button>
                        <span className="label-sm text-faint">
                          #{c.id}
                          {c.archetype ? ` · ${c.archetype}` : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] whitespace-nowrap text-muted-foreground">{c.type}</TableCell>
                    <TableCell className="font-mono text-xs">{c.attr ?? '—'}</TableCell>
                    <TableCell>
                      <Rarity value={c.rarity} />
                    </TableCell>
                    <TableCell>
                      <Switch checked={isOwned} onCheckedChange={() => toggleOwned(c.id)} aria-label={`Owned: ${c.name}`} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {badges.length ? (
                          badges.map((b) => (
                            <Badge key={b} variant="active">
                              {b}
                            </Badge>
                          ))
                        ) : (
                          <Dash />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{inUse ? <InUseBadge /> : <Dash />}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {rows.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
            {rows.map((c) => {
              const isOwned = col.isOwned(c.id);
              const inUse = col.isInUse(c.id);
              const badges = versionBadges(col.versions(c.id));
              return (
                <div
                  key={c.id}
                  className="group flex min-w-0 flex-col gap-2 rounded-lg border bg-card p-2.5 transition-all hover:border-secondary/70 hover:bg-panel-hover hover:shadow-panel"
                >
                  <button type="button" className="block w-full cursor-pointer" onClick={() => open(c)} aria-label={`Open ${c.name}`}>
                    <CardArt card={c} inUse={inUse} className={cn(!isOwned && 'brightness-[0.45] grayscale')} />
                  </button>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <button
                      type="button"
                      className="cursor-pointer truncate text-left text-[13px] leading-[18px] font-medium hover:text-primary"
                      onClick={() => open(c)}
                    >
                      {c.name}
                    </button>
                    <span className="label-sm truncate">
                      {c.type}
                      {c.attr ? ` · ${c.attr}` : ''}
                    </span>
                  </div>
                  <div className="flex min-h-6 flex-wrap items-center gap-1">
                    <Rarity value={c.rarity} />
                    {badges.map((b) => (
                      <Badge key={b} variant="active" className="h-5 px-1.5">
                        {b}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="label-sm">{isOwned ? 'Owned' : 'Missing'}</span>
                    <Switch checked={isOwned} onCheckedChange={() => toggleOwned(c.id)} aria-label={`Owned: ${c.name}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
