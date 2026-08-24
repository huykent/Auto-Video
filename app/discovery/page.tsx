'use client';

import React, { useState, useEffect } from 'react';
import UnifiedNavbar from '../../components/Navbar';
import { 
  Sparkles, 
  Search, 
  Play, 
  Layers, 
  ArrowRight, 
  Boxes, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Filter,
  Eye,
  Sliders,
  ArrowLeft,
  ExternalLink,
  Download,
  Link2,
  FileText,
  Image as ImageIcon,
  Trash2,
  X,
  Check,
  Star,
  Film,
  CheckSquare,
  Square,
  Weight,
  Printer
} from 'lucide-react';

interface SearchJobItem {
  id: string;
  keyword: string;
  maxResults: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  itemsFound: number;
  createdAt: string;
}

interface ProductItem {
  id: string;
  makerworldId: string;
  title: string;
  url: string;
  author: string | null;
  filamentTypes: string;
  filamentColors: string;
  printTimeMinutes?: number | null;
  weightGrams?: number | null;
  plateCount?: number | null;
  status: string;
  rawImages: string;
  selectedCoverImage?: string | null;
}

function formatPrintTime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return '1h 30m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export default function DiscoveryPage() {
  const [urlInput, setUrlInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [maxResults, setMaxResults] = useState('10');
  const [isIngesting, setIsIngesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingestSuccessMsg, setIngestSuccessMsg] = useState('');
  
  const [jobs, setJobs] = useState<SearchJobItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Model selection state for Video Export
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Gallery Modal State
  const [activeGalleryProd, setActiveGalleryProd] = useState<ProductItem | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [activeCover, setActiveCover] = useState<string | null>(null);
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState('');

  // Fetch search jobs and products
  const fetchData = async () => {
    try {
      const [jobsRes, prodRes] = await Promise.all([
        fetch('/api/crawler'),
        fetch('/api/products')
      ]);
      
      if (jobsRes.ok) {
        const jobData = await jobsRes.json();
        setJobs(jobData);
      }
      
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
    } catch (err) {
      console.error('Error fetching discovery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleSelectProduct = (prodId: string) => {
    if (selectedProductIds.includes(prodId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== prodId));
    } else {
      setSelectedProductIds([...selectedProductIds, prodId]);
    }
  };

  const selectAllProducts = () => {
    setSelectedProductIds(products.map(p => p.id));
  };

  const deselectAllProducts = () => {
    setSelectedProductIds([]);
  };

  const handleIngestUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsIngesting(true);
    setIngestSuccessMsg('');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlInput }),
      });

      if (res.ok) {
        const data = await res.json();
        setIngestSuccessMsg(data.message || 'Đã thêm mẫu thành công!');
        setUrlInput('');
        fetchData();
      }
    } catch (err) {
      console.error('URL Ingestion failed:', err);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleStartCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordInput.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keywordInput,
          maxResults: Number(maxResults),
        }),
      });

      if (res.ok) {
        setKeywordInput('');
        fetchData();
      }
    } catch (err) {
      console.error('Crawl submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearJobs = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử log tìm kiếm?')) return;
    try {
      const res = await fetch('/api/crawler', { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to clear jobs:', err);
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

  const getProductPhotosList = (prod: ProductItem): string[] => {
    if (prod.rawImages) {
      try {
        const parsed = JSON.parse(prod.rawImages);
        if (Array.isArray(parsed)) return parsed.filter((u: any) => typeof u === 'string' && u.startsWith('http'));
      } catch (e) {}
    }
    return [];
  };

  const getParsedFilaments = (prod: ProductItem): string[] => {
    if (prod.filamentTypes) {
      try {
        const parsed = JSON.parse(prod.filamentTypes);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return ['PLA Silk', 'PETG'];
  };

  // Open Gallery Modal for a product
  const openGalleryModal = (prod: ProductItem) => {
    const list = getProductPhotosList(prod);
    setActiveGalleryProd(prod);
    setGalleryImages(list);
    setSelectedPhotos(list);
    setActiveCover(getProductCoverImage(prod));
    setGalleryMsg('');
  };

  const closeGalleryModal = () => {
    setActiveGalleryProd(null);
    setGalleryImages([]);
    setSelectedPhotos([]);
    setActiveCover(null);
  };

  const togglePhotoSelection = (imgUrl: string) => {
    if (selectedPhotos.includes(imgUrl)) {
      setSelectedPhotos(selectedPhotos.filter((u) => u !== imgUrl));
    } else {
      setSelectedPhotos([...selectedPhotos, imgUrl]);
    }
  };

  const selectAllPhotos = () => {
    setSelectedPhotos([...galleryImages]);
  };

  const deselectAllPhotos = () => {
    setSelectedPhotos([]);
  };

  const saveGallerySelection = async (redirectToStudio = false) => {
    if (!activeGalleryProd) return;
    setIsSavingGallery(true);
    setGalleryMsg('');

    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: activeGalleryProd.id,
          selectedCoverImage: activeCover,
          rawImages: selectedPhotos,
        }),
      });

      if (res.ok) {
        setGalleryMsg('Đã lưu danh sách ảnh làm Video thành công!');
        fetchData();

        if (redirectToStudio) {
          window.location.href = `/studio?product=${activeGalleryProd.id}`;
        }
      }
    } catch (err) {
      console.error('Failed to save gallery selection:', err);
    } finally {
      setIsSavingGallery(false);
    }
  };

  const goToStudioWithSelected = () => {
    if (selectedProductIds.length === 0) return;
    window.location.href = `/studio?products=${selectedProductIds.join(',')}`;
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-cyan-500/30 pb-24">
      
      {/* Unified Top Navigation */}
      <UnifiedNavbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Section 1: DIRECT LINK INGESTION (PRIMARY USER METHOD) */}
        <div className="bg-[#090D1A] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.15)] space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Nhập Trực Tiếp Link / Mã Sản Phẩm MakerWorld</h2>
                <p className="text-xs text-slate-400">Dán 1 hoặc nhiều đường link MakerWorld (mỗi link 1 dòng) $\rightarrow$ Tự động kiểm tra API & lưu trọn bộ ảnh 4K cho AI dựng Video</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30">
              ⚡ Xử lý tức thì (1s)
            </span>
          </div>

          <form onSubmit={handleIngestUrl} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-emerald-300">ĐƯỜNG LINK / MÃ ID MAKERWORLD (DÁN VÀO ĐÂY):</label>
              <textarea
                rows={3}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="VD: https://makerworld.com/en/models/778956-moon-lamp&#10;https://makerworld.com/en/models/2544876-moon-lamp"
                className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl p-4 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex items-center justify-between">
              {ingestSuccessMsg ? (
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> {ingestSuccessMsg}
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-mono">Ví dụ URL: makerworld.com/en/models/778956</span>
              )}

              <button
                type="submit"
                disabled={isIngesting || !urlInput.trim()}
                className="py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isIngesting ? 'Đang gọi API & Lưu ảnh...' : 'Lấy Thông Tin & Lưu Bộ Ảnh 4K'}
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Automated Keyword Crawler Form */}
        <div className="bg-[#090D1A] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Tự Động Tìm & Cào Theo Từ Khóa (Server Engine)</h2>
                <p className="text-xs text-slate-400">Nhập từ khóa để Server tự động tìm và cào danh sách sản phẩm liên quan</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleStartCrawl} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 space-y-1.5">
                <label className="text-xs font-mono text-cyan-300">TỪ KHÓA TÌM KIẾM MAKERWORLD:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="VD: articulated dragon, phone stand, desk organizer..."
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white font-medium placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 pl-11"
                  />
                  <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-1.5">
                <label className="text-xs font-mono text-slate-400">SỐ MẪU / TỪ KHÓA:</label>
                <select
                  value={maxResults}
                  onChange={(e) => setMaxResults(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-cyan-400"
                >
                  <option value="5">5 mẫu</option>
                  <option value="10">10 mẫu</option>
                  <option value="20">20 mẫu</option>
                  <option value="50">50 mẫu</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !keywordInput.trim()}
                  className="w-full py-3 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {isSubmitting ? 'Đang gửi...' : 'Khởi Động Cào'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Section 3: Real-time Search Jobs Table */}
        <div className="bg-[#090D1A] border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" /> Tiến Độ Job Cào Từ Khóa (Real-time Queue Status)
            </h3>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">{jobs.length} Jobs Total</span>
              {jobs.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearJobs}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa Sạch Log Tìm Kiếm
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-cyan-500/15">
                  <th className="pb-3 font-semibold">JOB ID</th>
                  <th className="pb-3 font-semibold">TỪ KHÓA</th>
                  <th className="pb-3 font-semibold">MỤC TIÊU</th>
                  <th className="pb-3 font-semibold">ĐÃ TÌM THẤY</th>
                  <th className="pb-3 font-semibold">TRẠNG THÁI</th>
                  <th className="pb-3 font-semibold">THỜI GIAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">
                      Chưa có Job cào nào. Tất cả log tìm kiếm đã được xóa sạch!
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 text-cyan-400">{job.id}</td>
                      <td className="py-3 font-bold text-white">{job.keyword}</td>
                      <td className="py-3 text-slate-300">{job.maxResults} mẫu</td>
                      <td className="py-3 text-emerald-400 font-bold">{job.itemsFound || 0}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${job.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : job.status === 'RUNNING' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse' : job.status === 'FAILED' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{new Date(job.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Crawled Product Showcase Grid */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between bg-[#090D1A] border border-cyan-500/20 rounded-2xl p-4 gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-cyan-400" /> Danh Sách Mẫu 3D ({products.length})
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30">
                Đã chọn: {selectedProductIds.length} / {products.length} mẫu
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={selectAllProducts}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all min-h-[38px]"
              >
                Chọn Tất Cả ({products.length})
              </button>
              <button
                type="button"
                onClick={deselectAllProducts}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-700 hover:text-white transition-all min-h-[38px]"
              >
                Bỏ Chọn Hết
              </button>
              
              <button
                type="button"
                onClick={goToStudioWithSelected}
                disabled={selectedProductIds.length === 0}
                className="py-2.5 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] text-xs flex items-center gap-1.5 disabled:opacity-40 min-h-[38px]"
              >
                <Film className="w-4 h-4" /> Sang Studio Dựng Video ({selectedProductIds.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full bg-[#090D1A]/60 border border-cyan-500/20 rounded-2xl p-12 text-center text-slate-500 space-y-2">
                <Boxes className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm">Chưa có dữ liệu sản phẩm. Hãy dán đường link MakerWorld ở phía trên để nạp thông tin!</p>
              </div>
            ) : (
              products.map((prod) => {
                const coverImg = getProductCoverImage(prod);
                const photosList = getProductPhotosList(prod);
                const filaments = getParsedFilaments(prod);
                const isSelectedForVideo = selectedProductIds.includes(prod.id);

                return (
                  <div 
                    key={prod.id} 
                    className={`bg-[#090D1A] border rounded-2xl p-5 space-y-4 hover:border-cyan-400/50 transition-all backdrop-blur-xl group relative ${
                      isSelectedForVideo ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-2 ring-cyan-500/30' : 'border-cyan-500/25'
                    }`}
                  >
                    <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-cyan-500/20 relative flex items-center justify-center">
                      {coverImg ? (
                        <img 
                          src={coverImg} 
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Boxes className="w-10 h-10 text-cyan-500/40 group-hover:scale-110 transition-transform" />
                      )}

                      {/* MODEL SELECTION CHECKBOX (TOP LEFT) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectProduct(prod.id);
                        }}
                        className={`absolute top-2.5 left-2.5 p-2 rounded-xl backdrop-blur-md border transition-all flex items-center gap-1.5 text-xs font-mono font-bold ${
                          isSelectedForVideo 
                            ? 'bg-cyan-500 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]' 
                            : 'bg-slate-950/80 text-slate-400 border-slate-700 hover:text-white hover:border-cyan-400'
                        }`}
                      >
                        {isSelectedForVideo ? <CheckSquare className="w-4 h-4 text-white" /> : <Square className="w-4 h-4 text-slate-400" />}
                        <span>{isSelectedForVideo ? 'Đã chọn' : 'Chọn mẫu này'}</span>
                      </button>
                      
                      {/* INTERACTIVE GALLERY BADGE BUTTON (TOP RIGHT) */}
                      <button
                        type="button"
                        onClick={() => openGalleryModal(prod)}
                        className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-full bg-slate-950/85 hover:bg-cyan-500 border border-cyan-500/40 hover:border-cyan-300 text-xs font-mono text-cyan-300 hover:text-white backdrop-blur-md flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        title="Bấm để xem & chọn ảnh làm Video"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-bold">{photosList.length} Ảnh 4K</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{prod.title}</h4>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>MW ID: {prod.makerworldId}</span>
                        <span>{prod.author || 'MakerWorld Creator'}</span>
                      </div>

                      {/* 3D PRINTING REAL PARAMETERS BADGES */}
                      <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-[#0F172A] border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                          🧵 {filaments.join(', ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#0F172A] border border-purple-500/30 text-purple-300 flex items-center gap-1">
                          ⏱️ {formatPrintTime(prod.printTimeMinutes)}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#0F172A] border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                          ⚖️ {prod.weightGrams || 50}g
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#0F172A] border border-amber-500/30 text-amber-300 flex items-center gap-1">
                          🧩 {prod.plateCount || 1} Bàn in
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-cyan-500/15">
                      <button
                        type="button"
                        onClick={() => openGalleryModal(prod)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 transition-all flex items-center gap-1"
                      >
                        <ImageIcon className="w-3 h-3" /> Mở Album Ảnh ({photosList.length})
                      </button>

                      <div className="flex items-center gap-3">
                        {prod.url && (
                          <a href={prod.url} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Link Gốc
                          </a>
                        )}
                        <a 
                          href={`/studio?product=${prod.id}`} 
                          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
                        >
                          Tạo Video Mẫu Này <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </main>

      {/* INTERACTIVE PHOTO GALLERY MODAL */}
      {activeGalleryProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#090D1A] border border-cyan-500/40 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-cyan-500/20 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    Bộ Ảnh 4K: {activeGalleryProd.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Đã chọn: <strong className="text-cyan-400">{selectedPhotos.length}</strong> / {galleryImages.length} ảnh để AI làm Video
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={selectAllPhotos}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                >
                  Chọn Tất Cả ({galleryImages.length})
                </button>
                <button
                  type="button"
                  onClick={deselectAllPhotos}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-700 hover:text-white transition-all"
                >
                  Bỏ Chọn Hết
                </button>
                <button
                  type="button"
                  onClick={closeGalleryModal}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Photo Grid */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              {galleryMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {galleryMsg}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryImages.map((imgUrl, idx) => {
                  const isSelected = selectedPhotos.includes(imgUrl);
                  const isCover = activeCover === imgUrl;

                  return (
                    <div
                      key={idx}
                      onClick={() => togglePhotoSelection(imgUrl)}
                      className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-2 ring-cyan-500/30' 
                          : 'border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Selection Badge Overlay */}
                      <div className={`absolute top-2 left-2 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isSelected ? 'bg-cyan-500 text-white font-bold shadow-md' : 'bg-slate-950/80 border border-slate-700 text-slate-500'
                      }`}>
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                      </div>

                      {/* Cover Image Star Badge */}
                      {isCover && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-md font-mono">
                          <Star className="w-3 h-3 fill-slate-950" /> Ảnh Bìa
                        </div>
                      )}

                      {/* Hover Overlay: Set Cover Action */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1.5">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCover(imgUrl);
                              if (!selectedPhotos.includes(imgUrl)) {
                                setSelectedPhotos([...selectedPhotos, imgUrl]);
                              }
                            }}
                            className="w-full py-1 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-slate-950 text-[10px] font-bold transition-all flex items-center justify-center gap-1 font-mono"
                          >
                            <Star className="w-3 h-3" /> Đặt Làm Ảnh Bìa
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-cyan-500/20 bg-slate-950/60 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                Click vào ảnh để bật/tắt chọn • Bấm <strong className="text-amber-400">Đặt làm ảnh bìa</strong> để chọn ảnh hiển thị chính
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => saveGallerySelection(false)}
                  disabled={isSavingGallery}
                  className="py-2.5 px-5 rounded-xl font-bold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/40 transition-all text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {isSavingGallery ? 'Đang lưu...' : 'Lưu Danh Sách Ảnh Đã Chọn'}
                </button>

                <button
                  type="button"
                  onClick={() => saveGallerySelection(true)}
                  disabled={isSavingGallery}
                  className="py-2.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  <Film className="w-4 h-4" />
                  Sang Studio Dựng Video Mẫu Này
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
