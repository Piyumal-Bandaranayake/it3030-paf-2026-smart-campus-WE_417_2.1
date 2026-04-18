import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  CalendarCheck,
  Wrench,
  Bell,
  Search,
  BookOpen,
  ClipboardList,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axiosConfig";

// ── Count-up hook ──────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ── Stat Card ──────────────────────────────────────────────────
function StatCard({ value, suffix, label, icon: Icon, delay, trigger }) {
  const count = useCountUp(value, 1800, trigger);
  return (
    <div 
      className="group relative flex flex-col items-center rounded-[32px] border border-white/5 bg-slate-900/40 p-8 text-center backdrop-blur-xl transition-all hover:border-indigo-500/30 hover:bg-slate-900/60"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className="text-4xl font-black text-white">
        {count}{suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-slate-400">{label}</div>
    </div>
  );
}

const features = [
  {
    icon: Building2,
    title: "Resource Management",
    desc: "Centralize and track every campus asset — rooms, equipment, and facilities — with real-time availability views.",
    tag: "Core",
    color: "indigo"
  },
  {
    icon: CalendarCheck,
    title: "Booking Management",
    desc: "Reserve spaces and resources in seconds. Approve, modify, or cancel bookings with a streamlined workflow.",
    tag: "Popular",
    color: "blue"
  },
  {
    icon: Wrench,
    title: "Maintenance Tickets",
    desc: "Submit, prioritize, and resolve maintenance issues efficiently with automated routing to the right teams.",
    tag: "Smart",
    color: "purple"
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    desc: "Stay informed with instant alerts on booking confirmations, ticket updates, and resource changes.",
    tag: "Live",
    color: "green"
  },
];

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse Resources",
    desc: "Explore the full catalogue of campus facilities, equipment, and spaces. Filter by type, availability, and location.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Request Booking",
    desc: "Submit a booking request in minutes. Our smart scheduler checks conflicts and confirms in real time.",
  },
  {
    number: "03",
    icon: ClipboardList,
    title: "Track Maintenance",
    desc: "Log issues on the spot, monitor ticket progress, and get notified the moment a fix is completed.",
  },
];

const stats = [
  { value: 100, suffix: "+", label: "Campus Resources",  icon: Building2,     delay: 0   },
  { value: 500, suffix: "+", label: "Bookings Made",     icon: CalendarCheck, delay: 120 },
  { value: 200, suffix: "+", label: "Issues Resolved",   icon: CheckCircle2,  delay: 240 },
  { value: 98,  suffix: "%", label: "Satisfaction Rate", icon: Users,         delay: 360 },
];

export default function Dashboard() {
  const [statsTrigger, setStatsTrigger] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsTrigger(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login_success") === "true") {
      api.get("/api/auth/me")
        .then((res) => {
          sessionStorage.setItem("user", JSON.stringify(res.data));
          window.history.replaceState({}, document.title, window.location.pathname);
          window.location.reload();
        })
        .catch((err) => console.error("Auth failed:", err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-indigo-400 uppercase">
              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
              University Operations Platform
            </div>
            <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
              Smart <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent italic">Campus</span>
              <br />Operations Hub
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              The unified digital backbone for modern university management.
              Seamlessly handle bookings, resources, and maintenance in one place.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)]">
                Get Started <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20">
                Explore Resources <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="relative z-10 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} trigger={statsTrigger} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-20 text-center">
              <h2 className="text-4xl font-bold text-white sm:text-5xl">Everything your campus needs</h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                A unified platform replacing fragmented tools — giving students, staff,
                and facilities teams a seamless experience.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {features.map((f, i) => (
                <div key={i} className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-slate-900/40 p-10 backdrop-blur-xl transition-all hover:border-indigo-500/30">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                    <f.icon size={28} />
                  </div>
                  <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-indigo-400">{f.tag}</span>
                  <h3 className="mb-4 text-2xl font-bold text-white">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-slate-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-20 text-center">
              <h2 className="text-4xl font-bold text-white">How it works</h2>
              <p className="mt-4 text-slate-400">Simple, streamlined, and efficient.</p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={i} className="relative text-center">
                  <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-400">
                    <s.icon size={32} />
                    <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-lg">
                      {s.number}
                    </span>
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-white">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
