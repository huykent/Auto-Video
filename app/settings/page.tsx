'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Key, 
  Cpu, 
  CheckCircle2, 
  Save, 
  Sliders, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Server,
  Globe,
  LogIn,
  RefreshCw,
  Mail,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const [veoApiKey, setVeoApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [makerworldToken, setMakerworldToken] = useState('');
  const [makerworldCookie, setMakerworldCookie] = useState('');
  const [makerworldEmail, setMakerworldEmail] = useState('');
  const [makerworldPassword, setMakerworldPassword] = useState('');
  const [aiMode, setAiMode] = useState<'mock' | 'live'>('mock');
  const [maxCrawlItems, setMaxCrawlItems] = useState('10');
  
  const [showVeoKey, setShowVeoKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showMwToken, setShowMwToken] = useState(false);
  const [showMwPass, setShowMwPass] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch current system settings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setVeoApiKey(data.veo_api_key || '');
          setGeminiApiKey(data.gemini_api_key || '');
          setMakerworldToken(data.makerworld_token || '');
          setMakerworldCookie(data.makerworld_cookie || '');
          setMakerworldEmail(data.makerworld_email || '');
          setMakerworldPassword(data.makerworld_password || '');
          setAiMode(data.ai_mode === 'live' ? 'live' : 'mock');
          setMaxCrawlItems(data.max_crawl_items || '10');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load settings', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToastMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          veo_api_key: veoApiKey,
          gemini_api_key: geminiApiKey,
          makerworld_token: makerworldToken,
          makerworld_cookie: makerworldCookie,
          makerworld_email: makerworldEmail,
          makerworld_password: makerworldPassword,
          ai_mode: aiMode,
          max_crawl_items: maxCrawlItems,
        }),
      });

      if (res.ok) {
        setToastMessage('✅ Cấu hình hệ thống đã được lưu thành công!');
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setToastMessage('❌ Có lỗi xảy ra khi lưu cấu hình.');
      }
    } catch (err) {
      setToastMessage('❌ Lỗi kết nối máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoLogin = async () => {
    if (!makerworldEmail || !makerworldPassword) {
      setToastMessage('❌ Vui lòng nhập Email và Mật khẩu MakerWorld trước khi bấm đăng nhập.');
      return;
    }

    setLoggingIn(true);
    setToastMessage('⏳ Đang khởi chạy Playwright ngầm để Đăng nhập MakerWorld...');

    try {
      const res = await fetch('/api/settings/autologin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: makerworldEmail,
          password: makerworldPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) setMakerworldToken(data.token);
        if (data.cookie) setMakerworldCookie(data.cookie);
        setToastMessage('🎉 Đăng nhập thành công! Auth Token & Cookie đã được trích xuất và lưu vào hệ thống.');
      } else {
        setToastMessage(`❌ Đăng nhập thất bại: ${data.error || 'Có lỗi xảy ra.'}`);
      }
    } catch (err: any) {
      setToastMessage(`❌ Lỗi kết nối đăng nhập: ${err.message}`);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/15 bg-[#06080F]/80 backdrop-blur-2xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 rounded-xl bg-slate-900 border border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-[#06080F] rounded-[7px] flex items-center justify-center">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">System Settings & API Manager</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/30">
            <Server className="w-3.5 h-3.5" /> 192.168.11.11 // PORT 3008
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {toastMessage && (
          <div className={`p-4 rounded-xl text-sm font-medium border backdrop-blur-xl ${toastMessage.includes('✅') || toastMessage.includes('🎉') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : toastMessage.includes('⏳') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
            {toastMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-mono text-sm animate-pulse">
            Loading System Settings...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Card 1: AI Execution Mode */}
            <div className="bg-[#090D1A] border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-5 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Chế Độ Khởi Chạy AI Video Engine</h3>
                    <p className="text-xs text-slate-400">Chuyển đổi giữa chế độ Mock Thử nghiệm và Chế độ Live Production</p>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${aiMode === 'live' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'}`}>
                  {aiMode === 'live' ? 'LIVE PRODUCTION MODE' : 'MOCK TESTING MODE'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAiMode('mock')}
                  className={`p-4 rounded-xl border text-left space-y-2 transition-all ${aiMode === 'mock' ? 'bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Mock Mode (Thử nghiệm)
                  </div>
                  <p className="text-xs text-slate-400">Tạo Video giả định thành công mà không tiêu tốn API Credit thực tế.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setAiMode('live')}
                  className={`p-4 rounded-xl border text-left space-y-2 transition-all ${aiMode === 'live' ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Live Production Mode
                  </div>
                  <p className="text-xs text-slate-400">Gửi Prompt trực tiếp tới Google Veo 3 API để render Video 4K thực tế.</p>
                </button>
              </div>
            </div>

            {/* Card 2: MakerWorld Account Auth & Auto-Login Engine */}
            <div className="bg-[#090D1A] border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-5 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">MakerWorld Cloudflare Authentication (Auto-Login & Cookie Engine)</h3>
                    <p className="text-xs text-slate-400">Tự động đăng nhập ngầm để bóc tách Auth Token và Cookie bypass 100% Cloudflare</p>
                  </div>
                </div>
              </div>

              {/* Account Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> EMAIL TÀI KHOẢN MAKERWORLD:
                  </label>
                  <input
                    type="email"
                    value={makerworldEmail}
                    onChange={(e) => setMakerworldEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" /> MẬT KHẨU MAKERWORLD:
                  </label>
                  <div className="relative">
                    <input
                      type={showMwPass ? 'text' : 'password'}
                      value={makerworldPassword}
                      onChange={(e) => setMakerworldPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-purple-500/30 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-purple-400 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMwPass(!showMwPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showMwPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Auto Login Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleAutoLogin}
                  disabled={loggingIn || !makerworldEmail || !makerworldPassword}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 transition-all text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                >
                  {loggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  {loggingIn ? 'Đang Đăng Nhập Ngầm...' : '🚀 Tự Động Đăng Nhập & Lấy Cookie Ngầm'}
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-cyan-500/15">
                {/* MakerWorld Token */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-emerald-300 flex items-center justify-between">
                    <span>EXTRACTED AUTHORIZATION BEARER TOKEN:</span>
                    <span className="text-slate-500 text-[10px]">Tự động điền sau khi bấm đăng nhập</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showMwToken ? 'text' : 'password'}
                      value={makerworldToken}
                      onChange={(e) => setMakerworldToken(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMwToken(!showMwToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showMwToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* MakerWorld Cookie */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-cyan-300 flex items-center justify-between">
                    <span>EXTRACTED BROWSER COOKIE:</span>
                    <span className="text-slate-500 text-[10px]">Tự động điền sau khi bấm đăng nhập</span>
                  </label>
                  <textarea
                    rows={2}
                    value={makerworldCookie}
                    onChange={(e) => setMakerworldCookie(e.target.value)}
                    placeholder="t=...; cf_clearance=...; _ga=..."
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: API Keys Configuration */}
            <div className="bg-[#090D1A] border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-5 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="flex items-center gap-3 pb-4 border-b border-cyan-500/15">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Cấu Hình API Credentials</h3>
                  <p className="text-xs text-slate-400">Quản lý các khóa API dịch vụ Google Veo 3 và Gemini AI</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Veo 3 Key */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-cyan-300 flex items-center justify-between">
                    <span>GOOGLE VEO 3 API KEY:</span>
                    <span className="text-slate-500 text-[10px]">Lưu bảo mật trong SQLite Database</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showVeoKey ? 'text' : 'password'}
                      value={veoApiKey}
                      onChange={(e) => setVeoApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowVeoKey(!showVeoKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showVeoKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Gemini Key */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-purple-300 flex items-center justify-between">
                    <span>GEMINI AI COPYWRITING API KEY:</span>
                    <span className="text-slate-500 text-[10px]">Sinh bài viết Shopee & TikTok SEO</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showGeminiKey ? 'text' : 'password'}
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-slate-950 border border-purple-500/30 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-purple-400 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Crawler Settings */}
            <div className="bg-[#090D1A] border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-5 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="flex items-center gap-3 pb-4 border-b border-cyan-500/15">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Cấu Hình Scraper Settings</h3>
                  <p className="text-xs text-slate-400">Thiết lập tham số mặc định cho MakerWorld Engine</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Số lượng mẫu 3D cào mặc định mỗi từ khóa:</label>
                <div className="grid grid-cols-4 gap-3">
                  {['5', '10', '20', '50'].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setMaxCrawlItems(count)}
                      className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition-all ${maxCrawlItems === count ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      {count} mẫu
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Đang Lưu...' : 'Lưu Cấu Hình System Settings'}
              </button>
            </div>

          </form>
        )}

      </main>

    </div>
  );
}
