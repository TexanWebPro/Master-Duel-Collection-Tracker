import { useState } from 'react';

import { CardArt, InUseBadge, Rarity } from '@/components/tracker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { ART, FINISH } from '@/config';
import { getCard } from '@/data/cards';
import { navigate } from '@/lib/router';
import { cn } from '@/lib/utils';
import { useTracker } from '@/state/store';
import type { Art, Card, Finish } from '@/types';

/** /cards/$id — card info plus the 3×3 art × finish ownership grid. */
export default function CardDrawer({ id }: { id: number | null }) {
  const card = getCard(id);
  // Keep the last card rendered while the sheet animates closed
  // (React's "store information from previous renders" pattern).
  const [shown, setShown] = useState<Card | undefined>(card);
  if (card && card !== shown) setShown(card);

  return (
    <Sheet
      open={!!card}
      onOpenChange={(open) => {
        if (!open) navigate('/cards');
      }}
    >
      <SheetContent>{shown && <DrawerBody card={shown} />}</SheetContent>
    </Sheet>
  );
}

function DrawerBody({ card }: { card: Card }) {
  const { col, dispatch, notify, requestRemoveAll } = useTracker();
  const id = card.id;
  const versions = col.versions(id);
  const owned = versions.length > 0;
  const inUse = col.isInUse(id);
  const find = (art: Art, finish: Finish) => versions.find((v) => v.art === art && v.finish === finish);

  const info: [string, string][] = [
    ['Type', card.type],
    ['Attribute', card.attr ?? '—'],
    [card.attr ? 'Race' : 'Property', card.race],
  ];
  if (card.level) info.push(['Level', card.level]);
  if (card.atk != null) info.push(['ATK / DEF', `${card.atk} / ${card.def ?? '—'}`]);
  info.push(['Archetype', card.archetype ?? '—'], ['Passcode', String(card.id)]);

  const toggleCell = (art: Art, finish: Finish) => {
    const exists = !!find(art, finish);
    dispatch({ type: exists ? 'version/remove' : 'version/add', id, art, finish });
    notify(`Saved · ${art} / ${finish} ${exists ? 'removed' : 'owned'}`);
  };
  const toggleUse = (art: Art, finish: Finish) => {
    dispatch({ type: 'version/toggleInUse', id, art, finish });
    notify('Saved · in use updated');
  };

  return (
    <>
      <SheetHeader>
        <span className="label-md">
          {'// /cards/'}
          <span className="text-primary">{card.id}</span>
        </span>
      </SheetHeader>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-start gap-4">
          <CardArt card={card} inUse={inUse} size="lg" />
          <div className="flex min-w-0 flex-col gap-2">
            <SheetTitle>{card.name}</SheetTitle>
            <div className="flex flex-wrap gap-1.5">
              <Rarity value={card.rarity} />
              {owned ? <Badge variant="active">Owned · {versions.length} ver.</Badge> : <Badge>Missing</Badge>}
              {inUse && <InUseBadge />}
            </div>
            <dl className="mt-1 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3.5 gap-y-1">
              {info.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="label-sm leading-[22px]">{k}</dt>
                  <dd className="font-mono text-[13px] leading-[22px]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="rounded-md border border-tactical/45 bg-black/35 p-3 text-[13px] leading-5 text-muted-foreground">
          <div className="label-sm mb-1">Card text</div>
          [Card text from YGOPRODeck sync · description field]
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">Versions</h3>
            <SheetDescription className="label-sm">Art × Finish · any cell = owned</SheetDescription>
          </div>
          <div className="grid grid-cols-[64px_repeat(3,minmax(0,1fr))] gap-1.5 sm:grid-cols-[88px_repeat(3,minmax(0,1fr))]">
            <span />
            {FINISH.map((fin) => (
              <span key={fin} className="label-sm text-center">
                {fin}
              </span>
            ))}
            {ART.map((art) => (
              <div key={art} className="contents">
                <span className="label-sm self-center">{art}</span>
                {FINISH.map((fin) => {
                  const v = find(art, fin);
                  return (
                    <div
                      key={fin}
                      className={cn(
                        'flex flex-col gap-2 rounded-md border bg-black/35 p-2.5 transition-all',
                        v && 'border-secondary bg-panel-hover',
                        v?.in_use && 'border-primary shadow-[0_0_12px_-2px_rgba(31,234,0,0.45)]'
                      )}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="label-sm">Own</span>
                        <Switch checked={!!v} onCheckedChange={() => toggleCell(art, fin)} aria-label={`Owned ${art} ${fin}`} />
                      </div>
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="label-sm">Use</span>
                        <Switch
                          variant="use"
                          checked={!!v?.in_use}
                          disabled={!v}
                          onCheckedChange={() => toggleUse(art, fin)}
                          aria-label={`In use ${art} ${fin}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <span className="label-sm text-faint">In use can only be set on an owned version · removing a version removes its flag</span>
        </div>

        {owned && (
          <Button variant="destructive" className="self-start" onClick={() => requestRemoveAll(id)}>
            Remove all versions
          </Button>
        )}
      </div>
    </>
  );
}
