import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { getLevelStatus, formatTime, formatDateTime, LOW_LEVEL_THRESHOLD } from '../utils/tankAnalytics';

export default function MetricCards({ metrics }) {
  const {
    hasData,
    latest,
    previous,
    min,
    max,
    delta,
    count,
    isActiveLow
  } = metrics;

  const currentLevel = latest ? latest.level_percent : null;
  const currentStatus = getLevelStatus(currentLevel);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* 1. HERO METRIC: Current Level (5 Columns on Desktop) */}
      <div className="lg:col-span-5 rounded-xl bg-slate-900 border border-slate-800 text-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Primary Telemetry • Current Level
              </span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isActiveLow
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : 'bg-cyan-950 text-cyan-300 border-cyan-800'
            }`}>
              {currentStatus.label}
            </span>
          </div>

          <div className="mt-4 flex items-baseline space-x-3">
            <span className={`text-6xl font-mono font-black tracking-tight ${
              isActiveLow ? 'text-rose-400' : 'text-cyan-400'
            }`}>
              {currentLevel !== null ? `${currentLevel}%` : '--'}
            </span>
            {previous && (
              <div className="flex flex-col">
                <span className={`inline-flex items-center text-xs font-semibold ${
                  delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  {delta > 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : delta < 0 ? (
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : null}
                  {delta > 0 ? `+${delta}%` : `${delta}%`}
                </span>
                <span className="text-[10px] text-slate-400">vs 18:00 reading</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center font-mono">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Last sampled: {latest ? formatTime(latest.timestamp) : '--'}
          </span>
          <span className="text-[11px] text-slate-400">Unit: Hydrostatic %</span>
        </div>
      </div>

      {/* 2. OPERATIONAL ENVELOPE: Min & Max Daily Span (4 Columns on Desktop) */}
      <div className="lg:col-span-4 rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-slate-500" />
              Daily Operational Envelope
            </span>
            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Today's Range
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {/* Today's Minimum */}
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <div className="flex items-center justify-between text-slate-600 text-[11px] font-medium">
                <span>Minimum</span>
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-slate-900">
                  {min ? `${min.level_percent}%` : '--'}
                </span>
                {min && min.level_percent < LOW_LEVEL_THRESHOLD && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded border border-rose-200">
                    &lt; 20%
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-600 mt-1 block font-mono">
                At {min ? formatTime(min.timestamp) : '--'}
              </span>
            </div>

            {/* Today's Maximum */}
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <div className="flex items-center justify-between text-slate-600 text-[11px] font-medium">
                <span>Maximum</span>
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-slate-900">
                  {max ? `${max.level_percent}%` : '--'}
                </span>
                <span className="text-[10px] font-medium text-slate-600">Peak</span>
              </div>
              <span className="text-[10px] text-slate-600 mt-1 block font-mono">
                At {max ? formatTime(max.timestamp) : '--'}
              </span>
            </div>
          </div>

          {/* Visual Envelope Bar */}
          {min && max && (
            <div className="mt-3 pt-2">
              <div className="flex justify-between text-[10px] text-slate-600 mb-1 font-mono">
                <span>0%</span>
                <span className="text-rose-600 font-bold">20% Safety</span>
                <span>100%</span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                {/* 20% danger zone marker */}
                <div className="absolute left-0 top-0 bottom-0 w-[20%] bg-rose-200/50"></div>
                {/* Active min-max span indicator */}
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-400 to-blue-500 rounded-full"
                  style={{
                    left: `${Math.max(0, min.level_percent)}%`,
                    width: `${Math.max(4, max.level_percent - min.level_percent)}%`
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>Spread: {min && max ? `${max.level_percent - min.level_percent}% fluctuation` : '--'}</span>
          <span className="font-mono text-emerald-600">Valid Band</span>
        </div>
      </div>

      {/* 3. SAMPLING & HEARTBEAT METADATA (3 Columns on Desktop) */}
      <div className="lg:col-span-3 rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Telemetry Sync
            </span>
            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Healthy
            </span>
          </div>

          <div className="mt-3 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Last Telemetry:</span>
              <span className="font-mono font-semibold text-slate-800">
                {latest ? formatDateTime(latest.timestamp) : '--'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Sample Frequency:</span>
              <span className="font-mono font-semibold text-slate-800">120 min</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600">Total Samples:</span>
              <span className="font-mono font-semibold text-slate-800">{count} readings</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>Protocol: SCADA / Rest</span>
          <span className="font-mono text-slate-600">4-20mA</span>
        </div>
      </div>
    </div>
  );
}
