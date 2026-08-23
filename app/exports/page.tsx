import React from 'react';
import { db } from '../../lib/db';
import { products } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';

export const revalidate = 0;

export default async function ExportsPage() {
  const exportedProducts = await db.select().from(products).where(eq(products.status, 'EXPORTED'));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">3. Quản Lý Gói Bài Đăng Đã Xuất</h2>
        <p className="text-slate-400 mt-1">Danh sách bài đăng đã hoàn thiện sẵn sàng tải về đăng lên Shopee & TikTok Shop</p>
      </div>

      <div className="space-y-4">
        {exportedProducts.map((prod) => (
          <div key={prod.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-400 text-lg">{prod.exportTitle || prod.title}</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-semibold">
                EXPORTED
              </span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-lg text-sm text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto border border-slate-700/40 font-mono">
              {prod.exportDescription}
            </div>

            <div className="text-xs text-slate-400">
              Thư mục lưu trữ local: <code className="text-indigo-300 font-mono">storage/export_packages/{prod.id}/</code>
            </div>
          </div>
        ))}

        {exportedProducts.length === 0 && (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-12 text-center text-slate-400">
            Chưa có bài đăng nào được xuất. Hãy sang bước Studio để xuất gói sản phẩm!
          </div>
        )}
      </div>
    </div>
  );
}
