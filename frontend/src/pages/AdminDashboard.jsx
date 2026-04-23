import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
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
  Trash2,
  Shield,
  ChevronRight,
  Filter,
  Ticket,
  MapPin,
  Tag,
  AlertTriangle,
  Paperclip,
  RefreshCw,
  InboxIcon,
  ChevronDown,
} from "lucide-react";
import NotificationPanel from "../components/NotificationPanel";
import ResourceModal from "./Resources/ResourceModal";
import CommentSection from "../components/CommentSection";
import api from "../api/axiosConfig";

const sidebarLinks = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: UsersIcon },
  { id: "bookings", label: "Booking Management", icon: CalendarCheck },
  { id: "resources", label: "Resource Management", icon: Building2 },
  { id: "tickets", label: "Ticket Management", icon: Ticket },
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
              className={`group flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all ${activeTab === id
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
            <NotificationPanel onNavigate={(tab) => setActiveTab(tab)} />
          </div>
        </header>

        {/* Dynamic Section Rendering */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "overview" && <OverviewSection onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === "users" && <UserManagementSection />}
          {activeTab === "bookings" && <BookingManagementSection />}
          {activeTab === "resources" && <ResourceManagementSection />}
          {activeTab === "tickets" && <TicketManagementSection user={user} />}
        </div>
      </main>
    </div>
  );
}

// ── Sub-sections ───────────────────────────────────────────────

function OverviewSection({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/notifications");
        setNotifications((response.data || []).slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch recent notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentNotifications();
  }, []);

  const stats = [
    { label: "Total Users", value: "1,284", icon: UsersIcon, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Pending Bookings", value: "24", icon: CalendarCheck, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Active Resources", value: "112", icon: Building2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Maintenance Tasks", value: "8", icon: Settings, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  const getTab = (type) => {
    switch (type) {
      case "TICKET": return "tickets";
      case "REGISTRATION": return "users";
      case "BOOKING": return "bookings";
      default: return "overview";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "TICKET": return <Ticket size={18} />;
      case "REGISTRATION": return <UsersIcon size={18} />;
      case "BOOKING": return <CalendarCheck size={18} />;
      default: return <Clock size={18} />;
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "TICKET": return { label: "Ticket", cls: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
      case "REGISTRATION": return { label: "New User", cls: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
      case "BOOKING": return { label: "Booking", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
      default: return { label: type, cls: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" };
    }
  };

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
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <span className="text-xs text-slate-500 font-medium">Last 5 events</span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-10 text-slate-500">Loading activity...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 text-slate-500">No recent activity</div>
            ) : (
              notifications.map((n) => {
                const typeStyle = getTypeStyle(n.type);
                return (
                  <div key={n.id} className="flex items-center gap-4 rounded-2xl bg-white/5 px-5 py-4 border border-white/5 hover:border-white/10 transition-all group">
                    {/* Icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.type === "TICKET" ? "bg-amber-400/10 text-amber-400" :
                        n.type === "REGISTRATION" ? "bg-blue-400/10 text-blue-400" :
                          "bg-emerald-400/10 text-emerald-400"
                      }`}>
                      {getIcon(n.type)}
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${typeStyle.cls}`}>
                          {typeStyle.label}
                        </span>
                        <span className="text-[10px] text-slate-600 font-medium">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white">{n.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{n.message}</div>
                    </div>
                    {/* View button */}
                    <button
                      onClick={() => onNavigate && onNavigate(getTab(n.type))}
                      className="shrink-0 flex items-center gap-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-3 py-2 text-[11px] font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      View <ChevronRight size={12} />
                    </button>
                  </div>
                );
              })
            )}
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
  const [users, setUsers] = useState([]);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", role: "USER" });
  const [addingUser, setAddingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/users");
      setUsers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Unable to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      alert("Please fill in at least name and email.");
      return;
    }

    try {
      setAddingUser(true);
      const response = await api.post("/api/users", newUser);
      setUsers((prev) => [...prev, response.data]);
      setAddUserModalOpen(false);
      setNewUser({ name: "", email: "", phone: "", role: "USER" });
      alert("User added successfully! They can now log in using their Google account with this email.");
    } catch (err) {
      console.error("Failed to add user:", err);
      let message = "Failed to add user. Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          message = err.response.data;
        } else if (err.response.data.message) {
          message = err.response.data.message;
        }
      }
      alert(message);
    } finally {
      setAddingUser(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;

    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter === "ALL") return true;
    return (u.role || "").toUpperCase() === roleFilter;
  });

  if (loading) return <div className="py-20 text-center text-slate-500">Loading users...</div>;
  if (error) return <div className="py-20 text-center text-red-400">{error}</div>;

  return (
    <div className="rounded-[32px] border border-white/5 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
      <div className="p-8 flex flex-col gap-6 border-b border-white/5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">Registered Users</h3>
          <p className="text-xs text-slate-500 mt-1">Total {filteredUsers.length} users found</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {["ALL", "ADMIN", "USER", "TECHNICIAN", "MANAGER"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === r
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAddUserModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/20"
          >
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
            {filteredUsers.map((u, i) => (
              <tr key={u.id || i} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-slate-400">
                      {(u.name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{u.name || "Unknown User"}</div>
                      <div className="text-xs text-slate-500">{u.email || "No Email"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium text-slate-300">{u.role || "USER"}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${(u.status || 'Active') === 'Active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    <div className={`h-1 w-1 rounded-full ${(u.status || 'Active') === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {u.status || 'Active'}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    title="Remove User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900 p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-6">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full rounded-xl border border-white/5 bg-slate-800/50 p-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-xl border border-white/5 bg-slate-800/50 p-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none"
                  placeholder="name@university.edu"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/5 bg-slate-800/50 p-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none"
                  placeholder="+94 7X XXX XXXX"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-xl border border-white/5 bg-slate-800/50 p-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none appearance-none"
                >
                  <option value="USER">User (Student/Staff)</option>
                  <option value="MANAGER">Manager</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setAddUserModalOpen(false)}
                  className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {addingUser ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingManagementSection() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectingBooking, setRejectingBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/bookings/all");
      setBookings(response.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Unable to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, newStatus, reason = null) => {
    setUpdatingId(id);
    try {
      const payload = { status: newStatus };
      if (reason) payload.reason = reason;

      await api.put(`/api/bookings/${id}/status`, payload);

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus, rejectionReason: reason || b.rejectionReason } : b))
      );

      if (newStatus === "REJECTED") {
        setRejectingBooking(null);
        setRejectionReason("");
      }
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert("Failed to update booking. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    updateStatus(rejectingBooking.id, "REJECTED", rejectionReason);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === "ALL" || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (b.resourceName || "").toLowerCase().includes(q) ||
      (b.userEmail || "").toLowerCase().includes(q) ||
      (b.bookingId || "").toLowerCase().includes(q) ||
      (b.purpose || "").toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const approvedCount = bookings.filter((b) => b.status === "APPROVED").length;
  const rejectedCount = bookings.filter((b) => b.status === "REJECTED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;
  const totalCount = bookings.length;

  const approvalRate = totalCount > 0
    ? Math.round((approvedCount / totalCount) * 100)
    : 0;

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED": return "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20";
      case "REJECTED": return "text-red-400 bg-red-400/10 border border-red-400/20";
      case "CANCELLED": return "text-slate-400 bg-slate-400/10 border border-slate-400/20";
      default: return "text-amber-400 bg-amber-400/10 border border-amber-400/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Total", value: totalCount, color: "text-indigo-400", bg: "bg-indigo-400/10" },
          { label: "Pending", value: pendingCount, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Approved", value: approvedCount, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Rejected", value: rejectedCount, color: "text-red-400", bg: "bg-red-400/10" },
          { label: "Cancelled", value: cancelledCount, color: "text-slate-400", bg: "bg-slate-400/10" },
        ].map((s) => (
          <div key={s.label} className={`rounded-3xl border border-white/5 ${s.bg} p-6 text-center`}>
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Table */}
        <div className="lg:col-span-4 rounded-[32px] border border-white/5 bg-slate-900/40 p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold">Booking Requests</h3>
              {pendingCount > 0 && (
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase text-amber-400 tracking-widest border border-amber-500/20">
                  {pendingCount} PENDING
                </span>
              )}
            </div>
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all border border-white/5"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Search + Filter */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search by resource, email, purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/5 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all ${statusFilter === s
                      ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
                      : "border-white/5 bg-slate-900/50 text-slate-400 hover:text-white"
                    }`}
                >
                  {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">Loading bookings...</div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-red-400 text-sm">{error}</div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
              <InboxIcon size={40} className="opacity-30" />
              <p className="text-sm font-medium">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 sm:flex-row sm:items-center transition-all hover:border-white/10"
                >
                  {/* Resource info */}
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 font-bold text-lg flex-shrink-0">
                      {(b.resourceName || b.resourceId || "?")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{b.resourceName || b.resourceId}</div>
                      <div className="text-xs text-slate-500 truncate">
                        By <span className="text-indigo-400 font-medium">{b.userEmail}</span>
                      </div>
                      {b.purpose && (
                        <div className="text-xs text-slate-600 truncate mt-0.5">{b.purpose}</div>
                      )}
                    </div>
                  </div>

                  {/* Date/Time */}
                  <div className="flex gap-6 text-xs flex-shrink-0">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Date</div>
                      <div className="text-slate-300 font-medium">{b.date || "—"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Time</div>
                      <div className="text-slate-300 font-medium">
                        {b.startTime && b.endTime ? `${b.startTime} – ${b.endTime}` : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Status</div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${getStatusStyle(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {b.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(b.id, "APPROVED")}
                          disabled={updatingId === b.id}
                          title="Approve"
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          onClick={() => setRejectingBooking(b)}
                          disabled={updatingId === b.id}
                          title="Reject"
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900 p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <XCircle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Reject Booking</h3>
            <p className="text-sm text-slate-400 mb-6">
              Please provide a reason for rejecting the booking for <span className="text-white font-bold">{rejectingBooking.resourceName}</span>.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-32 rounded-2xl border border-white/5 bg-slate-800/50 p-4 text-sm text-white placeholder-slate-600 focus:border-red-500/50 focus:outline-none mb-6 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectingBooking(null);
                  setRejectionReason("");
                }}
                className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={updatingId === rejectingBooking.id}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {updatingId === rejectingBooking.id ? "Rejecting..." : "Reject Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function ResourceManagementSection() {
  const [resources, setResources] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceFilter, setResourceFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingResource, setSavingResource] = useState(false);
  const [saveError, setSaveError] = useState("");

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
    const [hours, minutes] = timeStr.split(":");
    let h = parseInt(hours, 10);
    const m = minutes || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h}.${m}${ampm}`;
  };

  const normalizeResource = (resource, index = 0) => ({
    ...resource,
    resourceCode: resource.resourceCode || `RES-${String(index + 1).padStart(3, "0")}`,
    name: resource.name || "Unnamed Resource",
    type: resource.type || "Unknown",
    location: resource.location || "Not specified",
    capacity: resource.capacity ?? 0,
    status: resource.status || "ACTIVE",
    startTime: resource.startTime,
    endTime: resource.endTime,
  });

  const sortResourcesByCode = (resourceList) => {
    return [...resourceList].sort((first, second) =>
      (first.resourceCode || "").localeCompare(second.resourceCode || "", undefined, { numeric: true })
    );
  };

  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/resource");

        if (!isMounted) {
          return;
        }

        const normalizedResources = (response.data ?? []).map((resource, index) =>
          normalizeResource(resource, index)
        );

        setResources(sortResourcesByCode(normalizedResources));
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError("Unable to load resources from the backend right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResources();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveResource = async (resourceData) => {
    try {
      setSavingResource(true);
      setSaveError("");

      const payload = {
        name: resourceData.name,
        type: resourceData.type,
        location: resourceData.location,
        capacity: resourceData.capacity,
        status: resourceData.status,
        description: resourceData.description || "",
        startTime: resourceData.startTime,
        endTime: resourceData.endTime,
      };

      if (editingResource) {
        // Update existing resource
        const response = await api.put(`/api/resource/${editingResource.id}`, payload);

        setResources((prev) =>
          prev.map((resource) =>
            resource.id === editingResource.id ? normalizeResource(response.data, resources.length) : resource
          )
        );
      } else {
        // Create new resource
        const response = await api.post("/api/resource", payload);
        const savedResource = normalizeResource(response.data, resources.length);
        setResources((prev) => sortResourcesByCode([...prev, savedResource]));
      }

      handleCloseModal();
    } catch (saveRequestError) {
      setSaveError(editingResource
        ? "Unable to update this resource right now."
        : "Unable to save this resource to the database right now."
      );
      throw saveRequestError;
    } finally {
      setSavingResource(false);
    }
  };

  const handleAddResource = () => {
    setEditingResource(null);
    setSaveError("");
    setModalOpen(true);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setSaveError("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingResource(null);
    setSaveError("");
  };

  const handleDeleteResource = async (resource) => {
    try {
      setSavingResource(true);
      setSaveError("");

      await api.delete(`/api/resource/${resource.id}`);

      // Remove from local state after successful deletion
      setResources((prev) => prev.filter((r) => r.id !== resource.id));
    } catch (deleteError) {
      setSaveError("Unable to delete this resource right now.");
      throw deleteError;
    } finally {
      setSavingResource(false);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-emerald-400 border-emerald-400/20 bg-emerald-400/10";
      case "OUT_OF_SERVICE":
        return "text-red-400 border-red-400/20 bg-red-400/10";
      case "MAINTENANCE":
        return "text-amber-400 border-amber-400/20 bg-amber-400/10";
      default:
        return "text-slate-400 border-white/10 bg-white/5";
    }
  };

  const getResourceCategory = (resource) => {
    return resource.type === "Equipment" ? "Equipment" : "Facilities";
  };

  const filteredResources = resources.filter((resource) => {
    // Filter by type (All/Facilities/Equipment)
    const matchesFilter = resourceFilter === "All" || getResourceCategory(resource) === resourceFilter;

    // Filter by search query (name)
    const matchesSearch = searchQuery === "" ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Search resources by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-white/5 bg-slate-900/50 py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {["All", "Facilities", "Equipment"].map((t) => (
            <button
              key={t}
              onClick={() => setResourceFilter(t)}
              className={`rounded-xl border px-5 py-2 text-xs font-bold transition-all ${resourceFilter === t
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
                  : "border-white/5 bg-slate-900/50 text-slate-400 hover:text-white"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={handleAddResource}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Add New Resource
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="md:col-span-2 xl:col-span-3 rounded-[40px] border border-white/5 bg-slate-900/20 p-12 text-center text-slate-500">
            Loading resources...
          </div>
        ) : error ? (
          <div className="md:col-span-2 xl:col-span-3 rounded-[40px] border border-red-500/20 bg-red-500/5 p-12 text-center text-red-400">
            {error}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 rounded-[40px] border border-dashed border-white/10 bg-slate-900/20 p-12 text-center text-slate-500">
            No resources found{resourceFilter !== "All" ? ` for the ${resourceFilter.toLowerCase()} filter` : ""}{searchQuery ? ` matching "${searchQuery}"` : ""}.
          </div>
        ) : filteredResources.map((r) => (
          <div key={r.id || r.resourceCode} className="group relative overflow-hidden rounded-[40px] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl transition-all hover:border-indigo-500/30">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                <Building2 size={24} />
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${getStatusClasses(r.status)}`}>
                {r.status.replace(/_/g, " ")}
              </span>
            </div>
            <h3 className="mb-1 text-xl font-bold">{r.name}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6">{r.type} • {r.location}</p>
            <div className="mb-4 inline-flex rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Capacity {r.capacity}
            </div>
            <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-400">
              <Clock size={14} className="text-indigo-400/70" />
              <span>Availability: <span className="text-slate-300">{formatTime(r.startTime)} - {formatTime(r.endTime)}</span></span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEditResource(r)}
                className="flex-1 rounded-xl bg-white/5 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 transition-all"
              >
                Edit Details
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${r.name}"? This action cannot be undone.`)) {
                    handleDeleteResource(r);
                  }
                }}
                className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-slate-400 transition-all hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ResourceModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveResource}
        onDelete={handleDeleteResource}
        initialData={editingResource}
        saving={savingResource}
        saveError={saveError}
      />
    </div>
  );
}

// ── Ticket Management Section ─────────────────────────────────────────────────

const TICKET_STATUSES = ["Open", "In Progress", "Resolved", "Closed", "Rejected"];

const STATUS_CFG = {
  "Open": { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)", text: "#818cf8", dot: "#6366f1" },
  "In Progress": { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#fbbf24", dot: "#f59e0b" },
  "Resolved": { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#4ade80", dot: "#22c55e" },
  "Closed": { bg: "rgba(100,116,139,0.15)", border: "rgba(100,116,139,0.4)", text: "#94a3b8", dot: "#64748b" },
  "Rejected": { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#f87171", dot: "#ef4444" },
};

const PRIORITY_CFG = {
  low: { label: "Low", color: "#22c55e" },
  medium: { label: "Medium", color: "#f59e0b" },
  high: { label: "High", color: "#f97316" },
  critical: { label: "Critical", color: "#ef4444" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Open"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.3rem",
      fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
      padding: "0.2rem 0.6rem", borderRadius: "9999px",
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block", flexShrink: 0 }} />
      {status}
    </span>
  );
}

function TicketManagementSection({ user }) {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const [rejectingTicketId, setRejectingTicketId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const [assignmentModalTicket, setAssignmentModalTicket] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [assigningLoading, setAssigningLoading] = useState(false);

  const load = async () => {
    try {
      const response = await api.get("/api/tickets");
      setTickets(response.data || []);

      const usersRes = await api.get("/api/users");
      setAllUsers(usersRes.data || []);
    } catch (err) {
      console.error("Failed to load tickets/users:", err);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("ticket-submitted", load);
    return () => window.removeEventListener("ticket-submitted", load);
  }, []);



  const updateStatus = async (ticket, newStatus) => {
    const id = ticket.id || ticket._id;
    if (newStatus === "Rejected") {
      handleRejectPrompt(id);
      return;
    }
    if (newStatus === "In Progress") {
      setExpandedId(id);
      setAssignmentModalTicket(ticket); // Note: We need the full ticket object here. 
    }
    try {
      await api.put(`/api/tickets/${id}/status`, { status: newStatus });
      // Reload or update locally
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      window.dispatchEvent(new Event("ticket-submitted"));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleRejectPrompt = (id) => {
    setRejectingTicketId(id);
    setRejectionReason("");
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this closed ticket? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/tickets/${id}`);
      setTickets(prev => prev.filter(t => (t.id || t._id) !== id));
      window.dispatchEvent(new Event("ticket-submitted"));
    } catch (err) {
      console.error("Failed to delete ticket:", err);
      alert("Failed to delete ticket.");
    }
  };

  const confirmRejection = async () => {
    if (!rejectionReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }

    setIsSubmittingReject(true);
    try {
      await api.put(`/api/tickets/${rejectingTicketId}/status`, {
        status: "Rejected",
        rejectionReason: rejectionReason
      });
      setTickets(prev => prev.map(t => t.id === rejectingTicketId ? { ...t, status: "Rejected", rejectionReason: rejectionReason } : t));
      setRejectingTicketId(null);
      setRejectionReason("");
      window.dispatchEvent(new Event("ticket-submitted"));
    } catch (err) {
      console.error("Failed to reject ticket:", err);
      alert("Failed to reject ticket.");
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const handleAssignStaff = async (staffName, role, staffEmail) => {
    setAssigningLoading(true);
    try {
      const payload = {};
      if (role === "TECHNICIAN") {
        payload.technician = staffName;
        payload.technicianEmail = staffEmail;
      }
      if (role === "MANAGER") {
        payload.manager = staffName;
        payload.managerEmail = staffEmail;
      }

      await api.put(`/api/tickets/${assignmentModalTicket.id}/assign`, payload);

      setTickets(prev => prev.map(t => t.id === assignmentModalTicket.id ? {
        ...t,
        assignedTechnician: role === "TECHNICIAN" ? staffName : t.assignedTechnician,
        assignedManager: role === "MANAGER" ? staffName : t.assignedManager
      } : t));

      setAssignmentModalTicket(null);
      window.dispatchEvent(new Event("ticket-submitted"));
    } catch (err) {
      console.error("Failed to assign staff:", err);
      alert("Failed to assign staff. Please try again.");
    } finally {
      setAssigningLoading(false);
    }
  };

  const handleUnassignStaff = async (ticketId, roleType) => {
    try {
      const payload = {};
      if (roleType === "TECHNICIAN") payload.technician = null;
      if (roleType === "MANAGER") payload.manager = null;

      await api.put(`/api/tickets/${ticketId}/assign`, payload);

      setTickets(prev => prev.map(t => t.id === ticketId ? {
        ...t,
        assignedTechnician: roleType === "TECHNICIAN" ? null : t.assignedTechnician,
        assignedManager: roleType === "MANAGER" ? null : t.assignedManager
      } : t));
    } catch (err) {
      console.error("Failed to unassign staff:", err);
      alert("Failed to remove assignment.");
    }
  };

  const filtered = tickets.filter((t) => {
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchPriority = priorityFilter === "All" || t.priority === priorityFilter.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q ||
      t.ticketId.toLowerCase().includes(q) ||
      t.resource.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.contactName || "").toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    return matchStatus && matchPriority && matchSearch;
  });

  const counts = TICKET_STATUSES.reduce((acc, s) => {
    acc[s] = tickets.filter((t) => t.status === s).length;
    return acc;
  }, {});

  /* ── shared inline styles ── */
  const card = {
    borderRadius: "1.75rem",
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(15,23,42,0.5)",
    backdropFilter: "blur(16px)",
    overflow: "hidden",
  };

  const inputBase = {
    padding: "0.6rem 0.875rem",
    borderRadius: "0.875rem",
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(15,23,42,0.6)",
    color: "#e2e8f0", fontSize: "0.8rem",
    outline: "none", cursor: "pointer",
  };

  const TH_COLS = "1fr 1.4fr 1fr 0.8fr 1.2fr 1.7fr";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── Status summary cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {TICKET_STATUSES.map((s) => {
          const cfg = STATUS_CFG[s];
          const active = statusFilter === s;
          return (
            <div
              key={s}
              onClick={() => setStatusFilter(active ? "All" : s)}
              style={{
                borderRadius: "1.25rem",
                border: `1px solid ${active ? cfg.dot : cfg.border}`,
                background: cfg.bg,
                padding: "1.25rem 1.5rem",
                cursor: "pointer",
                outline: active ? `2px solid ${cfg.dot}` : "none",
                outlineOffset: 2,
                transition: "outline 0.15s, border-color 0.15s",
              }}
            >
              <div style={{ fontSize: "2rem", fontWeight: 900, color: cfg.text, lineHeight: 1 }}>
                {counts[s]}
              </div>
              <div style={{
                marginTop: "0.35rem",
                fontSize: "0.68rem", fontWeight: 800,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: cfg.text, opacity: 0.75,
              }}>
                {s}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search size={14} style={{
            position: "absolute", left: "0.85rem", top: "50%",
            transform: "translateY(-50%)", color: "#475569", pointerEvents: "none",
          }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, resource, user, category…"
            style={{ ...inputBase, width: "100%", paddingLeft: "2.25rem", boxSizing: "border-box" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
        </div>

        {/* Status filter */}
        <div style={{ position: "relative" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...inputBase, appearance: "none", paddingRight: "2rem" }}
          >
            <option value="All">All Statuses</option>
            {TICKET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} style={{
            position: "absolute", right: "0.6rem", top: "50%",
            transform: "translateY(-50%)", color: "#475569", pointerEvents: "none",
          }} />
        </div>

        {/* Priority filter */}
        <div style={{ position: "relative" }}>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ ...inputBase, appearance: "none", paddingRight: "2rem" }}
          >
            <option value="All">All Priorities</option>
            {Object.entries(PRIORITY_CFG).map(([v, { label }]) => (
              <option key={v} value={label}>{label}</option>
            ))}
          </select>
          <ChevronDown size={13} style={{
            position: "absolute", right: "0.6rem", top: "50%",
            transform: "translateY(-50%)", color: "#475569", pointerEvents: "none",
          }} />
        </div>

        {/* Refresh */}
        <button
          onClick={load}
          style={{
            ...inputBase,
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.6rem 1rem", fontWeight: 700, cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#e2e8f0"; }}
        >
          <RefreshCw size={14} /> Refresh
        </button>

        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>
          {filtered.length} of {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Ticket table ── */}
      <div style={card}>
        {/* Table head */}
        <div style={{
          display: "grid", gridTemplateColumns: TH_COLS,
          padding: "0.75rem 1.5rem",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          fontSize: "0.63rem", fontWeight: 900,
          letterSpacing: "0.12em", textTransform: "uppercase", color: "#475569",
        }}>
          <span>Ticket ID</span>
          <span>Resource · Location</span>
          <span>Category</span>
          <span>Priority</span>
          <span>Status</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "4rem 1rem", gap: "0.75rem", color: "#334155",
          }}>
            <InboxIcon size={44} strokeWidth={1.2} />
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600 }}>
              {tickets.length === 0
                ? "No tickets have been submitted yet."
                : "No tickets match your current filters."}
            </p>
          </div>
        )}

        {/* Rows */}
        {filtered.map((ticket) => {
          const ticket_id = ticket.id || ticket._id;
          const priorityCfg = PRIORITY_CFG[ticket.priority] || { label: ticket.priority, color: "#94a3b8" };
          const isExpanded = expandedId === ticket_id;
          const date = new Date(ticket.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          });

          return (
            <div key={ticket_id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {/* Main row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : ticket_id)}
                style={{
                  display: "grid", gridTemplateColumns: TH_COLS,
                  alignItems: "center",
                  padding: "1rem 1.5rem",
                  cursor: "pointer",
                  background: isExpanded ? "rgba(99,102,241,0.05)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Ticket ID chip */}
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.72rem", fontWeight: 800, color: "#818cf8",
                  background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                  padding: "0.15rem 0.5rem", borderRadius: "0.3rem", width: "fit-content",
                }}>
                  {ticket.ticketId}
                </span>

                {/* Resource */}
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#e2e8f0" }}>{ticket.resource}</span>
                  {ticket.location && (
                    <span style={{ fontSize: "0.72rem", color: "#475569" }}> · {ticket.location}</span>
                  )}
                </div>

                {/* Category */}
                <span style={{ fontSize: "0.75rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ticket.category}
                </span>

                {/* Priority */}
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", fontWeight: 700, color: priorityCfg.color }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: priorityCfg.color, display: "inline-block", flexShrink: 0 }} />
                  {priorityCfg.label}
                </span>

                {/* Status badge */}
                <StatusBadge status={ticket.status} />

                {/* Action controls — stop propagation so row click doesn't toggle */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}
                >
                  {/* Inline status updater */}
                  <div style={{ position: "relative" }}>
                    <select
                      value={ticket.status}
                      onChange={(e) => updateStatus(ticket, e.target.value)}
                      style={{
                        appearance: "none",
                        padding: "0.3rem 1.75rem 0.3rem 0.65rem",
                        borderRadius: "0.5rem",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(15,23,42,0.8)",
                        color: "#e2e8f0",
                        fontSize: "0.7rem", fontWeight: 700,
                        cursor: "pointer", outline: "none",
                      }}
                    >
                      {TICKET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={11} style={{
                      position: "absolute", right: "0.45rem", top: "50%",
                      transform: "translateY(-50%)", color: "#475569", pointerEvents: "none",
                    }} />
                  </div>

                  {/* Permanent Delete for Closed Tickets */}
                  {ticket.status === "Closed" && (
                    <button
                      onClick={() => handlePermanentDelete(ticket_id)}
                      title="Permanently delete closed ticket"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "2rem", height: "2rem", borderRadius: "0.5rem",
                        border: "1px solid rgba(239,68,68,0.15)",
                        background: "rgba(239,68,68,0.06)",
                        color: "#f87171", cursor: "pointer", transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}



                  {/* Expand / collapse */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ticket_id)}
                    title={isExpanded ? "Collapse" : "Expand details"}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "2rem", height: "2rem", borderRadius: "0.5rem",
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: isExpanded ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                      color: isExpanded ? "#818cf8" : "#64748b",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <ChevronDown size={13} style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s",
                    }} />
                  </button>
                </div>
              </div>

              {/* ── Expanded detail panel ── */}
              {isExpanded && (
                <div style={{
                  padding: "1.25rem 1.5rem 1.5rem",
                  background: "rgba(99,102,241,0.03)",
                  borderTop: "1px solid rgba(99,102,241,0.1)",
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem",
                }}>
                  {/* Description */}
                  <div>
                    <div style={{
                      fontSize: "0.63rem", fontWeight: 800,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "#475569", marginBottom: "0.5rem",
                    }}>
                      Issue Description
                    </div>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.65 }}>
                      {ticket.description}
                    </p>

                    {ticket.status === 'Resolved' && ticket.resolutionNote && (
                      <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "1rem", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
                        <div style={{ fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", color: "#4ade80", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
                          Resolution Note
                        </div>
                        <p style={{ margin: 0, fontSize: "0.78rem", color: "#86efac", fontStyle: "italic" }}>
                          "{ticket.resolutionNote}"
                        </p>
                      </div>
                    )}

                    {ticket.status === 'Rejected' && ticket.rejectionReason && (
                      <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "1rem", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                        <div style={{ fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", color: "#f87171", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>
                          Rejection Reason
                        </div>
                        <p style={{ margin: 0, fontSize: "0.78rem", color: "#fca5a5" }}>
                          {ticket.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div style={{ marginTop: "1rem" }}>
                      <button
                        onClick={() => setAssignmentModalTicket(ticket)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.4rem",
                          padding: "0.45rem 1rem", borderRadius: "0.75rem",
                          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                          color: "#818cf8", fontSize: "0.75rem", fontWeight: 700,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
                      >
                        <UsersIcon size={14} />
                        {ticket.assignedTechnician || ticket.assignedManager ? "Reassign Staff" : "Assign Staff"}
                      </button>

                      {(ticket.assignedTechnician || ticket.assignedManager) && (
                        <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {ticket.assignedTechnician && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                                Technician: <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{ticket.assignedTechnician}</span>
                              </span>
                              <button
                                onClick={() => handleUnassignStaff(ticket.id, "TECHNICIAN")}
                                style={{
                                  background: "none", border: "none", color: "#ef4444",
                                  cursor: "pointer", display: "flex", alignItems: "center",
                                  padding: "2px", borderRadius: "4px",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                                title="Remove Technician"
                              >
                                <XCircle size={12} />
                              </button>
                            </div>
                          )}
                          {ticket.assignedManager && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                                Manager: <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{ticket.assignedManager}</span>
                              </span>
                              <button
                                onClick={() => handleUnassignStaff(ticket.id, "MANAGER")}
                                style={{
                                  background: "none", border: "none", color: "#ef4444",
                                  cursor: "pointer", display: "flex", alignItems: "center",
                                  padding: "2px", borderRadius: "4px",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                                title="Remove Manager"
                              >
                                <XCircle size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <div style={{
                      fontSize: "0.63rem", fontWeight: 800,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "#475569", marginBottom: "0.5rem",
                    }}>
                      Preferred Contact
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {ticket.contactName && <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>👤 {ticket.contactName}</span>}
                      {ticket.contactEmail && <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>✉️ {ticket.contactEmail}</span>}
                      {ticket.contactPhone && <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>📞 {ticket.contactPhone}</span>}
                    </div>

                    {/* Images */}
                    {ticket.images && ticket.images.length > 0 && (
                      <div style={{ marginTop: "1rem" }}>
                        <div style={{ fontSize: "0.63rem", fontWeight: 800, textTransform: "uppercase", color: "#475569", marginBottom: "0.4rem" }}>
                          Attachments
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {ticket.images.map((img, i) => (
                            <a key={i} href={`http://localhost:8080${img}`} target="_blank" rel="noreferrer">
                              <img
                                src={`http://localhost:8080${img}`}
                                alt="attachment"
                                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.1)" }}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer meta */}
                  <div style={{
                    gridColumn: "1 / -1",
                    display: "flex", gap: "1.5rem", alignItems: "center",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "#475569" }}>
                      <Clock size={12} /> Raised: {date}
                    </span>
                    {ticket.images && ticket.images.length > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "#475569" }}>
                        <Paperclip size={12} /> {ticket.images.length} attachment{ticket.images.length > 1 ? "s" : ""}
                      </span>
                    )}
                    <span style={{ marginLeft: "auto", fontSize: "0.65rem", fontFamily: "'Courier New', monospace", color: "#334155" }}>
                      {ticket.id}
                    </span>
                  </div>
                  {/* Collaboration Hub */}
                  <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.02)", paddingTop: "0.5rem" }}>
                    <CommentSection ticketId={ticket_id} user={user} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Rejection Modal ── */}
      {rejectingTicketId && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          padding: "1rem",
        }}>
          <div style={{
            width: "100%", maxWidth: "450px",
            background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1.5rem", padding: "2rem",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{
                display: "flex", height: "2.5rem", width: "2.5rem", alignItems: "center", justifyContent: "center",
                borderRadius: "0.75rem", background: "rgba(239,68,68,0.1)", color: "#f87171"
              }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 800 }}>Reject Ticket</h3>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#64748b" }}>Please provide a reason for rejecting this ticket.</p>
              </div>
            </div>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Type your reason here..."
              style={{
                width: "100%", minHeight: "120px", padding: "1rem", boxSizing: "border-box",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem", color: "#e2e8f0", fontSize: "0.875rem",
                outline: "none", resize: "none", marginBottom: "1.5rem",
              }}
            />

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setRejectingTicketId(null)}
                style={{
                  flex: 1, padding: "0.75rem", borderRadius: "0.75rem",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", fontSize: "0.875rem", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRejection}
                disabled={isSubmittingReject || !rejectionReason.trim()}
                style={{
                  flex: 2, padding: "0.75rem", borderRadius: "0.75rem",
                  background: "#ef4444", color: "white",
                  fontSize: "0.875rem", fontWeight: 700,
                  cursor: (isSubmittingReject || !rejectionReason.trim()) ? "not-allowed" : "pointer",
                  opacity: (isSubmittingReject || !rejectionReason.trim()) ? 0.5 : 1,
                  border: "none", transition: "all 0.15s",
                }}
              >
                {isSubmittingReject ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Assignment Modal ── */}
      {assignmentModalTicket && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          padding: "1rem",
        }}>
          <div style={{
            width: "100%", maxWidth: "500px", maxH: "80vh",
            background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1.5rem", padding: "2rem",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{
                display: "flex", height: "2.5rem", width: "2.5rem", alignItems: "center", justifyContent: "center",
                borderRadius: "0.75rem", background: "rgba(99,102,241,0.1)", color: "#818cf8"
              }}>
                <UsersIcon size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 800 }}>Assign Staff</h3>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#64748b" }}>Select a technician or manager for this ticket.</p>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingRight: "0.5rem" }}>
              {[
                { id: "TECHNICIAN", label: "Technicians", color: "#818cf8" },
                { id: "MANAGER", label: "Managers", color: "#c084fc" }
              ].map((role) => (
                <div key={role.id}>
                  <div style={{ fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", color: "#475569", marginBottom: "0.6rem", letterSpacing: "0.12em" }}>
                    {role.label}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {allUsers.filter(u => u.role === role.id).map(u => (
                      <button
                        key={u.id}
                        onClick={() => handleAssignStaff(u.name, role.id, u.email)}
                        disabled={assigningLoading}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.85rem",
                          padding: "0.85rem 1.15rem", borderRadius: "1.15rem",
                          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                          color: "#e2e8f0", fontSize: "0.875rem", textAlign: "left",
                          cursor: assigningLoading ? "not-allowed" : "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!assigningLoading) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateX(4px)"; } }}
                        onMouseLeave={(e) => { if (!assigningLoading) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateX(0)"; } }}
                      >
                        <div style={{
                          width: "2.25rem", height: "2.25rem", borderRadius: "0.75rem",
                          background: `${role.color}15`, color: role.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.85rem", fontWeight: 800, border: `1px solid ${role.color}30`
                        }}>
                          {u.name[0]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{u.name}</div>
                          <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{u.email}</div>
                        </div>
                        <ChevronRight size={14} style={{ color: "#334155" }} />
                      </button>
                    ))}
                    {allUsers.filter(u => u.role === role.id).length === 0 && (
                      <div style={{
                        fontSize: "0.75rem", color: "#475569", fontStyle: "italic",
                        padding: "1rem", background: "rgba(255,255,255,0.02)",
                        borderRadius: "1rem", border: "1px dashed rgba(255,255,255,0.05)",
                        textAlign: "center"
                      }}>
                        No {role.label.toLowerCase()} available.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setAssignmentModalTicket(null)}
              style={{
                marginTop: "1.5rem", width: "100%", padding: "0.75rem", borderRadius: "0.75rem",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8", fontSize: "0.875rem", fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
