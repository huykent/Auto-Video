import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Auto-Video | AI Video Production Workflow Automation',
  description: 'Automate your video creation pipeline from 3D models & images to Shopee & TikTok Shop ready packages.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-[#0A0A0A] text-slate-100 min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}
