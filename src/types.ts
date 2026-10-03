// Domain types for the tracker's tables (spec v0.8, section 5).
// The prototype keeps timestamps as epoch milliseconds in memory; the JSON data files
// store them as ISO 8601 strings, which the real app parses on load.

export type Art = 'standard' | 'alternate' | 'extended';
export type Finish = 'normal' | 'glossy' | 'royal';

export type Section = 'solo' | 'store' | 'event' | 'other';

export type Category =
  | 'card'
  | 'structure_deck'
  | 'mate'
  | 'mate_base'
  | 'duel_field'
  | 'field_part'
  | 'protector'
  | 'icon'
  | 'icon_frame'
  | 'title'
  | 'card_case'
  | 'coin'
  | 'wallpaper'
  | 'collectors_file'
  | 'other';

export type OtherSource = 'mission' | 'proficiency_test' | 'ranked' | 'duelist_points' | 'campaign_code';

export type Priority = 'RED' | 'ORANGE' | 'YELLOW';

export type Rarity = 'UR' | 'SR' | 'R' | 'N';

/** Card frame, used for the placeholder art colour. */
export type Frame = 'normal' | 'effect' | 'fusion' | 'synchro' | 'xyz' | 'link' | 'spell' | 'trap';

/** Prototype sample of the `cards` table (the real table comes from the YGOPRODeck sync). */
export interface Card {
  id: number;
  name: string;
  type: string;
  frame: Frame;
  attr: string | null;
  race: string;
  level: string | null;
  atk: string | null;
  def: string | null;
  archetype: string | null;
  rarity: Rarity | null;
}

/** One owned version of a card; the row existing means that version is owned. */
export interface CardVersion {
  card_id: number;
  art: Art;
  finish: Finish;
  in_use: boolean;
}

export interface Collectible {
  id: string;
  section: Section;
  category: Category;
  name: string;
  target_count: number;
  owned_count: number;
  /** YYYY-MM-DD */
  added_on: string;
  note: string;
  event_id: string | null;
  card_id: number | null;
  other_source: OtherSource | null;
  source_name: string | null;
  is_expired: boolean;
}

export interface TrackerEvent {
  id: string;
  name: string;
  starts_at: number | null;
  ends_at: number | null;
  note: string;
}

export interface Deadline {
  id: string;
  title: string;
  priority: Priority;
  starts_at: number | null;
  ends_at: number;
  note: string;
  done_at: number | null;
}

export interface TrackerState {
  collection: CardVersion[];
  items: Collectible[];
  events: TrackerEvent[];
  deadlines: Deadline[];
}

/** A row about to be saved: `id` is null until the store assigns one. */
export type Draft<T extends { id: string }> = Omit<T, 'id'> & { id: string | null };

export type TimeState = 'UPCOMING' | 'ACTIVE' | 'EXPIRED' | 'UNDATED';

export type Bucket = 'today' | 'd3' | 'd7' | 'active' | 'upcoming' | 'history';

export type RouteKey = 'dashboard' | 'cards' | 'solo' | 'store' | 'events' | 'other' | 'deadlines';

export type OwnFilter = 'all' | 'owned' | 'missing';
export type LedgerView = 'table' | 'grid';

export interface LedgerFilters {
  q: string;
  archetype: string;
  type: string;
  attr: string;
  rarity: string;
  own: OwnFilter;
  inUse: boolean;
  alt: boolean;
  ext: boolean;
  royal: boolean;
  glossy: boolean;
}

/** Which form dialog is open. */
export type DialogRequest =
  | { kind: 'collectible'; item?: Collectible; section?: Section; eventId?: string }
  | { kind: 'event'; event?: TrackerEvent }
  | { kind: 'deadline'; deadline?: Deadline };
