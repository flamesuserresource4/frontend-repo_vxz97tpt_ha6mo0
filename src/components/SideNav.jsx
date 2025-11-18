import { LayoutDashboard, BarChart2, Table2, Settings, Users2 } from "lucide-react";

export default function SideNav({ active = "dashboard" }) {
  const link = (key, label, Icon) => (
    <a
      key={key}
      href="#"
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active === key ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );

  return (
    <aside className="hidden md:block w-64 border-r border-slate-200 bg-white/70 backdrop-blur-sm sticky top-16 h-[calc(100vh-4rem)] p-3">
      <div className="space-y-1">
        {link("dashboard", "Team Dashboard", LayoutDashboard)}
        {link("sprints", "Sprint Detail", Table2)}
        {link("analytics", "Analytics", BarChart2)}
        {link("teams", "Teams", Users2)}
        <div className="h-px bg-slate-200 my-2" />
        {link("settings", "Settings", Settings)}
      </div>
    </aside>
  );
}
