import React from 'react';
import { db } from '../../lib/db';
import { products } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export const revalidate = 0;

export default async function StudioPage() {
  const readyProducts = await db.select().from(products).where(eq(products.status, 'VIDEO_READY'));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">2. Video & Copywriting Studio</h2>
        <p className="text-slate-400 mt-1">Xem trước video đã sinh, tự động viết bài SEO Shopee/TikTok và xuất gói đăng sàn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {readyProducts.map((prod) => (
          <div key={prod.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-xl">{prod.title}</h3>
            
            <div className="bg-slate-900 rounded-lg p-4 text-xs text-slate-300 space-y-2 border border-slate-700/40">
              <div><strong className="text-purple-400">Prompt AI đã dùng:</strong> {prod.videoPrompt || 'N/A'}</div>
              <div><strong className="text-purple-400">Đường dẫn Video MP4:</strong> {prod.generatedVideoPath || 'N/A'}</div>
            </div>

            <form action="/api/export" method="POST" className="pt-2">
              <input type="hidden" name="productId" value={prod.id} />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-600/20"
              >
                📦 Xuất Gói Bài Đăng TMĐT (ZIP / Text / Media)
              </button>
            </form>
          </div>
        ))}

        {readyProducts.length === 0 && (
          <div className="col-span-full bg-slate-800/40 border border-slate-700/50 rounded-xl p-12 text-center text-slate-400">
            Chưa có Video nào ở trạng thái sẵn sàng. Hãy sang bước 1 để tạo Video AI!
          </div>
        )}
      </div>
    </div>
  );
}
