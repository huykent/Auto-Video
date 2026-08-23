# 🐧 Comprehensive Ubuntu Deployment Guide: Auto-Video Pipeline

Hướng dẫn chi tiết triển khai hệ thống **Auto-Video Pipeline** trên máy chủ **Ubuntu Linux (20.04 / 22.04 / 24.04 LTS)** cho cả 3 thành phần: Web Dashboard (Next.js), Queue Worker (BullMQ + Redis), và Playwright Scraper.

---

## 📋 1. Yêu Cầu Cấu Hình Máy Chủ Ubuntu

- **OS**: Ubuntu 20.04 / 22.04 / 24.04 LTS 64-bit
- **RAM**: Tối thiểu 2GB RAM (Khuyên dùng 4GB RAM trở lên để chạy Playwright Chromium mượt mà)
- **CPU**: 2 vCPU trở lên
- **Disk**: 20GB SSD trở lên

---

## 🛠️ 2. Cài Đặt Các Gói Hệ Thống Cần Thiết

### Bước 2.1: Cập nhật hệ thống Ubuntu
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential ufw
```

### Bước 2.2: Cài đặt Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra phiên bản
node -v  # Trả về v20.x.x
npm -v   # Trả về v10.x.x
```

### Bước 2.3: Cài đặt & Kích hoạt Redis Server (Cho BullMQ Queue)
```bash
sudo apt install -y redis-server

# Cho phép Redis tự khởi động cùng hệ thống
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Kiểm tra trạng thái Redis
sudo systemctl status redis-server
redis-cli ping  # Trả về PONG
```

### Bước 2.4: Cài đặt PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

---

## 🚀 3. Tải Mã Nguồn & Cấu Hình Dự Án

### Bước 3.1: Clone repository từ GitHub
```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/huykent/Auto-Video.git
cd Auto-Video
```

### Bước 3.2: Cài đặt dependencies dự án & Playwright Chromium
```bash
# Cài đặt gói NPM
npm install

# Cài đặt Playwright Chromium browser & hệ thống thư viện Linux phụ thuộc
npx playwright install chromium
sudo npx playwright install-deps
```

### Bước 3.3: Tạo cấu hình môi trường `.env`
Tạo file `.env` tại thư mục gốc `/var/www/Auto-Video`:
```bash
nano .env
```

Dán nội dung sau vào file `.env`:
```env
PORT=3008
NODE_ENV=production
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# API Keys
VEO_API_KEY=your_actual_veo3_api_key_here
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(Bấm `Ctrl + O` $\rightarrow$ `Enter` $\rightarrow$ `Ctrl + X` để lưu và thoát)*

---

## 🏗️ 4. Build Ứng Dụng & Cấu Hình PM2 (Background Processes)

### Bước 4.1: Build bản Production của Next.js
```bash
npm run build
```

### Bước 4.2: Khởi chạy ứng dụng cổng 3008 qua PM2
```bash
pm2 start ecosystem.config.cjs

# Lưu trạng thái PM2 để tự động khởi động khi reboot máy chủ
pm2 save
pm2 startup
```

---

## 🌐 5. Cấu Hình NGINX Reverse Proxy & HTTPS (Certbot SSL)

### Bước 5.1: Cấu hình Virtual Host NGINX (Chuyển tiếp tới Cổng 3008)
Tạo file cấu hình mới:
```bash
sudo nano /etc/nginx/sites-available/auto-video
```

Dán nội dung cấu hình sau *(thay `your-domain.com` bằng tên miền của bạn)*:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Kích hoạt cấu hình NGINX:
```bash
sudo ln -s /etc/nginx/sites-available/auto-video /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📊 6. Theo Dõi & Lệnh Quản Lý Nhanh

- **Xem danh sách tiến trình PM2**:
  ```bash
  pm2 status
  ```

- **Xem log realtime của Web & Worker**:
  ```bash
  pm2 logs auto-video-web
  pm2 logs auto-video-worker
  ```

- **Khởi động lại ứng dụng khi cập nhật code mới**:
  ```bash
  cd /var/www/Auto-Video
  git pull origin main
  npm install
  npm run build
  pm2 restart all
  ```
