'use client';

import React, { useState, useEffect } from 'react';
import UnifiedNavbar from '../../components/Navbar';
import { 
  Film, 
  Sparkles, 
  Play, 
  Download, 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  Boxes, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Video,
  FileText,
  Sliders,
  AlertTriangle,
  ExternalLink
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
  videoPrompt?: string | null;
  generatedVideoPath?: string | null;
  errorMessage?: string | null;
}

export default function StudioPage() {
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [selectedProdIds, setSelectedProdIds] = useState<string[]>([]);
  const [hasInitializedSelect, setHasInitializedSelect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatusMsg, setVideoStatusMsg] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data: ProductItem[] = await res.json();
        setProductsList(data);

        if (!hasInitializedSelect) {
          const searchParams = new URLSearchParams(window.location.search);
          const singleParam = searchParams.get('product');
          const multiParam = searchParams.get('products');

          if (multiParam) {
            const ids = multiParam.split(',').filter(Boolean);
            setSelectedProdIds(ids);
          } else if (singleParam) {
            setSelectedProdIds([singleParam]);
          } else if (data.length > 0) {
            setSelectedProdIds([data[0].id]);
          }
          setHasInitializedSelect(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products for studio:', err);
    } fontally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 4000);
    return () => clearInterval(interval);
  }, [hasInitializedSelect]);

  const toggleSelectProduct = (id: string) => {
    if (selectedProdIds.includes(id)) {
      setSelectedProdIds(selectedProdIds.filter((item) => item !== id));
    } else {
      setSelectedProdIds([...selectedProdIds, id]);
    }
  };

  const selectAllProducts = () => {
    setSelectedProdIds(productsList.map((p) => p.id));
  };

  const deselectAllProducts = () => {
    setSelectedProdIds([]);
  };

  const handleBatchGenerateVideo = async () => {
    if (selectedProdIds.length === 0) return;
    setIsGeneratingVideo(true);
    setVideoStatusMsg('');

    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedProdIds }),
      });

      if (res.ok) {
        const data = await res.json();
        setVideoStatusMsg(`🚀 ${data.message || 'Đã khởi chạy tiến trình sinh Video AI cho các mẫu được chọn!'}`);
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to trigger video generation:', err);
    } finally {
      setIsGeneratingVideo(false);
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

  const getProductPhotosCount = (prod: ProductItem) => {
    if (prod.rawImages) {
      try {
        const parsed = JSON.parse(prod.rawImages);
        if (Array.isArray(parsed)) return parsed.length;
      } catch (e) {}
    }
    return 0;
  };

  const getVideoUrl = (prod: ProductItem) => {
    return `/api/video/file?productId=${prod.id}`;
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-cyan-500/30 pb-20">
      
      {/* Unified Navigation Header */}
      <UnifiedNavbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        
        {/* Top Control Bar: Selected Products Header */}
        <div className="bg-[#090D1A] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Chọn Mẫu 3D Cần Sinh Video AI</h2>
                <p className="text-xs text-slate-400">Tự chọn đúng các mẫu bạn muốn dựng Video (không dựng tràn lan toàn bộ hệ thống)</p>
              </div>
            </div>

            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30">
              Đã chọn: {selectedProdIds.length} / {productsList.length} mẫu
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={selectAllProducts}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
              >
                Chọn Tất Cả ({productsList.length})
              </button>
              <button
                type="button"
                onClick={deselectAllProducts}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-700 hover:text-white transition-all"
              >
                Bỏ Chọn Hết
              </button>
            </div>

            <button
              type="button"
              onClick={handleBatchGenerateVideo}
              disabled={isGeneratingVideo || selectedProdIds.length === 0}
              className="py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] text-sm flex items-center gap-2 disabled:opacity-40"
            >
              <Film className="w-4 h-4" />
              {isGeneratingVideo ? 'Đang Khởi Chạy Tiến Trình...' : `Khởi Động Sinh Video AI (${selectedProdIds.length} Mẫu Đã Chọn)`}
            </button>
          </div>

          {videoStatusMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {videoStatusMsg}
            </div>
          )}
        </div>

        {/* Studio Product Cards Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-cyan-400" /> Danh Sách Mẫu Trong Studio ({productsList.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productsList.length === 0 ? (
              <div className="col-span-full bg-[#090D1A]/60 border border-cyan-500/20 rounded-2xl p-12 text-center text-slate-500 space-y-2">
                <Boxes className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm">Chưa có mẫu nào trong Studio. Hãy quay lại trang Discovery để thêm link mẫu 3D!</p>
              </div>
            ) : (
              productsList.map((prod) => {
                const coverImg = getProductCoverImage(prod);
                const isSelected = selectedProdIds.includes(prod.id);
                const photosCount = getProductPhotosCount(prod);
                const videoUrl = getVideoUrl(prod);

                return (
                  <div
                    key={prod.id}
                    className={`bg-[#090D1A] border rounded-2xl p-6 space-y-5 backdrop-blur-xl transition-all relative ${
                      isSelected 
                        ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-2 ring-cyan-500/30' 
                        : 'border-cyan-500/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Top Row: Checkbox Selection & Cover Preview */}
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => toggleSelectProduct(prod.id)}
                        className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono font-bold ${
                          isSelected 
                            ? 'bg-cyan-500 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]' 
                            : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-white hover:border-cyan-400'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-4 h-4 text-white" /> : <Square className="w-4 h-4 text-slate-400" />}
                        <span>{isSelected ? 'Được Chọn Sinh Video' : 'Bỏ Qua'}</span>
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-base line-clamp-1">{prod.title}</h3>
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-1">
                          <span>ID: {prod.makerworldId}</span>
                          <span className="text-cyan-400 font-semibold">{photosCount} Ảnh 4K</span>
                        </div>
                      </div>
                    </div>

                    {/* Preview Image & Video Container */}
                    <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-cyan-500/20 relative flex items-center justify-center">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />

                      <div className={`absolute top-2.5 right-2.5 px-3 py-1 rounded-full border text-[10px] font-mono backdrop-blur-md ${
                        prod.status === 'GENERATION_FAILED'
                          ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                          : 'bg-slate-950/80 border-cyan-500/30 text-cyan-300'
                      }`}>
                        {prod.status}
                      </div>
                    </div>

                    {/* API Error Message Alert if Failed */}
                    {prod.errorMessage && (
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-rose-200">Thông báo từ Google API:</div>
                          <div className="text-[11px] text-rose-300/90">{prod.errorMessage}</div>
                        </div>
                      </div>
                    )}

                    {/* AI Video Prompt Info */}
                    <div className="bg-slate-950/80 rounded-xl p-4 text-xs font-mono text-slate-300 space-y-1.5 border border-cyan-500/15">
                      <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Kịch Bản & Prompt AI:
                      </div>
                      <p className="text-slate-300 italic line-clamp-2">
                        {prod.videoPrompt || `A cinematic 4K showcase of ${prod.title} 3D model, smooth rotation, detailed texture, studio lighting.`}
                      </p>
                    </div>

                    {/* Export Pack Actions */}
                    <form action="/api/export" method="POST" className="pt-1">
                      <input type="hidden" name="productId" value={prod.id} />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] text-xs flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Xuất Gói Đăng Bài TMĐT (ZIP / Text / Media)
                      </button>
                    </form>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </main>

    </div>
  );
}
