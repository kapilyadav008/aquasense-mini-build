import React from 'react';
import { Droplets, AlertOctagon, CheckCircle2, Waves, Gauge } from 'lucide-react';
import { getLevelStatus, LOW_LEVEL_THRESHOLD } from '../utils/tankAnalytics';

export default function TankVisualizer({ level = 0, tankCapacityLitres = 10000 }) {
  const safeLevel = Math.max(0, Math.min(100, level ?? 0));
  const currentVolume = Math.round((safeLevel / 100) * tankCapacityLitres);
  const status = getLevelStatus(safeLevel);
  const isCritical = safeLevel < LOW_LEVEL_THRESHOLD;

  // Industrial color mapping
  const liquidGradient = isCritical
    ? 'from-rose-600 via-rose-500 to-red-700'
    : safeLevel < 50
    ? 'from-amber-500 via-amber-400 to-orange-600'
    : 'from-cyan-400 via-cyan-500 to-blue-600';

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Vessel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Vessel Primary Unit
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
              VT-01
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">Vertical Hydrostatic Storage</h3>
        </div>

        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${status.badgeColor}`}>
          {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse"></span>}
          {status.label}
        </span>
      </div>

      {/* Main Industrial Vessel Render */}
      <div className="my-6 flex items-center justify-center">
        <div className="relative flex items-center gap-5 sm:gap-7">
          {/* Left Graduation Scale */}
          <div className="flex flex-col justify-between h-72 py-1 text-[11px] font-mono font-semibold text-slate-400 select-none text-right w-12">
            <div className="flex items-center justify-end gap-1.5">
              <span>100%</span>
              <span className="w-2 h-px bg-slate-300"></span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span>75%</span>
              <span className="w-1.5 h-px bg-slate-200"></span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span>50%</span>
              <span className="w-2 h-px bg-slate-300"></span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-rose-600 font-bold">
              <span>20%</span>
              <span className="w-3 h-px bg-rose-500"></span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span>0%</span>
              <span className="w-2 h-px bg-slate-300"></span>
            </div>
          </div>

          {/* Tank Column Visual */}
          <div className="relative w-36 sm:w-44 h-72 rounded-2xl p-2 bg-slate-900 border-2 border-slate-700 shadow-lg flex flex-col justify-end overflow-hidden ring-4 ring-slate-100">
            {/* 20% Critical Warning Line */}
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-rose-500 z-20 pointer-events-none opacity-90"
              style={{ bottom: '20%' }}
            >
              <span className="absolute right-2 -top-4 text-[9px] font-mono font-bold text-rose-400 bg-slate-950/90 px-1 py-0.2 rounded border border-rose-800">
                CRIT 20%
              </span>
            </div>

            {/* Inner Depth Grid Lines */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 opacity-20">
              <div className="border-b border-cyan-300 w-full"></div>
              <div className="border-b border-cyan-300 w-2/3"></div>
              <div className="border-b border-cyan-300 w-full"></div>
              <div className="border-b border-cyan-300 w-2/3"></div>
              <div className="border-b border-cyan-300 w-full"></div>
            </div>

            {/* Liquid Fill Element */}
            <div
              className={`w-full rounded-xl bg-gradient-to-t ${liquidGradient} transition-all duration-700 ease-out relative overflow-hidden`}
              style={{ height: `${safeLevel}%`, minHeight: safeLevel > 0 ? '12px' : '0' }}
            >
              {/* Liquid Surface Ripple Shimmer */}
              {safeLevel > 4 && (
                <div className="absolute -top-2 left-0 right-0 h-4 bg-white/30 rounded-full blur-[1px] transform scale-x-125 animate-pulse"></div>
              )}
              {/* Internal Meniscus Glow */}
              <div className="absolute top-0 bottom-0 left-2 w-2.5 bg-white/20 rounded-full blur-[1px]"></div>
            </div>
          </div>

          {/* Technical Telemetry Readout Box on the Right */}
          <div className="flex flex-col justify-center space-y-3">
            <div className="bg-slate-900 text-white rounded-lg p-3 border border-slate-800 min-w-[130px] shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Current Level
              </span>
              <span className={`text-3xl font-mono font-bold tracking-tight ${
                isCritical ? 'text-rose-400' : 'text-cyan-400'
              }`}>
                {safeLevel}%
              </span>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 min-w-[130px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                Estimated Volume
              </span>
              <span className="text-sm font-mono font-bold text-slate-900 block mt-0.5">
                {currentVolume.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">L</span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono">of 10,000L rated</span>
            </div>

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 min-w-[130px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                Probe State
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Calibrated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Vessel Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <Gauge className="w-3.5 h-3.5 text-cyan-600" />
          Sensor: Hydrostatic Pressure
        </span>
        <span className="font-mono text-[10px] text-slate-400">Loop: 4-20mA DC</span>
      </div>
    </div>
  );
}
