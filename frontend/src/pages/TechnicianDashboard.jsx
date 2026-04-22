import React, { useState, useEffect } from 'react';
import { Shield, Hammer, LogOut, Settings, ClipboardList, AlertCircle, Bell, Clock, CheckCircle2, InboxIcon, Ticket, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import UserNotificationPanel from '../components/UserNotificationPanel';
import { formatDistanceToNow } from "date-fns";

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "tasks"
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user.name) return;
        const res = await api.get(`/api/tickets?technicianEmail=${encodeURIComponent(user.email)}`);
        setTickets(res.data || []);
      } catch (err) {
        console.error("Failed to fetch technician tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchActivity = async () => {
      try {
        if (!user.email) return;
        setLoadingActivity(true);
        const res = await api.get(`/api/notifications/user/${encodeURIComponent(user.email)}`);
        setActivity((res.data || []).slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setLoadingActivity(false);
      }
    };
    fetchTasks();
    fetchActivity();
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [user.name, user.email]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleResolve = async () => {
    if (!selectedTicket || !resolutionNote) return;
    try {
      await api.put(`/api/tickets/${selectedTicket.id}/status`, {
        status: "Resolved",
        resolutionNote: resolutionNote
      });
      setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: "Resolved", resolutionNote } : t));
      setIsResolveModalOpen(false);
      setSelectedTicket(null);
      setResolutionNote("");
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open": return { bg: "bg-amber-500/10", text: "text-amber-400" };
      case "In Progress": return { bg: "bg-indigo-500/10", text: "text-indigo-400" };
      case "Resolved": return { bg: "bg-emerald-500/10", text: "text-emerald-400" };
      default: return { bg: "bg-slate-500/10", text: "text-slate-400" };
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans">
      {/* Sidebar Placeholder */}
      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl z-50">
        <div className="flex h-20 items-center gap-3 px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
            <Shield size={20} color="white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Tech<span className="text-amber-400">Portal</span></span>
        </div>
        <nav className="mt-10 space-y-2 px-4 text-slate-400">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab("tasks")}
            className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all ${activeTab === 'tasks' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <ClipboardList size={20} />
            <span>Assigned Tasks</span>
            {tickets.filter(t => t.status !== 'Resolved').length > 0 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                {tickets.filter(t => t.status !== 'Resolved').length}
              </span>
            )}
          </button>
        </nav>
        <div className="absolute bottom-0 w-full p-6">
           <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all">
             <LogOut size={14} /> Sign Out
           </button>
        </div>
      </aside>

      <main className="ml-72 flex-1 p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-slate-950 to-slate-950">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {activeTab === 'overview' ? 'Technician Overview' : 'Assigned Tasks'}
            </h1>
            <p className="mt-2 text-slate-400 font-medium">Welcome, {user.name || "Technician"}. Your assigned maintenance tasks.</p>
          </div>
          <div className="flex items-center">
            <UserNotificationPanel onNavigate={(view) => setActiveTab(view === 'tickets' ? 'tasks' : 'overview')} />
          </div>
        </header>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Stats */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 rounded-[32px] bg-slate-900/40 border border-white/5 flex items-center gap-6 group hover:bg-amber-500/5 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock size={28} />
                </div>
                <div>
                  <div className="text-2xl font-black">{tickets.filter(t => t.status !== 'Resolved').length}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Tasks</div>
                </div>
              </div>
              <div className="p-8 rounded-[32px] bg-slate-900/40 border border-white/5 flex items-center gap-6 group hover:bg-emerald-500/5 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <div className="text-2xl font-black">{tickets.filter(t => t.status === 'Resolved').length}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resolved Today</div>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="lg:col-span-2">
              <section className="rounded-[32px] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl h-full">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Recent Task Activity</h2>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-amber-400">
                    <Bell size={16} />
                  </div>
                </div>
                
                {loadingActivity ? (
                  <div className="flex items-center justify-center py-20 text-slate-500 text-sm italic">Retrieving logs...</div>
                ) : activity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-30">
                    <InboxIcon size={40} />
                    <p className="font-medium text-sm">No recent activity logs</p>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {activity.map((n) => {
                      const isTicket = n.type === "TICKET_UPDATE" || n.type === "TICKET";
                      const Icon = isTicket ? Ticket : Bell;
                      const colorClass = isTicket ? "text-amber-400" : "text-indigo-400";
                      const bgClass = isTicket ? "bg-amber-400/10" : "bg-indigo-400/10";
                      
                      return (
                        <li key={n.id} className="group flex items-start gap-5">
                          <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 ${bgClass} ${colorClass} transition-transform group-hover:scale-110`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${colorClass}`}>
                                {isTicket ? "Task Update" : "System Alert"}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-slate-800" />
                              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                                <Clock size={11} /> {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                            <div className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">{n.title}</div>
                            <div className="text-sm text-slate-500 line-clamp-1 mt-0.5">{n.message}</div>
                          </div>
                          
                          <button
                            onClick={() => setActiveTab("tasks")}
                            className="self-center flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all hover:bg-amber-600 hover:text-white"
                          >
                            <ArrowRight size={16} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>
          </div>
        ) : (
          /* Schedule / Tasks */
          <div className="lg:col-span-3">
            <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-white">Work Schedule</h3>
                <div className="text-xs font-bold text-amber-400 bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/20">
                  {tickets.length} Active Tickets
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/20 rounded-3xl border border-dashed border-white/5">
                  <p className="text-slate-500 font-medium">No tasks assigned for today yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => {
                    const status = getStatusStyle(ticket.status);
                    return (
                      <div key={ticket.id} className="p-6 rounded-3xl bg-slate-800/30 border border-white/5 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-800/50 transition-all group">
                        <div className={`h-12 w-12 rounded-2xl ${status.bg} ${status.text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <Hammer size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-white">{ticket.resource}</h4>
                            <span className="text-[10px] font-mono text-slate-500">#{ticket.ticketId}</span>
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-1">{ticket.description}</p>
                          {ticket.status === 'Resolved' && ticket.resolutionNote && (
                            <div className="mt-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter block mb-1">Resolution Note</span>
                              <p className="text-[11px] text-slate-300 italic">"{ticket.resolutionNote}"</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                            {ticket.status}
                          </span>
                          {ticket.status !== 'Resolved' ? (
                            <button 
                              onClick={() => { setSelectedTicket(ticket); setIsResolveModalOpen(true); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase hover:bg-emerald-500/20 transition-all border border-emerald-500/20 mt-1"
                            >
                              <CheckCircle2 size={12} /> Resolve
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                               <Settings size={12} /> {ticket.location || 'Unknown'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Resolve Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Resolve Ticket</h3>
                <p className="text-sm text-slate-400">Complete task and add a resolution note.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Resolution Note</label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Describe how the issue was resolved..."
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all min-h-[120px] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsResolveModalOpen(false)}
                  className="flex-1 px-6 py-3.5 rounded-2xl bg-white/5 text-slate-400 text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolve}
                  disabled={!resolutionNote.trim()}
                  className="flex-1 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resolve Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
