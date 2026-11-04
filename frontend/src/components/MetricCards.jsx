import React from 'react';
import { Gauge, TrendingDown, TrendingUp, ArrowDownRight, ArrowUpRight, Activity, Clock } from 'lucide-react';
import { getLevelStatus, formatTime } from '../utils/tankAnalytics';

export default function MetricCards({ metrics }) {
  const {
    hasData,
    latest,
    previous,
    min,
    max,
    average,
    delta,
    isActiveLow
  } = metrics;

  const currentLevel = latest ? latest.level_percent : null;
  const currentStatus = getLevelStatus(currentLevel);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. LATEST TANK LEVEL */}
      <div className={`relative overflow-hidden rounded-2xl bg-white border p-5 shadow-xs transition-all ${
        isActiveLow ? 'border-rose-300 ring-2 ring-rose-500/20' : 'border-slate-200 hover:border-blue-300'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current Tank Level
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${currentStatus.badgeColor}`}>
            {currentStatus.label}
          </span>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className={`text-4xl font-extrabold tracking-tight ${
            isActiveLow ? 'text-rose-600' : 'text-slate-900'
          }`}>
            {currentLevel !== null ? `${currentLevel}%` : '--'}
          </span>
          {previous && (
            <span className={`inline-flex items-center text-xs font-semibold ${
              delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-amber-600' : 'text-slate-500'
            }`}>
              {delta > 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : delta < 0 ? (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              ) : null}
              {delta > 0 ? `+${delta}%` : `${delta}%`} vs prev
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Last reading: {latest ? formatTime(latest.timestamp) : '--'}
          </span>
          <span className="text-slate-400">Node: Sensor-01</span>
        </div>
      </div>

      {/* 2. TODAY'S MINIMUM LEVEL */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Today's Minimum
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            {min ? `${min.level_percent}%` : '--'}
          </span>
          {min && min.level_percent < 20 && (
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Breached 20%
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Occurred at: {min ? formatTime(min.timestamp) : '--'}
          </span>
          <span className="text-slate-400">Calculated</span>
        </div>
      </div>

      {/* 3. TODAY'S MAXIMUM LEVEL */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Today's Maximum
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            {max ? `${max.level_percent}%` : '--'}
          </span>
          <span className="text-xs font-medium text-slate-500">Peak Capacity</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Occurred at: {max ? formatTime(max.timestamp) : '--'}
          </span>
          <span className="text-slate-400">Calculated</span>
        </div>
      </div>

      {/* 4. DAILY AVERAGE & SAMPLING STATUS */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Daily Average
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            {average !== null ? `${average}%` : '--'}
          </span>
          <span className="text-xs font-medium text-slate-500">Mean Level</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <span>{metrics.count} total samples today</span>
          <span className="text-emerald-600 font-medium">100% Health</span>
        </div>
      </div>
    </div>
  );
}
