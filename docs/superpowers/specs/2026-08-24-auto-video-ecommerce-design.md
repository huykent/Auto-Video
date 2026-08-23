# System Architecture Specification: MakerWorld Auto-Video & E-Commerce Exporter Pipeline

**Date:** 2026-08-24  
**Project:** Auto-Video (MakerWorld Scraper -> AI Video Generation -> E-Commerce Exporter)  
**Status:** Approved Draft  

---

## 1. Overview & Business Intent

The objective of this project is to build an automated pipeline with a human-in-the-loop Web Dashboard. The system automates:
1. Searching and scraping 3D printing model data from MakerWorld based on user keywords.
2. Extracting model information (title, images, filament type, filament color, 3D file metadata).
3. Allowing the user to review models, select images, and generate/edit AI video prompts.
4. Generating product videos using AI Video APIs (Veo 3 / Sora / Runway / Luma).
5. Generating SEO-optimized product titles, descriptions, and packaging videos + images + formatted CSV/JSON metadata for instant publishing on e-commerce platforms (Shopee, TikTok Shop, etc.).

---

## 2. Technical Architecture & Tech Stack

### 2.1 Architecture Pattern
- **Pattern:** Monolithic Next.js + Embedded BullMQ Queue Worker (Hybrid Desktop/Web local server model).
- **Frontend Framework:** Next.js 14+ App Router, React, Tailwind CSS, Lucide Icons.
- **Backend Services:** Next.js Server Actions & API Routes.
- **Queue & Async Job Engine:** Redis + BullMQ (Node.js background process).
- **Scraper Engine:** Playwright (Chromium Headless with stealth configuration).
- **Database:** SQLite managed via Drizzle ORM (`./data/app.db`).
- **File & Media Storage:** Local file directory (`./storage/`).

### 2.2 Storage Layout
```
./storage/
├── raw_images/          # Scraped product images per model ID
│   └── {model_id}/
├── 3d_files/            # Downloaded 3D files (.stl, .3mf)
│   └── {model_id}/
├── generated_videos/    # Veo3 AI generated MP4 videos
│   └── {product_id}.mp4
└── export_packages/     # Final zip & metadata packages for E-Commerce
    └── {product_id}/
        ├── video.mp4
        ├── image_01.jpg ... image_N.jpg
        ├── shopee_import.csv
        ├── tiktok_shop.json
        └── content.txt
```

---

## 3. Product State Machine (Workflow Lifecycle)

Every scraped model undergoes a strictly managed lifecycle state machine to guarantee human oversight before spending AI generation tokens:

```
[Keyword Input] -> DISCOVERED -> [Playwright Scraper] -> CRAWLED
                                                             |
                                           +-----------------+-----------------+
                                           |                                   |
                                      [User Approve]                     [User Reject]
                                           |                                   |
                                           v                                   v
                                  APPROVED_FOR_VIDEO                       REJECTED
                                           |
                                      [Veo 3 API]
                                           |
                                  +--------+--------+
                                  |                 |
                                  v                 v
                            GENERATING_VIDEO    GENERATION_FAILED
                                  |                 |
                             [Completed]        [User Retry]
                                  |                 |
                                  +--------+--------+
                                           |
                                           v
                                      VIDEO_READY
                                           |
                                    [User Export]
                                           |
                                           v
                                       EXPORTED
```

---

## 4. Detailed Component Modules

### 4.1 Module 1: MakerWorld Scraper (`/lib/crawler`)
- **Trigger:** User submits a keyword or direct MakerWorld URL on Dashboard.
- **Queue Job:** Enqueues job to `crawler-queue`.
- **Playwright Execution:**
  1. Opens headless browser with stealth headers and randomized delays.
  2. Searches MakerWorld, extracts model cards (title, model ID, author, print counts).
  3. Navigates to model detail page:
     - Scrapes high-resolution gallery image URLs.
     - Scrapes print profiles: Filament Type (PLA, PETG, TPU, ABS, etc.), Filament Color (White, Silk Gold, Matte Black, etc.), print time (minutes), weight (grams).
     - Scrapes `.3mf` / `.stl` download links.
  4. Saves images to `./storage/raw_images/{model_id}/` and inserts record into `products` table with `CRAWLED` status.

### 4.2 Module 2: Human Review & AI Video Generator Pipeline (`/lib/video-gen`)
- **Review UI (`/discovery`):**
  - Displays grid of `CRAWLED` items with thumbnail, filament info, and metadata.
  - User selects primary cover image and deselects low-quality images.
  - Auto-constructs AI video prompt using formula:  
    `"A 3D printed [Title] made of premium [Filament Type] filament in [Filament Color] color, cinematic studio lighting, rotating product display 360 degree, photorealistic 4k"`.
  - User can edit prompt before clicking "Generate Video".
- **Veo 3 API Integration:**
  - Enqueues job to `video-gen-queue`.
  - Updates status to `APPROVED_FOR_VIDEO` -> `GENERATING_VIDEO`.
  - Sends image + prompt payload to Veo 3 / AI Video API.
  - Polls API status asynchronously until completion.
  - Downloads finished MP4 video to `./storage/generated_videos/{product_id}.mp4` and sets status to `VIDEO_READY`.

### 4.3 Module 3: E-Commerce Formatter & Exporter (`/lib/exporter`)
- **Editor UI (`/studio`):**
  - Displays video player preview of generated MP4.
  - Uses AI Text Generator (Gemini API) to auto-generate:
    - **SEO Title:** `"Mô hình in 3D [Tên Mẫu] - Nhựa [Loại nhựa] Cao Cấp ([Màu sắc]) - Decor / Quà tặng"`.
    - **Description:** Features, material specifications, dimensions, care instructions, tags.
- **Package Exporter:**
  - Packages MP4 video, selected images, and generated text into `./storage/export_packages/{product_id}/`.
  - Generates platform-specific import files (`shopee_import.csv`, `tiktok_shop.json`).
  - Sets product status to `EXPORTED`.

### 4.4 Module 4: Web Dashboard Hub (`/app`)
- **`app/page.tsx` (Dashboard Overview):** System queue statistics, product counts per status, keyword crawler form.
- **`app/discovery/page.tsx` (Crawl Review):** Grid of crawled models, image picker, prompt editor, approve/reject buttons.
- **`app/studio/page.tsx` (Video & Copywriting Studio):** Video previewer, AI text editor, export trigger.
- **`app/exports/page.tsx` (Export Package Manager):** History of exported products, download ZIP buttons.
- **`app/settings/page.tsx` (Settings):** Manage Veo 3 API Keys, Gemini API Keys, MakerWorld request delays, and Redis URI.

---

## 5. Database Schema (SQLite + Drizzle ORM)

### `products` Table
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | UUID / Nanoid primary key |
| `makerworld_id` | TEXT (UNIQUE) | Original model ID from MakerWorld |
| `title` | TEXT | Model title |
| `url` | TEXT | MakerWorld page URL |
| `author` | TEXT | Author username |
| `filament_types` | TEXT (JSON) | Array of filament types (e.g. `["PLA", "PETG"]`) |
| `filament_colors` | TEXT (JSON) | Array of filament colors (e.g. `["Silk Gold", "Black"]`) |
| `print_time_minutes` | INTEGER | Estimated print time |
| `weight_grams` | REAL | Model weight in grams |
| `status` | TEXT | Enum: `DISCOVERED`, `CRAWLED`, `REJECTED`, `APPROVED_FOR_VIDEO`, `GENERATING_VIDEO`, `VIDEO_READY`, `GENERATION_FAILED`, `EXPORTED` |
| `raw_images` | TEXT (JSON) | Paths to local downloaded raw images |
| `selected_cover_image` | TEXT | Selected image path for video generation |
| `video_prompt` | TEXT | Prompt sent to Veo 3 API |
| `generated_video_path` | TEXT | Path to generated MP4 video |
| `export_title` | TEXT | SEO Title for E-Commerce |
| `export_description` | TEXT | Product description for E-Commerce |
| `error_message` | TEXT | Error log if crawling or video generation failed |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Record last update time |

### `search_jobs` Table
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Job ID |
| `keyword` | TEXT | Keyword searched |
| `max_results` | INTEGER | Target result count |
| `status` | TEXT | Enum: `PENDING`, `RUNNING`, `COMPLETED`, `FAILED` |
| `items_found` | INTEGER | Count of discovered items |
| `created_at` | TIMESTAMP | Job creation time |

---

## 6. Resilience & Error Handling

1. **MakerWorld Scraping Rate Limits / Captcha:**
   - Playwright uses stealth headers and randomized delays between requests.
   - Failures log errors, mark item as `FAILED` with retry option on Dashboard.
2. **Veo 3 / AI Video API Errors & Retries:**
   - BullMQ queue configured with 3 retries and Exponential Backoff (1m -> 5m -> 15m).
   - In case of invalid key / zero credit, sets status to `GENERATION_FAILED` and alerts user in Dashboard.
3. **Media Integrity:**
   - File size validation (>0 bytes) for downloaded images and MP4 files before advancing state machine.

---

## 7. Verification Strategy

1. **Crawler Verification (`/tests/crawler.test.ts`):** Scrape test MakerWorld URL, assert filament type, color, title, and image download completeness.
2. **Veo 3 API Integration Verification (`/tests/video-api.test.ts`):** Send payload to Mock/Live API, verify polling state transitions and video file download.
3. **Export Package Verification (`/tests/exporter.test.ts`):** Validate CSV layout, JSON structure, and file existence inside export directory.
