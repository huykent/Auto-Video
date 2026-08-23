import React from 'react';
import { db } from '../../lib/db';
import { products } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export const revalidate = 0;

export default async function DiscoveryPage() {
  const crawledProducts = await db.select().from(products).where(eq(products.status, 'CRAWLED'));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">1. Duyệt Mẫu & Tạo Video AI</h2>
        <p className="text-slate-400 mt-1">Kiểm tra thông tin nhựa, chọn ảnh và bấm sinh video từ API Veo 3</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crawledProducts.map((prod) => {
          const types = JSON.parse(prod.filamentTypes || '[]');
          const colors = JSON.parse(prod.filamentColors || '[]');
          const images = JSON.parse(prod.rawImages || '[]');

          return (
            <div key={prod.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl space-y-4 p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-44 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700/40">
                  {images[0] ? (
                    <img src={images[0]} alt={prod.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-600">No Image Preview</span>
                  )}
                </div>
                <h3 className="font-bold text-white text-lg line-clamp-1">{prod.title}</h3>
                <div className="text-xs text-slate-400 space-y-1">
                  <div><strong className="text-slate-300">Tác giả:</strong> {prod.author || 'Maker'}</div>
                  <div><strong className="text-slate-300">Loại nhựa:</strong> {types.join(', ')}</div>
                  <div><strong className="text-slate-300">Màu sắc:</strong> {colors.join(', ')}</div>
                </div>
              </div>

              <form action="/api/video" method="POST" className="pt-2">
                <input type="hidden" name="productId" value={prod.id} />
                <input type="hidden" name="coverImage" value={images[0] || ''} />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-purple-600/20"
                >
                  🚀 Sinh Video Veo 3
                </button>
              </form>
            </div>
          );
        })}

        {crawledProducts.length === 0 && (
          <div className="col-span-full bg-slate-800/40 border border-slate-700/50 rounded-xl p-12 text-center text-slate-400">
            Không có mẫu nào đang chờ duyệt. Hãy tìm kiếm từ khóa ở Bảng Điều Khiển!
          </div>
        )}
      </div>
    </div>
  );
}
