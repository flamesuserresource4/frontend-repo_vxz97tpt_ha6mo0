import { useMemo } from "react";

export function VelocityChart({ data = [], onClickBar }) {
  // Minimal SVG column chart
  const max = useMemo(() => Math.max(1, ...data.map(d => d.completed)), [data]);
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-semibold text-slate-800">Velocity</h3>
        <span className="text-xs text-slate-500">Story points per {data?.[0]?.key?.toLowerCase()?.includes('week') ? 'week' : 'sprint'}</span>
      </div>
      <div className="h-48 flex items-end gap-2">
        {data.map((d, i) => {
          const h = (d.completed / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer" onClick={() => onClickBar?.(d)}>
              <div className="w-full bg-blue-100 rounded-t" style={{ height: `${h}%` }}>
                <div className="w-full h-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t group-hover:brightness-110 transition" />
              </div>
              <div className="text-[10px] text-slate-500 mt-1 truncate w-full text-center" title={d.key}>{d.key}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CommitmentChart({ data = [], onClickBar }) {
  const max = useMemo(() => Math.max(1, ...data.map(d => Math.max(d.committed, d.completed))), [data]);
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-semibold text-slate-800">Commitment vs Completion</h3>
        <span className="text-xs text-slate-500">Story points</span>
      </div>
      <div className="h-48 grid grid-cols-12 gap-2">
        {data.map((d, i) => {
          const h1 = (d.committed / max) * 100;
          const h2 = (d.completed / max) * 100;
          return (
            <div key={i} className="col-span-3 sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1 flex flex-col items-center">
              <div className="w-2/3 flex items-end gap-1 cursor-pointer" onClick={() => onClickBar?.(d)}>
                <div className="flex-1 bg-amber-200 rounded-t" style={{ height: `${h1}%` }}>
                  <div className="w-full h-full bg-amber-500 rounded-t" />
                </div>
                <div className="flex-1 bg-emerald-200 rounded-t" style={{ height: `${h2}%` }}>
                  <div className="w-full h-full bg-emerald-500 rounded-t" />
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 truncate w-full text-center" title={d.sprint}>{d.sprint}</div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-amber-500 rounded-sm" /> Committed</div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-emerald-500 rounded-sm" /> Completed</div>
      </div>
    </div>
  );
}

export function RolloverTrend({ data = [], onClickPoint }) {
  const max = Math.max(1, ...data.map(d => d.percent));
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-semibold text-slate-800">Rollover Trend</h3>
        <span className="text-xs text-slate-500">% of committed points</span>
      </div>
      <svg viewBox="0 0 100 40" className="w-full h-44">
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          points={data.map((d, i) => `${(i / Math.max(1, data.length - 1)) * 100},${40 - (d.percent / max) * 35 - 2}`).join(" ")}
        />
        {data.map((d, i) => {
          const x = (i / Math.max(1, data.length - 1)) * 100;
          const y = 40 - (d.percent / max) * 35 - 2;
          return (
            <circle key={i} cx={x} cy={y} r="1.8" fill="#1d4ed8" className="cursor-pointer" onClick={() => onClickPoint?.(d)} />
          );
        })}
      </svg>
    </div>
  );
}
