import React from 'react';
import { Droplet, Radio, RefreshCw, ShieldCheck } from 'lucide-react';
import { formatTime } from '../utils/tankAnalytics';

export default function Navbar({ lastUpdated, onRefresh, isRefreshing }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm ring-4 ring-blue-50">
              <Droplet className="w-5 h-5 fill-white/90" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  AquaSense
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  IoT v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Industrial Tank Monitoring & Telemetry</p>
            </div>
          </div>

          {/* Device Context & Status */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-medium text-slate-500">Monitored Device</span>
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Node: TANK-ALPHA-01
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Radio className="w-3.5 h-3.5 mr-1 text-emerald-600 animate-pulse" />
                Live Feed
              </span>

              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Refresh Telemetry"
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 hover:border-blue-200 transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
