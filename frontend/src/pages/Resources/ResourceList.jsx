import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Building2, MapPin, Users } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ResourceModal from "./ResourceModal";
import BookingModal from "./BookingModal";
import api from "../../api/axiosConfig";

const PER_PAGE = 6;

export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/resource");

        if (!isMounted) {
          return;
        }

        const normalizedResources = (response.data ?? []).map((resource, index) => ({
          ...resource,
          resourceCode: resource.resourceCode || `RES-${String(index + 1).padStart(3, "0")}`,
          name: resource.name || "Unnamed Resource",
          type: resource.type || "Unknown",
          location: resource.location || "Not specified",
          capacity: resource.capacity ?? 0,
          status: resource.status || "ACTIVE",
        }));

        setResources(normalizedResources);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError("Unable to load resources from the backend right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResources();

    return () => {
      isMounted = false;
    };
  }, []);

  /* FILTER */
  const filtered = useMemo(() => {
    return resources.filter(
      (r) =>
        (r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.type.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "" || r.status === statusFilter)
    );
  }, [resources, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "OUT_OF_SERVICE": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "MAINTENANCE": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Resource <span className="text-indigo-400">Management</span></h1>
            <p className="mt-2 text-slate-400">Monitor and manage all campus facilities and equipment in real-time.</p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by name or type..."
              className="w-full rounded-2xl border border-white/5 bg-slate-900/50 py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 lg:col-span-2">
            {["", "ACTIVE", "OUT_OF_SERVICE", "MAINTENANCE"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-1 rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  statusFilter === s 
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400" 
                    : "border-white/5 bg-slate-900/50 text-slate-500 hover:bg-white/5"
                }`}
              >
                {s || "All Status"}
              </button>
            ))}
          </div>
        </div>

        {/* Table/Cards Container */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Resource</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Location</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Capacity</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      Loading resources...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-red-400">
                      {error}
                    </td>
                  </tr>
                ) : current.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 size={32} className="opacity-20" />
                        <span>No resources found matching your criteria</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  current.map((r) => (
                    <tr key={r.id || r.resourceCode} className="group transition-colors hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 font-bold">
                            {r.type[0]}
                          </div>
                          <div>
                            <div className="font-bold text-white">{r.name}</div>
                            <div className="text-[10px] font-medium text-slate-500 uppercase">{r.resourceCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{r.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin size={14} className="text-slate-500" />
                          {r.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Users size={14} className="text-slate-500" />
                          {r.capacity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusColor(r.status)}`}>
                          {r.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {r.status === "ACTIVE" ? (
                            <button
                              onClick={() => {
                                setSelectedResource(r);
                                setBookingModalOpen(true);
                              }}
                              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-indigo-500"
                            >
                              Book
                            </button>
                          ) : (
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-900/50 text-slate-400 transition-all hover:bg-white/5 disabled:opacity-20"
            >
              <ChevronLeft size={18} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                  page === i + 1 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "border border-white/5 bg-slate-900/50 text-slate-500 hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-900/50 text-slate-400 transition-all hover:bg-white/5 disabled:opacity-20"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>

      <Footer />

      <ResourceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addResource}
      />

      <BookingModal
        open={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedResource(null);
        }}
        resource={selectedResource}
      />
    </div>
  );
}
