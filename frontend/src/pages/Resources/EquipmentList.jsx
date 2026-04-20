import { useEffect, useMemo, useState } from "react";
import { Wrench, Search, Calendar, ShieldCheck, Zap, Info } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BookingModal from "./BookingModal";
import api from "../../api/axiosConfig";

const EquipmentList = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/resource/equipment");

        if (!isMounted) {
          return;
        }

        const normalizedResources = (response.data ?? []).map((resource, index) => ({
          ...resource,
          resourceCode: resource.resourceCode || `EQP-${String(index + 1).padStart(3, "0")}`,
          name: resource.name || "Unnamed Equipment",
          description: resource.description || "Standard campus equipment available for academic and research purposes.",
          location: resource.location || "Central Stores",
          status: resource.status || "ACTIVE",
          type: resource.type || "Equipment",
        }));

        setResources(normalizedResources);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError("Unable to load equipment from the backend right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEquipment();

    return () => {
      isMounted = false;
    };
  }, []);

  const equipmentList = useMemo(() => {
    return resources.filter((resource) =>
      resource.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [resources, search]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "OUT_OF_SERVICE": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "MAINTENANCE": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Equipment <span className="text-indigo-400 italic">Booking</span></h1>
            <p className="mt-2 text-slate-400 leading-relaxed">Borrow specialized equipment for your projects and academic needs.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-400 border border-white/5">
              <Zap size={14} className="text-yellow-400" />
              Instant Approval Available
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search equipment by name..."
              className="w-full rounded-2xl border border-white/5 bg-slate-900/50 py-4 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-500">
              Loading equipment...
            </div>
          ) : error ? (
            <div className="col-span-full py-20 text-center text-red-400">
              {error}
            </div>
          ) : equipmentList.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-slate-600">
                <Wrench size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">No equipment found</h3>
              <p className="mt-2 text-slate-500">Try adjusting your search terms.</p>
            </div>
          ) : (
            equipmentList.map((item) => (
              <div key={item.id || item.resourceCode} className="group relative flex flex-col overflow-hidden rounded-[32px] border border-white/5 bg-slate-900/40 backdrop-blur-xl transition-all hover:border-indigo-500/30 hover:bg-slate-900/60">
                <div className="p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                      <Wrench size={24} />
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider ${getStatusColor(item.status)}`}>
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="space-y-3 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <ShieldCheck size={14} className="text-indigo-400" />
                      Certified for University Use
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <Info size={14} className="text-indigo-400" />
                      Located in: <span className="text-slate-300 font-medium">{item.location || "Central Stores"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-4 pt-0">
                  <button 
                    onClick={() => setSelectedResource(item)}
                    disabled={item.status !== "ACTIVE"}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all ${
                      item.status === "ACTIVE"
                        ? "bg-white text-slate-950 hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
                        : "bg-white/5 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <Calendar size={18} />
                    {item.status === "ACTIVE" ? "Book Equipment" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />

      {/* Modal */}
      {selectedResource && (
        <BookingModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};

export default EquipmentList;
