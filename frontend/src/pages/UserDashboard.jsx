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
  Ticket,
  RefreshCw,
  Tag,
  MapPin,
  AlertTriangle,
  Paperclip,
  Search,
  InboxIcon,
  Trash2,
  Users,
  ArrowRight
} from "lucide-react";
import api from "../api/axiosConfig";
import UserNotificationPanel from "../components/UserNotificationPanel";
import { formatDistanceToNow } from "date-fns";

// ── Static data ───────────────────────────────────────────────────────────────

const quickActions = [
  { icon: Building2,    label: "Book a Resource", color: "indigo",  bg: "rgba(99,102,241,0.1)"  },
  { icon: Wrench,       label: "Report Issue",    color: "amber",   bg: "rgba(245,158,11,0.1)"  },
  { icon: CalendarCheck,label: "My Bookings",     color: "emerald", bg: "rgba(34,197,94,0.1)"   },
  { icon: Bell,         label: "Notifications",   color: "pink",    bg: "rgba(236,72,153,0.1)"  },
];

// Recent activity is now fetched dynamically

const stats = [
  { label: "Active Bookings", value: "3",  icon: CalendarCheck, color: "indigo"  },
  { label: "Open Tickets",    value: "1",  icon: Wrench,        color: "amber"   },
  { label: "Resources Used",  value: "12", icon: Building2,     color: "emerald" },
  { label: "Notifications",   value: "5",  icon: Bell,          color: "pink"    },
];

// ── Status badge config ────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Open:        { bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.4)",  text: "#818cf8" },
  "In Progress":{ bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)",  text: "#fbbf24" },
  Resolved:    { bg: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.4)",   text: "#4ade80" },
  Closed:      { bg: "rgba(100,116,139,0.15)", border: "rgba(100,116,139,0.4)", text: "#94a3b8" },
  Rejected:    { bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.4)",   text: "#f87171" },
};

const PRIORITY_CONFIG = {
  low:      { label: "Low",      color: "#22c55e" },
  medium:   { label: "Medium",   color: "#f59e0b" },
  high:     { label: "High",     color: "#f97316" },
  critical: { label: "Critical", color: "#ef4444" },
};

const BOOKING_STATUS_CONFIG = {
  Pending: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#fbbf24" },
  Approved: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#4ade80" },
  Rejected: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#f87171" },
  Cancelled: { bg: "rgba(100,116,139,0.15)", border: "rgba(100,116,139,0.4)", text: "#94a3b8" },
};

// ── My Tickets view ────────────────────────────────────────────────────────────

function MyTicketsView() {
  const [tickets, setTickets]   = useState([]);
  const [search,  setSearch]    = useState("");
  const [filter,  setFilter]    = useState("All");

  const load = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      
      const response = await api.get(`/api/tickets?email=${user.email}`);
      setTickets(response.data || []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    }
  };

  const deleteTicket = async (id) => {
    if (!confirm("Remove this rejected ticket from your view?")) return;
    try {
      await api.delete(`/api/tickets/${id}`);
      setTickets(prev => prev.filter(t => t.id !== id));
      window.dispatchEvent(new Event("ticket-submitted"));
    } catch (err) {
      console.error("Failed to delete ticket:", err);
      alert("Failed to delete ticket.");
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("ticket-submitted", load);
    return () => window.removeEventListener("ticket-submitted", load);
  }, []);

  const statuses = ["All", "Open", "In Progress", "Resolved", "Closed", "Rejected"];

  const visible = tickets.filter((t) => {
    const matchFilter = filter === "All" || t.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.ticketId.toLowerCase().includes(q) ||
      t.resource.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === "All" ? tickets.length : tickets.filter((t) => t.status === s).length;
    return acc;
  }, {});

  return (
    <section
      style={{
        borderRadius: "1.5rem",
        border: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(15,23,42,0.4)",
        backdropFilter: "blur(16px)",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>My Tickets</h2>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#64748b" }}>
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} raised
          </p>
        </div>
        <button
          onClick={load}
          title="Refresh"
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.45rem 0.875rem",
            borderRadius: "0.625rem",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.04)",
            color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700,
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {statuses.map((s) => {
          const isActive = filter === s;
          const cfg = s !== "All" ? STATUS_CONFIG[s] : null;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
                border: `1px solid ${isActive ? (cfg ? cfg.border : "rgba(99,102,241,0.5)") : "rgba(255,255,255,0.07)"}`,
                background: isActive ? (cfg ? cfg.bg : "rgba(99,102,241,0.12)") : "rgba(255,255,255,0.03)",
                color: isActive ? (cfg ? cfg.text : "#818cf8") : "#64748b",
                fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {s}
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: "1.1rem", height: "1.1rem",
                borderRadius: "9999px",
                background: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                fontSize: "0.6rem", fontWeight: 800,
              }}>
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, resource, or category…"
          style={{
            width: "100%", padding: "0.55rem 0.875rem 0.55rem 2.1rem",
            borderRadius: "0.625rem",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.04)",
            color: "#e2e8f0", fontSize: "0.8rem",
            outline: "none", boxSizing: "border-box",
          }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.05)"; }}
          onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
        />
      </div>

      {/* Ticket list */}
      {visible.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1rem", gap: "0.75rem", color: "#334155" }}>
          <InboxIcon size={40} strokeWidth={1.2} />
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600 }}>
            {tickets.length === 0 ? "No tickets yet. Raise your first ticket using the button below!" : "No tickets match your filter."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {visible.map((ticket) => {
            const statusCfg   = STATUS_CONFIG[ticket.status]   || STATUS_CONFIG["Open"];
            const priorityCfg = PRIORITY_CONFIG[ticket.priority] || { label: ticket.priority, color: "#94a3b8" };
            const date = new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
            const time = new Date(ticket.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            return (
              <div
                key={ticket.id}
                style={{
                  borderRadius: "1rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.03)",
                  padding: "1rem 1.25rem",
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                {/* Row 1: ID + status + priority */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                  <span style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.05em",
                    color: "#818cf8",
                    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
                    padding: "0.15rem 0.5rem", borderRadius: "0.35rem",
                  }}>
                    {ticket.ticketId}
                  </span>

                  {/* Status badge */}
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                    padding: "0.15rem 0.5rem", borderRadius: "9999px",
                    background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, color: statusCfg.text,
                  }}>
                    {ticket.status}
                  </span>

                  {/* Priority dot */}
                  <span style={{
                    display: "flex", alignItems: "center", gap: "0.25rem",
                    fontSize: "0.65rem", fontWeight: 700,
                    color: priorityCfg.color,
                  }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: priorityCfg.color, display: "inline-block" }} />
                    {priorityCfg.label}
                  </span>

                  {/* Attachment count */}
                  {ticket.images && ticket.images.length > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.65rem", color: "#475569", marginLeft: ticket.status === "Rejected" ? "0.5rem" : "auto" }}>
                      <Paperclip size={11} /> {ticket.images.length}
                    </span>
                  )}

                  {/* Delete button only for Rejected status */}
                  {ticket.status === "Rejected" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTicket(ticket.id);
                      }}
                      title="Clear rejected ticket"
                      style={{
                        marginLeft: "auto",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem",
                        border: "1px solid rgba(239,68,68,0.15)",
                        background: "rgba(239,68,68,0.06)",
                        color: "#f87171", cursor: "pointer", transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {/* Row 2: Resource & category */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", fontWeight: 700, color: "#e2e8f0" }}>
                    <MapPin size={12} style={{ color: "#6366f1", flexShrink: 0 }} />
                    {ticket.resource}{ticket.location ? ` · ${ticket.location}` : ""}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: "#64748b" }}>
                    <Tag size={11} /> {ticket.category}
                  </span>
                </div>

                {/* Row 3: Description snippet */}
                <p style={{
                  margin: "0 0 0.6rem",
                  fontSize: "0.775rem", color: "#64748b", lineHeight: 1.5,
                  overflow: "hidden", display: "-webkit-box",
                  WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {ticket.description}
                </p>

                {/* Rejection Reason */}
                {ticket.status === "Rejected" && ticket.rejectionReason && (
                   <div style={{
                     margin: "0 0 0.8rem",
                     padding: "0.75rem 1rem",
                     borderRadius: "0.75rem",
                     background: "rgba(239,68,68,0.05)",
                     border: "1px solid rgba(239,68,68,0.15)",
                   }}>
                     <div style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", color: "#f87171", marginBottom: "0.25rem" }}>
                       Rejection Reason
                     </div>
                     <p style={{ margin: 0, fontSize: "0.75rem", color: "#fca5a5" }}>
                       {ticket.rejectionReason}
                     </p>
                   </div>
                )}

                {/* Resolution Note */}
                {ticket.status === "Resolved" && ticket.resolutionNote && (
                   <div style={{
                     margin: "0 0 0.8rem",
                     padding: "0.75rem 1rem",
                     borderRadius: "0.75rem",
                     background: "rgba(34,197,94,0.05)",
                     border: "1px solid rgba(34,197,94,0.15)",
                   }}>
                     <div style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", color: "#4ade80", marginBottom: "0.25rem" }}>
                       Resolution Note
                     </div>
                     <p style={{ margin: 0, fontSize: "0.75rem", color: "#86efac" }}>
                       {ticket.resolutionNote}
                     </p>
                   </div>
                )}

                {/* Row 4: Images & Date */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.65rem", color: "#334155" }}>
                    <Clock size={10} /> Raised on {date} at {time}
                  </div>
                  
                  {ticket.images && ticket.images.length > 0 && (
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      {ticket.images.map((img, i) => (
                        <a key={i} href={`http://localhost:8080${img}`} target="_blank" rel="noreferrer">
                          <img 
                            src={`http://localhost:8080${img}`} 
                            alt="attachment" 
                            style={{ width: 32, height: 32, objectFit: "cover", borderRadius: "0.35rem", border: "1px solid rgba(255,255,255,0.05)" }} 
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ── My Bookings view ───────────────────────────────────────────────────────────

function MyBookingsView() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  const loadResources = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      
      const response = await api.get(`/api/bookings?email=${user.email}`);
      setBookings(response.data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const cancelBooking = async (id, status) => {
    const s = status?.toUpperCase();
    const isRemovable = s === "REJECTED" || s === "CANCELLED";
    
    const msg = isRemovable
      ? "Remove this record from your history?" 
      : "Are you sure you want to cancel this booking?";

    if (!confirm(msg)) return;
    try {
      await api.delete(`/api/bookings/${id}`);
      // Refresh the list to show the new status or removal
      loadResources();
      window.dispatchEvent(new Event("booking-submitted"));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Failed to update booking status.");
    }
  };

  useEffect(() => {
    loadResources();
    window.addEventListener("booking-submitted", loadResources);
    return () => window.removeEventListener("booking-submitted", loadResources);
  }, []);

  const visible = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      !q ||
      b.bookingId.toLowerCase().includes(q) ||
      b.resourceName.toLowerCase().includes(q) ||
      b.purpose.toLowerCase().includes(q)
    );
  });

  return (
    <section
      style={{
        borderRadius: "1.5rem",
        border: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(15,23,42,0.4)",
        backdropFilter: "blur(16px)",
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>My Bookings</h2>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#64748b" }}>
            {bookings.length} resource booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={loadResources}
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.45rem 0.875rem",
            borderRadius: "0.625rem",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.04)",
            color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, resource, or purpose…"
          style={{
            width: "100%", padding: "0.55rem 0.875rem 0.55rem 2.1rem",
            borderRadius: "0.625rem", border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: "0.8rem", outline: "none",
          }}
        />
      </div>

      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#475569" }}>
          <CalendarCheck size={40} style={{ marginBottom: "1rem", opacity: 0.5 }} />
          <p>No bookings found.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {visible.map((b) => (
            <div
              key={b.id}
              style={{
                borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)", padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 800,
                      color: "#818cf8", background: "rgba(99,102,241,0.1)",
                      padding: "0.2rem 0.5rem", borderRadius: "0.4rem"
                    }}>
                      {b.bookingId}
                    </span>
                    
                    {/* Status Badge */}
                    {(() => {
                      const status = b.status || "PENDING";
                      const cfg = BOOKING_STATUS_CONFIG[status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()] || BOOKING_STATUS_CONFIG.Pending;
                      return (
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                          padding: "0.15rem 0.5rem", borderRadius: "9999px",
                          background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text,
                        }}>
                          {status}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{b.resourceName}</h3>
                </div>
                <span style={{ color: "#475569", fontSize: "0.7rem", fontWeight: 700 }}>
                  {b.status?.toUpperCase() === "REJECTED" ? "Closed" : "Active"}
                </span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", fontSize: "0.75rem", color: "#94a3b8" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CalendarCheck size={14} className="text-indigo-400" />
                  {b.date}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Clock size={14} className="text-indigo-400" />
                  {b.startTime} - {b.endTime}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Users size={14} className="text-indigo-400" />
                  {b.attendance} People
                </div>
              </div>
              
              <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.02)", fontSize: "0.8rem", color: "#cbd5e1" }}>
                <strong style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase", color: "#64748b", marginBottom: "0.25rem" }}>Purpose</strong>
                {b.purpose}
              </div>

              <button
                onClick={() => cancelBooking(b.id, b.status)}
                style={{
                  marginTop: "1.25rem",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  border: (b.status?.toUpperCase() === "REJECTED" || b.status?.toUpperCase() === "CANCELLED") ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(239,68,68,0.2)",
                  background: (b.status?.toUpperCase() === "REJECTED" || b.status?.toUpperCase() === "CANCELLED") ? "rgba(255,255,255,0.03)" : "rgba(239,68,68,0.05)",
                  color: (b.status?.toUpperCase() === "REJECTED" || b.status?.toUpperCase() === "CANCELLED") ? "#94a3b8" : "#f87171",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  const s = b.status?.toUpperCase();
                  const isInactive = s === "REJECTED" || s === "CANCELLED";
                  e.currentTarget.style.background = isInactive ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.1)";
                  e.currentTarget.style.borderColor = isInactive ? "rgba(255,255,255,0.15)" : "rgba(239,68,68,0.4)";
                }}
                onMouseLeave={(e) => {
                  const s = b.status?.toUpperCase();
                  const isInactive = s === "REJECTED" || s === "CANCELLED";
                  e.currentTarget.style.background = isInactive ? "rgba(255,255,255,0.03)" : "rgba(239,68,68,0.05)";
                  e.currentTarget.style.borderColor = isInactive ? "rgba(255,255,255,0.08)" : "rgba(239,68,68,0.2)";
                }}
              >
                <Trash2 size={14} /> 
                {(() => {
                  const s = b.status?.toUpperCase();
                  if (s === "REJECTED" || s === "CANCELLED") return "Remove from History";
                  return "Cancel Booking";
                })()}
              </button>

              {b.status?.toUpperCase() === "REJECTED" && (b.rejectionReason || b.reason) && (
                <div style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: "1rem",
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.15)",
                }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", color: "#f87171", marginBottom: "0.25rem" }}>
                    Rejection Reason
                  </div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#fca5a5" }}>
                    {b.rejectionReason || b.reason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user,        setUser]       = useState(null);
  const [greeting,    setGreeting]   = useState("Good day");
  const [activeView,  setActiveView] = useState("dashboard"); // "dashboard" | "tickets" | "bookings"
  const [ticketCount, setTicketCount]= useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [activity,    setActivity]    = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const recentActivityRef = useRef(null);

  // Load ticket count for the sidebar badge
  const loadTicketCount = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      
      const response = await api.get(`/api/tickets?email=${user.email}`);
      const tickets = response.data || [];
      setTicketCount(tickets.filter((x) => x.status === "Open" || x.status === "In Progress").length);
    } catch (err) {
      console.error("Failed to load ticket count:", err);
    }
  };

  const loadBookingCount = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const response = await api.get(`/api/bookings?email=${user.email}`);
      const bookings = response.data || [];
      setBookingCount(bookings.length);
    } catch (err) {
      console.error("Failed to load booking count:", err);
    }
  };

  const loadActivity = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      setLoadingActivity(true);
      const response = await api.get(`/api/notifications/user/${encodeURIComponent(user.email)}`);
      setActivity((response.data || []).slice(0, 5));
    } catch (err) {
      console.error("Failed to load activity:", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12)      setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else                setGreeting("Good evening");

    const params = new URLSearchParams(window.location.search);
    if (params.get("login_success") === "true") {
      import("../api/axiosConfig").then(({ default: api }) => {
        api.get("/api/auth/me")
          .then((res) => {
            const userData = res.data;
            sessionStorage.setItem("user", JSON.stringify(userData));
            window.dispatchEvent(new Event("auth-change"));
            if (userData.role === "ADMIN") {
              navigate("/admin-dashboard");
            } else if (userData.role === "MANAGER") {
              navigate("/manager-dashboard");
            } else if (userData.role === "TECHNICIAN") {
              navigate("/technician-dashboard");
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
        } else if (userData.role === "MANAGER") {
          navigate("/manager-dashboard");
        } else if (userData.role === "TECHNICIAN") {
          navigate("/technician-dashboard");
        } else {
          setUser(userData);
        }
      } else {
        navigate("/login");
      }
    }
  
    loadTicketCount();
    loadBookingCount();
    loadActivity();
    window.addEventListener("ticket-submitted", () => { loadTicketCount(); loadActivity(); });
    window.addEventListener("booking-submitted", () => { loadBookingCount(); loadActivity(); });
    return () => {
      window.removeEventListener("ticket-submitted", loadTicketCount);
      window.removeEventListener("booking-submitted", loadBookingCount);
    };
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const handleSidebarNavigation = (label) => {
    if (label === "Resources")  { navigate("/resources"); return; }
    if (label === "Tickets")    { navigate("/tickets");   return; }
    if (label === "Alerts")     { setActiveView("dashboard"); setTimeout(() => recentActivityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); return; }
    if (label === "My Tickets") { setActiveView("tickets");   return; }
    if (label === "Bookings")    { setActiveView("bookings");  return; }
    if (label === "Dashboard")  { setActiveView("dashboard"); return; }
  };

  if (!user) return null;

  const firstName = user.name ? user.name.split(" ")[0] : "User";

  const navItems = [
    { icon: BarChart3,     label: "Dashboard"  },
    { icon: Building2,     label: "Resources"  },
    { icon: CalendarCheck, label: "Bookings"   },
    { icon: Ticket,        label: "Tickets"    },
    { icon: Wrench,        label: "Maintenance"},
    { icon: Bell,          label: "Alerts"     },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl transition-transform lg:translate-x-0"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 px-6" style={{ flexShrink: 0 }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
            <Building2 size={20} color="white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Smart Campus</span>
        </div>

        {/* Nav — scrollable middle area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 0.75rem" }}>
          {/* Main menu */}
          <nav className="mt-8 space-y-1">
            <div className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">Menu</div>
            {navItems.map(({ icon: Icon, label }) => {
              const active = activeView === "dashboard" && label === "Dashboard";
              return (
                <button
                  key={label}
                  onClick={() => handleSidebarNavigation(label)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    (activeView === "dashboard" && label === "Dashboard") || (activeView === "bookings" && label === "Bookings")
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {label === "Bookings" && bookingCount > 0 && activeView !== "bookings" && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
                      {bookingCount}
                    </span>
                  )}
                  {((activeView === "dashboard" && label === "Dashboard") || (activeView === "bookings" && label === "Bookings")) && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
                </button>
              );
            })}
          </nav>

          {/* ── My Tickets section ── */}
          <nav className="mt-6 space-y-1">
            <div className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">Support</div>
            <button
              onClick={() => handleSidebarNavigation("My Tickets")}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeView === "tickets"
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Ticket size={18} />
              <span>My Tickets</span>

              {/* Active dot */}
              {activeView === "tickets" && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}

              {/* Badge: open / in-progress count */}
              {activeView !== "tickets" && ticketCount > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minWidth: "1.25rem", height: "1.25rem",
                    borderRadius: "9999px",
                    background: "rgba(99,102,241,0.2)",
                    border: "1px solid rgba(99,102,241,0.4)",
                    color: "#818cf8",
                    fontSize: "0.6rem", fontWeight: 800,
                  }}
                >
                  {ticketCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* User card + logout — pinned to bottom */}
        <div style={{ flexShrink: 0, padding: "1rem" }}>
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
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-64 flex-1 p-8">
        {/* Top bar */}
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">
              {activeView === "tickets" ? "My Tickets 🎫" : activeView === "bookings" ? "My Bookings 🗓️" : `${greeting}, ${firstName} 👋`}
            </h1>
            <p className="mt-1 text-slate-400">
              {activeView === "tickets"
                ? "Track the status of all your submitted support tickets."
                : activeView === "bookings"
                ? "Manage your resource reservations and campus bookings."
                : "Here's what's happening on campus today."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <UserNotificationPanel onNavigate={(view) => setActiveView(view)} />
          </div>
        </header>

        {activeView === "tickets" ? (
          /* ─── My Tickets view ─── */
          <MyTicketsView />
        ) : activeView === "bookings" ? (
          /* ─── My Bookings view ─── */
          <MyBookingsView />
        ) : (
          /* ─── Default dashboard view ─── */
          <>
            {/* Stats row */}
            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Active Bookings", value: bookingCount.toString(), icon: CalendarCheck, color: "indigo" },
                { label: "Open Tickets", value: ticketCount.toString(), icon: Wrench, color: "amber" },
                { label: "Resources Used", value: "12", icon: Building2, color: "emerald" },
                { label: "Notifications", value: "5", icon: Bell, color: "pink" },
              ].map(({ label, value, icon: Icon, color }) => (
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
                  {quickActions.map(({ icon: Icon, label, color }) => (
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
                  <button 
                    onClick={loadActivity}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                {loadingActivity ? (
                  <div className="flex items-center justify-center py-10 text-slate-500 text-sm italic">Loading activity...</div>
                ) : activity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                    <InboxIcon size={32} />
                    <p className="text-sm font-medium">No recent activity</p>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {activity.map((n, i) => {
                      const isTicket = n.type === "TICKET_UPDATE";
                      const isBooking = n.type === "BOOKING_UPDATE";
                      const Icon = isTicket ? Ticket : isBooking ? CalendarCheck : Bell;
                      const colorClass = isTicket ? "text-amber-400" : isBooking ? "text-emerald-400" : "text-indigo-400";
                      const bgClass = isTicket ? "bg-amber-400/10" : isBooking ? "bg-emerald-400/10" : "bg-indigo-400/10";
                      
                      return (
                        <li key={n.id} className="group flex items-start gap-4">
                          <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ${bgClass} ${colorClass}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${colorClass}`}>
                                {isTicket ? "Ticket" : isBooking ? "Booking" : "Alert"}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-slate-700" />
                              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                <Clock size={10} /> {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{n.title}</div>
                            <div className="text-xs text-slate-500 line-clamp-1">{n.message}</div>
                          </div>
                          
                          {(isTicket || isBooking) && (
                            <button
                              onClick={() => setActiveView(isTicket ? "tickets" : "bookings")}
                              className="self-center flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all hover:bg-indigo-600 hover:text-white"
                              title="View Details"
                            >
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
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
                    </span>
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
          </>
        )}
      </main>
    </div>
  );
}
