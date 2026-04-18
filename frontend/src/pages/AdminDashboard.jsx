import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users as UsersIcon,
  CalendarCheck,
  Building2,
  LogOut,
  Bell,
  Search,
  Plus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Shield,
  ChevronRight,
  Filter,
} from "lucide-react";

const sidebarLinks = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: UsersIcon },
  { id: "bookings", label: "Booking Management", icon: CalendarCheck },
  { id: "resources", label: "Resource Management", icon: Building2 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      const userData = JSON.parse(stored);
      // In a real app, we'd check if user.role === 'ADMIN'
      setUser(userData);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex h-20 items-center gap-3 px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Shield size={20} color="white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Admin<span className="text-indigo-400">Panel</span></span>
        </div>

        <nav className="mt-10 space-y-2 px-4">
          <div className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Main Menu</div>
          {sidebarLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`group flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all ${
                activeTab === id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} className={activeTab === id ? "text-white" : "group-hover:text-indigo-400 transition-colors"} />
              <span>{label}</span>
              {activeTab === id && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="rounded-3xl bg-white/5 p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
                {user.name?.[0] || "A"}
              </div>
              <div className="overflow-hidden">
                <div className="truncate text-sm font-bold text-white">{user.name || "Admin User"}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Super Admin</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-xs font-bold text-red-400 transition-all hover:bg-red-500/20"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="ml-72 flex-1 p-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white capitalize">{activeTab.replace("-", " ")}</h1>
            <p className="mt-2 text-slate-400 font-medium">Manage your campus operations and data.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="w-64 rounded-2xl border border-white/5 bg-slate-900/50 py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400 transition-all hover:bg-white/10">
              <Bell size={20} />
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Section Rendering */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "overview" && <OverviewSection />}
          {activeTab === "users" && <UserManagementSection />}
          {activeTab === "bookings" && <BookingManagementSection />}
          {activeTab === "resources" && <ResourceManagementSection />}
        </div>
      </main>
    </div>
  );
}

// ── Sub-sections ───────────────────────────────────────────────

function OverviewSection() {
  const stats = [
    { label: "Total Users", value: "1,284", icon: UsersIcon, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Pending Bookings", value: "24", icon: CalendarCheck, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Active Resources", value: "112", icon: Building2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Maintenance Tasks", value: "8", icon: Settings, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl transition-all hover:border-white/10">
            <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg} ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div className="text-3xl font-black text-white">{s.value}</div>
            <div className="mt-1 text-sm font-bold text-slate-500 uppercase tracking-wider">{s.label}</div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10">+12%</span>
              <span className="text-slate-500 font-medium tracking-normal">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[32px] border border-white/5 bg-slate-900/40 p-8">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <button className="text-sm font-bold text-indigo-400">View History</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Clock size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">New Resource Added</div>
                  <div className="text-xs text-slate-500">Auditorium C was registered by Admin</div>
                </div>
                <div className="text-xs text-slate-600 font-medium">2 hours ago</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-8 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-400 mx-auto">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
          <p className="text-sm text-slate-400 mb-8 px-4">Instantly perform administrative tasks with shortcuts.</p>
          <div className="space-y-3">
            <button className="w-full rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white">Add New User</button>
            <button className="w-full rounded-2xl bg-white/5 py-4 text-sm font-bold text-slate-300 border border-white/5 hover:border-white/10 transition-all">Create Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagementSection() {
  const users = [
    { name: "John Doe", email: "john@university.edu", role: "Student", status: "Active" },
    { name: "Sarah Smith", email: "sarah@university.edu", role: "Staff", status: "Active" },
    { name: "Robert Wilson", email: "robert@university.edu", role: "Maintenance", status: "Suspended" },
    { name: "Emma Davis", email: "emma@university.edu", role: "Student", status: "Active" },
  ];

  return (
    <div className="rounded-[32px] border border-white/5 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
      <div className="p-8 flex items-center justify-between border-b border-white/5">
        <h3 className="text-xl font-bold">Registered Users</h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold border border-white/5">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <th className="px-8 py-5">User</th>
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u, i) => (
              <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-slate-400">{u.name[0]}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium text-slate-300">{u.role}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${u.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    <div className={`h-1 w-1 rounded-full ${u.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {u.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingManagementSection() {
  const bookings = [
    { item: "Lecture Hall A", user: "John Doe", date: "May 12, 2024", time: "10:00 AM", status: "Pending" },
    { item: "Projector X", user: "Sarah Smith", date: "May 13, 2024", time: "02:00 PM", status: "Approved" },
    { item: "Meeting Room B", user: "Mike Jones", date: "May 12, 2024", time: "11:30 AM", status: "Rejected" },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <div className="lg:col-span-3 rounded-[32px] border border-white/5 bg-slate-900/40 p-8">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-xl font-bold">Booking Requests</h3>
          <span className="rounded-full bg-indigo-500/10 px-4 py-1 text-[10px] font-black uppercase text-indigo-400 tracking-widest border border-indigo-500/20">12 NEW REQUESTS</span>
        </div>
        <div className="space-y-4">
          {bookings.map((b, i) => (
            <div key={i} className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-white/5 p-6 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 font-bold">{b.item[0]}</div>
                <div>
                  <div className="text-sm font-bold text-white">{b.item}</div>
                  <div className="text-xs text-slate-500">Requested by <span className="text-indigo-400 font-medium">{b.user}</span></div>
                </div>
              </div>
              <div className="flex flex-1 gap-8">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Date & Time</div>
                  <div className="text-xs text-slate-300 font-medium">{b.date} • {b.time}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Status</div>
                  <div className={`text-xs font-bold ${b.status === 'Approved' ? 'text-emerald-400' : b.status === 'Rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                    {b.status}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {b.status === "Pending" && (
                  <>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 size={18} /></button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"><XCircle size={18} /></button>
                  </>
                )}
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all"><MoreVertical size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-8">
        <h3 className="text-lg font-bold mb-6">Booking Stats</h3>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest text-slate-500">
              <span>Approvals</span>
              <span className="text-emerald-400">84%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '84%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest text-slate-500">
              <span>Utilisation</span>
              <span className="text-indigo-400">62%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '62%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceManagementSection() {
  const resources = [
    { name: "Auditorium A", type: "Facility", location: "Building 1", status: "Active" },
    { name: "Projector X", type: "Equipment", location: "Central Hub", status: "Maintenance" },
    { name: "Meeting Room B", type: "Facility", location: "Building 2", status: "Active" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {["All", "Facilities", "Equipment"].map(t => (
            <button key={t} className="rounded-xl border border-white/5 bg-slate-900/50 px-5 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all">{t}</button>
          ))}
        </div>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20">
          <Plus size={18} /> Add New Resource
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((r, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[40px] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl transition-all hover:border-indigo-500/30">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                <Building2 size={24} />
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${r.status === 'Active' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' : 'text-amber-400 border-amber-400/20 bg-amber-400/10'}`}>
                {r.status}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1">{r.name}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6">{r.type} • {r.location}</p>
            <div className="flex gap-3">
              <button className="flex-1 rounded-xl bg-white/5 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 transition-all">Edit Details</button>
              <button className="rounded-xl bg-white/5 px-4 py-3 text-slate-400 hover:text-red-400 transition-all border border-white/5"><Settings size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
