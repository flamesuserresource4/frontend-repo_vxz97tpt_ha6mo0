import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import TopBar from './components/TopBar'
import SideNav from './components/SideNav'
import KpiCards from './components/KpiCards'
import { VelocityChart, CommitmentChart, RolloverTrend } from './components/Charts'
import SprintTable from './components/Table'
import { ChevronRight, Filter } from 'lucide-react'

function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!ignore) { setData(d); setLoading(false); }})
      .catch(e => { if (!ignore) { setError(e); setLoading(false); }})
    return () => { ignore = true }
  }, [url])

  return { data, loading, error }
}

function FilterBar({ state, setState }) {
  const types = ['Stories', 'Bugs', 'Tasks', 'Epics']
  const toggleType = (t) => {
    const set = new Set(state.item_types)
    if (set.has(t)) set.delete(t); else set.add(t)
    setState(s => ({ ...s, item_types: Array.from(set) }))
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-2 text-slate-700"><Filter className="h-4 w-4"/> Filters</div>
      <div className="h-6 w-px bg-slate-200" />

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase">Item types</span>
        <div className="flex flex-wrap gap-1">
          {types.map(t => (
            <button key={t} onClick={() => toggleType(t)} className={`px-2 py-1 rounded-full text-xs border ${state.item_types.includes(t) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="h-6 w-px bg-slate-200" />
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase">Group</span>
        <select value={state.grouping} onChange={e => setState(s => ({ ...s, grouping: e.target.value }))} className="px-2 py-1 border rounded-lg text-sm">
          <option>By sprint</option>
          <option>By week</option>
          <option>By month</option>
        </select>
      </div>

      <div className="h-6 w-px bg-slate-200" />
      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={state.include_done_only} onChange={e => setState(s => ({ ...s, include_done_only: e.target.checked }))} />
        Include only Done items
      </label>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/WCoEDSwacOpKBjaC/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/70 to-white pointer-events-none" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Team Dashboard</h1>
        <p className="text-slate-600">Alpha Team</p>
      </div>
    </section>
  )
}

function App() {
  const [filters, setFilters] = useState({
    item_types: ['Stories','Bugs','Tasks','Epics'],
    grouping: 'By sprint',
    include_done_only: false,
  })

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const query = new URLSearchParams({
    team_id: 'team-1',
    team_name: 'Alpha Team',
    grouping: filters.grouping,
    include_done_only: String(filters.include_done_only),
    item_types: filters.item_types, // array gets repeated automatically by URLSearchParams
  })
  const url = `${baseUrl}/api/team-dashboard?${query.toString()}`
  const { data, loading, error } = useApi(url)

  const onNavigateSprint = (d) => {
    alert(`Navigate to Sprint Detail for ${d.sprint || d.key}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[16rem,1fr] gap-6">
          <SideNav />

          <main className="py-4">
            <Hero />
            <div className="space-y-6 -mt-6">
              <FilterBar state={filters} setState={setFilters} />

              {loading && (
                <div className="p-6 bg-white rounded-xl border text-slate-600">Loading dashboard…</div>
              )}
              {error && (
                <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">Failed to load: {String(error)}</div>
              )}

              {data && (
                <>
                  <KpiCards data={data.kpis} onClick={(k)=>{ /* Scroll to relevant section later */ }} />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <VelocityChart data={data.velocity} onClickBar={onNavigateSprint} />
                      <CommitmentChart data={data.commitment_vs_completion} onClickBar={onNavigateSprint} />
                    </div>
                    <div className="space-y-6">
                      <RolloverTrend data={data.rollover_trend} onClickPoint={onNavigateSprint} />
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-slate-800">Scope change summary</h3>
                          <a className="inline-flex items-center gap-1 text-sm text-blue-700" href="#"><span>View details</span><ChevronRight className="h-4 w-4"/></a>
                        </div>
                        {data.scope_change && (
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <div className="text-xs text-slate-500">Avg items added</div>
                              <div className="text-xl font-semibold text-slate-900">{data.scope_change.avg_added}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <div className="text-xs text-slate-500">Avg items removed</div>
                              <div className="text-xl font-semibold text-slate-900">{data.scope_change.avg_removed}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <div className="text-xs text-slate-500">Avg net %</div>
                              <div className="text-xl font-semibold text-slate-900">{data.scope_change.avg_net_percent}%</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Sprint overview</h3>
                    <SprintTable rows={data.sprint_rows} onClickRow={onNavigateSprint} />
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
