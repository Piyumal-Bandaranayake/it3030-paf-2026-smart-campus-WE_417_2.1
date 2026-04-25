import "./RaiseTicketButton.css";
import { useState, useRef, useCallback } from "react";
import {
  Ticket,
  X,
  MapPin,
  Tag,
  AlignLeft,
  AlertTriangle,
  Phone,
  Mail,
  User,
  Upload,
  ImagePlus,
  Trash2,
  ChevronDown,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import api from "../api/axiosConfig";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Facility / Infrastructure",
  "IT & Equipment",
  "Safety & Security",
  "Cleaning & Hygiene",
  "Electrical / Plumbing",
  "Event Support",
  "Other",
];

const PRIORITIES = [
  { label: "Low",      value: "low",      color: "#22c55e" },
  { label: "Medium",   value: "medium",   color: "#f59e0b" },
  { label: "High",     value: "high",     color: "#f97316" },
  { label: "Critical", value: "critical", color: "#ef4444" },
];

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ─── Helper: image preview card ───────────────────────────────────────────────

function ImagePreviewCard({ file, preview, onRemove }) {
  return (
    <div className="rtb-img-card">
      <img src={preview} alt={file.name} className="rtb-img-thumb" />
      <div className="rtb-img-info">
        <span className="rtb-img-name">{file.name}</span>
        <span className="rtb-img-size">{(file.size / 1024).toFixed(1)} KB</span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rtb-img-remove"
        aria-label="Remove image"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RaiseTicketButton() {
  const [open, setOpen]       = useState(false);
  const [status, setStatus]   = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef               = useRef(null);

  const emptyForm = {
    resource: "",
    location: "",
    category: "",
    priority: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  };

  const [form, setForm]     = useState(emptyForm);
  const [images, setImages] = useState([]); // [{ file, preview }]
  const [imageDrag, setImageDrag] = useState(false);

  // ── handlers ────────────────────────────────────────────────────────────────

  const handleOpen  = () => { 
    setOpen(true);  
    setStatus("idle"); 
    setErrorMsg(""); 
    
    // Fetch logged user for email pre-fill
    const stored = sessionStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setForm(f => ({ ...f, contactEmail: user.email || f.contactEmail }));
    }
  };

  const handleClose = () => {
    if (status === "submitting") return;
    setOpen(false);
    // keep form until success so user doesn't lose data on accidental close
    if (status === "success") { 
      setForm(emptyForm); 
      setImages([]); 
      setStatus("idle"); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const processFiles = useCallback((files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .filter((f) => f.size <= MAX_FILE_SIZE)
      .slice(0, remaining);

    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) =>
          prev.length < MAX_IMAGES
            ? [...prev, { file, preview: e.target.result }]
            : prev
        );
      };
      reader.readAsDataURL(file);
    });
  }, [images.length]);

  const handleFileInput = (e) => { processFiles(e.target.files); e.target.value = ""; };

  const handleDrop = (e) => {
    e.preventDefault();
    setImageDrag(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.resource.trim() || !form.category || !form.priority || !form.description.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const stored = sessionStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      images.forEach(({ file }) => data.append("attachments", file));
      data.append("userEmail", user?.email || "anonymous@campus.edu");

      await api.post("/api/tickets", data, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });

      // Notify other components
      window.dispatchEvent(new Event("ticket-submitted"));
      setStatus("success");
    } catch (err) {
      console.error("Ticket submission error:", err);
      setStatus("error");
      setErrorMsg(err?.response?.data?.message || err?.message || "Failed to submit ticket. Please try again.");
    }
  };


  const isSubmitting = status === "submitting";
  const isSuccess    = status === "success";

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Floating button ── */}
      <button
        id="raise-ticket-fab"
        onClick={handleOpen}
        className="rtb-fab"
        aria-label="Raise a support ticket"
        title="Raise a Ticket"
      >
        <Ticket size={22} />
        <span className="rtb-fab-label">Raise Ticket</span>
        <span className="rtb-fab-pulse" />
      </button>

      {/* ── Backdrop + Modal ── */}
      {open && (
        <div className="rtb-backdrop" onClick={handleClose}>
          <div
            className="rtb-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rtb-modal-title"
          >
            {/* Header */}
            <div className="rtb-header">
              <div className="rtb-header-icon">
                <Ticket size={20} />
              </div>
              <div>
                <h2 id="rtb-modal-title" className="rtb-title">Raise a Support Ticket</h2>
                <p className="rtb-subtitle">Report an issue or request for a campus resource</p>
              </div>
              <button onClick={handleClose} className="rtb-close" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* ── Success state ── */}
            {isSuccess ? (
              <div className="rtb-success">
                <div className="rtb-success-icon">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="rtb-success-title">Ticket Submitted!</h3>
                <p className="rtb-success-body">
                  Your ticket has been received. Our team will review it shortly and
                  reach out via your preferred contact method.
                </p>
                <button
                  onClick={() => {
                    setForm(emptyForm);
                    setImages([]);
                    setStatus("idle");
                  }}
                  className="rtb-btn rtb-btn-primary"
                >
                  Raise Another Ticket
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} noValidate className="rtb-form">
                {/* ── Section: Resource & Location ── */}
                <div className="rtb-section-label">
                  <MapPin size={14} /> Resource &amp; Location
                </div>
                <div className="rtb-row-2">
                  <div className="rtb-field">
                    <label htmlFor="ticket-resource" className="rtb-label">
                      Resource / Area <span className="rtb-required">*</span>
                    </label>
                    <input
                      id="ticket-resource"
                      name="resource"
                      value={form.resource}
                      onChange={handleChange}
                      placeholder="e.g. Library, Lab 3, Gym"
                      className="rtb-input"
                      required
                    />
                  </div>
                  <div className="rtb-field">
                    <label htmlFor="ticket-location" className="rtb-label">
                      Specific Location
                    </label>
                    <input
                      id="ticket-location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. 2nd floor, Room 204"
                      className="rtb-input"
                    />
                  </div>
                </div>

                {/* ── Section: Category & Priority ── */}
                <div className="rtb-section-label">
                  <Tag size={14} /> Category &amp; Priority
                </div>
                <div className="rtb-row-2">
                  {/* Category */}
                  <div className="rtb-field">
                    <label htmlFor="ticket-category" className="rtb-label">
                      Category <span className="rtb-required">*</span>
                    </label>
                    <div className="rtb-select-wrap">
                      <select
                        id="ticket-category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="rtb-select"
                        required
                      >
                        <option value="">Select category…</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="rtb-select-icon" />
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="rtb-field">
                    <label className="rtb-label">
                      Priority <span className="rtb-required">*</span>
                    </label>
                    <div className="rtb-priority-grid">
                      {PRIORITIES.map(({ label, value, color }) => (
                        <label key={value} className="rtb-priority-opt">
                          <input
                            type="radio"
                            name="priority"
                            value={value}
                            checked={form.priority === value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span
                            className={`rtb-priority-chip ${form.priority === value ? "rtb-priority-active" : ""}`}
                            style={form.priority === value ? { background: color + "22", borderColor: color, color } : {}}
                          >
                            <AlertTriangle size={11} />
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Section: Description ── */}
                <div className="rtb-section-label">
                  <AlignLeft size={14} /> Description
                </div>
                <div className="rtb-field">
                  <label htmlFor="ticket-description" className="rtb-label">
                    Issue Description <span className="rtb-required">*</span>
                  </label>
                  <textarea
                    id="ticket-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the issue in detail…"
                    className="rtb-textarea"
                    required
                  />
                  <span className="rtb-char-count">{form.description.length} chars</span>
                </div>

                {/* ── Section: Image Attachments ── */}
                <div className="rtb-section-label">
                  <ImagePlus size={14} /> Attachments
                  <span className="rtb-section-note">(up to {MAX_IMAGES} images, 5 MB each)</span>
                </div>

                {images.length < MAX_IMAGES && (
                  <div
                    className={`rtb-dropzone ${imageDrag ? "rtb-dropzone-active" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setImageDrag(true); }}
                    onDragLeave={() => setImageDrag(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                  >
                    <Upload size={24} className="rtb-dropzone-icon" />
                    <p className="rtb-dropzone-text">
                      Drag &amp; drop images here, or <span className="rtb-dropzone-link">browse</span>
                    </p>
                    <p className="rtb-dropzone-hint">PNG, JPG, GIF, WebP · Max {MAX_IMAGES - images.length} more</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleFileInput}
                      aria-label="Upload images"
                    />
                  </div>
                )}

                {images.length > 0 && (
                  <div className="rtb-img-list">
                    {images.map(({ file, preview }, idx) => (
                      <ImagePreviewCard
                        key={idx}
                        file={file}
                        preview={preview}
                        onRemove={() => removeImage(idx)}
                      />
                    ))}
                  </div>
                )}

                {/* ── Section: Contact Details ── */}
                <div className="rtb-section-label">
                  <Phone size={14} /> Preferred Contact Details
                </div>
                <div className="rtb-row-3">
                  <div className="rtb-field">
                    <label htmlFor="ticket-contact-name" className="rtb-label">
                      <User size={12} /> Full Name
                    </label>
                    <input
                      id="ticket-contact-name"
                      name="contactName"
                      value={form.contactName}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="rtb-input"
                    />
                  </div>
                  <div className="rtb-field">
                    <label htmlFor="ticket-contact-email" className="rtb-label">
                      <Mail size={12} /> Email
                    </label>
                    <input
                      id="ticket-contact-email"
                      name="contactEmail"
                      type="email"
                      value={form.contactEmail}
                      onChange={handleChange}
                      placeholder="you@university.edu"
                      className="rtb-input"
                    />
                  </div>
                  <div className="rtb-field">
                    <label htmlFor="ticket-contact-phone" className="rtb-label">
                      <Phone size={12} /> Phone
                    </label>
                    <input
                      id="ticket-contact-phone"
                      name="contactPhone"
                      type="tel"
                      value={form.contactPhone}
                      onChange={handleChange}
                      placeholder="+94 77 000 0000"
                      className="rtb-input"
                    />
                  </div>
                </div>

                {/* Error banner */}
                {(status === "error" || errorMsg) && (
                  <div className="rtb-error-banner">
                    <AlertTriangle size={14} />
                    {errorMsg || "Something went wrong. Please try again."}
                  </div>
                )}

                {/* Actions */}
                <div className="rtb-actions">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rtb-btn rtb-btn-ghost"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rtb-btn rtb-btn-primary"
                    disabled={isSubmitting}
                    id="ticket-submit-btn"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="rtb-spin" /> Submitting…</>
                    ) : (
                      <><Send size={16} /> Submit Ticket</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
