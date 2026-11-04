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
import { Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isBelow = data.level_percent < LOW_LEVEL_THRESHOLD;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[140px]">
        <p className="text-slate-400 font-mono text-[11px] mb-1">Time: {formatTime(data.timestamp)}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-slate-200">Level:</span>
          <span className={`text-sm font-bold ${isBelow ? 'text-rose-400' : 'text-cyan-400'}`}>
            {data.level_percent}%
          </span>
        </div>
        <div className="mt-1 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Status:</span>
          <span className={isBelow ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
            {isBelow ? 'Below Threshold' : 'Safe'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom customized dot that highlights readings < 20%
const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;

  const isBelow = payload.level_percent < LOW_LEVEL_THRESHOLD;

  if (isBelow) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="#ef4444" fillOpacity={0.3} className="animate-ping" />
        <circle cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#ffffff" strokeWidth={2} />
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
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Telemetry History</h3>
          <p className="text-xs text-slate-500">24-Hour Time-Series Level Curve with Safety Limits</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></span>
            Water Level (%)
          </span>
          <span className="flex items-center text-rose-600 font-medium">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500 mr-1.5"></span>
            Low Safety Limit (20%)
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 my-4">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="formattedTime"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Critical 20% Threshold Line */}
              <ReferenceLine
                y={LOW_LEVEL_THRESHOLD}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Threshold 20%',
                  position: 'insideTopLeft',
                  fill: '#ef4444',
                  fontSize: 10,
                  fontWeight: 600
                }}
              />
              <Area
                type="monotone"
                dataKey="level_percent"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#waterGradient)"
                dot={<CustomizedDot />}
                activeDot={{ r: 6, stroke: '#0284c7', strokeWidth: 2, fill: '#ffffff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No chart data available for current selection.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          Sampling Frequency: Every 2 Hours
        </span>
        <span className="text-slate-400">Timezone: Local / Node UTC+0</span>
      </div>
    </div>
  );
}
