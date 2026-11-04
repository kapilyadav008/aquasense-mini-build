import React from 'react';
import { Droplets, Radio, RefreshCw, Cpu, Activity, BarChart2, Shield } from 'lucide-react';
import { formatTime } from '../utils/tankAnalytics';

export default function Navbar({ activeTab, onTabChange, lastUpdated, onRefresh, isRefreshing }) {
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'device', label: 'Device Overview', icon: Cpu },
    { id: 'history', label: 'Reading History', icon: BarChart2 }
  ];

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm ring-1 ring-cyan-400/30">
              <Droplets className="w-5 h-5 fill-white/90" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white font-mono">
                  AquaSense
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Industrial OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Smart Infrastructure Water Intelligence</p>
            </div>
          </div>

          {/* Navigation Links / View Switchers */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Device Connectivity Indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <div className="text-[11px] leading-tight text-left">
                <span className="font-mono font-semibold text-slate-200 block">AS-001</span>
                <span className="text-[9px] text-cyan-400 font-mono block">Demo / Connected</span>
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Poll Sensor Telemetry"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-800 transition-all focus:outline-hidden disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
