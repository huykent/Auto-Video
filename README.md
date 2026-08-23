# 🚀 MakerWorld Auto-Video & E-Commerce Exporter Pipeline

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-Drizzle_ORM-blueviolet?style=for-the-badge&logo=sqlite)
![BullMQ](https://img.shields.io/badge/BullMQ-Redis_Queue-red?style=for-the-badge&logo=redis)
![Playwright](https://img.shields.io/badge/Playwright-Scraper-green?style=for-the-badge&logo=playwright)
![Ubuntu](https://img.shields.io/badge/Ubuntu-Deployment_Ready-E95420?style=for-the-badge&logo=ubuntu)

Hệ thống tự động hóa cào dữ liệu mẫu in 3D từ **MakerWorld**, trích xuất thông tin chi tiết (ảnh, loại nhựa, màu nhựa, file 3D), tạo video quảng cáo sản phẩm bằng AI (**Google Veo 3** / AI Video API) theo cơ chế kiểm duyệt **Human-in-the-loop**, và tự động biên tập bài đăng chuẩn SEO xuất ra các sàn TMĐT (Shopee, TikTok Shop).

---

## 🌟 Tính Năng Nổi Bật

- **🌐 MakerWorld Scraper Engine (Playwright)**:
  - Cào tự động hàng loạt mẫu in 3D theo từ khóa tìm kiếm.
  - Phân tích bóc tách chính xác **Loại nhựa** (`PLA`, `PETG`, `TPU`, `ABS`...) và **Màu nhựa** (`Silk Gold`, `Matte Black`, `White`...).
  - Tải và lưu trữ tập trung ảnh sản phẩm chất lượng cao về ổ đĩa local (`./storage/raw_images/`).

- **🎛️ Human-in-the-Loop Web Dashboard (Next.js 14 + Tailwind CSS)**:
  - Giao diện Dark Mode hiện đại, tối ưu trải nghiệm người dùng.
  - Cho phép xem trước ảnh, chọn ảnh chính, kiểm duyệt thông tin và tùy chỉnh Prompt AI trước khi gửi request tốn chi phí.

- **🎬 AI Video Generation Pipeline (Veo 3 Integrator)**:
  - Tự động dựng Prompt AI chuyên nghiệp chuẩn studio 3D.
  - Kết nối API Veo 3 / Google AI Video, hỗ trợ chế độ **Mock mode** thử nghiệm local không tốn credit API.

- **📦 E-Commerce Exporter Engine**:
  - **Shopee Exporter**: Tự động sinh tiêu đề chuẩn SEO $\le 120$ ký tự và mô tả chi tiết bài đăng.
  - **TikTok Shop Exporter**: Tự động tạo file cấu hình `tiktok_metadata.json`.
  - **Packager**: Đóng gói toàn bộ video MP4 + ảnh sản phẩm + nội dung bài đăng vào thư mục `./storage/export_packages/{product_id}/`.

---

## 🐧 Hướng Dẫn Triển Khai Trên Ubuntu Server (VPS)

Dự án đã sẵn sàng 100% cho việc triển khai Production trên Ubuntu Linux (20.04/22.04/24.04 LTS).

👉 **Xem hướng dẫn từng bước tại**: **[docs/ubuntu-deployment-guide.md](docs/ubuntu-deployment-guide.md)**

### Tóm tắt câu lệnh triển khai nhanh trên Ubuntu:
```bash
# 1. Cài đặt Node.js 20, Redis Server & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs redis-server nginx
sudo npm install -g pm2

# 2. Clone repository & cài đặt dependencies + Playwright
git clone https://github.com/huykent/Auto-Video.git /var/www/Auto-Video
cd /var/www/Auto-Video
npm install
npx playwright install chromium && sudo npx playwright install-deps

# 3. Build & Khởi chạy với PM2
npm run build
pm2 start ecosystem.config.cjs
```

---

## 🛠️ Hướng Dẫn Chạy Local (Windows / Mac)

### 1. Khởi động Web Dashboard
```bash
npm run dev
```
Truy cập giao diện Web tại: **`http://localhost:3000`**

### 2. Khởi động Background Worker (BullMQ Queue)
```bash
npm run worker
```

### 3. Chạy Kiểm Thử (Testing)
```bash
npm test
```

---

## 📜 Giấy Phép (License)

Dự án được phát triển dưới giấy phép [MIT License](LICENSE).
