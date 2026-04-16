import { useState, useEffect } from "react";
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
import "./UserDashboard.css";

const quickActions = [
  { icon: Building2, label: "Book a Resource", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  { icon: Wrench,    label: "Report Issue",    color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { icon: CalendarCheck, label: "My Bookings", color: "#22c55e", bg: "rgba(34,197,94,0.12)"  },
  { icon: Bell,      label: "Notifications",   color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
];

const recentActivity = [
  { icon: CheckCircle2, color: "#22c55e", text: "Room 204 booking confirmed",   time: "2 min ago"  },
  { icon: AlertCircle,  color: "#f59e0b", text: "Maintenance ticket #45 updated", time: "1 hr ago"  },
  { icon: CalendarCheck,color: "#6366f1", text: "Lab B reservation approved",   time: "3 hrs ago"  },
  { icon: Bell,         color: "#ec4899", text: "Reminder: Meeting at 3 PM",    time: "5 hrs ago"  },
];

const stats = [
  { label: "Active Bookings",   value: "3",  icon: CalendarCheck, color: "#6366f1" },
  { label: "Open Tickets",      value: "1",  icon: Wrench,        color: "#f59e0b" },
  { label: "Resources Used",    value: "12", icon: Building2,     color: "#22c55e" },
  { label: "Notifications",     value: "5",  icon: Bell,          color: "#ec4899" },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    // Get time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Handle OAuth redirect with login_success=true
    const params = new URLSearchParams(window.location.search);
    if (params.get("login_success") === "true") {
      import("../api/axiosConfig").then(({ default: api }) => {
        api.get("/api/auth/me")
          .then((res) => {
            sessionStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch(() => navigate("/"));
      });
    } else {
      // Load user from session
      const stored = sessionStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  const firstName = user.name ? user.name.split(" ")[0] : "User";

  return (
    <div className="ud-root">
      {/* ── Sidebar ── */}
      <aside className="ud-sidebar">
        <div className="ud-sidebar-logo">
          <div className="ud-logo-icon">
            <Building2 size={18} color="white" strokeWidth={2} />
          </div>
          <span>Smart Campus</span>
        </div>

        <nav className="ud-nav">
          <div className="ud-nav-label">Menu</div>
          {[
            { icon: BarChart3,     label: "Dashboard",   active: true  },
            { icon: Building2,     label: "Resources",   active: false },
            { icon: CalendarCheck, label: "Bookings",    active: false },
            { icon: Wrench,        label: "Maintenance", active: false },
            { icon: Bell,          label: "Alerts",      active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} className={`ud-nav-item ${active ? "active" : ""}`}>
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {active && <span className="ud-nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="ud-sidebar-bottom">
          <div className="ud-profile-mini">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="avatar" className="ud-avatar-sm" />
            ) : (
              <div className="ud-avatar-placeholder-sm">
                <User size={14} />
              </div>
            )}
            <div>
              <div className="ud-profile-name">{firstName}</div>
              <div className="ud-profile-role">{user.role || "Student"}</div>
            </div>
          </div>
          <button className="ud-logout-btn" onClick={handleLogout}>
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ud-main">
        {/* Top bar */}
        <header className="ud-topbar">
          <div>
            <h1 className="ud-page-title">{greeting}, {firstName} 👋</h1>
            <p className="ud-page-sub">Here's what's happening on campus today.</p>
          </div>
          <div className="ud-topbar-right">
            <button className="ud-icon-btn"><Bell size={18} /></button>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="avatar" className="ud-avatar" />
            ) : (
              <div className="ud-avatar-placeholder"><User size={18} /></div>
            )}
          </div>
        </header>

        {/* Stats row */}
        <div className="ud-stats-grid">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div className="ud-stat-card" key={label}>
              <div className="ud-stat-icon" style={{ background: `${color}1a`, color }}>
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div>
                <div className="ud-stat-value">{value}</div>
                <div className="ud-stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className="ud-content-grid">
          {/* Quick Actions */}
          <section className="ud-card">
            <div className="ud-card-header">
              <h2>Quick Actions</h2>
              <button className="ud-card-btn"><Plus size={15} /> New</button>
            </div>
            <div className="ud-quick-grid">
              {quickActions.map(({ icon: Icon, label, color, bg }) => (
                <button
                  key={label}
                  className="ud-quick-btn"
                  style={{ "--qa-bg": bg, "--qa-color": color }}
                >
                  <div className="ud-quick-icon">
                    <Icon size={20} strokeWidth={1.8} style={{ color }} />
                  </div>
                  <span>{label}</span>
                  <ChevronRight size={14} className="ud-quick-arrow" />
                </button>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="ud-card">
            <div className="ud-card-header">
              <h2>Recent Activity</h2>
              <button className="ud-card-btn-ghost">View all</button>
            </div>
            <ul className="ud-activity-list">
              {recentActivity.map(({ icon: Icon, color, text, time }, i) => (
                <li key={i} className="ud-activity-item">
                  <div className="ud-activity-icon" style={{ color }}>
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <div className="ud-activity-text">{text}</div>
                  <div className="ud-activity-time">
                    <Clock size={11} /> {time}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* My Profile Card */}
        <section className="ud-card ud-profile-card">
          <div className="ud-profile-hero">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="avatar" className="ud-avatar-lg" />
            ) : (
              <div className="ud-avatar-placeholder-lg"><User size={32} /></div>
            )}
            <div>
              <div className="ud-profile-full-name">{user.name}</div>
              <div className="ud-profile-email">{user.email}</div>
              <span className="ud-role-badge">{user.role || "Student"}</span>
            </div>
          </div>
          <div className="ud-profile-meta">
            <div className="ud-meta-item">
              <span className="ud-meta-label">Member since</span>
              <span className="ud-meta-val">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
            </div>
            <div className="ud-meta-item">
              <span className="ud-meta-label">Auth Provider</span>
              <span className="ud-meta-val">{user.provider || "Google"}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
