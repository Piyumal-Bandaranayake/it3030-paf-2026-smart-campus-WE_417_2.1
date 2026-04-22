import { useState, useEffect, useRef } from "react";
import { Bell, Clock, Trash2, UserPlus, Calendar, Ticket, ArrowRight } from "lucide-react";
import api from "../api/axiosConfig";
import { formatDistanceToNow } from "date-fns";

export default function NotificationPanel({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/notifications");
      setNotifications(response.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
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
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/api/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const deleteAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) return;
    try {
      await api.delete("/api/notifications/all");
      setNotifications([]);
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    }
  };

  // Map notification type → admin dashboard tab
  const getTab = (type) => {
    switch (type) {
      case "TICKET":       return "tickets";
      case "REGISTRATION": return "users";
      case "BOOKING":      return "bookings";
      default:             return "overview";
    }
  };

  const handleView = async (n, e) => {
    e.stopPropagation();
    if (!n.read) await markAsRead(n.id);
    if (onNavigate) onNavigate(getTab(n.type));
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case "TICKET":       return <Ticket   size={16} className="text-amber-400" />;
      case "REGISTRATION": return <UserPlus size={16} className="text-blue-400" />;
      case "BOOKING":      return <Calendar size={16} className="text-emerald-400" />;
      default:             return <Bell     size={16} className="text-indigo-400" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "TICKET":       return "bg-amber-400/10";
      case "REGISTRATION": return "bg-blue-400/10";
      case "BOOKING":      return "bg-emerald-400/10";
      default:             return "bg-indigo-400/10";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "TICKET":       return { label: "Ticket", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
      case "REGISTRATION": return { label: "New User", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
      case "BOOKING":      return { label: "Booking", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
      default:             return { label: type, color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400 transition-all hover:bg-white/10"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_15px_rgba(79,70,229,0.6)] animate-pulse border-2 border-[#020617] z-10">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-[420px] rounded-3xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Notifications</h3>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center gap-3">
                <Bell size={32} className="text-slate-700" />
                <p className="text-slate-500 text-sm font-medium">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((n) => {
                  const typeInfo = getTypeLabel(n.type);
                  return (
                    <div
                      key={n.id}
                      className={`p-4 flex gap-3 relative transition-all ${
                        n.read ? "opacity-55" : "bg-indigo-500/[0.03]"
                      }`}
                    >
                      {/* Unread indicator */}
                      {!n.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 rounded-r" />
                      )}

                      {/* Icon */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getBgColor(n.type)}`}>
                        {getIcon(n.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          <span className="text-[10px] text-slate-600 flex items-center gap-1">
                            <Clock size={9} />
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-tight">{n.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{n.message}</p>

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => handleView(n, e)}
                            className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-[11px] font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            View <ArrowRight size={11} />
                          </button>
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
          <div className="p-4 bg-white/5 border-t border-white/5 flex gap-3">
            <button className="flex-1 text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 py-2">
              View History
            </button>
            {notifications.length > 0 && (
              <button
                onClick={deleteAllNotifications}
                className="flex-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-1.5 py-2"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
