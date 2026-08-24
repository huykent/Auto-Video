'use client';

import React, { useState, useEffect } from 'react';
import UnifiedNavbar from '../../components/Navbar';
import { 
  PackageCheck, 
  Download, 
  Copy, 
  Check, 
  Film, 
  ArrowLeft, 
  Sparkles, 
  ShoppingBag, 
  Store, 
  FolderArchive, 
  Sliders, 
  CheckCircle2, 
  Search, 
  FileText,
  Boxes,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface ProductItem {
  id: string;
  makerworldId: string;
  title: string;
  url: string;
  author: string | null;
  status: string;
  rawImages: string;
  selectedCoverImage?: string | null;
  exportTitle?: string | null;
  exportDescription?: string | null;
  generatedVideoPath?: string | null;
  updatedAt: string;
}

export default function ExportsPage() {
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedTitleId, setCopiedTitleId] = useState<string | null>(null);
  const [copiedDescId, setCopiedDescId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchExports = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data: ProductItem[] = await res.json();
        setProductsList(data.filter((p) => p.status === 'EXPORTED' || p.status === 'VIDEO_READY'));
      }
    } catch (err) {
      console.error('Failed to fetch exports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExports();
    const interval = setInterval(fetchExports, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyText = (text: string, id: string, type: 'title' | 'desc') => {
    navigator.clipboard.writeText(text);
    if (type === 'title') {
      setCopiedTitleId(id);
      setTimeout(() => setCopiedTitleId(null), 2000);
    } else {
      setCopiedDescId(id);
      setTimeout(() => setCopiedDescId(null), 2000);
    }
  };

  const getProductCoverImage = (prod: ProductItem) => {
    if (prod.selectedCoverImage) return prod.selectedCoverImage;
    if (prod.rawImages) {
      try {
        const parsed = JSON.parse(prod.rawImages);
        if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === 'string' && parsed[0].startsWith('http')) {
          return parsed[0];
        }
      } catch (e) {}
    }
    return null;
  };

  const getProductParsedImages = (prod: ProductItem): string[] => {
    if (prod.rawImages) {
      try {
        const parsed = JSON.parse(prod.rawImages);
        if (Array.isArray(parsed)) {
          return parsed.filter((u) => typeof u === 'string' && u.startsWith('http')).slice(0, 5);
        }
      } catch (e) {}
    }
    return [];
  };

  const getVideoUrl = (prod: ProductItem) => {
    return `/api/video/file?productId=${prod.id}`;
  };

  const filteredProducts = productsList.filter((prod) => {
    const q = searchQuery.toLowerCase();
    return (
      prod.title.toLowerCase().includes(q) ||
      (prod.exportTitle && prod.exportTitle.toLowerCase().includes(q)) ||
      prod.makerworldId.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-emerald-500/30 pb-20">
      
      {/* Unified Top Navigation */}
      <UnifiedNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        
        {/* Top Control Banner */}
        <div className="bg-[#090D1A] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.15)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Kho Gói Bài Đăng TMĐT Đã Hoàn Thiện</h2>
                <p className="text-xs text-slate-400">Gói nội dung bao gồm tiêu đề chuẩn SEO, bài viết mô tả, bộ ảnh 4K & Video 9:16 sản phẩm</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> Đã Xuất: {productsList.length} Gói
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-cyan-400" /> Sẵn Sàng Đăng Bài
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm gói bài đăng theo tên sản phẩm, tiêu đề Shopee hoặc ID..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>
        </div>

        {/* Export Cards Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-[#090D1A]/60 border border-emerald-500/20 rounded-2xl p-12 text-center text-slate-500 space-y-2">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-sm font-mono">Đang tải danh sách gói bài đăng...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-[#090D1A]/60 border border-emerald-500/20 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <Boxes className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm">Chưa có gói bài đăng nào được xuất. Hãy chọn mẫu trong AI Studio để xuất gói sản phẩm!</p>
              <a
                href="/studio"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 font-bold text-xs text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                Chuyển Đến AI Studio
              </a>
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const coverImg = getProductCoverImage(prod);
              const galleryImgs = getProductParsedImages(prod);
              const videoUrl = getVideoUrl(prod);
              const exportTitleText = prod.exportTitle || `Mô hình in 3D ${prod.title} - Nhựa PLA Silk Cao Cấp - Trang Trí / Quà Tặng`;
              const isTitleCopied = copiedTitleId === prod.id;
              const isDescCopied = copiedDescId === prod.id;

              return (
                <div
                  key={prod.id}
                  className="bg-[#090D1A] border border-emerald-500/25 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:border-emerald-400/50 transition-all"
                >
                  {/* Top Row: Title & Download Action */}
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-emerald-500/15">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300">
                          SEO Shopee & TikTok
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                          ID: {prod.makerworldId}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug">{exportTitleText}</h3>
                    </div>

                    <a
                      href={`/api/export/download?productId=${prod.id}`}
                      className="py-3 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] text-xs flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Tải Bộ File Gói Bài Đăng (ZIP)
                    </a>
                  </div>

                  {/* Media Grid: Video 9:16 + Image Gallery */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left: Video Showcase Player */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-cyan-400" /> Video Sản Phẩm 9:16:
                      </div>
                      <div className="aspect-[9/16] bg-slate-950 rounded-xl overflow-hidden border border-emerald-500/20 relative shadow-inner max-h-[320px] mx-auto w-full">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Middle & Right: Title Copy & Description */}
                    <div className="md:col-span-2 space-y-4">
                      
                      {/* Copy Title Box */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Tiêu Đề Bài Đăng Shopee (SEO):
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(exportTitleText, prod.id, 'title')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-all flex items-center gap-1 text-[11px] font-bold"
                          >
                            {isTitleCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isTitleCopied ? 'Đã Chép Tiêu Đề!' : 'Sao Chép Tiêu Đề'}</span>
                          </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs font-mono text-emerald-300 font-semibold leading-relaxed">
                          {exportTitleText}
                        </div>
                      </div>

                      {/* Copy Description Box */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Mô Tả Chi Tiết Bài Đăng:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(prod.exportDescription || '', prod.id, 'desc')}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center gap-1 text-[11px] font-bold"
                          >
                            {isDescCopied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isDescCopied ? 'Đã Chép Mô Tả!' : 'Sao Chép Mô Tả'}</span>
                          </button>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/15 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-emerald-500/30">
                          {prod.exportDescription || 'Chưa có mô tả bài viết.'}
                        </div>
                      </div>

                      {/* Scraped Images Mini Gallery */}
                      {galleryImgs.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <div className="text-xs font-mono font-semibold text-slate-400">
                            Bộ Ảnh 4K Sản Phẩm ({galleryImgs.length} Ảnh):
                          </div>
                          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                            {galleryImgs.map((imgUrl, i) => (
                              <img
                                key={i}
                                src={imgUrl}
                                alt={`Gallery ${i}`}
                                className="w-16 h-16 rounded-lg object-cover border border-emerald-500/20 shrink-0 hover:scale-105 transition-transform cursor-pointer"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Storage Folder Path Info */}
                      <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                        <FolderArchive className="w-3.5 h-3.5 text-slate-400" />
                        <span>Thư mục lưu trữ local server:</span>
                        <code className="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/20">
                          storage/export_packages/{prod.id}/
                        </code>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

    </div>
  );
}
