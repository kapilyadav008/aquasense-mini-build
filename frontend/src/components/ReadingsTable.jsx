import React from 'react';
import { getLevelStatus, formatDateTime, formatTime, LOW_LEVEL_THRESHOLD } from '../utils/tankAnalytics';
import { ArrowDownRight, ArrowUpRight, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ReadingsTable({ readings = [] }) {
  if (!readings || readings.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-xs">
        <p className="text-sm text-slate-500">No telemetry log entries to display.</p>
      </div>
    );
  }

  // Display most recent readings first in the table for quick operational oversight
  const reversedReadings = [...readings].reverse();

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Section */}
      <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Telemetry Log Records</h3>
          <p className="text-xs text-slate-500">Chronological telemetry audit trail with condition markers</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            {readings.length} Logged Readings
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-6">Timestamp</th>
              <th className="py-3.5 px-6">Water Level</th>
              <th className="py-3.5 px-6">Visual Level</th>
              <th className="py-3.5 px-6">Status Indicator</th>
              <th className="py-3.5 px-6 text-right">Trend / Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {reversedReadings.map((reading, index) => {
              const status = getLevelStatus(reading.level_percent);
              const isBelow = reading.level_percent < LOW_LEVEL_THRESHOLD;
              
              // Calculate difference from chronologically previous reading
              const originalIndex = readings.findIndex(r => r.timestamp === reading.timestamp);
              const prev = originalIndex > 0 ? readings[originalIndex - 1] : null;
              const delta = prev ? reading.level_percent - prev.level_percent : null;

              return (
                <tr
                  key={reading.timestamp}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isBelow ? 'bg-rose-50/40' : ''
                  }`}
                >
                  {/* Timestamp */}
                  <td className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {isBelow ? (
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      )}
                      <span>{formatDateTime(reading.timestamp)}</span>
                    </div>
                  </td>

                  {/* Level Percent */}
                  <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                    <span className={isBelow ? 'text-rose-600 font-extrabold' : ''}>
                      {reading.level_percent}%
                    </span>
                  </td>

                  {/* Mini visual progress bar */}
                  <td className="py-4 px-6 min-w-[140px]">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-300 ${status.barColor}`}
                        style={{ width: `${Math.min(100, Math.max(0, reading.level_percent))}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.badgeColor}`}
                    >
                      {isBelow && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse"></span>}
                      {status.label}
                    </span>
                  </td>

                  {/* Trend / Delta */}
                  <td className="py-4 px-6 text-right whitespace-nowrap font-medium text-xs">
                    {delta === null ? (
                      <span className="text-slate-400 flex items-center justify-end">
                        <Minus className="w-3.5 h-3.5 mr-0.5" /> Initial
                      </span>
                    ) : delta > 0 ? (
                      <span className="text-emerald-600 inline-flex items-center justify-end font-semibold">
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +{delta}%
                      </span>
                    ) : delta < 0 ? (
                      <span className="text-amber-600 inline-flex items-center justify-end font-semibold">
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> {delta}%
                      </span>
                    ) : (
                      <span className="text-slate-400 inline-flex items-center justify-end">
                        <Minus className="w-3.5 h-3.5 mr-0.5" /> 0%
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
