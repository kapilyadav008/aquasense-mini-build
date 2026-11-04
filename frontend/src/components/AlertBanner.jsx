import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, Info, ArrowUpRight } from 'lucide-react';
import { formatTime, formatDateTime } from '../utils/tankAnalytics';

export default function AlertBanner({ metrics }) {
  const {
    hasData,
    latest,
    isActiveLow,
    isHistoricalOnlyAlert,
    historicalLowEvents,
    min
  } = metrics;

  if (!hasData) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex items-center space-x-3 text-slate-600">
        <Info className="w-5 h-5 text-slate-400 shrink-0" />
        <div className="text-sm">
          <span className="font-semibold text-slate-800">Awaiting Telemetry:</span> No sensor readings currently loaded. Please select a dataset or check network connection.
        </div>
      </div>
    );
  }

  // 1. ACTIVE LOW-LEVEL ALERT (Current reading < 20%)
  if (isActiveLow) {
    return (
      <div className="rounded-xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-red-50 p-4 shadow-sm text-rose-950 animate-pulse">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 mt-0.5 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-600 text-white">
                Active Critical Warning
              </span>
              <span className="text-xs text-rose-700 font-medium">
                Triggered at {formatTime(latest.timestamp)}
              </span>
            </div>
            <h3 className="text-base font-bold text-rose-900 mt-1">
              Tank Level Below Threshold: Currently at {latest.level_percent}%
            </h3>
            <p className="text-sm text-rose-700 mt-0.5">
              Current tank capacity has breached the safety minimum of 20%. Automated refill pump sequence should be verified immediately to avoid cavitation or air locking.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. HISTORICAL LOW-LEVEL EVENT NOTIFICATION (Earlier < 20%, but currently recovered >= 20%)
  if (isHistoricalOnlyAlert) {
    const earliestDip = historicalLowEvents[0] || min;
    return (
      <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 p-4 shadow-xs text-amber-950">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                Historical Low Event – Recovered
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Active Alert Cleared
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Historical Dip Recorded: Tank reached {earliestDip.level_percent}% at {formatTime(earliestDip.timestamp)}
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              An earlier reading dropped below the 20% critical threshold, but the water level has since safely recovered to{' '}
              <span className="font-semibold text-slate-900">{latest.level_percent}%</span>. No active low-level alarm is currently required.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. NORMAL OPTIMAL STATE
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between text-slate-700">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">System Normal – All Thresholds Satisfied</h4>
          <p className="text-xs text-slate-500">
            Water level is stable at {latest.level_percent}%. No historical dips or threshold violations detected today.
          </p>
        </div>
      </div>
      <span className="hidden sm:inline-flex items-center text-xs text-slate-400 font-medium">
        Telemetry Synced
      </span>
    </div>
  );
}
