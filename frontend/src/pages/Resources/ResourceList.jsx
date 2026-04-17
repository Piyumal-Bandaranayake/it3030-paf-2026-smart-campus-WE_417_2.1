import { useMemo, useState } from "react";
import "./Resources.css";
import ResourceModal from "./ResourceModal";

const PER_PAGE = 6;

const initialResources = [
  { id: 1, name: "Lecture Hall A", type: "Lecture Hall", location: "1st Floor", capacity: 120, status: "ACTIVE", util: 87 },
  { id: 2, name: "Computer Lab 1", type: "Lab", location: "3rd Floor", capacity: 40, status: "ACTIVE", util: 63 },
  { id: 3, name: "Meeting Room B", type: "Meeting Room", location: "2nd Floor", capacity: 12, status: "OUT_OF_SERVICE", util: 0 },
  { id: 4, name: "Sports Complex", type: "Sports", location: "Ground Floor", capacity: 200, status: "ACTIVE", util: 45 },
  { id: 5, name: "Research Lab 2", type: "Lab", location: "4th Floor", capacity: 25, status: "MAINTENANCE", util: 30 },
  { id: 6, name: "Conference Room A", type: "Meeting Room", location: "2nd Floor", capacity: 20, status: "ACTIVE", util: 74 },
];

export default function ResourceList() {
  const [resources, setResources] = useState(initialResources);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  /* FILTER */
  const filtered = useMemo(() => {
    return resources.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter === "" || r.status === statusFilter)
    );
  }, [resources, search, statusFilter]);

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ADD */
  const addResource = (newRes) => {
    setResources((prev) => [
      ...prev,
      { id: prev.length + 1, ...newRes },
    ]);
  };

  /* DELETE */
  const deleteResource = (id) => {
    if (!window.confirm("Delete this resource?")) return;
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="page">

      {/* TITLE */}
      <h1 className="title">Resource Management</h1>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="add-btn" onClick={() => setModalOpen(true)}>
          + Add
        </button>
      </div>

      {/* FILTER */}
      <div className="filter">
        {["", "ACTIVE", "OUT_OF_SERVICE", "MAINTENANCE"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={statusFilter === s ? "active" : ""}
          >
            {s || "ALL"}
          </button>
        ))}
        <button onClick={() => navigate("/equipment")}>
          Equipments
        </button>
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
              <th>Status</th>
              <th>Util</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {current.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No resources found
                </td>
              </tr>
            ) : (
              current.map((r) => (
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

                  {/* STATUS */}
                  <td>
                    <span
                      className={`status ${
                        r.status === "ACTIVE"
                          ? "active-status"
                          : r.status === "OUT_OF_SERVICE"
                          ? "out-status"
                          : "maint-status"
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

                  {/* ACTIONS */}
                  <td className="actions">
                    <button className="edit">Edit</button>
                    <button
                      className="delete"
                      onClick={() => deleteResource(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? "active-page" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODAL */}
      <ResourceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addResource}
      />
    </div>
  );
}