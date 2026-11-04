import React from 'react';
import { Cpu, Wifi, Activity, AlertCircle, Info, ShieldCheck, Power } from 'lucide-react';
import { formatDateTime, formatTime } from '../utils/tankAnalytics';

export default function DevicePanel({ latestReading }) {
  const lastCommunication = latestReading ? latestReading.timestamp : null;

  return (
    <div className="rounded-xl bg-slate-900 text-white border border-slate-800 p-5 shadow-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase">Device Telemetry Node</h3>
            <p className="text-[11px] text-slate-400 font-mono">AS-001 • Industrial Controller</p>
          </div>
        </div>

        {/* Demo / Mock connection pill - Clearly labeled simulated */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-[11px] font-semibold text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Demo / Mock Connected</span>
        </div>
      </div>

      {/* Grid of Technical Specifications */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
        {/* Device Name */}
        <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Device Name</span>
          <span className="text-sm font-bold text-slate-100 mt-0.5 block">AquaSense Mini</span>
        </div>

        {/* Device ID */}
        <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Device ID</span>
          <span className="text-sm font-mono font-bold text-cyan-400 mt-0.5 block">AS-001</span>
        </div>

        {/* Last Communication Time */}
        <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Last Communication</span>
          <span className="text-xs font-mono font-semibold text-slate-200 mt-1 block">
            {lastCommunication ? formatDateTime(lastCommunication) : '--'}
          </span>
        </div>

        {/* Pump State - Explicit Mock Notice */}
        <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Pump State</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-slate-500"></span>
            <span className="text-xs font-semibold text-amber-300">Mock / Not Provided</span>
          </div>
        </div>
      </div>

      {/* Transparency / Integrity Notice */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Simulation Mode:</strong> Telemetry reflects the assignment's official 8-point sensor dataset. Pump state is unmonitored by the supplied readings and is marked simulated per assignment specifications.
        </p>
      </div>
    </div>
  );
}
