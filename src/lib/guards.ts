// Type guards for string values coming back from Radix controls (Select, ToggleGroup),
// which always report plain strings.

import { CATEGORIES, OTHER_SOURCES, PRIORITIES, SECTIONS } from "../config";
import type {
  Category,
  LedgerView,
  OtherSource,
  OwnFilter,
  Priority,
  Section,
  TimeState,
} from "../types";

/** True when `value` is one of `options`. */
export function oneOf<T extends string>(
  options: readonly T[],
  value: string,
): value is T {
  return options.some((option) => option === value);
}

const SECTION_KEYS: readonly Section[] = SECTIONS.map((s) => s.key);
const OTHER_SOURCE_KEYS: readonly OtherSource[] = OTHER_SOURCES.map(
  (s) => s.key,
);
const OWN_FILTERS: readonly OwnFilter[] = ["all", "owned", "missing"];
const LEDGER_VIEWS: readonly LedgerView[] = ["table", "grid"];
const TIME_STATES: readonly TimeState[] = [
  "UPCOMING",
  "ACTIVE",
  "EXPIRED",
  "UNDATED",
];

export const isSection = (v: string): v is Section => oneOf(SECTION_KEYS, v);
export const isCategory = (v: string): v is Category => oneOf(CATEGORIES, v);
export const isOtherSource = (v: string): v is OtherSource =>
  oneOf(OTHER_SOURCE_KEYS, v);
export const isPriority = (v: string): v is Priority => oneOf(PRIORITIES, v);
export const isOwnFilter = (v: string): v is OwnFilter => oneOf(OWN_FILTERS, v);
export const isLedgerView = (v: string): v is LedgerView =>
  oneOf(LEDGER_VIEWS, v);
export const isTimeState = (v: string): v is TimeState => oneOf(TIME_STATES, v);
