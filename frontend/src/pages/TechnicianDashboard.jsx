import React from 'react';
import { Shield, Hammer, LogOut, Settings, ClipboardList, AlertCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TechnicianDashboard() {
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
            <Shield size={20} color="white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Tech<span className="text-amber-400">Portal</span></span>
        </div>
        <nav className="mt-10 space-y-2 px-4 text-slate-400">
          <div className="flex items-center gap-4 rounded-2xl bg-amber-600 text-white px-5 py-4 text-sm font-bold shadow-lg shadow-amber-600/20">
            <ClipboardList size={20} />
            <span>Assigned Tasks</span>
          </div>
          <div className="flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold hover:bg-white/5 hover:text-white transition-all cursor-not-allowed opacity-50">
            <Hammer size={20} />
            <span>Equipment Status</span>
          </div>
          <div className="flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold hover:bg-white/5 hover:text-white transition-all cursor-not-allowed opacity-50">
            <AlertCircle size={20} />
            <span>Emergency Tickets</span>
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
            <h1 className="text-4xl font-black text-white">Technician Dashboard</h1>
            <p className="mt-2 text-slate-400 font-medium">Welcome, {user.name || "Technician"}. Your tools are ready.</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
            <Bell size={20} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Today's Schedule</h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 italic">No tasks assigned for today yet.</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">System Alerts</h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 italic">All systems are operational.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
