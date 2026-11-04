import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, Info, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { formatTime } from '../utils/tankAnalytics';

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
      <div className="rounded-xl border border-slate-300 bg-slate-100 p-4 shadow-2xs flex items-center space-x-3 text-slate-600 font-mono text-xs">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <div>
          <strong className="text-slate-800">TELEMETRY IDLE:</strong> No sensor readings currently loaded. Select a test dataset in the simulation console.
        </div>
      </div>
    );
  }

  // 1. ACTIVE CRITICAL ALERT (Current reading < 20%)
  if (isActiveLow) {
    return (
      <div className="rounded-xl border-2 border-rose-500 bg-rose-950/20 p-4.5 shadow-sm text-slate-900 border-l-8 border-l-rose-600">
        <div className="flex items-start space-x-3.5">
          <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 mt-0.5 shadow-xs">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
                CRITICAL EMERGENCY • ACTIVE ALARM
              </span>
              <span className="text-xs font-mono text-rose-800 font-medium">
                Sensor Breach at {formatTime(latest.timestamp)}
              </span>
            </div>
            <h3 className="text-base font-bold text-rose-950 mt-1">
              Active Low Level Breach: Current Storage at {latest.level_percent}% (&lt; 20% Threshold)
            </h3>
            <p className="text-xs text-rose-900 mt-0.5 leading-relaxed">
              Tank volume has dropped below the safety limit of 20%. Automated intake valve and pump sequencing required to avoid pump cavitation and air intake.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. HISTORICAL LOW-LEVEL EVENT (Earlier dipped below 20%, but currently recovered)
  if (isHistoricalOnlyAlert) {
    const earliestDip = historicalLowEvents[0] || min;
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4.5 shadow-2xs text-slate-900 border-l-8 border-l-amber-500">
        <div className="flex items-start space-x-3.5">
          <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                HISTORICAL EVENT LOGGED
              </span>
              <span className="inline-flex items-center text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                Active Emergency Suppressed (System Recovered)
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Prior Low-Level Dip Recorded: Tank reached {earliestDip.level_percent}% at {formatTime(earliestDip.timestamp)}
            </h3>
            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
              Telemetry records show an earlier drop below the 20% limit today at 16:00. The water level has since safely recovered to{' '}
              <strong className="text-slate-900 font-mono font-bold">{latest.level_percent}%</strong> at {formatTime(latest.timestamp)}. No active emergency alarm is triggered.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. NORMAL OPTIMAL STATE
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center justify-between text-slate-700 border-l-4 border-l-emerald-500">
      <div className="flex items-center space-x-3">
        <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-mono font-bold text-slate-900 uppercase">
            System Operating Envelope: Nominal
          </h4>
          <p className="text-xs text-slate-500">
            Water level is at {latest.level_percent}%. All safety limits satisfied; zero unacknowledged breach events.
          </p>
        </div>
      </div>
      <span className="hidden sm:inline-flex items-center text-[11px] font-mono text-slate-400">
        SCADA OK
      </span>
    </div>
  );
}
