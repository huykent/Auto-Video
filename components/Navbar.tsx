'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Film, 
  Sparkles, 
  Search, 
  Boxes, 
  PackageCheck, 
  Sliders, 
  Server,
  ArrowRight
} from 'lucide-react';

export default function UnifiedNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Quản Lý Mẫu 3D', path: '/discovery', icon: Search, badge: null },
    { name: 'AI Studio', path: '/studio', icon: Film, badge: 'PRO' },
    { name: 'Gói Bài Đăng', path: '/exports', icon: PackageCheck, badge: null },
    { name: 'API Settings', path: '/settings', icon: Sliders, badge: null },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#06080F]/90 backdrop-blur-2xl px-6 py-3.5 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
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
            <p className="text-[10px] text-slate-400 font-mono">Tự động cào mẫu 3D & dựng Video E-Commerce</p>
          </div>
        </a>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-cyan-500/20 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <a
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
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

        {/* Server Status Badge */}
        <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/20 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>Server 192.168.11.11:3008</span>
        </div>

      </div>
    </header>
  );
}
