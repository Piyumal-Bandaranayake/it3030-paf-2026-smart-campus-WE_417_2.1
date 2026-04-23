import { useEffect, useMemo, useState } from "react";
import "./Resources.css";
import BookingModal from "./BookingModal";
import api from "../../api/axiosConfig";
import { Clock } from "lucide-react";

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
  const [hours, minutes] = timeStr.split(":");
  let h = parseInt(hours, 10);
  const m = minutes || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${h}.${m}${ampm}`;
};

const initialResources = [
  { id: 1, name: "Lecture Hall A", type: "Lecture Hall", location: "1st Floor", capacity: 120, status: "ACTIVE", util: 87 },
  { id: 2, name: "Computer Lab 1", type: "Lab", location: "3rd Floor", capacity: 40, status: "ACTIVE", util: 63 },
  { id: 3, name: "Meeting Room B", type: "Meeting Room", location: "2nd Floor", capacity: 12, status: "OUT_OF_SERVICE", util: 0 },
  { id: 4, name: "Sports Complex", type: "Sports", location: "Ground Floor", capacity: 200, status: "ACTIVE", util: 45 },
];

export default function UserResourceList() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/resource");
        setResources(response.data || []);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
        setError("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // 🔥 NEW STATES
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  /* FILTER */
  const filtered = useMemo(() => {
    return resources.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter === "" || r.status === statusFilter)
    );
  }, [resources, search, statusFilter]);

  return (
    <div className="page">

      {/* TITLE */}
      <h1 className="title">Available Resources</h1>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTER */}
      <div className="filter">
        {["", "ACTIVE", "OUT_OF_SERVICE"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={statusFilter === s ? "active" : ""}
          >
            {s || "ALL"}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Type</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Util</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  Loading resources...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "red" }}>
                  {error}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  No resources available
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="resource">
                      <div className="icon">{r.type[0]}</div>
                      <div>
                        <div>{r.name}</div>
                        <small>RES-{String(r.id).padStart(3, "0")}</small>
                      </div>
                    </div>
                  </td>

                  <td>{r.type}</td>
                  <td>{r.location}</td>
                  <td>{r.capacity}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Clock size={14} color="gray" />
                      {formatTime(r.startTime || "08:00")} - {formatTime(r.endTime || "19:00")}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`status ${
                        r.status === "ACTIVE"
                          ? "active-status"
                          : "out-status"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* UTIL */}
                  <td>
                    <div className="util-bar">
                      <div className="bar">
                        <div
                          className="fill"
                          style={{ width: `${r.util}%` }}
                        ></div>
                      </div>
                      {r.util}%
                    </div>
                  </td>

                  {/* BOOK BUTTON */}
                  <td>
                    {r.status === "ACTIVE" ? (
                      <button
                        className="add-btn"
                        onClick={() => {
                          setSelectedResource(r);
                          setModalOpen(true);
                        }}
                      >
                        Book
                      </button>
                    ) : (
                      <span style={{ color: "gray" }}>Unavailable</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 BOOKING MODAL */}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        resource={selectedResource}
      />
    </div>
  );
}
