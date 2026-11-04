/**
 * Pure analytical functions for processing tank telemetry.
 * Computes dynamic metrics, thresholds, and alert states.
 */

export const LOW_LEVEL_THRESHOLD = 20;
export const OPTIMAL_LEVEL_THRESHOLD = 50;

/**
 * Formats ISO date string to a concise display string (e.g., "08:00 PM" or "Nov 02, 20:00")
 */
export function formatTime(isoString) {
  if (!isoString) return "--:--";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString) {
  if (!isoString) return "--";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } catch {
    return isoString;
  }
}

/**
 * Analyzes an array of reading objects { timestamp: string, level_percent: number }
 */
export function calculateTankMetrics(rawReadings = []) {
  if (!Array.isArray(rawReadings) || rawReadings.length === 0) {
    return {
      hasData: false,
      count: 0,
      latest: null,
      previous: null,
      min: null,
      max: null,
      average: null,
      delta: 0,
      isActiveLow: false,
      hasHistoricalLow: false,
      isHistoricalOnlyAlert: false,
      historicalLowEvents: [],
      sortedReadings: []
    };
  }

  // Filter valid readings with numeric levels
  const validReadings = rawReadings
    .filter(r => r && typeof r.level_percent === "number" && !isNaN(r.level_percent))
    .slice();

  if (validReadings.length === 0) {
    return {
      hasData: false,
      count: 0,
      latest: null,
      previous: null,
      min: null,
      max: null,
      average: null,
      delta: 0,
      isActiveLow: false,
      hasHistoricalLow: false,
      isHistoricalOnlyAlert: false,
      historicalLowEvents: [],
      sortedReadings: []
    };
  }

  // Sort chronologically ascending
  const sorted = validReadings.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const count = sorted.length;
  const latest = sorted[count - 1];
  const previous = count > 1 ? sorted[count - 2] : null;

  // Calculate dynamic minimum and maximum
  let min = sorted[0];
  let max = sorted[0];
  let sum = 0;
  const historicalLowEvents = [];

  for (const item of sorted) {
    sum += item.level_percent;
    if (item.level_percent < min.level_percent) {
      min = item;
    }
    if (item.level_percent > max.level_percent) {
      max = item;
    }
    if (item.level_percent < LOW_LEVEL_THRESHOLD) {
      historicalLowEvents.push(item);
    }
  }

  const average = Math.round((sum / count) * 10) / 10;
  const delta = previous !== null ? latest.level_percent - previous.level_percent : 0;

  // Alert conditions:
  // 1. Active low: current reading < 20%
  const isActiveLow = latest.level_percent < LOW_LEVEL_THRESHOLD;

  // 2. Has any reading below 20% in the series
  const hasHistoricalLow = historicalLowEvents.length > 0;

  // 3. Historical event notification: earlier reading was < 20%, but latest reading has recovered
  const isHistoricalOnlyAlert = !isActiveLow && hasHistoricalLow;

  return {
    hasData: true,
    count,
    latest,
    previous,
    min,
    max,
    average,
    delta,
    isActiveLow,
    hasHistoricalLow,
    isHistoricalOnlyAlert,
    historicalLowEvents,
    sortedReadings: sorted
  };
}

/**
 * Returns UI classification status and styling metadata for a level percentage
 */
export function getLevelStatus(level) {
  if (level === null || level === undefined || isNaN(level)) {
    return { label: "No Data", badgeColor: "bg-slate-100 text-slate-700 border-slate-300" };
  }
  if (level < LOW_LEVEL_THRESHOLD) {
    return {
      label: "Critical Low",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
      accentColor: "#ef4444",
      barColor: "bg-rose-500"
    };
  }
  if (level < OPTIMAL_LEVEL_THRESHOLD) {
    return {
      label: "Moderate",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
      accentColor: "#f59e0b",
      barColor: "bg-amber-500"
    };
  }
  return {
    label: "Optimal",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
    accentColor: "#0ea5e9",
    barColor: "bg-blue-600"
  };
}
