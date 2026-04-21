import { useState } from "react";
import { X, Calendar, Clock, FileText, Users } from "lucide-react";
import api from "../../api/axiosConfig";

export default function BookingModal({ open, onClose, resource }) {
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    attendance: "",
    purpose: "",
  });

  // Since the parent handles conditional rendering based on selectedResource,
  // we use a combined check for 'open' or just assume it's open if rendered.
  // But let's be safe and support the 'open' prop if passed.
  if (open === false) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.date || !form.startTime || !form.endTime || !form.attendance || !form.purpose) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) {
        alert("User not logged in.");
        return;
      }
      const user = JSON.parse(storedUser);

      const bookingData = {
        ...form,
        userEmail: user.email,
        resourceId: resource?.id,
        resourceName: resource?.name,
        attendance: parseInt(form.attendance)
      };

      await api.post("/api/bookings", bookingData);
      alert(`Booking submitted for ${resource?.name}`);
      onClose();
      // Optional: dispatch event to refresh dashboard
      window.dispatchEvent(new Event("booking-submitted"));
    } catch (err) {
      console.error("Failed to submit booking:", err);
      const errorMsg = err.response?.data?.message || err.message || "Please try again.";
      alert(`Failed to submit booking: ${errorMsg}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 p-8 shadow-2xl transition-all sm:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Book Resource</h2>
            <p className="mt-1 text-sm text-indigo-400 font-medium">{resource?.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              <Calendar size={14} /> Date
            </label>
            <input 
              type="date"
              name="date" 
              className="w-full rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              onChange={handleChange} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                <Clock size={14} /> Start Time
              </label>
              <input 
                type="time"
                name="startTime" 
                className="w-full rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                onChange={handleChange} 
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                <Clock size={14} /> End Time
              </label>
              <input 
                type="time"
                name="endTime" 
                className="w-full rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              <Users size={14} /> Number of Attendance
            </label>
            <input 
              type="number"
              name="attendance" 
              placeholder="e.g. 50"
              className="w-full rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={handleChange} 
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              <FileText size={14} /> Purpose
            </label>
            <textarea 
              name="purpose" 
              placeholder="e.g. Research Project Presentation" 
              rows="3"
              className="w-full rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/5 bg-white/5 py-4 text-sm font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
