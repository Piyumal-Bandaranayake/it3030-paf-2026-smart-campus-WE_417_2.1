import React from 'react';
import { Shield, LayoutDashboard, LogOut, Settings, Users, Building2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      {/* Sidebar Placeholder */}
      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex h-20 items-center gap-3 px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <Shield size={20} color="white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Manager<span className="text-indigo-400">Portal</span></span>
        </div>
        <nav className="mt-10 space-y-2 px-4 text-slate-400">
          <div className="flex items-center gap-4 rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20">
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </div>
          <div className="flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold hover:bg-white/5 hover:text-white transition-all cursor-not-allowed opacity-50">
            <Building2 size={20} />
            <span>Resource Management</span>
          </div>
          <div className="flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold hover:bg-white/5 hover:text-white transition-all cursor-not-allowed opacity-50">
            <Users size={20} />
            <span>Team Overview</span>
          </div>
        </nav>
        <div className="absolute bottom-0 w-full p-6">
           <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all">
             <LogOut size={14} /> Sign Out
           </button>
        </div>
      </aside>

      <main className="ml-72 flex-1 p-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white">Manager Dashboard</h1>
            <p className="mt-2 text-slate-400 font-medium">Welcome back, {user.name || "Manager"}.</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
            <Bell size={20} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-8 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto">
              <LayoutDashboard size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Performance Metrics</h3>
            <p className="text-sm text-slate-500">System metrics will appear here.</p>
          </div>
          <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-8 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mx-auto">
              <Building2 size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Resource Utilization</h3>
            <p className="text-sm text-slate-500">Usage stats will appear here.</p>
          </div>
          <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-8 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto">
              <Settings size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Operational Tasks</h3>
            <p className="text-sm text-slate-500">Pending approvals will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
