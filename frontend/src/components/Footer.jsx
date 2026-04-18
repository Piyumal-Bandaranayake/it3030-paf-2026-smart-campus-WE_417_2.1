import React from 'react';
import { Twitter, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Smart<span className="text-indigo-400">Campus</span>
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Revolutionizing campus operations through intelligent automation and seamless resource management. Join us in building the campus of the future.
            </p>
            <div className="mt-8 flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-indigo-500 hover:text-indigo-400">
                <Twitter size={18} />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-indigo-500 hover:text-indigo-400">
                <Linkedin size={18} />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-indigo-500 hover:text-indigo-400">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Platform</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">Resources</a></li>
              <li><a href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">Equipment</a></li>
              <li><a href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">Dashboard</a></li>
              <li><a href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={16} className="text-indigo-400" />
                support@smartcampus.io
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone size={16} className="text-indigo-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={16} className="text-indigo-400" />
                Silicon Valley, CA
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/5 pt-8 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
