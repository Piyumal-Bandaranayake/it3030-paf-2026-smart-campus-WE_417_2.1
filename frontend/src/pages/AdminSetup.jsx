import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import api from "../api/axiosConfig";

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSetupAdmin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.get("/api/auth/setup-admin");
      setResult(response.data);
    } catch (err) {
      console.error("Setup failed:", err);
      if (err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : err.response.data.message);
      } else {
        setError("Failed to setup admin. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "http://localhost:8080/logout";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/60 backdrop-blur-xl p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Admin Setup</h1>
            <p className="text-slate-400">Set up the first administrator account for your Smart Campus system</p>
          </div>

          {/* Info Box */}
          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-6 mb-8">
            <div className="flex gap-3">
              <AlertTriangle className="text-blue-400 shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-200">
                <p className="font-bold mb-2">First-Time Setup</p>
                <p className="text-blue-300/80">
                  This endpoint allows you to set yourself as the first admin user. 
                  It only works if no admin exists in the system yet. After setup, 
                  you'll need to log out and log back in for the changes to take effect.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!result && !error && (
            <button
              onClick={handleSetupAdmin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting up..." : "Make Me Admin"}
              {!loading && <ArrowRight size={18} />}
            </button>
          )}

          {/* Success Result */}
          {result && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6">
                <div className="flex gap-3 mb-4">
                  <CheckCircle className="text-emerald-400 shrink-0" size={24} />
                  <div>
                    <p className="font-bold text-emerald-400 mb-1">Success!</p>
                    <p className="text-sm text-emerald-200/80">{result.message}</p>
                  </div>
                </div>
                {result.user && (
                  <div className="mt-4 pt-4 border-t border-emerald-500/20">
                    <p className="text-xs text-emerald-300/60 mb-2">Your Details:</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-emerald-200"><span className="text-emerald-400/60">Name:</span> {result.user.name}</p>
                      <p className="text-emerald-200"><span className="text-emerald-400/60">Email:</span> {result.user.email}</p>
                      <p className="text-emerald-200"><span className="text-emerald-400/60">Role:</span> {result.user.role}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-all"
                >
                  Log Out & Log Back In
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  Go to Home
                </button>
              </div>
            </div>
          )}

          {/* Error Result */}
          {error && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6">
                <div className="flex gap-3">
                  <AlertTriangle className="text-red-400 shrink-0" size={24} />
                  <div>
                    <p className="font-bold text-red-400 mb-1">Setup Failed</p>
                    <p className="text-sm text-red-200/80">{error}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setError(null); setResult(null); }}
                  className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-all"
                >
                  Go to Home
                </button>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-xs text-slate-500 text-center">
              Need help? Check the <span className="text-indigo-400 font-bold">ADMIN_SETUP.md</span> file in the project root for detailed instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
