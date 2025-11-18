import { Search, Bell, Settings, ChevronDown, User } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">A</div>
          <div>
            <div className="text-slate-900 font-semibold leading-tight">Agile Analytics</div>
            <div className="text-slate-500 text-xs -mt-0.5">Insights for Jira & Azure DevOps</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search teams, sprints, items..."
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm text-slate-700">Alex</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
