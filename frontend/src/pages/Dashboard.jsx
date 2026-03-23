import { createElement, useState, useEffect, useRef } from "react";
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
  MapPin,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Github,
  CheckCircle2,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

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
function StatCard({ value, suffix, label, icon, delay, trigger }) {
  const count = useCountUp(value, 1800, trigger);
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-icon-wrap">
        {createElement(icon, { size: 22, strokeWidth: 1.8 })}
      </div>
      <div className="stat-number">
        {count}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────
const features = [
  {
    icon: Building2,
    title: "Resource Management",
    desc: "Centralize and track every campus asset — rooms, equipment, and facilities — with real-time availability views.",
    tag: "Core",
  },
  {
    icon: CalendarCheck,
    title: "Booking Management",
    desc: "Reserve spaces and resources in seconds. Approve, modify, or cancel bookings with a streamlined workflow.",
    tag: "Popular",
  },
  {
    icon: Wrench,
    title: "Maintenance Tickets",
    desc: "Submit, prioritize, and resolve maintenance issues efficiently with automated routing to the right teams.",
    tag: "Smart",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    desc: "Stay informed with instant alerts on booking confirmations, ticket updates, and resource changes.",
    tag: "Live",
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

const heroBars = [
  { label: "Lecture Halls", pct: 87 },
  { label: "Labs",          pct: 63 },
  { label: "Meeting Rooms", pct: 74 },
  { label: "Sports",        pct: 45 },
];

const heroMinis = [
  { val: "14",  color: "var(--green-700)", lbl: "Active Bookings" },
  { val: "3",   color: "#e67e22",          lbl: "Open Tickets"    },
  { val: "98%", color: "var(--green-500)", lbl: "Uptime"          },
];

// ── HomePage ───────────────────────────────────────────────────
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

  return (
    <>
      {/* ── Navbar (separate component) ── */}
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="animate-pulse" />
            University Operations Platform
          </div>
          <h1>
            Smart <em>Campus</em><br />Operations Hub
          </h1>
          <p>
            Manage campus resources, bookings, and maintenance efficiently — all
            from one intelligent platform built for modern universities.
          </p>
          <div className="hero-btns">
            <a href="#" className="btn-primary">
              Get Started <ArrowRight size={16} />
            </a>
            <a href="#" className="btn-secondary">
              Explore Resources <ChevronRight size={16} />
            </a>
          </div>
        </div>

        {/* Dashboard preview card */}
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-header">
              <span className="hero-card-title">Resource Utilisation</span>
              <span className="hero-card-badge">Live</span>
            </div>
            <div className="hero-bar-group">
              {heroBars.map((r) => (
                <div className="hero-bar-row" key={r.label}>
                  <span className="hero-bar-label">{r.label}</span>
                  <div className="hero-bar-track">
                    <div className="hero-bar-fill" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="hero-bar-pct">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-mini-cards">
            {heroMinis.map((m) => (
              <div className="hero-mini" key={m.lbl}>
                <div className="hero-mini-val" style={{ color: m.color }}>{m.val}</div>
                <div className="hero-mini-lbl">{m.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="section-label">Features</div>
        <h2 className="section-title">Everything your campus needs</h2>
        <p className="section-sub">
          A unified platform replacing fragmented tools — giving students, staff,
          and facilities teams a seamless experience.
        </p>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-tag">{f.tag}</span>
              <div className="feature-icon">
                <f.icon size={22} strokeWidth={1.8} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-section">
        <div style={{ textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Process</div>
          <h2 className="section-title">How it works</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            From discovery to resolution in three simple steps — designed for
            everyone on campus.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <div className="step-card" key={s.number}>
              <div className="step-num-wrap">
                <div className="step-num-bg">
                  <s.icon size={28} strokeWidth={1.5} color="var(--green-600)" />
                </div>
                <span className="step-num-label">{s.number}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-inner">
          <div className="stats-header">
            <div className="section-label">Impact</div>
            <h2 className="section-title">Trusted across campus</h2>
            <p className="section-sub">
              Real numbers from real operations — tracking impact across every department.
            </p>
          </div>
          <div className="stats-grid">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} trigger={statsTrigger} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <span className="footer-logo-icon">
                <Building2 size={16} color="white" strokeWidth={2} />
              </span>
              Smart Campus Hub
            </a>
            <p>
              A unified platform for university operations — empowering staff and
              students to manage resources, spaces, and maintenance effortlessly.
            </p>
            <div className="footer-socials">
              {[{ icon: Twitter, label: "Twitter" }, { icon: Linkedin, label: "LinkedIn" }, { icon: Github, label: "GitHub" }].map(
                ({ icon, label }) => (
                  <a key={label} href="#" className="social-btn" aria-label={label}>
                    {createElement(icon, { size: 15 })}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="footer-col">
            <h4>About</h4>
            <ul>
              {["Our Mission", "The Team", "Partnerships", "Press Kit", "Careers"].map((item) => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              {["Resources", "Bookings", "Maintenance", "Dashboard", "API Docs"].map((item) => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact-item"><MapPin size={14} /> University Campus, Main Building</div>
            <div className="footer-contact-item"><Mail size={14} /> support@smarthub.edu</div>
            <div className="footer-contact-item"><Phone size={14} /> +1 (800) 123-4567</div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </>
  );
}
