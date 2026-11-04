import React, { useState } from 'react';
import { Sliders, PlusCircle, RotateCcw, AlertTriangle, CheckCircle, Terminal, HelpCircle } from 'lucide-react';
import {
  EXACT_ASSIGNMENT_DATA,
  SCENARIO_ACTIVE_LOW,
  SCENARIO_ALL_NORMAL,
  SCENARIO_EMPTY
} from '../data/mockData';

export default function ScenarioSimulator({ onDatasetChange, onAddReading }) {
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
    <div className="rounded-xl bg-slate-950 text-white p-4.5 border border-slate-800 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title & Diagnostic Label */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-mono font-bold tracking-wide uppercase text-slate-200">
                QA Diagnostic &amp; Scenario Simulator
              </h4>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Evaluation Tool
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Toggle mock scenarios to verify historical event recovery vs active alarm suppression
            </p>
          </div>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onDatasetChange(EXACT_ASSIGNMENT_DATA, 'assignment')}
            className="px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Default Mock (18% Historical Dip)
          </button>

          <button
            onClick={() => onDatasetChange(SCENARIO_ACTIVE_LOW, 'active_low')}
            className="px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Active Critical Low (12%)
          </button>

          <button
            onClick={() => onDatasetChange(SCENARIO_ALL_NORMAL, 'normal')}
            className="px-2.5 py-1.5 rounded-md text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            All Normal
          </button>

          <button
            onClick={() => onDatasetChange(SCENARIO_EMPTY, 'empty')}
            className="px-2.5 py-1.5 rounded-md text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            Empty Dataset
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2.5 py-1.5 rounded-md text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-950 border border-cyan-800/80 transition-all"
          >
            {isOpen ? 'Close Custom' : '+ Inject Custom'}
          </button>
        </div>
      </div>

      {/* Expandable Custom Reading Injector */}
      {isOpen && (
        <form
          onSubmit={handleCustomSubmit}
          className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Time (2026-11-02)
            </label>
            <input
              type="text"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="22:00"
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs font-mono text-white focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Water Level (0 - 100%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={customLevel}
              onChange={(e) => setCustomLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs font-mono text-white focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Append Reading
          </button>

          <button
            type="button"
            onClick={() => onDatasetChange(EXACT_ASSIGNMENT_DATA, 'reset')}
            className="px-3.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Assignment Mock
          </button>
        </form>
      )}
    </div>
  );
}
