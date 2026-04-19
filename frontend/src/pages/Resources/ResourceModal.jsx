import { useEffect, useState } from "react";
import { X } from "lucide-react";

const defaultForm = {
  name: "",
  type: "Lecture Hall",
  location: "",
  capacity: "",
  status: "ACTIVE",
};

export default function ResourceModal({
  open,
  onClose,
  onSave,
  onDelete,
  initialData = null,
  saving = false,
  saveError = "",
}) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        type: initialData.type ?? defaultForm.type,
        location: initialData.location ?? "",
        capacity: initialData.capacity?.toString() ?? "",
        status: initialData.status ?? defaultForm.status,
      });
      return;
    }

    setForm(defaultForm);
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await onSave({
        ...initialData,
        ...form,
        capacity: parseInt(form.capacity, 10) || 0,
        util: initialData?.util ?? Math.floor(Math.random() * 80) + 10,
      });

      onClose();
    } catch {
      // The parent sets an inline error message when the save fails.
    }
  };

  const handleDelete = () => {
    if (!initialData || !onDelete) return;
    onDelete(initialData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
        onClick={saving ? undefined : onClose} 
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 p-8 shadow-2xl transition-all sm:p-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{initialData ? "Edit Resource" : "Add New Resource"}</h2>
          <button 
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Resource Name</label>
            <input 
              name="name" 
              placeholder="e.g. Auditorium B" 
              className="w-full rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              value={form.name}
              onChange={handleChange} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Location</label>
              <input 
                name="location" 
                placeholder="e.g. 2nd Floor" 
                className="w-full rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                value={form.location}
                onChange={handleChange} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Capacity</label>
              <input 
                name="capacity" 
                type="number"
                placeholder="e.g. 50" 
                className="w-full rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                value={form.capacity}
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Type</label>
              <select 
                name="type" 
                className="w-full appearance-none rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                value={form.type}
                onChange={handleChange}
              >
                <option>Lecture Hall</option>
                <option>Lab</option>
                <option>Meeting Room</option>
                <option>Sports</option>
                <option>Equipment</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Status</label>
              <select 
                name="status" 
                className="w-full appearance-none rounded-2xl border border-white/5 bg-slate-800/50 px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                value={form.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>

          {saveError ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {saveError}
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex gap-4">
          <button 
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-2xl border border-white/5 bg-white/5 py-4 text-sm font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
          <button 
            onClick={initialData && onDelete ? handleDelete : handleSubmit}
            disabled={saving}
            className={`flex-1 rounded-2xl py-4 text-sm font-bold text-white transition-all ${
              initialData && onDelete
                ? "bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                : "bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            }`}
          >
            {saving ? "Saving..." : initialData && onDelete ? "Delete Resource" : initialData ? "Update Resource" : "Save Resource"}
          </button>
        </div>
      </div>
    </div>
  );
}
