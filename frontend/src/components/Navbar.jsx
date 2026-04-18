import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";

  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Smart<span className="text-indigo-400">Campus</span>
          </span>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">Home</Link>
            <Link to="/resources" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">Resources</Link>
            <Link to="/equipment" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">Equipment</Link>
            <Link to="/dashboard" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">Dashboard</Link>
          </div>
        </div>

        <div>
          <button
            onClick={handleLogin}
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-slate-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
              alt="Google" 
              className="h-4 w-4"
            />
            <span>Login</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;