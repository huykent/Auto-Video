'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Film, 
  Sparkles, 
  Search, 
  Boxes, 
  PackageCheck, 
  Sliders, 
  Server,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

export default function UnifiedNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Quản Lý Mẫu 3D', shortName: 'Mẫu 3D', path: '/discovery', icon: Search, badge: null },
    { name: 'AI Studio', shortName: 'Studio', path: '/studio', icon: Film, badge: 'PRO' },
    { name: 'Gói Bài Đăng', shortName: 'Bài Đăng', path: '/exports', icon: PackageCheck, badge: null },
    { name: 'API Settings', shortName: 'Cài Đặt', path: '/settings', icon: Sliders, badge: null },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#06080F]/90 backdrop-blur-2xl px-4 sm:px-6 py-3.5 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a href="/discovery" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#06080F] rounded-[11px] flex items-center justify-center">
                <Film className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white tracking-tight font-sans">
                  AUTO-VIDEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">AI</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Tự động cào mẫu 3D & dựng Video E-Commerce</p>
            </div>
          </a>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-cyan-500/20 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative min-h-[40px] ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.name}</span>

                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Server Status Badge (Desktop) & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/20 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>Server Online</span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-cyan-500/20 mt-3 space-y-2 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between min-h-[48px] ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/50'
                      : 'text-slate-300 bg-slate-950/60 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Floating Bottom Bar for Quick Navigation on Smartphones */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#06080F]/95 backdrop-blur-2xl border-t border-cyan-500/20 px-3 py-2 flex items-center justify-around shadow-[0_-4px_30px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all min-h-[48px] min-w-[56px] ${
                isActive
                  ? 'text-cyan-400 font-bold bg-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-1 font-sans leading-none">{item.shortName}</span>
            </a>
          );
        })}
      </div>
    </>
  );
}
