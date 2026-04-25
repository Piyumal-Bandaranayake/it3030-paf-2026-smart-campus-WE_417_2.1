import { useState } from "react";
import { X, Calendar, Clock, FileText, Users, QrCode, CheckCircle2 } from "lucide-react";
import api from "../../api/axiosConfig";

export default function BookingModal({ open, onClose, resource }) {
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    attendance: "",
    purpose: "",
  });
  const [errors, setErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Since the parent handles conditional rendering based on selectedResource,
  // we use a combined check for 'open' or just assume it's open if rendered.
  // But let's be safe and support the 'open' prop if passed.
  if (open === false) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = "Date is required";
    if (!form.startTime) newErrors.startTime = "Start time is required";
    if (!form.endTime) newErrors.endTime = "End time is required";
    if (!form.attendance) newErrors.attendance = "Attendance is required";
    else if (isNaN(form.attendance) || parseInt(form.attendance) <= 0) newErrors.attendance = "Must be a valid positive number";
    if (!form.purpose.trim()) newErrors.purpose = "Purpose is required";

    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    if (resource?.startTime && resource?.endTime && form.startTime && form.endTime) {
       if (form.startTime < resource.startTime || form.endTime > resource.endTime) {
         newErrors.time = `Resource is only available between ${resource.startTime} and ${resource.endTime}`;
       }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for the field being edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    if (errors.time && (e.target.name === 'startTime' || e.target.name === 'endTime')) {
      setErrors({ ...errors, time: null, startTime: null, endTime: null });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) {
        alert("User not logged in.");
        setLoading(false);
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

      const response = await api.post("/api/bookings", bookingData);
      setSuccessData(response.data);
      // Optional: dispatch event to refresh dashboard
      window.dispatchEvent(new Event("booking-submitted"));
    } catch (err) {
      console.error("Failed to submit booking:", err);
      const errorMsg = err.response?.data?.message || err.message || "Please try again.";
      alert(`Failed to submit booking: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 p-8 shadow-2xl text-center animate-in zoom-in-95 duration-300">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-sm text-slate-400 mb-8 px-4">
            Your request for <span className="text-white font-bold">{resource?.name}</span> has been submitted successfully.
          </p>

          <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-2xl shadow-indigo-500/20">
            <img
              src={`data:image/png;base64,${successData.qrCode}`}
              alt="QR Code"
              className="w-48 h-48 mx-auto rounded-lg"
            />
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Booking ID</p>
            <p className="text-sm text-indigo-400 font-mono font-bold">{successData.bookingId}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-indigo-600 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

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
              className={`w-full rounded-2xl border ${errors.date ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/50'} bg-slate-800/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1`}
              onChange={handleChange}
            />
            {errors.date && <p className="text-red-400 text-xs mt-1 ml-1">{errors.date}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                <Clock size={14} /> Start Time
              </label>
              <input
                type="time"
                name="startTime"
                className={`w-full rounded-2xl border ${errors.startTime || errors.time ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/50'} bg-slate-800/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1`}
                onChange={handleChange}
              />
              {errors.startTime && <p className="text-red-400 text-xs mt-1 ml-1">{errors.startTime}</p>}
              {errors.time && !errors.startTime && <p className="text-red-400 text-xs mt-1 ml-1">{errors.time}</p>}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                <Clock size={14} /> End Time
              </label>
              <input
                type="time"
                name="endTime"
                className={`w-full rounded-2xl border ${errors.endTime || errors.time ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/50'} bg-slate-800/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1`}
                onChange={handleChange}
              />
              {errors.endTime && <p className="text-red-400 text-xs mt-1 ml-1">{errors.endTime}</p>}
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
              className={`w-full rounded-2xl border ${errors.attendance ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/50'} bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              onChange={handleChange}
            />
            {errors.attendance && <p className="text-red-400 text-xs mt-1 ml-1">{errors.attendance}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              <FileText size={14} /> Purpose
            </label>
            <textarea
              name="purpose"
              placeholder="e.g. Research Project Presentation"
              rows="3"
              className={`w-full rounded-2xl border ${errors.purpose ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/50'} bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1`}
              onChange={handleChange}
            />
            {errors.purpose && <p className="text-red-400 text-xs mt-1 ml-1">{errors.purpose}</p>}
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
            disabled={loading}
            className="flex-1 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50"
          >
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
