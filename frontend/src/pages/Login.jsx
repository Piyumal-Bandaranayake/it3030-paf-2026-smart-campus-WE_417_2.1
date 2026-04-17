import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Login = () => {
  const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";
  const navigate = useNavigate();

  // After Google redirects back with ?login_success=true,
  // fetch the user from the backend and go to dashboard

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a0f1a] p-4 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 
        PREMIUM BACKGROUND 
        Using multi-layered gradients and animated blobs for depth 
      */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-[70%] w-[70%] animate-blob rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen" />
        <div className="animation-delay-2000 absolute -bottom-1/4 -right-1/4 h-[70%] w-[70%] animate-blob rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      {/* 
        LOGIN CARD 
        Refined glassmorphism with better spacing and contrast
      */}
      <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/40 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-500 hover:border-white/20 sm:p-12">
        
        {/* Logo/Title Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
            <svg 
              className="h-9 w-9 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <h1 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Smart <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Campus</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-px w-4 bg-indigo-500/50"></span>
            <p className="text-[10px] font-bold tracking-[0.3em] text-indigo-400 uppercase">
              Operations Hub
            </p>
            <span className="h-px w-4 bg-indigo-500/50"></span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white sm:text-2xl">Welcome back!</h2>
            <p className="mt-3 px-2 text-sm leading-relaxed text-slate-400">
              Access the campus portal with a single click to manage your bookings and tasks.
            </p>
          </div>
          
          <button 
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-slate-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-[0.98]"
            onClick={handleGoogleLogin}
          >
            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
              alt="Google" 
              className="h-5 w-5"
            />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer Section */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/5 pt-8">
          <p className="text-[11px] font-medium text-slate-500">
            Secure authentication powered by Google
          </p>
          <div className="flex gap-4">
            <div className="h-1 w-1 rounded-full bg-slate-700"></div>
            <div className="h-1 w-1 rounded-full bg-slate-700"></div>
            <div className="h-1 w-1 rounded-full bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
