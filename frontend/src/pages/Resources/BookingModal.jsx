import { useState } from "react";
import "./Resources.css";

export default function BookingModal({ open, onClose, resource }) {
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert("Booking submitted (we will add logic next)");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Book Resource</h2>

        <p style={{ fontSize: "14px", marginBottom: "10px" }}>
          <strong>{resource?.name}</strong>
        </p>

        <input type="date" name="date" onChange={handleChange} />

        <input type="time" name="startTime" onChange={handleChange} />

        <input type="time" name="endTime" onChange={handleChange} />

        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Confirm Booking</button>
        </div>
      </div>
    </div>
  );
}
