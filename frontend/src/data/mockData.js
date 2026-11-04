/**
 * AquaSense IoT Mock Telemetry Data
 * Contains the exact prompt dataset as default, plus scenarios for testing edge cases.
 */

export const EXACT_ASSIGNMENT_DATA = [
  { timestamp: "2026-11-02T06:00:00", level_percent: 78 },
  { timestamp: "2026-11-02T08:00:00", level_percent: 64 },
  { timestamp: "2026-11-02T10:00:00", level_percent: 51 },
  { timestamp: "2026-11-02T12:00:00", level_percent: 37 },
  { timestamp: "2026-11-02T14:00:00", level_percent: 24 },
  { timestamp: "2026-11-02T16:00:00", level_percent: 18 },
  { timestamp: "2026-11-02T18:00:00", level_percent: 42 },
  { timestamp: "2026-11-02T20:00:00", level_percent: 55 }
];

export const SCENARIO_ACTIVE_LOW = [
  { timestamp: "2026-11-02T06:00:00", level_percent: 78 },
  { timestamp: "2026-11-02T08:00:00", level_percent: 64 },
  { timestamp: "2026-11-02T10:00:00", level_percent: 51 },
  { timestamp: "2026-11-02T12:00:00", level_percent: 37 },
  { timestamp: "2026-11-02T14:00:00", level_percent: 24 },
  { timestamp: "2026-11-02T16:00:00", level_percent: 18 },
  { timestamp: "2026-11-02T18:00:00", level_percent: 15 },
  { timestamp: "2026-11-02T20:00:00", level_percent: 12 } // Active critical low < 20%
];

export const SCENARIO_ALL_NORMAL = [
  { timestamp: "2026-11-02T06:00:00", level_percent: 88 },
  { timestamp: "2026-11-02T08:00:00", level_percent: 82 },
  { timestamp: "2026-11-02T10:00:00", level_percent: 75 },
  { timestamp: "2026-11-02T12:00:00", level_percent: 68 },
  { timestamp: "2026-11-02T14:00:00", level_percent: 62 },
  { timestamp: "2026-11-02T16:00:00", level_percent: 58 },
  { timestamp: "2026-11-02T18:00:00", level_percent: 70 },
  { timestamp: "2026-11-02T20:00:00", level_percent: 79 }
];

export const SCENARIO_EMPTY = [];
