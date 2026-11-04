import React, { useState } from 'react';
import { Sliders, PlusCircle, RotateCcw, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import {
  EXACT_ASSIGNMENT_DATA,
  SCENARIO_ACTIVE_LOW,
  SCENARIO_ALL_NORMAL,
  SCENARIO_EMPTY
} from '../data/mockData';

export default function ScenarioSimulator({ currentReadings, onDatasetChange, onAddReading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customLevel, setCustomLevel] = useState(15);
  const [customTime, setCustomTime] = useState('22:00');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const levelNum = Number(customLevel);
    if (isNaN(levelNum) || levelNum < 0 || levelNum > 100) return;

    const newReading = {
      timestamp: `2026-11-02T${customTime}:00`,
      level_percent: levelNum
    };
    onAddReading(newReading);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 shadow-sm border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Scenario & Telemetry Simulator</h4>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700/50">
                QA / Reviewer Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Switch test scenarios or simulate sensor input to verify active vs historical alert logic
            </p>
          </div>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onDatasetChange(EXACT_ASSIGNMENT_DATA, 'assignment')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Default Mock (Historical 18% Dip)
          </button>

          <button
            onClick={() => onDatasetChange(SCENARIO_ACTIVE_LOW, 'active_low')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/90 hover:bg-rose-500 text-white transition-all shadow-xs flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Active Low Level (12%)
          </button>

          <button
            onClick={() => onDatasetChange(SCENARIO_ALL_NORMAL, 'normal')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-xs"
          >
            All Normal (No Alert)
          </button>

          <button
            onClick={() => onDatasetChange(SCENARIO_EMPTY, 'empty')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-xs"
          >
            Empty Dataset
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            {isOpen ? 'Close Custom Tool' : '+ Custom Reading'}
          </button>
        </div>
      </div>

      {/* Expandable Custom Reading Injector */}
      {isOpen && (
        <form
          onSubmit={handleCustomSubmit}
          className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Time (2026-11-02)
            </label>
            <input
              type="text"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="22:00"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Water Level (0 - 100%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={customLevel}
              onChange={(e) => setCustomLevel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Append Reading
          </button>

          <button
            type="button"
            onClick={() => onDatasetChange(EXACT_ASSIGNMENT_DATA, 'reset')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Assignment Mock
          </button>
        </form>
      )}
    </div>
  );
}
