'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Layers, 
  Cpu, 
  Film, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  Volume2, 
  FileText, 
  Wand2, 
  Boxes, 
  Terminal,
  Activity,
  Globe,
  Radio,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';

export default function LandingPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineProgress, setTimelineProgress] = useState(48);
  const [activeTab, setActiveTab] = useState('shopee');
  const [selectedFilament, setSelectedFilament] = useState('PLA Silk Gold');

  // Animate timeline progress indicator
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimelineProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans relative overflow-hidden">
      
      {/* Sci-Fi Holographic Ambient Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-cyan-500/15 via-purple-600/10 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-[700px] left-[-250px] w-[700px] h-[700px] bg-cyan-600/10 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute top-[1400px] right-[-250px] w-[800px] h-[800px] bg-purple-600/15 blur-[200px] pointer-events-none rounded-full" />

      {/* Cybernetic Grid & Node Matrix Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]" 
        style={{ 
          backgroundImage: `linear-gradient(to right, #00f2fe 1px, transparent 1px), linear-gradient(to bottom, #00f2fe 1px, transparent 1px)`, 
          backgroundSize: '48px 48px' 
        }}
      />

      {/* Top Holographic Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/15 bg-[#06080F]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <div className="w-full h-full bg-[#06080F] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Auto-Video <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono tracking-widest uppercase">Neo-Gravity</span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="/discovery" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-cyan-400" /> Discovery</a>
            <a href="/studio" className="hover:text-cyan-400 transition-colors">Studio</a>
            <a href="/exports" className="hover:text-cyan-400 transition-colors">Exports</a>
            <a href="/settings" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-purple-400" /> Settings</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/discovery" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Dashboard
            </a>
            <a 
              href="/settings" 
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Settings API <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-16 pb-28 px-6 max-w-7xl mx-auto text-center space-y-10">
        
        {/* Holographic Mode Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] text-xs font-mono text-cyan-300">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>PROJECT NEO-GRAVITY // HOLOGRAM CANVAS ACTIVE</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Next-Gen Holographic <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
            AI Video Production Studio
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Manipulate spatial video timelines, synthesize Veo 3 neural render tracks, and publish automated 3D product showcase videos with zero-gravity friction.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
          <a
            href="/discovery"
            className="w-full sm:w-auto px-9 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 text-base group"
          >
            <Sparkles className="w-5 h-5 text-cyan-200" />
            Launch Zero-G Studio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="/settings"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-3 text-base shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            Configure API Keys
          </a>
        </div>

        {/* Centerpiece Mockup */}
        <div className="pt-12 relative max-w-6xl mx-auto">
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-cyan-400/40 via-purple-500/30 to-transparent shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            <div className="bg-[#090D1A]/95 rounded-[23px] p-6 sm:p-8 backdrop-blur-3xl border border-cyan-500/20 space-y-6 text-left relative overflow-hidden">
              
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-cyan-500/15 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
                    <div className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  </div>
                  <span className="text-xs font-mono text-cyan-300 flex items-center gap-2 pl-3 border-l border-cyan-500/20">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" /> SPATIAL CANVAS // VEO-3 NEURAL MATRIX
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> NEURAL CORE: ACTIVE 99.2%
                  </span>
                  <span className="text-slate-400">FRAME: <strong className="text-white font-mono">1440 x 2560 HQ</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                <div className="lg:col-span-5 relative aspect-[9/16] bg-[#050711] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] p-5 flex flex-col justify-between group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-purple-950/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 border border-cyan-400/20 rounded-2xl pointer-events-none" />

                  <div className="relative z-10 flex justify-between items-center">
                    <span className="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> HOLOGRAM VIEWPORT
                    </span>
                    <Maximize2 className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                  </div>

                  <div className="relative z-10 my-auto text-center space-y-4">
                    <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/30 to-indigo-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-xl transform group-hover:scale-105 transition-transform duration-500">
                      <Boxes className="w-14 h-14 text-cyan-300 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">Articulated Dragon 3D</h4>
                      <p className="text-xs text-slate-400 font-mono">MakerWorld ID: MW-884920</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between bg-[#06080F]/90 backdrop-blur-xl p-2.5 rounded-xl border border-cyan-500/30">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-9 h-9 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 flex items-center justify-center text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <div className="flex-1 mx-3 h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
                      <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" style={{ width: `${timelineProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300">00:14.28</span>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="bg-[#080C17]/90 border border-cyan-500/30 rounded-2xl p-5 space-y-3 backdrop-blur-2xl shadow-[0_0_25px_rgba(6,182,212,0.1)]">
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-300 pb-2 border-b border-cyan-500/15">
                      <span className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-cyan-400" /> HOLOGRAM NODE 01 // VEO 3 PROMPT SYNTHESIZER
                      </span>
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">SYNTHESIZED</span>
                    </div>
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-cyan-500/20 font-mono text-xs text-slate-300 leading-relaxed">
                      <span className="text-cyan-400 font-bold">PROMPT:</span> "A 3D printed Articulated Dragon made of premium PLA plastic filament in Silk Gold color, cinematic studio lighting, 360 degree rotating showcase camera spin, high detail photorealistic 4k."
                    </div>
                  </div>

                  <div className="bg-[#080C17]/90 border border-purple-500/30 rounded-2xl p-5 space-y-3 backdrop-blur-2xl shadow-[0_0_25px_rgba(139,92,246,0.1)]">
                    <div className="flex items-center justify-between text-xs font-mono text-purple-300 pb-2 border-b border-purple-500/15">
                      <span className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-purple-400" /> HOLOGRAM NODE 02 // SYNTHESIZED AUDIO WAVEFORMS
                      </span>
                      <span className="text-purple-400">48kHz HD</span>
                    </div>
                    <div className="h-12 bg-slate-950/90 rounded-xl border border-purple-500/30 flex items-center px-4 gap-1 overflow-hidden">
                      {Array.from({ length: 54 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ height: `${Math.sin(i * 0.4) * 45 + 50}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#080C17]/90 border border-emerald-500/30 rounded-2xl p-5 space-y-3 backdrop-blur-2xl shadow-[0_0_25px_rgba(16,185,129,0.1)]">
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-300 pb-2 border-b border-emerald-500/15">
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-400" /> HOLOGRAM NODE 03 // E-COMMERCE EXPORT PACKAGER
                      </span>
                      <span className="text-emerald-400 font-bold">ZIP READY</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Shopee SEO Title Formatted
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> TikTok Shop JSON Validated
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/15 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Auto-Video Neo-Gravity. Inspired by Holographic Spatial Studio.</div>
          <div className="flex items-center gap-6">
            <a href="/discovery" className="hover:text-cyan-400 transition-colors">Discovery</a>
            <a href="/settings" className="hover:text-cyan-400 transition-colors">Settings</a>
            <a href="https://github.com/huykent/Auto-Video" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">GitHub Repository</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
