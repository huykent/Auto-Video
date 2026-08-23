import React from 'react';
import { db } from '../lib/db';
import { products, searchJobs } from '../lib/db/schema';
import { count, eq } from 'drizzle-orm';

export const revalidate = 0;

export default async function OverviewPage() {
  const allProducts = await db.select().from(products);
  const totalDiscovered = allProducts.length;
  const readyForVideo = allProducts.filter((p) => p.status === 'CRAWLED').length;
  const videoReady = allProducts.filter((p) => p.status === 'VIDEO_READY').length;
  const exported = allProducts.filter((p) => p.status === 'EXPORTED').length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Bảng Điều Khiển Tổng Quan</h2>
        <p className="text-slate-400 mt-1">Quản lý quy trình cào dữ liệu, sinh video AI và xuất bài đăng TMĐT</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-xl">
          <div className="text-sm font-medium text-slate-400">Tổng Mẫu Đã Cào</div>
          <div className="text-3xl font-black text-indigo-400 mt-2">{totalDiscovered}</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-xl">
          <div className="text-sm font-medium text-slate-400">Chờ Duyệt Tạo Video</div>
          <div className="text-3xl font-black text-amber-400 mt-2">{readyForVideo}</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-xl">
          <div className="text-sm font-medium text-slate-400">Video Đã Sẵn Sàng</div>
          <div className="text-3xl font-black text-purple-400 mt-2">{videoReady}</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-xl">
          <div className="text-sm font-medium text-slate-400">Gói Bài Đăng Đã Xuất</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">{exported}</div>
        </div>
      </div>

      {/* Crawl Form */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white">Bắt Đầu Cào Mẫu 3D Từ MakerWorld</h3>
        <form action="/api/crawler" method="POST" className="flex gap-4">
          <input
            type="text"
            name="keyword"
            placeholder="Nhập từ khóa (ví dụ: articulated dragon, desk organizer)..."
            required
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/30"
          >
            Tìm & Cào Mẫu
          </button>
        </form>
      </div>

      {/* Recent Scrapes Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white">Danh Sách Mẫu Gần Đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-3">Tiêu Đề</th>
                <th className="p-3">Tác Giả</th>
                <th className="p-3">Loại Nhựa</th>
                <th className="p-3">Màu Nhựa</th>
                <th className="p-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {allProducts.slice(0, 10).map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-700/30">
                  <td className="p-3 font-medium text-slate-100">{prod.title}</td>
                  <td className="p-3 text-slate-400">{prod.author || 'N/A'}</td>
                  <td className="p-3">{JSON.parse(prod.filamentTypes || '[]').join(', ')}</td>
                  <td className="p-3">{JSON.parse(prod.filamentColors || '[]').join(', ')}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {prod.status}
                    </span>
                  </td>
                </tr>
              ))}
              {allProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    Chưa có mẫu 3D nào. Hãy nhập từ khóa ở trên để tìm và cào mẫu!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
