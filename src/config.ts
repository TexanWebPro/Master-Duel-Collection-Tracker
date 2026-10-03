// Mirrors config.ts from the spec (section 6). Settings live in code, not the data files.

import type {
  Art,
  Category,
  Finish,
  OtherSource,
  Priority,
  RouteKey,
  Section,
} from "./types";

export const CARD_TARGET = 1;
export const ART: readonly Art[] = ["standard", "alternate", "extended"];
export const FINISH: readonly Finish[] = ["normal", "glossy", "royal"];

export interface Pool {
  name: string;
  count: string;
  note: string;
}

// Static reference counts, shown on the dashboard only.
export const POOLS: readonly Pool[] = [
  { name: "Duel Result", count: "200", note: "Duel Assessment reward pool" },
  { name: "Legacy Pack", count: "4,080", note: "Legacy Pack Ticket pool" },
];

// Deadline thresholds in days (today is handled separately).
export const THRESHOLDS = { soon: 3, week: 7 } as const;

export const TIMEZONE = "America/Chicago";
export const TZ_LABEL = "CDT";

export const YGOPRODECK_URL =
  "https://db.ygoprodeck.com/api/v7/cardinfo.php?format=master%20duel&misc=yes";
export const IMAGE_DIR = "public/card-images";

// Prototype clock. Fixed so the deadline buckets stay stable while reviewing.
// Set to null to use the real current time.
export const PROTOTYPE_NOW: number | null = Date.parse(
  "2026-09-30T16:44:00-05:00",
);

export const CATEGORY_LABEL: Record<Category, string> = {
  card: "Card",
  structure_deck: "Structure Deck",
  mate: "Mate",
  mate_base: "Mate Base",
  duel_field: "Duel Field",
  field_part: "Field Part",
  protector: "Protector",
  icon: "Icon",
  icon_frame: "Icon Frame",
  title: "Title",
  card_case: "Card Case",
  coin: "Coin",
  wallpaper: "Wallpaper",
  collectors_file: "Collector's File",
  other: "Other",
};

/** Category keys in form order (same order as CATEGORY_LABEL). */
export const CATEGORIES: readonly Category[] = [
  "card",
  "structure_deck",
  "mate",
  "mate_base",
  "duel_field",
  "field_part",
  "protector",
  "icon",
  "icon_frame",
  "title",
  "card_case",
  "coin",
  "wallpaper",
  "collectors_file",
  "other",
];

export const SECTIONS: readonly { key: Section; label: string }[] = [
  { key: "solo", label: "Solo" },
  { key: "store", label: "Store" },
  { key: "event", label: "Event" },
  { key: "other", label: "Other" },
];

export interface OtherSourceMeta {
  key: OtherSource;
  label: string;
  /** What source_name means for this source. */
  name: string;
  placeholder: string;
  nameRequired: boolean;
}

// Sources for section = "other".
export const OTHER_SOURCE_BY_KEY: Record<OtherSource, OtherSourceMeta> = {
  mission: {
    key: "mission",
    label: "Mission",
    name: "Mission name",
    placeholder: "e.g. Normal Summon 30 times",
    nameRequired: true,
  },
  proficiency_test: {
    key: "proficiency_test",
    label: "Proficiency Test",
    name: "Test",
    placeholder: "e.g. Test 9",
    nameRequired: false,
  },
  ranked: {
    key: "ranked",
    label: "Ranked",
    name: "Rank reached",
    placeholder: "e.g. Master",
    nameRequired: false,
  },
  duelist_points: {
    key: "duelist_points",
    label: "Duelist Points",
    name: "Cost",
    placeholder: "e.g. 600 Duelist Points",
    nameRequired: false,
  },
  campaign_code: {
    key: "campaign_code",
    label: "Campaign Code",
    name: "Code or campaign",
    placeholder: "e.g. Rookie & Returner campaign",
    nameRequired: true,
  },
};
export const OTHER_SOURCES: readonly OtherSourceMeta[] = [
  OTHER_SOURCE_BY_KEY.mission,
  OTHER_SOURCE_BY_KEY.proficiency_test,
  OTHER_SOURCE_BY_KEY.ranked,
  OTHER_SOURCE_BY_KEY.duelist_points,
  OTHER_SOURCE_BY_KEY.campaign_code,
];

export const PRIORITIES: readonly Priority[] = ["RED", "ORANGE", "YELLOW"];
export const PRIORITY_COLOR: Record<Priority, string> = {
  RED: "#ff6b5e",
  ORANGE: "#ffa24a",
  YELLOW: "#ffd84d",
};

export interface RouteHeaderMeta {
  key: RouteKey;
  title: string;
  sub: string;
}

export interface RouteMeta {
  key: RouteKey;
  label: string;
  path: string;
  sec: string;
}

/** Where unknown paths land. */
export const DEFAULT_ROUTE: RouteMeta = {
  key: "dashboard",
  label: "Dashboard",
  path: "/",
  sec: "SEC-01",
};
