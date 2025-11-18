import { useMemo, useState } from "react";
import { ArrowDownUp, Download } from "lucide-react";

export default function SprintTable({ rows = [], onClickRow }) {
  const [sort, setSort] = useState({ key: "sprint", dir: "asc" });
  const [q, setQ] = useState("");
  const [minRollover, setMinRollover] = useState(0);

  const filtered = useMemo(() => {
    return rows
      .filter(r => r.sprint.toLowerCase().includes(q.toLowerCase()))
      .filter(r => r.rollover_percent >= Number(minRollover))
      .sort((a, b) => {
        const dir = sort.dir === "asc" ? 1 : -1;
        const va = a[sort.key];
        const vb = b[sort.key];
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
  }, [rows, q, minRollover, sort]);

  const toggleSort = (key) => {
    setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const exportCsv = () => {
    const headers = [
      'Sprint name','Start date','End date','Committed','Completed','Commitment %','Rolled over','Rollover %','DoR %','Bugs created','Items reopened'
    ];
    const lines = filtered.map(r => [
      r.sprint, r.start, r.end, r.committed, r.completed, r.completion_percent, r.rollover_points, r.rollover_percent, r.dor_compliance_percent, r.bugs_created, r.items_reopened
    ].join(','));
    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sprint_overview.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const Header = ({ label, keyName }) => (
    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer" onClick={() => toggleSort(keyName)}>
      <div className="inline-flex items-center gap-1">{label}<ArrowDownUp className="h-3 w-3" /></div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="p-3 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search sprint name" className="px-3 py-2 border rounded-lg text-sm" />
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <label>Show only sprints with Rollover % greater than</label>
            <input type="number" value={minRollover} onChange={e => setMinRollover(e.target.value)} className="w-20 px-2 py-1 border rounded" />
          </div>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <Header label="Sprint" keyName="sprint" />
              <Header label="Start date" keyName="start" />
              <Header label="End date" keyName="end" />
              <Header label="Committed SP" keyName="committed" />
              <Header label="Completed SP" keyName="completed" />
              <Header label="Commitment %" keyName="completion_percent" />
              <Header label="Rolled-over SP" keyName="rollover_points" />
              <Header label="Rollover %" keyName="rollover_percent" />
              <Header label="DoR %" keyName="dor_compliance_percent" />
              <Header label="Bugs created" keyName="bugs_created" />
              <Header label="Reopened" keyName="items_reopened" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t hover:bg-slate-50 cursor-pointer" onClick={() => onClickRow?.(r)}>
                <td className="px-3 py-2 font-medium text-slate-700">{r.sprint}</td>
                <td className="px-3 py-2 text-slate-600">{r.start}</td>
                <td className="px-3 py-2 text-slate-600">{r.end}</td>
                <td className="px-3 py-2">{r.committed}</td>
                <td className="px-3 py-2">{r.completed}</td>
                <td className="px-3 py-2">{r.completion_percent}%</td>
                <td className="px-3 py-2">{r.rollover_points}</td>
                <td className="px-3 py-2">{r.rollover_percent}%</td>
                <td className="px-3 py-2">{r.dor_compliance_percent}%</td>
                <td className="px-3 py-2">{r.bugs_created}</td>
                <td className="px-3 py-2">{r.items_reopened}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
