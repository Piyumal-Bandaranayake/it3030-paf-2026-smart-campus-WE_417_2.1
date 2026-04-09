import { useState } from "react";
import "./Resources.css";

export default function ResourceModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    type: "Lecture Hall",
    location: "",
    capacity: "",
    status: "ACTIVE",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.location) {
      alert("Fill all required fields");
      return;
    }

    onSave({
      ...form,
      capacity: parseInt(form.capacity) || 0,
      util: Math.floor(Math.random() * 80) + 10,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Resource</h2>

        <input name="name" placeholder="Resource Name" onChange={handleChange} />
        <input name="location" placeholder="Location" onChange={handleChange} />
        <input name="capacity" placeholder="Capacity" onChange={handleChange} />

        <select name="type" onChange={handleChange}>
          <option>Lecture Hall</option>
          <option>Lab</option>
          <option>Meeting Room</option>
          <option>Sports</option>
        </select>

        <select name="status" onChange={handleChange}>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
