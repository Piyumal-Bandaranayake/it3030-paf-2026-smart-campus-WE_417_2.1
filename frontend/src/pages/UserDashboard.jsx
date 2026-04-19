import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarCheck,
  Wrench,
  Bell,
  LogOut,
  User,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Plus,
} from "lucide-react";

const quickActions = [
  { icon: Building2, label: "Book a Resource", color: "indigo", bg: "rgba(99,102,241,0.1)" },
  { icon: Wrench,    label: "Report Issue",    color: "amber",  bg: "rgba(245,158,11,0.1)" },
  { icon: CalendarCheck, label: "My Bookings", color: "emerald", bg: "rgba(34,197,94,0.1)"  },
  { icon: Bell,      label: "Notifications",   color: "pink",   bg: "rgba(236,72,153,0.1)" },
];

const recentActivity = [
  { icon: CheckCircle2, color: "text-emerald-400", text: "Room 204 booking confirmed",   time: "2 min ago"  },
  { icon: AlertCircle,  color: "text-amber-400",  text: "Maintenance ticket #45 updated", time: "1 hr ago"  },
  { icon: CalendarCheck,color: "text-indigo-400", text: "Lab B reservation approved",   time: "3 hrs ago"  },
  { icon: Bell,         color: "text-pink-400",   text: "Reminder: Meeting at 3 PM",    time: "5 hrs ago"  },
];

const stats = [
  { label: "Active Bookings",   value: "3",  icon: CalendarCheck, color: "indigo" },
  { label: "Open Tickets",      value: "1",  icon: Wrench,        color: "amber" },
  { label: "Resources Used",    value: "12", icon: Building2,     color: "emerald" },
  { label: "Notifications",     value: "5",  icon: Bell,          color: "pink" },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Good day");
  const recentActivityRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const params = new URLSearchParams(window.location.search);
    if (params.get("login_success") === "true") {
      import("../api/axiosConfig").then(({ default: api }) => {
        api.get("/api/auth/me")
          .then((res) => {
            const userData = res.data;
            sessionStorage.setItem("user", JSON.stringify(userData));
            
            // Redirect based on role
            if (userData.role === "ADMIN") {
              navigate("/admin-dashboard");
            } else {
              setUser(userData);
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          })
          .catch(() => navigate("/login"));
      });
    } else {
      const stored = sessionStorage.getItem("user");
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          setUser(userData);
        }
      } else {
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleSidebarNavigation = (label) => {
    if (label === "Resources") {
      navigate("/resources");
    }

    if (label === "Alerts") {
      recentActivityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!user) return null;

  const firstName = user.name ? user.name.split(" ")[0] : "User";

  return (
    <div className="flex min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl transition-transform lg:translate-x-0">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
            <Building2 size={20} color="white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Smart Campus</span>
        </div>

        <nav className="mt-8 space-y-1 px-3">
          <div className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">Menu</div>
          {[
            { icon: BarChart3,     label: "Dashboard",   active: true  },
            { icon: Building2,     label: "Resources",   active: false },
            { icon: CalendarCheck, label: "Bookings",    active: false },
            { icon: Wrench,        label: "Maintenance", active: false },
            { icon: Bell,          label: "Alerts",      active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              onClick={() => handleSidebarNavigation(label)}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                active 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="mb-4 rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="avatar" className="h-10 w-10 rounded-full border-2 border-indigo-500/50" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                  <User size={20} />
                </div>
              )}
              <div className="overflow-hidden">
                <div className="truncate text-sm font-bold">{user.name}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{user.role || "Student"}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-64 flex-1 p-8">
        {/* Top bar */}
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">{greeting}, {firstName} 👋</h1>
            <p className="mt-1 text-slate-400">Here's what's happening on campus today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-lg">5</span>
            </button>
          </div>
        </header>

        {/* Stats row */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-white/10">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:bg-${color}-500/20 transition-colors`}>
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="text-sm font-medium text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Quick Actions */}
          <section ref={recentActivityRef} className="rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-500">
                <Plus size={14} /> New
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map(({ icon: Icon, label, color, bg }) => (
                <button
                  key={label}
                  className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-left transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{label}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
            </div>
            <ul className="space-y-6">
              {recentActivity.map(({ icon: Icon, color, text, time }, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-300">{text}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <Clock size={10} /> {time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Profile Summary Card */}
        <section className="mt-8 rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="avatar" className="h-24 w-24 rounded-[32px] border-4 border-indigo-500/30 object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-[32px] bg-indigo-500/20 text-indigo-400">
                  <User size={40} />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 border-4 border-slate-900">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-black text-white">{user.name}</div>
              <div className="mt-1 text-indigo-300 font-medium">{user.email}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-500/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/30">
                  {user.role || "Student"}
                </span >
                <span className="rounded-full bg-white/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/10">
                  {user.provider || "Google"} Account
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 border-t border-white/5 pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-8">
              <div className="flex items-center justify-between gap-12">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Member since</span>
                <span className="text-sm font-bold text-white">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between gap-12">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
                <span className="flex items-center gap-2 text-sm font-bold text-green-400">
                  <CheckCircle2 size={14} /> Active
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
