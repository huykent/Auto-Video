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
  Sliders, 
  Clock, 
  Share2, 
  Boxes, 
  ChevronRight, 
  Terminal,
  Download
} from 'lucide-react';

export default function LandingPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineProgress, setTimelineProgress] = useState(42);
  const [activeTab, setActiveTab] = useState('shopee');
  const [selectedFilament, setSelectedFilament] = useState('PLA Silk Gold');

  // Animate timeline progress indicator
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimelineProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] left-[-200px] w-[600px] h-[600px] bg-blue-600/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-[1600px] right-[-200px] w-[700px] h-[700px] bg-purple-600/10 blur-[180px] pointer-events-none rounded-full" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-purple-500/25">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Auto-Video <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">v2.0 AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">App Preview</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#exporter" className="hover:text-white transition-colors">E-Commerce</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Dashboard Hub
            </a>
            <a 
              href="#hero" 
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-24 px-6 max-w-7xl mx-auto text-center space-y-10">
        
        {/* Hero Tag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-inner text-xs font-mono text-purple-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Powered by Veo 3 Neural Renderer & MakerWorld API
        </div>

        {/* Hero Headline */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Automate Your <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            Video Production Workflow
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          Transform 3D models, raw images, and product concepts into studio-grade marketing videos automatically. From MakerWorld extraction to Shopee & TikTok Shop publishing in seconds.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="/"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center justify-center gap-3 text-base group"
          >
            <Sparkles className="w-5 h-5 text-purple-200" />
            Start Creating for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#preview"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-lg transition-all duration-300 flex items-center justify-center gap-3 text-base"
          >
            <Play className="w-4 h-4 fill-slate-300" />
            Watch Interactive Demo
          </a>
        </div>

        {/* Centerpiece: Stunning 3D Glassmorphic Timeline Mockup */}
        <div className="pt-12 relative max-w-6xl mx-auto">
          {/* Outer Glowing Border Box */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-purple-500/30 via-blue-500/20 to-transparent shadow-2xl shadow-purple-950/50">
            
            <div className="bg-[#121216]/90 rounded-[15px] p-6 backdrop-blur-2xl border border-white/[0.06] space-y-6 text-left">
              
              {/* Window Bar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-2 pl-3 border-l border-white/[0.08]">
                    <Film className="w-3.5 h-3.5 text-purple-400" /> Auto-Video Studio Timeline // 4K Render Core
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300">
                    <Cpu className="w-3.5 h-3.5 animate-pulse text-purple-400" /> Veo 3 Neural Processing: 98.4%
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    TIMECODE: <span className="text-white font-bold">00:14.28</span>
                  </div>
                </div>
              </div>

              {/* Timeline Editor Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left: Video Canvas Preview */}
                <div className="lg:col-span-5 relative aspect-[9/16] sm:aspect-video lg:aspect-[9/16] bg-slate-950 rounded-xl overflow-hidden border border-white/[0.08] group shadow-inner flex flex-col justify-between p-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-blue-900/20 to-transparent opacity-80" />
                  
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> LIVE PREVIEW 4K
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-400">
                      9:16 VERTICAL
                    </span>
                  </div>

                  {/* Center Mock 3D Model Graphic */}
                  <div className="relative z-10 my-auto text-center space-y-3">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500/20 via-blue-500/30 to-indigo-500/20 border border-purple-400/40 flex items-center justify-center shadow-2xl backdrop-blur-md">
                      <Boxes className="w-12 h-12 text-purple-300 animate-bounce" />
                    </div>
                    <div className="text-xs font-bold text-white tracking-wide">Articulated Dragon 3D</div>
                    <div className="inline-flex gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">PLA Plastic</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Silk Gold</span>
                    </div>
                  </div>

                  {/* Video Play Controls */}
                  <div className="relative z-10 flex items-center justify-between bg-black/60 backdrop-blur p-2 rounded-lg border border-white/[0.06]">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <div className="flex-1 mx-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${timelineProgress}%` }} />
                    </div>
                    <Volume2 className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Right: Multi-track Glassmorphic Timeline Tracks */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Track 1: AI Video Generation Layer */}
                  <div className="bg-slate-900/80 border border-purple-500/20 rounded-xl p-3.5 space-y-2 backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                      <span className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-purple-400" /> Track 01: Veo 3 Neural Video Generation
                      </span>
                      <span className="text-purple-400 font-bold">100% Rendered</span>
                    </div>
                    <div className="h-10 bg-gradient-to-r from-purple-900/50 via-indigo-900/60 to-purple-900/50 rounded-lg border border-purple-500/30 flex items-center px-3 justify-between relative overflow-hidden">
                      <div className="absolute inset-0 bg-purple-500/10 animate-pulse" />
                      <span className="relative z-10 text-xs font-mono text-white flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Prompt: Cinematic Studio 360 Spin...
                      </span>
                      <span className="relative z-10 text-[10px] px-2 py-0.5 rounded bg-purple-500/30 text-purple-200">Veo 3 AI</span>
                    </div>
                  </div>

                  {/* Track 2: Audio Waveform Track */}
                  <div className="bg-slate-900/80 border border-blue-500/20 rounded-xl p-3.5 space-y-2 backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs font-mono text-blue-300">
                      <span className="flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Track 02: Voiceover & Sound Effects
                      </span>
                      <span className="text-blue-400">Speech Synthesized</span>
                    </div>
                    <div className="h-10 bg-slate-950 rounded-lg border border-blue-500/30 flex items-center px-3 gap-1 overflow-hidden">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-blue-500/60 rounded-full transition-all duration-300"
                          style={{ height: `${Math.sin(i * 0.5) * 40 + 50}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Track 3: E-Commerce SEO Subtitles Layer */}
                  <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-3.5 space-y-2 backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" /> Track 03: Shopee / TikTok SEO Captions
                      </span>
                      <span className="text-emerald-400">Formatted</span>
                    </div>
                    <div className="h-10 bg-emerald-950/40 rounded-lg border border-emerald-500/30 flex items-center px-3 justify-between">
                      <span className="text-xs font-mono text-emerald-200 truncate">
                        "Mô hình in 3D Dragon Figurine - Nhựa PLA Cao Cấp"
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Feature Grid Section (Bento Box Layout) */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-16 border-t border-white/[0.08]">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">Cutting-Edge Features</h2>
          <h3 className="text-4xl font-extrabold text-white tracking-tight">
            Built for Modern Creators & E-Commerce Sellers
          </h3>
          <p className="text-slate-400 text-base">
            Everything you need to automate video production from 3D assets to high-converting marketplace listings.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Large 2-column span */}
          <div className="md:col-span-2 bg-[#121216]/80 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 rounded-2xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Wand2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Veo 3 AI Video Generation Engine</h4>
                <p className="text-sm text-slate-400">Neural image-to-video rendering with studio lighting</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Our advanced AI prompt synthesis converts raw product photos and 3D model metadata into 4K 360-degree rotating showcase videos using Google Veo 3 technology.
            </p>

            {/* Sub-preview inside Bento 1 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-white/[0.06] font-mono text-xs text-slate-300 space-y-2">
              <div className="text-purple-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> // Prompt Auto-Synthesizer Output
              </div>
              <div className="text-slate-400 bg-slate-900 p-3 rounded border border-slate-800">
                "A 3D printed Articulated Dragon made of premium PLA plastic filament in Silk Gold color, cinematic studio lighting, 360 degree rotating showcase camera spin, high detail photorealistic 4k."
              </div>
            </div>
          </div>

          {/* Bento Card 2: Auto-Subtitles */}
          <div className="bg-[#121216]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 rounded-2xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Volume2 className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Auto Voiceover & Waveforms</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Synthesize natural human voiceovers in Vietnamese & English with synchronized audio waveforms and dynamic subtitles.
            </p>
          </div>

          {/* Bento Card 3: Batch Queue Rendering */}
          <div className="bg-[#121216]/80 border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 rounded-2xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Batch Queue Worker Engine</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powered by BullMQ and Redis. Render dozens of videos simultaneously in background workers without slowing down your computer.
            </p>
          </div>

          {/* Bento Card 4: 1-Click E-Commerce Publisher */}
          <div className="md:col-span-2 bg-[#121216]/80 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 rounded-2xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">1-Click Shopee & TikTok Shop Exporter</h4>
                <p className="text-sm text-slate-400">Automated SEO titles, descriptions, and zip packaging</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Instantly export ready-to-upload ZIP packages containing formatted MP4 videos, product photos, SEO-optimized titles, and TikTok Shop metadata JSON files.
            </p>

            <div className="flex gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Shopee Import CSV Ready
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> TikTok Shop JSON Validated
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* App Interface Interactive Preview Section */}
      <section id="preview" className="py-24 px-6 max-w-7xl mx-auto space-y-12 border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">Web App Preview</h2>
            <h3 className="text-4xl font-extrabold text-white tracking-tight">Human-in-the-Loop Studio Interface</h3>
          </div>
          <div className="flex bg-slate-900 p-1.5 rounded-xl border border-white/[0.08]">
            <button 
              onClick={() => setActiveTab('shopee')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'shopee' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white'}`}
            >
              Shopee Copywriting
            </button>
            <button 
              onClick={() => setActiveTab('tiktok')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'tiktok' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white'}`}
            >
              TikTok Shop Export
            </button>
          </div>
        </div>

        {/* Studio Dual-Pane Interactive Interface Mockup */}
        <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Pane: Media & Filament Config */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 rounded-xl p-4 border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>MODEL ID: MW-884920</span>
                  <span className="text-purple-400">MAKERWORLD CRAWLED</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Select Filament Material:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['PLA Silk Gold', 'PETG Translucent', 'TPU Flexible', 'ABS Matte Black'].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setSelectedFilament(mat)}
                        className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${selectedFilament === mat ? 'bg-purple-600/20 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Pane: Generated Content Output */}
            <div className="lg:col-span-7 bg-slate-950 rounded-xl p-6 border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" /> Auto-Generated Marketplace Listing
                </h4>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  SEO Optimized
                </span>
              </div>

              {activeTab === 'shopee' ? (
                <div className="space-y-3 text-xs font-mono text-slate-300 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                  <div><span className="text-slate-500">SHOPEE TITLE:</span> <br /><strong className="text-white">Mô hình in 3D Articulated Dragon - Nhựa {selectedFilament} Cao Cấp - Decor Trang Trí</strong></div>
                  <div className="pt-2"><span className="text-slate-500">DESCRIPTION:</span> <br />Chất liệu: Nhựa in 3D {selectedFilament}<br />Thời gian in: 2h 25m | Trọng lượng: 50g<br />#in3d #3dprint #articulateddragon #shopee</div>
                </div>
              ) : (
                <div className="space-y-3 text-xs font-mono text-slate-300 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                  <pre className="text-purple-300 overflow-x-auto">
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

      {/* High-Converting CTA Footer Banner */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-12 bg-gradient-to-r from-blue-900/40 via-purple-900/60 to-indigo-900/40 border border-purple-500/30 shadow-2xl overflow-hidden text-center space-y-8 backdrop-blur-2xl">
          <div className="absolute inset-0 bg-purple-600/10 blur-3xl pointer-events-none" />
          
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight relative z-10">
            Ready to Automate Your Video Creation?
          </h2>

          <p className="text-slate-300 text-base max-w-2xl mx-auto relative z-10">
            Join hundreds of creators and 3D sellers generating viral video ads effortlessly with Auto-Video.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 max-w-md mx-auto">
            <a
              href="/"
              className="w-full px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-xl shadow-purple-600/40 flex items-center justify-center gap-3 text-base"
            >
              <Sparkles className="w-5 h-5 text-purple-200" /> Launch Dashboard Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Auto-Video Pipeline. Built with Next.js 14, BullMQ & Veo 3 AI.</div>
          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-slate-300 transition-colors">Dashboard</a>
            <a href="https://github.com/huykent/Auto-Video" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">GitHub Repository</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
