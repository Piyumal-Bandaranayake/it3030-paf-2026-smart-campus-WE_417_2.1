import { useState, useEffect, useRef } from "react";
import { Bell, Clock, Trash2, CalendarCheck, Ticket, ArrowRight, CheckCircle2 } from "lucide-react";
import api from "../api/axiosConfig";
import { formatDistanceToNow } from "date-fns";

export default function UserNotificationPanel({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const getUserEmail = () => {
    try {
      const stored = sessionStorage.getItem("user");
      return stored ? JSON.parse(stored).email : null;
    } catch {
      return null;
    }
  };

  const fetchNotifications = async () => {
    const email = getUserEmail();
    if (!email) return;
    try {
      setLoading(true);
      const response = await api.get(`/api/notifications/user/${encodeURIComponent(email)}`);
      setNotifications(response.data || []);
    } catch (err) {
      console.error("Failed to fetch user notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const markAllAsRead = async () => {
    const email = getUserEmail();
    if (!email) return;
    try {
      await api.put(`/api/notifications/user/${encodeURIComponent(email)}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const deleteAll = async () => {
    const email = getUserEmail();
    if (!email || !window.confirm("Clear all notifications?")) return;
    try {
      await api.delete(`/api/notifications/user/${encodeURIComponent(email)}/all`);
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear:", err);
    }
  };

  const getView = (type) => {
    switch (type) {
      case "BOOKING_UPDATE": return "bookings";
      case "TICKET_UPDATE":  return "tickets";
      default:               return null;
    }
  };

  const handleView = async (n, e) => {
    e.stopPropagation();
    if (!n.read) await markAsRead(n.id);
    const view = getView(n.type);
    if (view && onNavigate) onNavigate(view);
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case "TICKET_UPDATE":  return <Ticket size={16} className="text-amber-400" />;
      case "BOOKING_UPDATE": return <CalendarCheck size={16} className="text-emerald-400" />;
      default:               return <Bell size={16} className="text-indigo-400" />;
    }
  };

  const getStyle = (type) => {
    switch (type) {
      case "TICKET_UPDATE":  return { label: "Ticket",  cls: "text-amber-400 bg-amber-400/10 border-amber-400/20",   iconBg: "bg-amber-400/10" };
      case "BOOKING_UPDATE": return { label: "Booking", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", iconBg: "bg-emerald-400/10" };
      default:               return { label: "Alert",   cls: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",  iconBg: "bg-indigo-400/10" };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white border-2 border-[#020617] animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.6)] z-10">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[400px] rounded-3xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden"
          style={{ animation: "fadeInScale 0.15s ease-out" }}>

          {/* Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">My Notifications</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <CheckCircle2 size={12} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-10 flex flex-col items-center gap-3 text-center">
                <Bell size={32} className="text-slate-700" />
                <p className="text-slate-500 text-sm font-medium">No notifications yet</p>
                <p className="text-slate-600 text-xs">You'll be notified when your bookings or tickets are updated.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((n) => {
                  const style = getStyle(n.type);
                  const viewTarget = getView(n.type);
                  return (
                    <div
                      key={n.id}
                      className={`p-4 flex gap-3 relative transition-all ${n.read ? "opacity-55" : "bg-indigo-500/[0.03]"}`}
                    >
                      {!n.read && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 rounded-r" />}

                      {/* Icon */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}>
                        {getIcon(n.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${style.cls}`}>
                            {style.label}
                          </span>
                          <span className="text-[10px] text-slate-600 flex items-center gap-1">
                            <Clock size={9} />
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug">{n.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>

                        {/* Action row */}
                        <div className="flex gap-2 mt-2">
                          {viewTarget && (
                            <button
                              onClick={(e) => handleView(n, e)}
                              className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-[11px] font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"
                            >
                              View <ArrowRight size={11} />
                            </button>
                          )}
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={(e) => deleteNotification(n.id, e)}
                        className="shrink-0 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all self-start mt-1"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-white/5 border-t border-white/5 flex justify-end">
              <button
                onClick={deleteAll}
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors px-4 py-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}
