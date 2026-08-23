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
      
      {/* Sci-Fi Holographic Ambient Glow Gradients (Inspired by Zero-G Holographic Studio) */}
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
            <a href="#hero" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-cyan-400" /> Spatial Studio</a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#preview" className="hover:text-cyan-400 transition-colors">Hologram Preview</a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">Workflow</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Dashboard
            </a>
            <a 
              href="#hero" 
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Enter Studio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section: Holographic Floating Spatial Canvas */}
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
            href="/"
            className="w-full sm:w-auto px-9 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 text-base group"
          >
            <Sparkles className="w-5 h-5 text-cyan-200" />
            Launch Zero-G Studio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#preview"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-3 text-base shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
            Inspect Hologram Preview
          </a>
        </div>

        {/* CENTERPIECE: Floating Holographic Spatial Canvas (Inspired by User Image) */}
        <div className="pt-12 relative max-w-6xl mx-auto">
          
          {/* Floating UI Container */}
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-cyan-400/40 via-purple-500/30 to-transparent shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            
            <div className="bg-[#090D1A]/95 rounded-[23px] p-6 sm:p-8 backdrop-blur-3xl border border-cyan-500/20 space-y-6 text-left relative overflow-hidden">
              
              {/* Sci-Fi Top Status Ribbon */}
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

              {/* Floating Holographic Grid: 3 Floating Interactive Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Holographic Panel 1: Video Viewport */}
                <div className="lg:col-span-5 relative aspect-[9/16] bg-[#050711] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] p-5 flex flex-col justify-between group">
                  
                  {/* Holographic Grid overlay inside player */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-purple-950/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 border border-cyan-400/20 rounded-2xl pointer-events-none" />

                  {/* Top Floating Badge */}
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> HOLOGRAM VIEWPORT
                    </span>
                    <Maximize2 className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                  </div>

                  {/* Center Floating 3D Model Card */}
                  <div className="relative z-10 my-auto text-center space-y-4">
                    <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/30 to-indigo-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-xl transform group-hover:scale-105 transition-transform duration-500">
                      <Boxes className="w-14 h-14 text-cyan-300 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">Articulated Dragon 3D</h4>
                      <p className="text-xs text-slate-400 font-mono">MakerWorld ID: MW-884920</p>
                    </div>
                    <div className="flex justify-center gap-2">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">PLA Silk Gold</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">4K 60FPS</span>
                    </div>
                  </div>

                  {/* Player Control Toolbar */}
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

                {/* Holographic Panel 2 & 3: Floating Multi-Track Matrix */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  
                  {/* Floating Holographic Window: "NEURAL FEEDBACK & PROMPT" */}
                  <div className="bg-[#080C17]/90 border border-cyan-500/30 rounded-2xl p-5 space-y-3 backdrop-blur-2xl shadow-[0_0_25px_rgba(6,182,212,0.1)] transform hover:-translate-y-1 transition-transform duration-300">
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

                  {/* Floating Holographic Window: "AUDIO & SUBTITLE TRACKS" */}
                  <div className="bg-[#080C17]/90 border border-purple-500/30 rounded-2xl p-5 space-y-3 backdrop-blur-2xl shadow-[0_0_25px_rgba(139,92,246,0.1)] transform hover:-translate-y-1 transition-transform duration-300">
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

                  {/* Floating Holographic Window: "SPATIAL EXPORT OPS" */}
                  <div className="bg-[#080C17]/90 border border-emerald-500/30 rounded-2xl p-5 space-y-3 backdrop-blur-2xl shadow-[0_0_25px_rgba(16,185,129,0.1)] transform hover:-translate-y-1 transition-transform duration-300">
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

      {/* Feature Grid: Spatial Bento Box (Inspired by Holographic Modules) */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-16 border-t border-cyan-500/15">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> SPATIAL BENTO MATRIX
          </h2>
          <h3 className="text-4xl font-extrabold text-white tracking-tight">
            High-Performance Automated Modules
          </h3>
          <p className="text-slate-400 text-base">
            Every subsystem functions as an autonomous neural node for effortless video creation and publishing.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 2-column span */}
          <div className="md:col-span-2 bg-[#090D1A]/80 border border-cyan-500/25 hover:border-cyan-400/50 transition-all duration-300 rounded-2xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Wand2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Veo 3 Neural Video Synthesizer</h4>
                <p className="text-sm text-cyan-400 font-mono">Image-to-Video 4K Camera Rotation</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Transforms 3D print photos and model metadata into cinematic 360-degree product showcases with realistic plastic lighting reflections.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/20 font-mono text-xs text-slate-300">
              <div className="text-cyan-400 flex items-center gap-2 pb-1">
                <Terminal className="w-4 h-4" /> // Live Terminal Stream
              </div>
              <div className="text-slate-400 bg-[#06080F] p-3 rounded border border-cyan-500/20">
                [Worker Job #982] Prompt verified $\rightarrow$ Veo 3 Neural Engine Rendering 4K MP4...
              </div>
            </div>
          </div>

          {/* Card 2: Voiceover */}
          <div className="bg-[#090D1A]/80 border border-purple-500/25 hover:border-purple-400/50 transition-all duration-300 rounded-2xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Volume2 className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">AI Voiceover & Waveforms</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Synthesize natural human audio tracks and dynamic animated soundwave visualizers for TikTok & Shopee.
            </p>
          </div>

          {/* Card 3: Batch Queue */}
          <div className="bg-[#090D1A]/80 border border-emerald-500/25 hover:border-emerald-400/50 transition-all duration-300 rounded-2xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">BullMQ Worker Cluster</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Process dozens of crawling, video generation, and packaging jobs concurrently in Redis background threads.
            </p>
          </div>

          {/* Card 4: E-Commerce Publisher */}
          <div className="md:col-span-2 bg-[#090D1A]/80 border border-cyan-500/25 hover:border-cyan-400/50 transition-all duration-300 rounded-2xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">1-Click Shopee & TikTok Shop Exporter</h4>
                <p className="text-sm text-slate-400">Automated SEO descriptions, tags, and ZIP packages</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Instantly export ready-to-upload ZIP packages containing formatted MP4 videos, product photos, SEO titles, and JSON metadata.
            </p>
          </div>

        </div>
      </section>

      {/* Holographic Interactive App Preview Section */}
      <section id="preview" className="py-24 px-6 max-w-7xl mx-auto space-y-12 border-t border-cyan-500/15">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">HOLOGRAM PREVIEW</h2>
            <h3 className="text-4xl font-extrabold text-white tracking-tight">Zero-G Human-in-the-Loop Studio</h3>
          </div>
          <div className="flex bg-[#080C17] p-1.5 rounded-xl border border-cyan-500/30">
            <button 
              onClick={() => setActiveTab('shopee')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'shopee' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'}`}
            >
              Shopee Copywriting
            </button>
            <button 
              onClick={() => setActiveTab('tiktok')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'tiktok' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'}`}
            >
              TikTok Shop JSON
            </button>
          </div>
        </div>

        {/* Dual-Pane Studio Mockup */}
        <div className="bg-[#090D1A] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Pane: Config */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-cyan-500/20 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>MODEL: MW-884920</span>
                  <span className="text-cyan-400 font-bold">MAKERWORLD CRAWLED</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Select Filament Material & Palette:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['PLA Silk Gold', 'PETG Translucent', 'TPU Flexible', 'ABS Matte Black'].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setSelectedFilament(mat)}
                        className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${selectedFilament === mat ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Pane: Generated Content */}
            <div className="lg:col-span-7 bg-slate-950 rounded-xl p-6 border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Auto-Generated Listing
                </h4>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  SEO Validated
                </span>
              </div>

              {activeTab === 'shopee' ? (
                <div className="space-y-3 text-xs font-mono text-slate-300 bg-[#06080F] p-4 rounded-lg border border-cyan-500/20">
                  <div><span className="text-slate-500">SHOPEE TITLE:</span> <br /><strong className="text-white">Mô hình in 3D Articulated Dragon - Nhựa {selectedFilament} Cao Cấp - Decor Trang Trí</strong></div>
                  <div className="pt-2"><span className="text-slate-500">DESCRIPTION:</span> <br />Chất liệu: Nhựa in 3D {selectedFilament}<br />Thời gian in: 2h 25m | Trọng lượng: 50g<br />#in3d #3dprint #articulateddragon #shopee</div>
                </div>
              ) : (
                <div className="space-y-3 text-xs font-mono text-slate-300 bg-[#06080F] p-4 rounded-lg border border-cyan-500/20">
                  <pre className="text-cyan-300 overflow-x-auto">
{JSON.stringify({
  product_name: `[In 3D] Articulated Dragon - ${selectedFilament}`,
  category_id: 100234,
  material: selectedFilament,
  export_status: "READY_FOR_IMPORT"
}, null, 2)}
                  </pre>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Sci-Fi Call to Action Footer Banner */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-12 bg-gradient-to-r from-cyan-950/60 via-purple-950/70 to-indigo-950/60 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden text-center space-y-8 backdrop-blur-3xl">
          
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight relative z-10">
            Ready for Zero-Gravity Video Automation?
          </h2>

          <p className="text-slate-300 text-base max-w-2xl mx-auto relative z-10">
            Experience the future of AI video production today with Auto-Video Neo-Gravity.
          </p>

          <div className="flex justify-center relative z-10 max-w-md mx-auto">
            <a
              href="/"
              className="w-full px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 text-base"
            >
              <Sparkles className="w-5 h-5 text-cyan-200" /> Enter Dashboard Studio
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/15 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Auto-Video Neo-Gravity. Inspired by Holographic Spatial Studio.</div>
          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-cyan-400 transition-colors">Dashboard</a>
            <a href="https://github.com/huykent/Auto-Video" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">GitHub Repository</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
