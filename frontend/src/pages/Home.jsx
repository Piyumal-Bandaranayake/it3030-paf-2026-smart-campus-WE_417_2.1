import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, CheckCircle2, Building2, Wrench, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 h-[70%] w-[70%] animate-blob rounded-full bg-indigo-600/10 blur-[120px]" />
            <div className="absolute -bottom-1/4 -right-1/4 h-[70%] w-[70%] animate-blob animation-delay-2000 rounded-full bg-blue-600/10 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-400 mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                </span>
                Next-Gen Campus Management
              </div>
              <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
                Smart Campus <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent italic">Operations Hub</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 sm:text-xl leading-relaxed">
                Empower your institution with a unified platform for resource booking, equipment tracking, and operational efficiency. Experience the future of campus management today.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] active:scale-95">
                  Get Started for Free
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything you need to succeed</h2>
              <p className="mt-4 text-slate-400">Streamline workflows and increase productivity with our powerful tools.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  icon: <Building2 className="text-indigo-400" />,
                  title: "Resource Booking",
                  desc: "Easily book rooms, labs, and event spaces with a real-time availability calendar."
                },
                {
                  icon: <Wrench className="text-blue-400" />,
                  title: "Equipment Tracking",
                  desc: "Monitor and manage inventory, maintenance schedules, and check-outs effortlessly."
                },
                {
                  icon: <ShieldCheck className="text-purple-400" />,
                  title: "Secure Access",
                  desc: "Role-based permissions and secure authentication to keep your data protected."
                },
                {
                  icon: <Zap className="text-yellow-400" />,
                  title: "Real-time Updates",
                  desc: "Instant notifications and updates to keep everyone in the loop at all times."
                },
                {
                  icon: <CheckCircle2 className="text-green-400" />,
                  title: "Compliance Ready",
                  desc: "Automated logging and reporting to meet institutional standards and regulations."
                },
                {
                  icon: <ArrowRight className="text-slate-400" />,
                  title: "And Much More",
                  desc: "Customizable dashboards, analytics, and integrations with your favorite tools."
                }
              ].map((feature, i) => (
                <div key={i} className="group rounded-3xl border border-white/5 bg-slate-800/50 p-8 transition-all hover:border-indigo-500/30 hover:bg-slate-800/80">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[48px] bg-gradient-to-br from-indigo-600 to-blue-700 p-12 lg:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-white/10 blur-[100px]" />
              
              <div className="relative z-10 grid grid-cols-1 gap-12 text-center md:grid-cols-3">
                <div>
                  <div className="text-5xl font-black text-white">99.9%</div>
                  <div className="mt-2 text-indigo-100 font-medium">Platform Uptime</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-white">10k+</div>
                  <div className="mt-2 text-indigo-100 font-medium">Active Users</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-white">24/7</div>
                  <div className="mt-2 text-indigo-100 font-medium">Expert Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
