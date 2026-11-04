import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { formatTime, LOW_LEVEL_THRESHOLD } from '../utils/tankAnalytics';
import { Activity, ShieldAlert } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isBelow = data.level_percent < LOW_LEVEL_THRESHOLD;
    return (
      <div className="bg-slate-950 text-white p-3 rounded-lg shadow-xl border border-slate-800 text-xs min-w-[150px]">
        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] pb-1 border-b border-slate-800">
          <span>SAMPLE TIME</span>
          <span className="text-slate-200">{formatTime(data.timestamp)}</span>
        </div>
        <div className="my-2 flex items-baseline justify-between">
          <span className="text-slate-400">Level:</span>
          <span className={`text-base font-mono font-bold ${isBelow ? 'text-rose-400' : 'text-cyan-400'}`}>
            {data.level_percent}%
          </span>
        </div>
        <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Status:</span>
          <span className={`font-mono font-bold ${isBelow ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isBelow ? 'CRITICAL DIP' : 'NOMINAL'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom dot: specially highlights the 18% reading at 16:00
const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;

  const isBelow = payload.level_percent < LOW_LEVEL_THRESHOLD;

  if (isBelow) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={10} fill="#ef4444" fillOpacity={0.25} className="animate-ping" />
        <circle cx={cx} cy={cy} r={6} fill="#dc2626" stroke="#ffffff" strokeWidth={2} />
        {/* Custom text tag for 18% reading */}
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fill="#dc2626"
          fontSize={10}
          fontFamily="monospace"
          fontWeight="bold"
        >
          {payload.level_percent}% DIP
        </text>
      </g>
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={3.5}
      fill="#0284c7"
      stroke="#ffffff"
      strokeWidth={2}
    />
  );
};

export default function HistoryChart({ readings = [] }) {
  const formattedData = readings.map((item) => ({
    ...item,
    formattedTime: formatTime(item.timestamp),
  }));

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Time-Series Telemetry
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
              8 Points Logged
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">24-Hour Tank Level Curve</h3>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="flex items-center text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 mr-1.5"></span>
            Telemetry Curve
          </span>
          <span className="flex items-center text-rose-600 font-semibold">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500 mr-1.5"></span>
            20% Safety Floor
          </span>
        </div>
      </div>

      {/* Chart Viewport */}
      <div className="w-full h-72 my-4">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="industrialCyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="formattedTime"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                fontFamily="monospace"
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                fontFamily="monospace"
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* 20% Threshold Reference Line */}
              <ReferenceLine
                y={LOW_LEVEL_THRESHOLD}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '20% CRITICAL FLOOR',
                  position: 'insideTopLeft',
                  fill: '#dc2626',
                  fontSize: 10,
                  fontFamily: 'monospace',
                  fontWeight: 700
                }}
              />
              <Area
                type="monotone"
                dataKey="level_percent"
                stroke="#0891b2"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#industrialCyanGrad)"
                dot={<CustomizedDot />}
                activeDot={{ r: 6, stroke: '#0891b2', strokeWidth: 2, fill: '#ffffff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 font-mono text-xs">
            No telemetry data loaded.
          </div>
        )}
      </div>

      {/* Chart Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span className="flex items-center gap-1.5 text-[11px]">
          <Activity className="w-3.5 h-3.5 text-cyan-600" />
          16:00 Historic Breach Point: 18% (Highlighted)
        </span>
        <span className="text-[10px] text-slate-400">Node Sync: Normal</span>
      </div>
    </div>
  );
}
