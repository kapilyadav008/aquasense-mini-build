import React from 'react';
import { getLevelStatus, formatDateTime, formatTime, LOW_LEVEL_THRESHOLD } from '../utils/tankAnalytics';
import { ArrowDownRight, ArrowUpRight, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ReadingsTable({ readings = [] }) {
  if (!readings || readings.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-slate-200 p-8 text-center shadow-xs">
        <p className="text-xs font-mono text-slate-500">No telemetry log entries available for this node.</p>
      </div>
    );
  }

  // Display most recent readings first (chronological reverse)
  const reversedReadings = [...readings].reverse();

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Section */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Telemetry Audit Trail
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
              FIFO Log
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">Sensor Reading History Records</h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            {readings.length} Recorded Readings
          </span>
        </div>
      </div>

      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-6">Timestamp</th>
              <th className="py-3 px-6">Water Level</th>
              <th className="py-3 px-6">Capacity Meter</th>
              <th className="py-3 px-6">Status Indicator</th>
              <th className="py-3 px-6 text-right">Trend vs Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {reversedReadings.map((reading) => {
              const status = getLevelStatus(reading.level_percent);
              const isBelow = reading.level_percent < LOW_LEVEL_THRESHOLD;

              // Calculate delta from chronologically prior reading
              const originalIndex = readings.findIndex((r) => r.timestamp === reading.timestamp);
              const prev = originalIndex > 0 ? readings[originalIndex - 1] : null;
              const delta = prev ? reading.level_percent - prev.level_percent : null;

              return (
                <tr
                  key={reading.timestamp}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isBelow ? 'bg-rose-50/60 border-l-4 border-l-rose-500' : ''
                  }`}
                >
                  {/* Timestamp */}
                  <td className="py-3.5 px-6 font-mono font-medium text-slate-900 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {isBelow ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      )}
                      <span>{formatDateTime(reading.timestamp)}</span>
                    </div>
                  </td>

                  {/* Level Percent */}
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900 whitespace-nowrap">
                    <span className={isBelow ? 'text-rose-600 font-extrabold text-sm' : 'text-slate-800'}>
                      {reading.level_percent}%
                    </span>
                  </td>

                  {/* Mini visual progress bar */}
                  <td className="py-3.5 px-6 min-w-[130px]">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${status.barColor}`}
                        style={{ width: `${Math.min(100, Math.max(0, reading.level_percent))}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${status.badgeColor}`}
                    >
                      {isBelow && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1 animate-pulse"></span>
                      )}
                      {status.label}
                    </span>
                  </td>

                  {/* Trend / Delta */}
                  <td className="py-3.5 px-6 text-right whitespace-nowrap font-mono font-medium text-xs">
                    {delta === null ? (
                      <span className="text-slate-400 flex items-center justify-end">
                        <Minus className="w-3 h-3 mr-0.5" /> Initial
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
                        <Minus className="w-3 h-3 mr-0.5" /> 0%
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
