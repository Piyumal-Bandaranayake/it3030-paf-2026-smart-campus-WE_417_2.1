import { useState, useEffect } from "react";
import { 
  Ticket as TicketIcon, 
  Search, 
  RefreshCw, 
  MapPin, 
  Tag, 
  Clock, 
  InboxIcon,
  ChevronDown,
  Paperclip,
  Trash2,
  ChevronRight,
  User as UserIcon,
  MessageCircle
} from "lucide-react";
import api from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import CommentSection from "../components/CommentSection";

const STATUS_CFG = {
  All:         { dot: "#6366f1", bg: "rgba(99,102,241,0.05)", border: "rgba(99,102,241,0.1)",  text: "#818cf8" },
  Open:        { dot: "#6366f1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.2)",  text: "#818cf8" },
  "In Progress": { dot: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", text: "#fbbf24" },
  Resolved:    { dot: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", text: "#34d399" },
  Rejected:    { dot: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)",   text: "#f87171" },
  Closed:      { dot: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", text: "#94a3b8" },
};

const PRIORITY_CFG = {
  low:      { label: "Low",      color: "#22c55e" },
  medium:   { label: "Medium",   color: "#f59e0b" },
  high:     { label: "High",     color: "#f97316" },
  critical: { label: "Critical", color: "#ef4444" },
};

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/tickets");
      setTickets(response.data || []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    loadTickets();
  }, []);

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    return (
      (!q ||
      t.ticketId.toLowerCase().includes(q) ||
      t.resource.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)) &&
      t.status !== "Closed"
    );
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <header className="mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Campus <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Collaborations</span></h1>
              <p className="mt-2 text-slate-400 font-medium font-inter text-sm">Join the discussion on maintenance and operational status updates across SLIIT.</p>
            </div>
            <button
              onClick={loadTickets}
              className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by ID, resource, or category..."
                    className="w-full rounded-2xl border border-white/5 bg-slate-900/50 py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none transition-all"
                />
            </div>
            <div className="text-xs font-black text-slate-500 tracking-[0.1em] uppercase">
                Active Discussions: <span className="text-indigo-400">{filtered.length}</span>
            </div>
        </div>

        {/* Content */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                <div className="relative mb-6">
                    <RefreshCw size={48} className="animate-spin opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                    </div>
                </div>
                <p className="text-xs font-black tracking-[0.3em] uppercase opacity-40">Synchronizing...</p>
            </div>
        ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[48px] border border-white/5 bg-slate-900/20 py-32 text-slate-500">
                <InboxIcon size={64} strokeWidth={1} className="opacity-10 mb-6" />
                <p className="text-xl font-bold text-slate-300">No entries found</p>
                <p className="text-sm font-medium opacity-40 mt-1">Try a different search term or category.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
                {filtered.map((ticket) => {
                    const statusCfg = STATUS_CFG[ticket.status] || STATUS_CFG.Open;
                    const priorityCfg = PRIORITY_CFG[ticket.priority] || { label: ticket.priority, color: "#94a3b8" };
                    const date = new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                    const isExpanded = expandedId === ticket.id;

                    return (
                        <div 
                            key={ticket.id}
                            className={`group relative flex flex-col rounded-[40px] border transition-all duration-500 ease-out ${isExpanded ? "border-indigo-500/40 bg-slate-900 shadow-2xl shadow-indigo-500/10 z-10" : "border-white/5 bg-slate-900/40 hover:border-white/10 hover:bg-slate-900/60"}`}
                        >
                            <div className="p-10">
                                <div className="mb-8 flex items-start justify-between">
                                    <div className="space-y-4">
                                        <div className="inline-flex rounded-xl bg-indigo-500/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 border border-indigo-500/20 shadow-sm">
                                            {ticket.ticketId}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-colors ${statusCfg.text === "#818cf8" ? "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" : statusCfg.text === "#fbbf24" ? "text-warning bg-amber-400/10 border-amber-400/20 text-amber-400" : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"}`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${isExpanded ? "animate-pulse" : ""} bg-current`} />
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-40" style={{ color: priorityCfg.color }}>Severity</div>
                                        <div className="text-xs font-black text-white uppercase tracking-wider">{priorityCfg.label}</div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white leading-tight tracking-tight">{ticket.resource}</h3>
                                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-tight">
                                        <MapPin size={14} className="text-indigo-400" />
                                        {ticket.location}
                                    </div>
                                </div>

                                <p className={`mb-10 text-[13px] leading-relaxed text-slate-400 font-inter ${isExpanded ? "" : "line-clamp-3"}`}>
                                    {ticket.description}
                                </p>

                                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-black uppercase tracking-[0.1em]">
                                        <Clock size={12} />
                                        {date}
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                                            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${isExpanded ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"}`}
                                        >
                                            {isExpanded ? (
                                                <>Close Hub</>
                                            ) : (
                                                <>
                                                    <MessageCircle size={16} />
                                                    Collaborate
                                                    <ChevronRight size={14} className="opacity-40" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="animate-in fade-in slide-in-from-top-6 duration-700">
                                        <CommentSection ticketId={ticket.id} user={user} />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </main>
    </div>
  );
}
