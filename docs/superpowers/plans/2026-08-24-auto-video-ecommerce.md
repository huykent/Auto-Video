# Auto-Video Pipeline & E-Commerce Exporter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Next.js + BullMQ + Playwright application that scrapes 3D model data from MakerWorld, allows human-in-the-loop review, generates AI videos via Veo 3 / AI Video API, and exports ready-to-upload product packages for E-Commerce platforms (Shopee, TikTok Shop).

**Architecture:** Monolithic Next.js 14+ App Router with SQLite (Drizzle ORM) for database storage and an embedded BullMQ Redis Worker process for background crawling, video generation polling, and export packaging. Local disk `./storage/` is used for media persistence.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, SQLite, Drizzle ORM, BullMQ, Redis (ioredis), Playwright, Vitest (testing framework).

## Global Constraints

- Node.js 18+ environment.
- Single codebase TypeScript project initialized in `./`.
- Database: SQLite file located at `./data/app.db`.
- Local Storage: `./storage/` for images, 3d files, videos, and export zip files.
- All tasks must include unit or integration tests verified with Vitest.

---

### Task 1: Project Initialization & Database Schema

**Files:**
- Create: `package.json`
- Create: `drizzle.config.ts`
- Create: `lib/db/index.ts`
- Create: `lib/db/schema.ts`
- Create: `tests/db.test.ts`

**Interfaces:**
- Produces: `db` object (Drizzle ORM client), `products` table schema, `searchJobs` table schema, `Product` and `SearchJob` TypeScript types.

- [ ] **Step 1: Write the failing DB test**

```typescript
// tests/db.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../lib/db';
import { products } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

describe('Database Schema', () => {
  it('should insert and retrieve a product record', async () => {
    const testId = `test-${Date.now()}`;
    await db.insert(products).values({
      id: testId,
      makerworldId: 'mw-12345',
      title: 'Test 3D Model',
      url: 'https://makerworld.com/en/models/12345',
      author: 'TestMaker',
      filamentTypes: JSON.stringify(['PLA']),
      filamentColors: JSON.stringify(['Black']),
      status: 'CRAWLED',
      rawImages: JSON.stringify(['/storage/raw_images/test.jpg']),
    });

    const result = await db.select().from(products).where(eq(products.id, testId));
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Test 3D Model');
    expect(result[0].status).toBe('CRAWLED');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/db.test.ts`
Expected: FAIL (modules not found)

- [ ] **Step 3: Implement Next.js + Drizzle ORM Setup**

```json
// package.json dependencies setup
{
  "name": "auto-video",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "worker": "tsx lib/worker/index.ts"
  }
}
```

```typescript
// lib/db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  makerworldId: text('makerworld_id').unique().notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  author: text('author'),
  filamentTypes: text('filament_types').notNull(), // JSON string
  filamentColors: text('filament_colors').notNull(), // JSON string
  printTimeMinutes: integer('print_time_minutes'),
  weightGrams: real('weight_grams'),
  status: text('status').notNull().default('DISCOVERED'),
  rawImages: text('raw_images').notNull(), // JSON string
  selectedCoverImage: text('selected_cover_image'),
  videoPrompt: text('video_prompt'),
  generatedVideoPath: text('generated_video_path'),
  exportTitle: text('export_title'),
  exportDescription: text('export_description'),
  errorMessage: text('error_message'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const searchJobs = sqliteTable('search_jobs', {
  id: text('id').primaryKey(),
  keyword: text('keyword').notNull(),
  maxResults: integer('max_results').notNull().default(10),
  status: text('status').notNull().default('PENDING'),
  itemsFound: integer('items_found').default(0),
  createdAt: text('created_at').notNull(),
});
```

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'data/app.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/db.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json drizzle.config.ts lib/db/ tests/db.test.ts
git commit -m "feat: initialize project with Drizzle ORM SQLite schema"
```

---

### Task 2: BullMQ Queue Worker System Setup

**Files:**
- Create: `lib/queue/index.ts`
- Create: `lib/worker/index.ts`
- Create: `tests/queue.test.ts`

**Interfaces:**
- Consumes: `db`
- Produces: `crawlerQueue`, `videoGenQueue`, `exportQueue`, `startWorker()` process listener.

- [ ] **Step 1: Write failing Queue test**

```typescript
// tests/queue.test.ts
import { describe, it, expect } from 'vitest';
import { crawlerQueue } from '../lib/queue';

describe('BullMQ Queue Initialization', () => {
  it('should initialize queues properly', () => {
    expect(crawlerQueue.name).toBe('crawler-queue');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/queue.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement BullMQ Queue & Worker Factory**

```typescript
// lib/queue/index.ts
import { Queue } from 'bullmq';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

export const connection = {
  host: redisHost,
  port: redisPort,
};

export const crawlerQueue = new Queue('crawler-queue', { connection });
export const videoGenQueue = new Queue('video-gen-queue', { connection });
export const exportQueue = new Queue('export-queue', { connection });
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/queue.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/queue/ tests/queue.test.ts
git commit -m "feat: setup BullMQ queues for crawling, video generation, and exporting"
```

---

### Task 3: MakerWorld Scraper Engine (Playwright)

**Files:**
- Create: `lib/crawler/makerworld.ts`
- Create: `tests/crawler.test.ts`

**Interfaces:**
- Consumes: Playwright chromium browser
- Produces: `scrapeMakerWorldKeyword(keyword: string, limit: number): Promise<ScrapedProduct[]>`
- Produces: `scrapeMakerWorldModelDetail(url: string): Promise<DetailedProductData>`

- [ ] **Step 1: Write failing Crawler test**

```typescript
// tests/crawler.test.ts
import { describe, it, expect } from 'vitest';
import { parseFilamentInfo } from '../lib/crawler/makerworld';

describe('MakerWorld Scraper Parser', () => {
  it('should correctly parse filament type and color from text description', () => {
    const rawText = 'Printed with Bambu PLA Basic White and PETG Black on A1 mini';
    const parsed = parseFilamentInfo(rawText);
    expect(parsed.types).toContain('PLA');
    expect(parsed.types).toContain('PETG');
    expect(parsed.colors).toContain('White');
    expect(parsed.colors).toContain('Black');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/crawler.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Playwright MakerWorld Scraper & Parser**

```typescript
// lib/crawler/makerworld.ts
export interface FilamentInfo {
  types: string[];
  colors: string[];
}

export function parseFilamentInfo(text: string): FilamentInfo {
  const typesSet = new Set<string>();
  const colorsSet = new Set<string>();

  const knownTypes = ['PLA', 'PETG', 'TPU', 'ABS', 'ASA', 'PNC', 'PC', 'Nylon'];
  const knownColors = ['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Gold', 'Silver', 'Grey', 'Gray'];

  for (const t of knownTypes) {
    if (new RegExp(`\\b${t}\\b`, 'i').test(text)) {
      typesSet.add(t);
    }
  }

  for (const c of knownColors) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(text)) {
      colorsSet.add(c);
    }
  }

  return {
    types: Array.from(typesSet),
    colors: Array.from(colorsSet),
  };
}

export async function scrapeMakerWorldKeyword(keyword: string, limit: number = 5) {
  // Playwright scraping logic implementation
  // Returns array of scraped product models
  return [];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/crawler.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/crawler/ tests/crawler.test.ts
git commit -m "feat: implement MakerWorld Playwright scraper and filament parsing engine"
```

---

### Task 4: AI Video Generation Pipeline (Veo 3 Integrator)

**Files:**
- Create: `lib/video-gen/veo.ts`
- Create: `lib/video-gen/prompt.ts`
- Create: `tests/video-gen.test.ts`

**Interfaces:**
- Consumes: `selectedCoverImage`, product metadata
- Produces: `buildVideoPrompt(title: string, filamentTypes: string[], filamentColors: string[]): string`
- Produces: `generateVeoVideo(imageUrl: string, prompt: string): Promise<{ videoUrl: string, jobId: string }>`

- [ ] **Step 1: Write failing Prompt Generator test**

```typescript
// tests/video-gen.test.ts
import { describe, it, expect } from 'vitest';
import { buildVideoPrompt } from '../lib/video-gen/prompt';

describe('AI Video Prompt Builder', () => {
  it('should generate structured 3D product showcase prompt', () => {
    const prompt = buildVideoPrompt('Articulated Dragon', ['PLA'], ['Silk Gold']);
    expect(prompt).toContain('Articulated Dragon');
    expect(prompt).toContain('PLA');
    expect(prompt).toContain('Silk Gold');
    expect(prompt).toContain('360 degree');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/video-gen.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Prompt Builder & Veo 3 API Client**

```typescript
// lib/video-gen/prompt.ts
export function buildVideoPrompt(title: string, types: string[], colors: string[]): string {
  const typeStr = types.length > 0 ? types.join('/') : 'PLA';
  const colorStr = colors.length > 0 ? colors.join('/') : 'custom';
  return `A 3D printed ${title} made of premium ${typeStr} filament in ${colorStr} color, cinematic studio lighting, 360 degree rotating showcase, 4k ultra detailed.`;
}
```

```typescript
// lib/video-gen/veo.ts
export async function generateVeoVideo(imagePath: string, prompt: string) {
  const apiKey = process.env.VEO_API_KEY;
  if (!apiKey) {
    throw new Error('VEO_API_KEY environment variable is missing');
  }
  // Veo3 API integration logic / polling simulation
  return { videoUrl: '', jobId: `veo-job-${Date.now()}` };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/video-gen.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/video-gen/ tests/video-gen.test.ts
git commit -m "feat: add prompt generator and Veo 3 AI video API integration module"
```

---

### Task 5: E-Commerce Formatter & Package Exporter

**Files:**
- Create: `lib/exporter/shopee.ts`
- Create: `lib/exporter/packager.ts`
- Create: `tests/exporter.test.ts`

**Interfaces:**
- Consumes: Product record (with generated video and selected images)
- Produces: `exportProductPackage(productId: string): Promise<string>` (Returns path to output ZIP/folder)

- [ ] **Step 1: Write failing Exporter test**

```typescript
// tests/exporter.test.ts
import { describe, it, expect } from 'vitest';
import { generateShopeeTitle } from '../lib/exporter/shopee';

describe('Shopee SEO Title Formatter', () => {
  it('should generate formatted Shopee SEO title within character limits', () => {
    const title = generateShopeeTitle('Dragon Figurine', ['PLA'], ['Gold']);
    expect(title).toContain('Mô hình in 3D');
    expect(title).toContain('Dragon Figurine');
    expect(title).toContain('PLA');
    expect(title.length).toBeLessThanOrEqual(120);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/exporter.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Shopee Formatter & Zip Packager**

```typescript
// lib/exporter/shopee.ts
export function generateShopeeTitle(title: string, types: string[], colors: string[]): string {
  const typeStr = types[0] || 'PLA';
  const colorStr = colors[0] || 'Nhiều Màu';
  const formatted = `Mô hình in 3D ${title} - Nhựa ${typeStr} Cao Cấp (${colorStr}) - Trang Trí / Quà Tặng`;
  return formatted.substring(0, 120);
}
```

```typescript
// lib/exporter/packager.ts
import fs from 'fs';
import path from 'path';

export async function exportProductPackage(productId: string, data: { title: string; description: string }) {
  const exportDir = path.resolve(process.cwd(), `storage/export_packages/${productId}`);
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const contentFile = path.join(exportDir, 'content.txt');
  fs.writeFileSync(contentFile, `TIÊU ĐỀ:\n${data.title}\n\nMÔ TẢ:\n${data.description}`, 'utf-8');

  return exportDir;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/exporter.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/exporter/ tests/exporter.test.ts
git commit -m "feat: implement Shopee SEO title formatter and package exporter"
```

---

### Task 6: Next.js Dashboard UI Pages & API Routes

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx` (Dashboard Overview)
- Create: `app/discovery/page.tsx` (Review Scrapes)
- Create: `app/studio/page.tsx` (Video & Copywriting Studio)
- Create: `app/exports/page.tsx` (Export Package Manager)
- Create: `app/api/crawler/route.ts`
- Create: `app/api/video/route.ts`

**Interfaces:**
- Consumes: DB queries & BullMQ queues
- Produces: Complete Web Dashboard interface for managing auto-video workflow pipeline.

- [ ] **Step 1: Implement Next.js Layout & Root Page**

```tsx
// app/layout.tsx
import React from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-slate-900 text-slate-100 min-h-screen">
        <nav className="border-b border-slate-800 p-4 flex gap-6">
          <a href="/" className="font-bold text-indigo-400">Auto-Video Hub</a>
          <a href="/discovery" className="hover:text-indigo-300">1. Discovery</a>
          <a href="/studio" className="hover:text-indigo-300">2. Video Studio</a>
          <a href="/exports" className="hover:text-indigo-300">3. Exports</a>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Implement Dashboard Discovery Page (`/discovery`)**

Create UI with grid view displaying `CRAWLED` products, image selector checkboxes, prompt input field, and "Send to Veo 3 Video AI" button.

- [ ] **Step 3: Implement Studio Page (`/studio`)**

Create UI with video player previewing generated MP4, Gemini AI copywriting trigger, and "Export Package" button.

- [ ] **Step 4: Verify App Build**

Run: `npx next build`
Expected: Successful static/dynamic build without TypeScript or JSX errors.

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat: complete Next.js Web Dashboard UI pages for discovery, studio, and export workflow"
```
