import React from 'react';
import { Droplets, AlertOctagon, CheckCircle, Waves } from 'lucide-react';
import { getLevelStatus } from '../utils/tankAnalytics';

export default function TankVisualizer({ level = 0, tankCapacityLitres = 10000 }) {
  const safeLevel = Math.max(0, Math.min(100, level ?? 0));
  const currentVolume = Math.round((safeLevel / 100) * tankCapacityLitres);
  const status = getLevelStatus(safeLevel);
  const isCritical = safeLevel < 20;

  // Visual gradient selection based on condition
  const fillGradientClass = isCritical
    ? 'from-rose-500 via-rose-600 to-red-700'
    : safeLevel < 50
    ? 'from-amber-400 via-amber-500 to-orange-600'
    : 'from-cyan-400 via-blue-500 to-indigo-600';

  const glowClass = isCritical
    ? 'shadow-rose-500/30'
    : 'shadow-blue-500/20';

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Vessel Level Visualization</h3>
          <p className="text-xs text-slate-500">Vertical Cylindrical Unit • Tank-01</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.badgeColor}`}>
          {status.label}
        </span>
      </div>

      {/* Tank Graphic Container */}
      <div className="my-6 flex items-center justify-center">
        <div className="relative flex items-center gap-6">
          {/* Graduation Marks on the Left */}
          <div className="flex flex-col justify-between h-72 py-2 text-[11px] font-semibold text-slate-400 select-none text-right w-12">
            <span className="text-slate-600">100%</span>
            <span>75%</span>
            <span>50%</span>
            <span className="text-rose-600 font-bold flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              20%
            </span>
            <span>0%</span>
          </div>

          {/* Cylindrical Tank Vessel */}
          <div className="relative w-40 sm:w-44 h-72 rounded-3xl p-2.5 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 border-2 border-slate-300 shadow-inner flex flex-col justify-end overflow-hidden ring-4 ring-slate-100">
            {/* 20% Critical Threshold Marker Line */}
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-rose-500 z-20 pointer-events-none opacity-80"
              style={{ bottom: '20%' }}
            >
              <span className="absolute right-2 -top-4 text-[9px] font-bold text-rose-600 bg-rose-50/90 px-1 rounded">
                MIN 20%
              </span>
            </div>

            {/* Graduated Tick lines inside tank */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 opacity-25">
              <div className="border-b border-slate-700 w-full"></div>
              <div className="border-b border-slate-700 w-3/4"></div>
              <div className="border-b border-slate-700 w-full"></div>
              <div className="border-b border-slate-700 w-3/4"></div>
              <div className="border-b border-slate-700 w-full"></div>
            </div>

            {/* Liquid Fill */}
            <div
              className={`w-full rounded-2xl bg-gradient-to-t ${fillGradientClass} shadow-lg transition-all duration-700 ease-out relative overflow-hidden`}
              style={{ height: `${safeLevel}%`, minHeight: safeLevel > 0 ? '12px' : '0' }}
            >
              {/* Subtle Liquid Surface Wave Effect */}
              {safeLevel > 5 && (
                <div className="absolute -top-3 left-0 right-0 h-6 bg-white/25 rounded-full blur-[2px] transform scale-x-125 animate-pulse"></div>
              )}
              {/* Internal Glass Reflection */}
              <div className="absolute top-0 bottom-0 left-2 w-3 bg-white/20 rounded-full blur-[1px]"></div>
            </div>

            {/* Glass Highlights Overlay */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-r from-white/30 via-transparent to-black/10"></div>
          </div>

          {/* Quick Metrics on the Right */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 min-w-[130px]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Reading
              </span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {safeLevel}%
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 min-w-[130px]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Estimated Vol.
              </span>
              <span className="text-sm font-bold text-slate-800">
                {currentVolume.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ 10k L</span>
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 min-w-[130px]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Pump Intake
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Nominal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-blue-500" />
          Sensor: Hydrostatic Pressure Probe
        </span>
        <span className="font-mono text-[11px] text-slate-400">4-20mA Output</span>
      </div>
    </div>
  );
}
