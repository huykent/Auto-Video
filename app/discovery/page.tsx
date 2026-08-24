'use client';

import React, { useState, useEffect } from 'react';
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
  Trash2
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
  status: string;
  rawImages: string;
  selectedCoverImage?: string | null;
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

  const getProductPhotosCount = (prod: ProductItem) => {
    if (prod.rawImages) {
      try {
        const parsed = JSON.parse(prod.rawImages);
        if (Array.isArray(parsed)) return parsed.length;
      } catch (e) {}
    }
    return 1;
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/15 bg-[#06080F]/80 backdrop-blur-2xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 rounded-xl bg-slate-900 border border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-[#06080F] rounded-[7px] flex items-center justify-center">
                  <Search className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">MakerWorld Model Ingestion & Discovery</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="/studio" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Studio
            </a>
            <a href="/settings" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> API Settings
            </a>
          </div>
        </div>
      </header>

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

        {/* Section 3: Real-time Search Jobs Table with CLEAR LOGS Button */}
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-cyan-400" /> Danh Sách Mẫu 3D Đã Sẵn Sàng Cho AI Dựng Video ({products.length})
            </h3>
            <a href="/studio" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
              Sang Studio Dựng Video <ArrowRight className="w-3.5 h-3.5" />
            </a>
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
                const photoCount = getProductPhotosCount(prod);
                return (
                  <div key={prod.id} className="bg-[#090D1A] border border-cyan-500/25 rounded-2xl p-5 space-y-4 hover:border-cyan-400/50 transition-all backdrop-blur-xl group">
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
                      
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 backdrop-blur-md flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-cyan-400" /> {photoCount} Ảnh 4K
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{prod.title}</h4>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>MW ID: {prod.makerworldId}</span>
                        <span>{prod.author || 'MakerWorld Creator'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-cyan-500/15">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                        {prod.status}
                      </span>
                      <div className="flex items-center gap-3">
                        {prod.url && (
                          <a href={prod.url} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Link Gốc
                          </a>
                        )}
                        <a href="/studio" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                          Tạo Video <ArrowRight className="w-3 h-3" />
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

    </div>
  );
}
