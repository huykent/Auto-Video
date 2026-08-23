import React from 'react';
import './globals.css';

export const metadata = {
  title: 'MakerWorld Auto-Video & E-Commerce Exporter',
  description: 'Tự động hóa cào mẫu 3D MakerWorld, tạo video AI Veo 3 và xuất bài đăng sàn TMĐT',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-slate-900 text-slate-100 min-h-screen">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                AV
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Auto-Video Pipeline
              </h1>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <a href="/" className="hover:text-indigo-400 transition-colors">
                Dashboard
              </a>
              <a href="/discovery" className="hover:text-indigo-400 transition-colors">
                1. Khám Phá Mẫu
              </a>
              <a href="/studio" className="hover:text-indigo-400 transition-colors">
                2. Video Studio
              </a>
              <a href="/exports" className="hover:text-indigo-400 transition-colors">
                3. Gói Bài Đăng
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
