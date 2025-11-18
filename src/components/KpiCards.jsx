import { TrendingUp, Activity, CheckCircle2, RefreshCw, ShieldCheck, Bug } from "lucide-react";

export default function KpiCards({ data = [], onClick }) {
  const iconMap = {
    Velocity: TrendingUp,
    Throughput: Activity,
    "Commitment completion %": CheckCircle2,
    "Rollover rate %": RefreshCw,
    "DoR compliance %": ShieldCheck,
    "Bug ratio": Bug,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {data.map((kpi) => {
        const Icon = iconMap[kpi.label] || Activity;
        return (
          <button
            key={kpi.label}
            className="group text-left p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition"
            title={kpi.help}
            onClick={() => onClick?.(kpi)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-700">
                <Icon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{kpi.label}</span>
              </div>
              {kpi.delta !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${kpi.delta >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}> 
                  {kpi.delta >= 0 ? '+' : ''}{kpi.delta}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
            <div className="text-[11px] text-slate-500 mt-1">Click for details</div>
          </button>
        );
      })}
    </div>
  );
}
